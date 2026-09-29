'use client'

import type { ReactNode } from 'react'
import { events } from '@/data/dodEvents'
import skippedBerlinMesh from '@/data/skippedBerlinMesh'
import skippedDates from '@/data/skippedStammtisch'
import {
  type UpcomingDate,
  groupByYear,
  isUpcoming,
  meetupDate,
  monthlyCadence,
  pastDate,
  sentenceCase,
  upcomingDate,
} from '@/lib/eventDates'
import { getNextMonthlyWeekdayDate } from '@/lib/recurringEvents'

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
 * The events page's lists: what comes next, the meetups included, and every
 * past event by year (SPEC.md, Bugfix: Design Review, #11). Dates are read so
 * that no time zone moves them (`lib/eventDates.ts`, SPEC.md I1).
 */
export default function EventsList() {
  const now = new Date()
  const upcomingEvents = events.filter((event) => isUpcoming(event, now))
  const pastEvents = events.filter((event) => !isUpcoming(event, now))

  const nextStammtischDate = getNextMonthlyWeekdayDate({
    weekday: 3,
    weekOfMonth: 2,
    startHourUtc: 21,
    skipMonths: skippedDates.skippedDates,
  })

  const nextBerlinMeshDate = getNextMonthlyWeekdayDate({
    weekday: 3,
    weekOfMonth: 3,
    startHourUtc: 21,
    skipMonths: skippedBerlinMesh.skippedDates,
  })

  const cbase = (
    <a href="https://c-base.org" target="_blank" rel="noopener noreferrer" className={LINK}>
      c-base
    </a>
  )

  const upcomingItems: { key: string; date: Date; row: ReactNode }[] = [
    ...upcomingEvents.map((event) => ({
      key: `${event.title}-${event.date}`,
      date: new Date(`${event.date}T00:00:00Z`),
      row: (
        <>
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
        </>
      ),
    })),
    {
      key: 'stammtisch',
      date: nextStammtischDate,
      row: (
        <>
          <UpcomingDateColumn date={meetupDate(nextStammtischDate)} />
          <div>
            <div data-title className={TITLE}>
              DoD Stammtisch
            </div>
            <div data-description className={DESCRIPTION}>
              Informal meetup at {cbase}, 19:00 Berlin time · {monthlyCadence(nextStammtischDate)}
            </div>
          </div>
        </>
      ),
    },
    {
      key: 'berlin-mesh',
      date: nextBerlinMeshDate,
      row: (
        <>
          <UpcomingDateColumn date={meetupDate(nextBerlinMeshDate)} />
          <div>
            <div data-title className={TITLE}>
              <a
                href="https://chaosmesh.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-butter-600 underline-offset-[3px] hover:text-primary-700 dark:decoration-gray-600 dark:hover:text-primary-300"
              >
                Berlin Chaos Mesh
              </a>
            </div>
            <div data-description className={DESCRIPTION}>
              Meshtastic/Meshcore/Reticulum meetup at {cbase}, 19:00 Berlin time ·{' '}
              {monthlyCadence(nextBerlinMeshDate)}
            </div>
          </div>
        </>
      ),
    },
  ].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="pt-8 pb-8">
      <section className="max-w-[52rem]">
        <h2 className="border-b border-butter-600 pb-3 text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:border-gray-700 dark:text-gray-100">
          Upcoming
        </h2>
        <ul>
          {upcomingItems.map((item) => (
            <li key={item.key} className={ROW}>
              {item.row}
            </li>
          ))}
        </ul>
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
