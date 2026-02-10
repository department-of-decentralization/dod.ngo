'use client'

import skippedDates from '@/data/skippedStammtisch'
import { getNextMonthlyWeekdayDate } from '@/lib/recurringEvents'

export default function NextStammtisch() {
  // For testing
  // const currentDate = new Date('2025-06-02T12:00:00Z')
  const nextStammtisch = getNextMonthlyWeekdayDate({
    weekday: 3,
    weekOfMonth: 3,
    startHourUtc: 21,
    skipMonths: skippedDates.skippedDates,
  })

  return (
    <span className="font-medium">
      {nextStammtisch.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  )
}
