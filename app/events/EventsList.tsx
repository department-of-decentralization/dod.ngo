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

  const formatEventDate = (event: (typeof events)[number], mode: 'upcoming' | 'past') => {
    const startDate = new Date(event.date)

    if (event.yearOnly) {
      return startDate.getFullYear()
    }

    if (event.endDate) {
      const endDate = new Date(event.endDate)
      const sameYear = startDate.getFullYear() === endDate.getFullYear()
      const sameMonth = startDate.getMonth() === endDate.getMonth() && sameYear

      if (sameMonth) {
        const month = startDate.toLocaleDateString('en-US', { month: 'long' })
        const year = startDate.getFullYear()
        const startDay = startDate.getDate()
        const endDay = endDate.getDate()
        return `${month} ${startDay}-${endDay}, ${year}`
      }

      if (sameYear) {
        const startMonthDay = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
        const endMonthDay = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
        return `${startMonthDay}-${endMonthDay}, ${startDate.getFullYear()}`
      }

      const startFull = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      const endFull = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      return `${startFull} - ${endFull}`
    }

    return mode === 'upcoming'
      ? startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : startDate.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })
  }

  const renderEventDescription = (event: (typeof events)[number]) => {
    if (!event.textLink) {
      return event.description
    }

    const { text, url } = event.textLink
    const [before, ...afterParts] = event.description.split(text)

    if (afterParts.length === 0) {
      return event.description
    }

    return (
      <>
        {before}
        <a href={url} target="_blank" rel="noreferrer">
          {text}
        </a>
        {afterParts.join(text)}
      </>
    )
  }

  const renderUpcomingEvent = (event: (typeof events)[number]) => (
    <li key={`${event.title}-${event.date}`}>
      <strong>
        {event.title} ({formatEventDate(event, 'upcoming')}):
      </strong>{' '}
      {renderEventDescription(event)}
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
  const renderPastEvent = (event: (typeof events)[number]) => (
    <li key={`${event.title}-${event.date}`}>
      <strong>
        {event.title} ({formatEventDate(event, 'past')}):
      </strong>{' '}
      {renderEventDescription(event)}
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
    } as UpcomingItem,
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
    } as UpcomingItem,
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
