/*
 * SPDX-FileCopyrightText: 2026 Department of Decentralization
 * SPDX-License-Identifier: MIT
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import type { Service, ServiceTier } from '../data/services'

/**
 * A settled status for one service.
 *
 * Three of these assert something about the service and are split by tier
 * (`SPEC.md` D10). A `verified` probe reads the response and reports
 * `operational` or `down`. An `opaque` probe cannot read anything and reports
 * only `reachable`.
 *
 * `operational` is therefore a strictly stronger claim than `reachable`, and an
 * opaque service must never produce it: a `mode: 'no-cors'` response resolves
 * identically on 200 and on 500, so reporting one as healthy would show a green
 * row during a total application failure that still terminates TLS.
 *
 * The fourth, `noAnswer`, asserts nothing and belongs to both tiers. A `fetch`
 * rejects for reasons that say nothing about the server — a content blocker or
 * extension cancelling the request, an ETP or DNS blocklist, the timeout firing
 * on a slow but healthy host — so a rejection is not evidence of an outage
 * (`SPEC.md` D20).
 */
export type ServiceStatus = 'operational' | 'down' | 'reachable' | 'noAnswer'

/**
 * The states that make a claim about the service, per tier.
 *
 * These stay disjoint: no opaque probe may produce `operational` or `down`, and
 * no verified probe may produce `reachable`.
 */
export const CLAIMS_BY_TIER: Record<ServiceTier, readonly ServiceStatus[]> = {
  verified: ['operational', 'down'],
  opaque: ['reachable'],
}

/** The state that makes no claim. Reachable from either tier. */
export const NO_CLAIM = 'noAnswer' as const

/** The states a probe of the given tier is permitted to produce. */
export const STATES_BY_TIER: Record<ServiceTier, readonly ServiceStatus[]> = {
  verified: [...CLAIMS_BY_TIER.verified, NO_CLAIM],
  opaque: [...CLAIMS_BY_TIER.opaque, NO_CLAIM],
}

/** The result of probing one service. */
export type ServiceStatusResult = {
  /** The service that was probed. */
  service: Service
  /** The settled status, drawn from the vocabulary its tier permits. */
  status: ServiceStatus
  /**
   * HTTP status code, present only for a `verified` probe. An `opaque` probe
   * cannot read one, and this field is `undefined` there by construction.
   */
  httpStatus?: number
  /** Round-trip time in milliseconds, measured whether or not the probe won. */
  ms: number
  /** True when the probe was cut off by `timeoutMs` rather than answering. */
  timedOut: boolean
}

/**
 * A clock, injected for the same reason `fetch` is: a test that measures real
 * elapsed time is as non-deterministic as one that makes a real request.
 */
export type NowFn = () => number

/**
 * The subset of `fetch` this module uses.
 *
 * Injected rather than imported so tests can supply a stub. A test that reaches
 * the real network fails when a service is legitimately down, when CI has no
 * egress, and when a maintainer is offline; it is non-deterministic by
 * construction (`SPEC.md` D13).
 */
export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>

/** Default probe timeout in milliseconds. */
export const DEFAULT_TIMEOUT_MS = 8000

/**
 * Decide a `verified` service's status from the HTTP status code it returned.
 *
 * A refusal is not an outage. Four of the nine services are invite only, and
 * an anonymous probe against them is expected to be turned away; a 401 or 403
 * still proves the application is running and answering (`SPEC.md` D11).
 *
 * A 404 does mean `down`, because every pinned probe endpoint is known to exist
 * — a 404 means it moved, which the page should surface rather than hide.
 *
 * @param httpStatus - HTTP status code from the probe response.
 * @returns `operational` if the application answered, `down` otherwise.
 */
export function statusFromHttpCode(httpStatus: number): ServiceStatus {
  if (httpStatus >= 200 && httpStatus < 400) return 'operational'
  if (httpStatus === 401 || httpStatus === 403) return 'operational'
  return 'down'
}

/**
 * Probe one service and return its status.
 *
 * The tier selects both the request mode and the vocabulary of the result, in
 * one branch each, so an `opaque` service has no code path that can reach
 * `operational` (`SPEC.md` D10, acceptance S5).
 *
 * @param service - The service to probe, from the `data/services` registry.
 * @param fetchImpl - `fetch` implementation; injected for testability.
 * @param timeoutMs - Abort the probe after this many milliseconds.
 * @param now - Clock used to measure round-trip time; injected for testability.
 * @returns The settled status. Never rejects: a failed probe is a result, not
 *   an error, because one failed probe must not blank the whole page.
 */
export async function probeService(
  service: Service,
  fetchImpl: FetchLike,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  now: NowFn = () => Date.now()
): Promise<ServiceStatusResult> {
  const signal = AbortSignal.timeout(timeoutMs)
  const started = now()
  // Elapsed time is reported for a failed probe too: "connection failed after
  // 8 s" and "connection failed after 40 ms" describe different outages.
  const elapsed = () => Math.max(0, now() - started)

  if (service.tier === 'verified') {
    try {
      const response = await fetchImpl(service.probeUrl, { signal })
      return {
        service,
        status: statusFromHttpCode(response.status),
        httpStatus: response.status,
        ms: elapsed(),
        timedOut: false,
      }
    } catch {
      // Not `down`: nothing was read from the server, so nothing is known
      // about it (`SPEC.md` D20).
      const ms = elapsed()
      return { service, status: NO_CLAIM, ms, timedOut: ms >= timeoutMs }
    }
  }

  // Opaque tier. The response is unreadable, so only the fact that the request
  // settled at all carries information.
  try {
    await fetchImpl(service.probeUrl, { mode: 'no-cors', signal })
    return { service, status: 'reachable', ms: elapsed(), timedOut: false }
  } catch {
    const ms = elapsed()
    return { service, status: NO_CLAIM, ms, timedOut: ms >= timeoutMs }
  }
}

/**
 * Probe every service in parallel.
 *
 * Results come back in registry order regardless of which probe settles first,
 * so the rendered table does not reorder itself as responses arrive.
 *
 * @param servicesToProbe - Services to probe, in the order to report them.
 * @param fetchImpl - `fetch` implementation; injected for testability.
 * @param timeoutMs - Abort each probe after this many milliseconds.
 * @param now - Clock used to measure round-trip time; injected for testability.
 * @returns One result per service, in the order given.
 */
export async function probeAllServices(
  servicesToProbe: Service[],
  fetchImpl: FetchLike,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  now: NowFn = () => Date.now()
): Promise<ServiceStatusResult[]> {
  return Promise.all(servicesToProbe.map((s) => probeService(s, fetchImpl, timeoutMs, now)))
}

/**
 * Format a probe duration the way the status page shows it.
 *
 * Milliseconds below one second, one decimal of seconds above, so a slow
 * service reads "1.1 s" rather than "1103 ms".
 *
 * @param ms - Duration in milliseconds.
 * @returns A short human-readable duration.
 */
export function formatDuration(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`
}

/**
 * Describe what a probe actually observed, for the line under its status.
 *
 * The status word says how healthy the service is; this says what was measured,
 * so a reader can tell an `operational` backed by `HTTP 200` from a `reachable`
 * backed by nothing but a completed TCP handshake.
 *
 * @param result - A settled probe result.
 * @returns One short line of evidence.
 */
export function describeEvidence(result: ServiceStatusResult): string {
  const took = formatDuration(result.ms)
  if (result.timedOut) return `no answer within ${took}`
  // A rejection cannot distinguish a blocked request from a dead host, so the
  // line names both possibilities rather than picking one.
  if (result.status === NO_CLAIM) return `blocked or unreachable \u00b7 ${took}`
  if (result.status === 'reachable') return `connection only \u00b7 ${took}`
  return `HTTP ${result.httpStatus} \u00b7 ${took}`
}
