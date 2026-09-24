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
import { describe, expect, it } from 'vitest'
import services, { type Service } from '../data/services'
import {
  DEFAULT_TIMEOUT_MS,
  STATES_BY_TIER,
  type FetchLike,
  describeEvidence,
  formatDuration,
  probeAllServices,
  probeService,
  statusFromHttpCode,
} from './serviceStatus'

/** A clock that advances a fixed amount per call, so durations are exact. */
function fakeClock(stepMs: number): () => number {
  let t = 0
  return () => {
    const current = t
    t += stepMs
    return current
  }
}

/**
 * Build a service fixture. The URLs are inert strings handed to a stub; no test
 * in this file dials anything (`SPEC.md` D13).
 */
function fixture(overrides: Partial<Service> = {}): Service {
  return {
    name: 'Test Service',
    desc: 'A service used only by this test file',
    url: 'https://example.invalid',
    host: 'example.invalid',
    repo: 'example/test-service',
    img: '/static/images/services/test.png',
    probeUrl: 'https://example.invalid/health',
    tier: 'verified',
    access: 'Public',
    ...overrides,
  }
}

/** A stub `fetch` that resolves with the given status and records its calls. */
function stubOk(status: number): { fetch: FetchLike; calls: RequestInit[] } {
  const calls: RequestInit[] = []
  const fetchImpl: FetchLike = async (_url, init) => {
    calls.push(init ?? {})
    return new Response(null, { status })
  }
  return { fetch: fetchImpl, calls }
}

/** A stub `fetch` that rejects, standing in for DNS, TLS or connection failure. */
const stubReject: FetchLike = async () => {
  throw new Error('connection refused')
}

describe('statusFromHttpCode', () => {
  it('treats 2xx and 3xx as operational', () => {
    expect(statusFromHttpCode(200)).toBe('operational')
    expect(statusFromHttpCode(204)).toBe('operational')
    expect(statusFromHttpCode(302)).toBe('operational')
  })

  it('treats an auth refusal as operational, because a refusal is not an outage', () => {
    // Four of nine services are invite only; an anonymous probe is expected
    // to be turned away, and being turned away proves the app is running.
    expect(statusFromHttpCode(401)).toBe('operational')
    expect(statusFromHttpCode(403)).toBe('operational')
  })

  it('treats 404 as down, because every pinned endpoint is known to exist', () => {
    expect(statusFromHttpCode(404)).toBe('down')
  })

  it('treats 5xx as down', () => {
    expect(statusFromHttpCode(500)).toBe('down')
    expect(statusFromHttpCode(503)).toBe('down')
  })
})

describe('probeService, verified tier', () => {
  it('reports operational and carries the HTTP status through', async () => {
    const result = await probeService(fixture(), stubOk(200).fetch)
    expect(result.status).toBe('operational')
    expect(result.httpStatus).toBe(200)
  })

  it('reports down on a 5xx', async () => {
    const result = await probeService(fixture(), stubOk(503).fetch)
    expect(result.status).toBe('down')
    expect(result.httpStatus).toBe(503)
  })

  it('reports down with no HTTP status when the request fails outright', async () => {
    const result = await probeService(fixture(), stubReject)
    expect(result.status).toBe('down')
    expect(result.httpStatus).toBeUndefined()
  })

  it('does not request no-cors mode, so the response stays readable', async () => {
    const stub = stubOk(200)
    await probeService(fixture(), stub.fetch)
    expect(stub.calls[0].mode).toBeUndefined()
  })
})

describe('probeService, opaque tier', () => {
  const opaque = fixture({ tier: 'opaque' })

  it('reports reachable when the request settles', async () => {
    const result = await probeService(opaque, stubOk(200).fetch)
    expect(result.status).toBe('reachable')
  })

  it('reports unreachable when the request fails', async () => {
    const result = await probeService(opaque, stubReject)
    expect(result.status).toBe('unreachable')
  })

  it('requests no-cors mode', async () => {
    const stub = stubOk(200)
    await probeService(opaque, stub.fetch)
    expect(stub.calls[0].mode).toBe('no-cors')
  })

  it('never reports operational, on any status the stub returns', async () => {
    // The load-bearing assertion of acceptance S5. An opaque response resolves
    // identically on 200 and on 500, so claiming "operational" would show a
    // green row during a total application failure that still terminates TLS.
    for (const status of [200, 204, 301, 401, 403, 404, 500, 502, 503]) {
      const result = await probeService(opaque, stubOk(status).fetch)
      expect(result.status).toBe('reachable')
      expect(result.status).not.toBe('operational')
    }
  })

  it('never exposes an HTTP status, because it cannot read one', async () => {
    const result = await probeService(opaque, stubOk(500).fetch)
    expect(result.httpStatus).toBeUndefined()
  })
})

describe('tier vocabularies stay disjoint', () => {
  it('shares no state between the two tiers', () => {
    const overlap = STATES_BY_TIER.verified.filter((s) => STATES_BY_TIER.opaque.includes(s))
    expect(overlap).toEqual([])
  })

  it('only ever produces a state its own tier permits', async () => {
    for (const tier of ['verified', 'opaque'] as const) {
      for (const stub of [stubOk(200).fetch, stubOk(503).fetch, stubReject]) {
        const result = await probeService(fixture({ tier }), stub)
        expect(STATES_BY_TIER[tier]).toContain(result.status)
      }
    }
  })
})

describe('probeAllServices', () => {
  it('returns one result per service, in registry order', async () => {
    const input = [
      fixture({ name: 'First' }),
      fixture({ name: 'Second', tier: 'opaque' }),
      fixture({ name: 'Third' }),
    ]
    const results = await probeAllServices(input, stubOk(200).fetch)
    expect(results.map((r) => r.service.name)).toEqual(['First', 'Second', 'Third'])
  })

  it('does not let one failing service blank the others', async () => {
    const failing: FetchLike = async (url) => {
      if (url.includes('broken')) throw new Error('down')
      return new Response(null, { status: 200 })
    }
    const results = await probeAllServices(
      [fixture({ name: 'Fine' }), fixture({ name: 'Broken', probeUrl: 'https://broken.invalid' })],
      failing
    )
    expect(results.map((r) => r.status)).toEqual(['operational', 'down'])
  })

  it('passes the timeout through and defaults to 8 seconds', async () => {
    expect(DEFAULT_TIMEOUT_MS).toBe(8000)
    const results = await probeAllServices([fixture()], stubOk(200).fetch, 50)
    expect(results).toHaveLength(1)
  })
})

describe('the shipped registry', () => {
  it('holds nine services', () => {
    expect(services).toHaveLength(9)
  })

  it('gives every service a description, repo and thumbnail', () => {
    for (const service of services) {
      expect(service.desc.length).toBeGreaterThan(0)
      expect(service.repo).toMatch(/^[\w.-]+\/[\w.-]+$/)
      expect(service.img).toMatch(/^\/static\/images\/services\/.+\.png$/)
    }
  })

  it('states the host that its url points at', () => {
    for (const service of services) {
      expect(service.host).toBe(new URL(service.url).host)
    }
  })

  it('probes every service over https', () => {
    for (const service of services) {
      expect(service.probeUrl.startsWith('https://')).toBe(true)
    }
  })

  it('never probes a root that is known to redirect', () => {
    // matrix.dod.ngo and post.dod.ngo both 302 at the root, so probing there
    // would measure the redirect rather than the service (SPEC.md D11).
    // A root probe is fine for a host that answers 200 there, which is why
    // MeshINT and DWeb Camp Mesh legitimately use one.
    const redirectingHosts = ['matrix.dod.ngo', 'post.dod.ngo']
    for (const service of services) {
      const probe = new URL(service.probeUrl)
      if (redirectingHosts.includes(probe.host)) {
        expect(probe.pathname).not.toBe('/')
      }
    }
  })

  it('keeps the five verified and four opaque services as measured', () => {
    const byTier = (tier: string) => services.filter((s) => s.tier === tier).map((s) => s.name)
    expect(byTier('verified')).toEqual([
      'Synapse',
      'Pretalx',
      'Potato Mesh',
      'MeshINT',
      'DWeb Camp Mesh',
    ])
    expect(byTier('opaque')).toEqual(['Cryptpad', 'Element', 'Pretix', 'Freescout'])
  })

  it('marks Cryptpad opaque despite it sending a CORS header', () => {
    // office.dod.ngo pins Access-Control-Allow-Origin to https://sicher.dod.ngo,
    // so the header being present does not make it readable from dod.ngo.
    const cryptpad = services.find((s) => s.name === 'Cryptpad')
    expect(cryptpad?.tier).toBe('opaque')
  })
})

describe('formatDuration', () => {
  it('shows milliseconds below one second', () => {
    expect(formatDuration(0)).toBe('0 ms')
    expect(formatDuration(140)).toBe('140 ms')
    expect(formatDuration(999)).toBe('999 ms')
  })

  it('switches to one decimal of seconds at one second', () => {
    expect(formatDuration(1000)).toBe('1.0 s')
    expect(formatDuration(1103)).toBe('1.1 s')
    expect(formatDuration(8000)).toBe('8.0 s')
  })
})

describe('probe timing', () => {
  it('measures elapsed time from the injected clock', async () => {
    const result = await probeService(fixture(), stubOk(200).fetch, 8000, fakeClock(140))
    expect(result.ms).toBe(140)
    expect(result.timedOut).toBe(false)
  })

  it('measures elapsed time for a failed probe too', async () => {
    // "connection failed after 8 s" and "after 40 ms" are different outages.
    const result = await probeService(fixture(), stubReject, 8000, fakeClock(40))
    expect(result.status).toBe('down')
    expect(result.ms).toBe(40)
  })

  it('flags a failure that ran out the clock as a timeout', async () => {
    const result = await probeService(fixture(), stubReject, 8000, fakeClock(8000))
    expect(result.timedOut).toBe(true)
  })

  it('does not flag a fast failure as a timeout', async () => {
    const result = await probeService(fixture(), stubReject, 8000, fakeClock(40))
    expect(result.timedOut).toBe(false)
  })

  it('never reports a negative duration if the clock goes backwards', async () => {
    const result = await probeService(fixture(), stubOk(200).fetch, 8000, fakeClock(-500))
    expect(result.ms).toBe(0)
  })
})

describe('describeEvidence', () => {
  const evidenceFor = async (
    tier: 'verified' | 'opaque',
    fetchImpl: FetchLike,
    stepMs = 140,
    timeoutMs = 8000
  ) =>
    describeEvidence(await probeService(fixture({ tier }), fetchImpl, timeoutMs, fakeClock(stepMs)))

  it('reports the HTTP status for a verified probe', async () => {
    expect(await evidenceFor('verified', stubOk(200).fetch)).toBe('HTTP 200 · 140 ms')
  })

  it('says connection only for an opaque probe, claiming nothing more', async () => {
    expect(await evidenceFor('opaque', stubOk(200).fetch)).toBe('connection only · 140 ms')
  })

  it('distinguishes a failed connection from a failed request', async () => {
    expect(await evidenceFor('opaque', stubReject)).toBe('connection failed · 140 ms')
    expect(await evidenceFor('verified', stubReject)).toBe('request failed · 140 ms')
  })

  it('says no answer when the probe ran out the clock', async () => {
    expect(await evidenceFor('verified', stubReject, 8000)).toBe('no answer within 8.0 s')
  })

  it('never names a status code an opaque probe could not have read', async () => {
    for (const code of [200, 404, 500]) {
      expect(await evidenceFor('opaque', stubOk(code).fetch)).not.toContain('HTTP')
    }
  })
})
