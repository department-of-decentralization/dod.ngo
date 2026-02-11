'use client'

import { events } from '@/data/dodEvents'
import skippedDates from '@/data/skippedStammtisch'
import { getNextMonthlyWeekdayDate } from '@/lib/recurringEvents'
import NextBerlinMeshMeetup from 'app/NextBerlinMeshMeetup'
import NextStammtisch from 'app/NextStammtisch'

export default function EventsList() {
  const now = new Date()
  const upcomingEvents = events.filter((event) => new Date(event.date) > now)

  const pastEvents = events
    .filter((event) => new Date(event.date) <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const renderUpcomingEvent = (event) => (
    <li key={`${event.title}-${event.date}`}>
      <strong>
        {event.title} (
        {event.yearOnly
          ? new Date(event.date).getFullYear()
          : new Date(event.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
        ){':'}
      </strong>{' '}
      {event.description}
      {event.link && (
        <>
          :{' '}
          <a href={event.link.url} target="_blank" rel="noreferrer">
            {event.link.label}
          </a>
        </>
      )}
    </li>
  )
  const renderPastEvent = (event) => (
    <li key={`${event.title}-${event.date}`}>
      <strong>
        {event.title} (
        {event.yearOnly
          ? new Date(event.date).getFullYear()
          : new Date(event.date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
        ){':'}
      </strong>{' '}
      {event.description}
      {event.link && (
        <>
          :{' '}
          <a href={event.link.url} target="_blank" rel="noreferrer">
            {event.link.label}
          </a>
        </>
      )}
    </li>
  )

  const nextStammtischDate = getNextMonthlyWeekdayDate({
    weekday: 3,
    weekOfMonth: 3,
    startHourUtc: 21,
    skipMonths: skippedDates.skippedDates,
  })

  const nextBerlinMeshDate = getNextMonthlyWeekdayDate({
    weekday: 3,
    weekOfMonth: 2,
    startHourUtc: 21,
  })

  type UpcomingItem =
    | { type: 'event'; date: Date; event: (typeof events)[number] }
    | { type: 'recurring'; key: string; date: Date; render: () => JSX.Element }

  const upcomingItems: UpcomingItem[] = [
    ...upcomingEvents.map(
      (event): UpcomingItem => ({
        type: 'event',
        date: new Date(event.date),
        event,
      })
    ),
    {
      type: 'recurring',
      key: 'stammtisch',
      date: nextStammtischDate,
      render: () => (
        <li key="stammtisch">
          Next <strong>DoD Stammtisch</strong> (informal meetup) at{' '}
          <a href="https://c-base.org" target="_blank" rel="noopener noreferrer">
            c-base
          </a>
          : <NextStammtisch /> at 19:00 Berlin time.
        </li>
      ),
    },
    {
      type: 'recurring',
      key: 'berlin-mesh',
      date: nextBerlinMeshDate,
      render: () => (
        <li key="berlin-mesh">
          Next{' '}
          <a href="https://chaosmesh.net/" target="_blank" rel="noopener noreferrer">
            <strong>Berlin Chaos Mesh</strong>
          </a>{' '}
          meetup (Meshtastic/Meshcore/Reticulum) at{' '}
          <a href="https://c-base.org" target="_blank" rel="noopener noreferrer">
            c-base
          </a>
          : <NextBerlinMeshMeetup /> at 19:00 Berlin time.
        </li>
      ),
    },
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
      <h3>Upcoming events:</h3>
      <div>
        <ul>
          {upcomingItems.map((item) =>
            item.type === 'event' ? renderUpcomingEvent(item.event) : item.render()
          )}
        </ul>
      </div>
      <h3>Past events:</h3>
      <div>
        <ul>{pastEvents.map(renderPastEvent)}</ul>
      </div>
    </div>
  )
}
