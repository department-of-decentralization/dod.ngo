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

/**
 * Whether a probe of this service can read the response it gets back.
 *
 * `verified` services send CORS headers that permit `dod.ngo` to read the
 * response, so the probe learns the actual HTTP status. `opaque` services do
 * not, so the probe can only learn whether the connection succeeded. See
 * `SPEC.md` D10 for why the two are never collapsed into one vocabulary.
 */
export type ServiceTier = 'verified' | 'opaque'

/** Whether anyone may sign up, or membership is issued by invitation. */
export type ServiceAccess = 'public' | 'invite only'

/** One service the Department of Decentralization operates. */
export type Service = {
  /** Display name, as shown on the status page. */
  name: string
  /** Public entry point, used for the link a visitor clicks. */
  url: string
  /** Endpoint the status probe requests. Not always the same as `url`. */
  probeUrl: string
  /** What a probe of `probeUrl` is able to learn. See `SPEC.md` D11. */
  tier: ServiceTier
  /** Whether a visitor can sign up unaided. Independent of status. */
  access: ServiceAccess
}

/**
 * The single registry of DoD-operated services (`SPEC.md` D14).
 *
 * Every probe endpoint and tier below was measured on 2026-09-23. A tier is a
 * property of the service's CORS policy, not a preference: do not promote a
 * service to `verified` without confirming it sends an
 * `Access-Control-Allow-Origin` that covers `https://dod.ngo`.
 *
 * Three entries are easy to get wrong, so each carries its reason inline.
 */
const services: Service[] = [
  {
    name: 'Cryptpad',
    url: 'https://office.dod.ngo',
    // Sends Access-Control-Allow-Origin, but pinned to https://sicher.dod.ngo
    // (CryptPad's sandbox origin), so it is opaque to dod.ngo specifically.
    probeUrl: 'https://office.dod.ngo/api/config',
    tier: 'opaque',
    access: 'public',
  },
  {
    name: 'Element (Matrix)',
    url: 'https://element.dod.ngo',
    probeUrl: 'https://element.dod.ngo/version',
    tier: 'opaque',
    access: 'public',
  },
  {
    name: 'Synapse (Matrix)',
    url: 'https://matrix.dod.ngo',
    // /health returns 404 at this deployment's edge; the root 302-redirects to
    // element.dod.ngo. This path is CORS-open by Matrix specification.
    probeUrl: 'https://matrix.dod.ngo/_matrix/client/versions',
    tier: 'verified',
    access: 'invite only',
  },
  {
    name: 'Pretix',
    url: 'https://tix.dod.ngo',
    probeUrl: 'https://tix.dod.ngo/healthcheck/',
    tier: 'opaque',
    access: 'invite only',
  },
  {
    name: 'Pretalx',
    url: 'https://talx.dod.ngo',
    // /healthcheck/ exists but sends no CORS headers. This path does, which is
    // the only reason Pretalx is verified and Pretix is not.
    probeUrl: 'https://talx.dod.ngo/api/events/',
    tier: 'verified',
    access: 'invite only',
  },
  {
    name: 'Freescout',
    url: 'https://post.dod.ngo',
    // The root 302-redirects here; probing it directly measures the app, not
    // the redirect.
    probeUrl: 'https://post.dod.ngo/login',
    tier: 'opaque',
    access: 'invite only',
  },
  {
    name: 'Potato Mesh',
    url: 'https://potatomesh.net',
    probeUrl: 'https://potatomesh.net/api/stats',
    tier: 'verified',
    access: 'public',
  },
]

export default services
