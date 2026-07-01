'use client'

import skippedDates from '@/data/skippedBerlinMesh'
import { getNextMonthlyWeekdayDate } from '@/lib/recurringEvents'

export default function NextBerlinMeshMeetup() {
  // For testing
  // const currentDate = new Date('2025-06-02T12:00:00Z')
  const nextMeetup = getNextMonthlyWeekdayDate({
    weekday: 3,
    weekOfMonth: 2,
    startHourUtc: 21,
    skipMonths: skippedDates.skippedDates,
  })

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
