'use client'

export default function NextBerlinMeshMeetup() {
  // For testing
  // const currentDate = new Date('2025-06-02T12:00:00Z')
  const currentDate = new Date()
  const currentMonth = currentDate.getUTCMonth()
  const currentYear = currentDate.getUTCFullYear()
  let nextMeetup = new Date()
  let nextMonth = 0

  do {
    // Create date object for 1st of current month
    nextMeetup = new Date(Date.UTC(currentYear, currentMonth + nextMonth, 1))

    // Find first Wednesday
    while (nextMeetup.getUTCDay() !== 3) {
      nextMeetup.setUTCDate(nextMeetup.getUTCDate() + 1)
    }

    // Add 1 week to get to 2nd Wednesday
    nextMeetup.setUTCDate(nextMeetup.getUTCDate() + 7)

    // Set start time to 21:00 UTC which is intentionally a bit into the event
    nextMeetup.setUTCHours(21)

    // If meetup already started/passed this month, move to next month
    ++nextMonth
  } while (nextMeetup < currentDate)

  return (
    <span className="font-medium">
      {nextMeetup.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  )
}
