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

/**
 * Whether anyone may sign up, or membership is issued by invitation.
 *
 * Rendered verbatim, so these are display strings rather than lowercase keys.
 */
export type ServiceAccess = 'Public' | 'Invite only'

/** One service the Department of Decentralization operates. */
export type Service = {
  /** Display name, as shown on the status page. */
  name: string
  /** One-line description of what the service does. */
  desc: string
  /** Public entry point, used for the link a visitor clicks. */
  url: string
  /** Hostname shown under the service name. */
  host: string
  /** Upstream source repository, as `owner/name` on GitHub. */
  repo: string
  /** Thumbnail under `public/`, or omitted when no screenshot exists. */
  img?: string
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
 * Every probe endpoint and tier below was measured directly: the seven original
 * services on 2026-09-23, MeshINT and DWeb Camp Mesh on 2026-09-24. A tier is a
 * property of the service's CORS policy, not a preference: do not promote a
 * service to `verified` without confirming it sends an
 * `Access-Control-Allow-Origin` that covers `https://dod.ngo`.
 *
 * Several entries are easy to get wrong, so each carries its reason inline.
 */
const services: Service[] = [
  {
    name: 'Cryptpad',
    desc: 'End-to-end encrypted office suite',
    url: 'https://office.dod.ngo',
    host: 'office.dod.ngo',
    repo: 'cryptpad/cryptpad',
    img: '/static/images/services/cryptpad.png',
    // Sends Access-Control-Allow-Origin, but pinned to https://sicher.dod.ngo
    // (CryptPad's sandbox origin), so it is opaque to dod.ngo specifically.
    probeUrl: 'https://office.dod.ngo/api/config',
    tier: 'opaque',
    access: 'Public',
  },
  {
    name: 'Element',
    desc: 'Matrix chat in the browser',
    url: 'https://element.dod.ngo',
    host: 'element.dod.ngo',
    repo: 'element-hq/element-web',
    img: '/static/images/services/element.png',
    probeUrl: 'https://element.dod.ngo/version',
    tier: 'opaque',
    access: 'Public',
  },
  {
    name: 'Synapse',
    desc: 'Matrix homeserver',
    url: 'https://matrix.dod.ngo',
    host: 'matrix.dod.ngo',
    repo: 'element-hq/synapse',
    // Synapse has no web interface of its own; its root redirects to Element,
    // so this row shows the Element screenshot by maintainer instruction.
    img: '/static/images/services/synapse.png',
    // /health returns 404 at this deployment's edge; the root 302-redirects to
    // element.dod.ngo. This path is CORS-open by Matrix specification.
    probeUrl: 'https://matrix.dod.ngo/_matrix/client/versions',
    tier: 'verified',
    access: 'Invite only',
  },
  {
    name: 'Pretix',
    desc: 'Event ticketing',
    url: 'https://tix.dod.ngo',
    host: 'tix.dod.ngo',
    repo: 'pretix/pretix',
    img: '/static/images/services/pretix.png',
    probeUrl: 'https://tix.dod.ngo/healthcheck/',
    tier: 'opaque',
    access: 'Invite only',
  },
  {
    name: 'Pretalx',
    desc: 'Call for papers and schedules',
    url: 'https://talx.dod.ngo',
    host: 'talx.dod.ngo',
    repo: 'pretalx/pretalx',
    img: '/static/images/services/pretalx.png',
    // /healthcheck/ exists but sends no CORS headers. This path does, which is
    // the only reason Pretalx is verified and Pretix is not.
    probeUrl: 'https://talx.dod.ngo/api/events/',
    tier: 'verified',
    access: 'Invite only',
  },
  {
    name: 'Freescout',
    desc: 'Shared inbox',
    url: 'https://post.dod.ngo',
    host: 'post.dod.ngo',
    repo: 'freescout-help-desk/freescout',
    img: '/static/images/services/freescout.png',
    // The root 302-redirects here; probing it directly measures the app, not
    // the redirect.
    probeUrl: 'https://post.dod.ngo/login',
    tier: 'opaque',
    access: 'Invite only',
  },
  {
    name: 'Potato Mesh',
    desc: 'Mesh network node dashboard',
    url: 'https://potatomesh.net',
    host: 'potatomesh.net',
    repo: 'l5yth/potato-mesh',
    img: '/static/images/services/potato-mesh.png',
    probeUrl: 'https://potatomesh.net/api/stats',
    tier: 'verified',
    access: 'Public',
  },
  {
    name: 'MeshINT',
    desc: 'Berlin Chaos Mesh map and node roster',
    url: 'https://meshint.potatomesh.net',
    host: 'meshint.potatomesh.net',
    repo: 'l5yth/meshint',
    img: '/static/images/services/meshint.png',
    // No /api surface: /api, /api/stats and /api/nodes all return 404. The root
    // answers 200 with Access-Control-Allow-Origin: * and does not redirect, so
    // it is both the only and a correct verified probe.
    probeUrl: 'https://meshint.potatomesh.net/',
    tier: 'verified',
    access: 'Public',
  },
  {
    name: 'DWeb Camp Mesh',
    desc: 'Mesh network for DWeb Camp',
    url: 'https://mesh.dod.ngo',
    host: 'mesh.dod.ngo',
    repo: 'department-of-decentralization/dweb-mesh',
    img: '/static/images/services/dweb-camp-mesh.png',
    // Same shape as MeshINT: no /api surface, root answers 200 with
    // Access-Control-Allow-Origin: * and does not redirect.
    probeUrl: 'https://mesh.dod.ngo/',
    tier: 'verified',
    access: 'Public',
  },
]

export default services
