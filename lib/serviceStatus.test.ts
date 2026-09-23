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
  probeAllServices,
  probeService,
  statusFromHttpCode,
} from './serviceStatus'

/**
 * Build a service fixture. The URLs are inert strings handed to a stub; no test
 * in this file dials anything (`SPEC.md` D13).
 */
function fixture(overrides: Partial<Service> = {}): Service {
  return {
    name: 'Test Service',
    url: 'https://example.invalid',
    probeUrl: 'https://example.invalid/health',
    tier: 'verified',
    access: 'public',
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
    // Three of seven services are invite only; an anonymous probe is expected
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
  it('holds seven services', () => {
    expect(services).toHaveLength(7)
  })

  it('probes every service over https', () => {
    for (const service of services) {
      expect(service.probeUrl.startsWith('https://')).toBe(true)
    }
  })

  it('never probes a bare origin, which would measure a redirect', () => {
    // matrix.dod.ngo and post.dod.ngo both 302 at the root (SPEC.md D11).
    for (const service of services) {
      expect(new URL(service.probeUrl).pathname).not.toBe('/')
    }
  })

  it('keeps the three verified and four opaque services as measured', () => {
    const byTier = (tier: string) => services.filter((s) => s.tier === tier).map((s) => s.name)
    expect(byTier('verified')).toEqual(['Synapse (Matrix)', 'Pretalx', 'Potato Mesh'])
    expect(byTier('opaque')).toEqual(['Cryptpad', 'Element (Matrix)', 'Pretix', 'Freescout'])
  })

  it('marks Cryptpad opaque despite it sending a CORS header', () => {
    // office.dod.ngo pins Access-Control-Allow-Origin to https://sicher.dod.ngo,
    // so the header being present does not make it readable from dod.ngo.
    const cryptpad = services.find((s) => s.name === 'Cryptpad')
    expect(cryptpad?.tier).toBe('opaque')
  })
})
