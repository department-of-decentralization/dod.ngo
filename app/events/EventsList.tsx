'use client'

import { events } from '@/data/dodEvents'
import NextBerlinMeshMeetup from 'app/NextBerlinMeshMeetup'
import NextStammtisch from 'app/NextStammtisch'

export default function EventsList() {
  const now = new Date()
  const upcomingEvents = events
    .filter((event) => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastEvents = events
    .filter((event) => new Date(event.date) <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const renderEvent = (event) => (
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

  return (
    <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
      <h3>Upcoming events:</h3>
      <div>
        <ul>
          {upcomingEvents.map(renderEvent)}
          <li>
            Next <strong>DoD Stammtisch</strong> (informal meetup) at{' '}
            <a href="https://c-base.org" target="_blank" rel="noopener noreferrer">
              c-base
            </a>
            : <NextStammtisch /> at 19:00 Berlin time.
          </li>
          <li>
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
        </ul>
      </div>
      <h3>Past events:</h3>
      <div>
        <ul>{pastEvents.map(renderEvent)}</ul>
      </div>
    </div>
  )
}
