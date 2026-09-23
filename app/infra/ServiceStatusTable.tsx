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
'use client'

import { useEffect, useState } from 'react'
import services from '@/data/services'
import { type ServiceStatus, probeAllServices } from '@/lib/serviceStatus'

/** Status of one row before its probe has settled. */
type RowStatus = ServiceStatus | 'checking'

/** Label and dot colour for each status a row can hold. */
const PRESENTATION: Record<RowStatus, { label: string; dot: string }> = {
  operational: { label: 'Operational', dot: 'bg-green-500' },
  reachable: { label: 'Reachable', dot: 'bg-green-500' },
  down: { label: 'Down', dot: 'bg-red-500' },
  unreachable: { label: 'Unreachable', dot: 'bg-red-500' },
  checking: { label: 'Checking', dot: 'bg-gray-400 animate-pulse' },
}

/**
 * Renders the service table and probes every service once on mount.
 *
 * Probing runs in the browser, not at build time: a status baked into the HTML
 * would report whenever the site was last deployed, not now (`SPEC.md` D9).
 */
export default function ServiceStatusTable() {
  const [statuses, setStatuses] = useState<RowStatus[]>(() => services.map(() => 'checking'))

  useEffect(() => {
    let cancelled = false
    probeAllServices(services, (url, init) => fetch(url, init)).then((results) => {
      // Guard against a state update after the visitor has navigated away.
      if (!cancelled) setStatuses(results.map((r) => r.status))
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="pb-8 pt-4">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {services.map((service, index) => {
          const { label, dot } = PRESENTATION[statuses[index]]
          return (
            <li
              key={service.name}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
            >
              <div className="flex flex-col">
                <a
                  href={service.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                >
                  {service.name}
                </a>
                <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                  {new URL(service.url).host}
                </span>
              </div>
              <div className="flex items-center gap-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">{service.access}</span>
                <span className="flex w-32 items-center gap-x-2">
                  <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dot}`} aria-hidden />
                  <span className="text-gray-900 dark:text-gray-100">{label}</span>
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <dl className="mt-8 space-y-1 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex gap-x-2">
          <dt className="font-medium">Operational</dt>
          <dd>service answered the status check</dd>
        </div>
        <div className="flex gap-x-2">
          <dt className="font-medium">Reachable</dt>
          <dd>service accepted the connection, response not readable</dd>
        </div>
        <div className="flex gap-x-2">
          <dt className="font-medium">Down, Unreachable</dt>
          <dd>check failed</dd>
        </div>
        <div className="flex gap-x-2">
          <dt className="font-medium">invite only</dt>
          <dd>account issued by the DoD, no open signup</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Checks run in your browser when this page loads. Each service sees your IP address.
      </p>
    </div>
  )
}
