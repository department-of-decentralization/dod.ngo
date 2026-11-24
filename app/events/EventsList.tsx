'use client'

import type { ReactNode } from 'react'
import { events } from '@/data/dodEvents'
import {
  type UpcomingDate,
  groupByYear,
  isUpcoming,
  pastDate,
  sentenceCase,
  upcomingDate,
} from '@/lib/eventDates'

/** One entry of `data/dodEvents.ts`. */
type EventEntry = (typeof events)[number]

/** A link in a row, coloured as the prose colours its links (design review #3). */
const LINK =
  'font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'

/** A row: the date column, then the event, above a butter hairline (#11). */
const ROW =
  'grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-butter-600 py-4 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-6 dark:border-gray-700'

/** An event's title. */
const TITLE = 'text-lg leading-7 font-semibold text-gray-900 dark:text-gray-100'

/** An event's description. */
const DESCRIPTION = 'mt-0.5 text-base leading-6 text-gray-700 dark:text-gray-300'

/**
 * An event's description, starting with a capital letter, with its text link
 * if it has one.
 *
 * @param event - The event.
 * @returns The description.
 */
function describe(event: EventEntry): ReactNode {
  const text = sentenceCase(event.description)
  if (!event.textLink) return text
  const { text: linkText, url } = event.textLink
  const [before, ...after] = text.split(linkText)
  if (after.length === 0) return text
  return (
    <>
      {before}
      <a href={url} target="_blank" rel="noreferrer" className={LINK}>
        {linkText}
      </a>
      {after.join(linkText)}
    </>
  )
}

/**
 * The date column of an upcoming row: the weekday over the day.
 *
 * @param props - The date to show.
 * @returns The column.
 */
function UpcomingDateColumn({ date }: { date: UpcomingDate }) {
  return (
    <div data-date>
      <div className="text-[13px] leading-5 font-semibold tracking-[0.06em] text-gray-600 uppercase dark:text-gray-400">
        {date.weekday}
      </div>
      <div className="text-xl leading-7 font-bold text-gray-900 dark:text-gray-100">{date.day}</div>
    </div>
  )
}

/**
 * The link under an event's description, on its own line.
 *
 * @param props - The event.
 * @returns The link, or nothing.
 */
function EventLink({ event }: { event: EventEntry }) {
  if (!event.link) return null
  return (
    <a
      href={event.link.url}
      target="_blank"
      rel="noreferrer"
      className={`mt-1 inline-block text-[15px] leading-[22px] ${LINK}`}
    >
      {event.link.label}
    </a>
  )
}

/**
 * The events page's lists: what comes next, and every past event by year
 * (SPEC.md, Bugfix: Design Review, #11). Dates are read so that no time zone
 * moves them (`lib/eventDates.ts`, SPEC.md I1).
 */
export default function EventsList() {
  const now = new Date()
  const upcomingEvents = events
    .filter((event) => isUpcoming(event, now))
    .sort((a, b) => a.date.localeCompare(b.date))
  const pastEvents = events.filter((event) => !isUpcoming(event, now))

  return (
    <div className="pt-8 pb-8">
      <section className="max-w-[52rem]">
        <h2 className="border-b border-butter-600 pb-3 text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:border-gray-700 dark:text-gray-100">
          Upcoming
        </h2>
        {upcomingEvents.length === 0 ? (
          <p className="border-b border-butter-600 py-4 text-base leading-6 text-gray-700 dark:border-gray-700 dark:text-gray-300">
            No upcoming events.
          </p>
        ) : (
          <ul>
            {upcomingEvents.map((event) => (
              <li key={`${event.title}-${event.date}`} className={ROW}>
                <UpcomingDateColumn date={upcomingDate(event)} />
                <div>
                  <div data-title className={TITLE}>
                    {event.title}
                  </div>
                  <div data-description className={DESCRIPTION}>
                    {describe(event)}
                  </div>
                  <EventLink event={event} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-12 max-w-[52rem]">
        <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Past
        </h2>
        {groupByYear(pastEvents).map((group) => (
          <div key={group.year}>
            <h3 className="mt-4 border-b border-butter-600 py-2 text-sm leading-5 font-semibold tracking-[0.06em] text-gray-600 dark:border-gray-700 dark:text-gray-400">
              {group.year}
            </h3>
            <ul>
              {group.events.map((event) => (
                <li key={`${event.title}-${event.date}`} className={ROW}>
                  <div
                    data-date
                    className="text-base leading-7 font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {pastDate(event)}
                  </div>
                  <div>
                    <div data-title className={TITLE}>
                      {event.title}
                    </div>
                    <div data-description className={DESCRIPTION}>
                      {describe(event)}
                    </div>
                    <EventLink event={event} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}
