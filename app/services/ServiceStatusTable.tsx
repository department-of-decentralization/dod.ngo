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

import { useCallback, useEffect, useRef, useState } from 'react'
import services from '@/data/services'
import {
  type ServiceStatus,
  type ServiceStatusResult,
  describeEvidence,
  formatDuration,
  probeAllServices,
} from '@/lib/serviceStatus'

/** Where the page is in a check cycle. */
type Phase = 'checking' | 'done'

/** Status of one row, including the pre-answer state the engine never returns. */
type RowStatus = ServiceStatus | 'checking'

/** Human label for every state a row can hold. */
const LABEL: Record<RowStatus, string> = {
  operational: 'Operational',
  reachable: 'Reachable',
  down: 'Down',
  unreachable: 'Unreachable',
  checking: 'Checking',
}

/**
 * A status dot.
 *
 * Filled means the response was read; a ring means only the connection was
 * observed. That mirrors the two-tier vocabulary (`SPEC.md` D10) visually, so
 * Operational and Reachable stay distinguishable without reading the label.
 */
function StatusDot({ status, size }: { status: RowStatus; size: number }) {
  const bad = status === 'down' || status === 'unreachable'
  const pending = status === 'checking'
  const hollow = status === 'reachable' || status === 'unreachable'
  const color = pending
    ? 'border-gray-400 bg-gray-400 dark:border-gray-500 dark:bg-gray-500'
    : bad
      ? 'border-red-600 dark:border-red-500'
      : 'border-green-600 dark:border-green-500'
  const fill = hollow ? '' : bad ? 'bg-red-600 dark:bg-red-500' : 'bg-green-600 dark:bg-green-500'
  return (
    <span
      aria-hidden
      className={`mt-2 block flex-shrink-0 rounded-full border-2 ${color} ${pending ? 'animate-pulse' : fill} ${hollow ? 'bg-transparent' : ''}`}
      style={{ width: size, height: size }}
    />
  )
}

/**
 * Renders the service table and probes every service on mount.
 *
 * Probing runs in the browser, not at build time: a status baked into the HTML
 * would report whenever the site was last deployed, not now (`SPEC.md` D9).
 */
export default function ServiceStatusTable() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [results, setResults] = useState<(ServiceStatusResult | null)[]>(() =>
    services.map(() => null)
  )
  const [checkedAt, setCheckedAt] = useState('')
  const [took, setTook] = useState(0)
  const running = useRef(false)

  const run = useCallback(async () => {
    // Guard re-entry: the button stays clickable for keyboard users, and a
    // second run mid-flight would interleave two sets of results.
    if (running.current) return
    running.current = true
    setPhase('checking')
    setResults(services.map(() => null))
    const startedAt = Date.now()
    const settled = await probeAllServices(services, (url, init) => fetch(url, init))
    setResults(settled)
    setTook(Date.now() - startedAt)
    setCheckedAt(new Date().toLocaleTimeString('en-GB'))
    setPhase('done')
    running.current = false
  }, [])

  useEffect(() => {
    void run()
  }, [run])

  const answered = results.filter(Boolean).length
  const failed = results.filter(
    (r) => r && (r.status === 'down' || r.status === 'unreachable')
  ) as ServiceStatusResult[]
  const total = services.length

  let headline: string
  let meta = ''
  let summaryStatus: RowStatus
  if (phase === 'checking') {
    headline = `Checking ${total} services`
    meta = `${answered} of ${total} answered`
    summaryStatus = 'checking'
  } else if (failed.length) {
    headline = `${failed.length} of ${total} services not responding`
    meta = `${failed.map((r) => r.service.name).join(', ')} · checked at ${checkedAt} · took ${formatDuration(took)}`
    summaryStatus = 'down'
  } else {
    headline = `All ${total} services responding`
    meta = `Checked at ${checkedAt} · took ${formatDuration(took)}`
    summaryStatus = 'operational'
  }

  return (
    <div className="pb-8">
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        We run these open-source services for our events and community.
      </p>

      <section className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-md border border-gray-300 bg-butter-400/40 px-6 py-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex min-w-0 flex-1 basis-80 items-start gap-x-3.5">
          <StatusDot status={summaryStatus} size={14} />
          <div className="min-w-0">
            <div
              className={`text-xl font-semibold leading-7 ${failed.length ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}
            >
              {headline}
            </div>
            <div className="mt-0.5 text-sm tabular-nums leading-5 text-gray-700 dark:text-gray-400">
              {meta}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void run()}
          disabled={phase === 'checking'}
          className="flex-shrink-0 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold leading-5 text-gray-900 hover:bg-gray-100 disabled:cursor-default disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          Run again
        </button>
      </section>

      <ul className="mt-6 list-none border-t border-gray-200 p-0 dark:border-gray-700">
        {services.map((service, index) => {
          const result = results[index]
          const status: RowStatus = result ? result.status : 'checking'
          const evidence = result ? describeEvidence(result) : 'waiting for answer'
          return (
            <li
              key={service.name}
              className="flex flex-wrap items-start gap-x-6 gap-y-2 border-b border-gray-200 py-4 dark:border-gray-700"
            >
              <div className="flex min-w-0 flex-1 basis-80 items-start gap-x-4">
                <a
                  href={service.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block aspect-[4/3] w-20 flex-shrink-0 overflow-hidden rounded border border-gray-300 hover:border-primary-500 dark:border-gray-600 sm:w-28"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.img}
                    alt={`${service.name} screenshot`}
                    width={224}
                    height={168}
                    loading="lazy"
                    className="block h-full w-full object-cover object-top"
                  />
                </a>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2.5">
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg font-medium leading-7 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                    >
                      {service.name}
                    </a>
                    <span className="text-base leading-6 text-gray-600 dark:text-gray-400">
                      {service.desc}
                    </span>
                  </div>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block max-w-full break-words font-mono text-sm leading-5 text-primary-500 underline underline-offset-2 hover:text-primary-600 dark:text-primary-400"
                  >
                    {service.host}
                  </a>
                  <a
                    href={`https://github.com/${service.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Source code on GitHub: ${service.repo}`}
                    className="flex max-w-full items-start gap-x-1.5 font-mono text-xs leading-5 text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      fill="currentColor"
                      aria-hidden="true"
                      className="mt-1 flex-shrink-0"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span className="min-w-0 break-words">{service.repo}</span>
                  </a>
                </div>
              </div>
              <div className="flex min-w-0 flex-shrink-0 gap-x-6">
                <div className="w-24 flex-shrink-0 text-[15px] leading-7 text-gray-700 dark:text-gray-400">
                  {service.access}
                </div>
                <div className="flex w-52 min-w-0 items-start gap-x-2.5">
                  <StatusDot status={status} size={10} />
                  <div className="min-w-0">
                    <div
                      className={`text-base font-medium leading-7 ${result ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      {LABEL[status]}
                    </div>
                    <div className="font-mono text-xs leading-5 text-gray-600 dark:text-gray-400">
                      {evidence}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <dl className="mt-6 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm leading-5 text-gray-600 dark:text-gray-400">
        <dt className="flex items-center gap-x-1.5 font-medium text-gray-700 dark:text-gray-300">
          <span
            aria-hidden
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-green-600 dark:bg-green-500"
          />
          Operational
        </dt>
        <dd className="m-0">service answered the status check</dd>
        <dt className="flex items-center gap-x-1.5 font-medium text-gray-700 dark:text-gray-300">
          <span
            aria-hidden
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-green-600 dark:border-green-500"
          />
          Reachable
        </dt>
        <dd className="m-0">service accepted the connection, response not readable</dd>
        <dt className="flex items-center gap-x-1.5 font-medium text-gray-700 dark:text-gray-300">
          <span
            aria-hidden
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-red-600 dark:bg-red-500"
          />
          <span
            aria-hidden
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-red-600 dark:border-red-500"
          />
          Down, Unreachable
        </dt>
        <dd className="m-0">check failed</dd>
        <dt className="font-medium text-gray-700 dark:text-gray-300">Invite only</dt>
        <dd className="m-0">account issued by the DoD, no open signup</dd>
      </dl>

      <p className="mt-6 text-sm leading-5 text-gray-600 dark:text-gray-400">
        Something not working? Let us know via the{' '}
        <a
          href="/contact"
          className="font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
        >
          contact page
        </a>
        .
      </p>
    </div>
  )
}
