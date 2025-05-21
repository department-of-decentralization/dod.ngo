'use client'

import skippedDates from '@/data/skippedStammtisch'

export default function NextStammtisch() {
  // For testing
  // const currentDate = new Date('2025-06-02T12:00:00Z')
  const currentDate = new Date()
  const currentMonth = currentDate.getUTCMonth()
  const currentYear = currentDate.getUTCFullYear()
  let nextStammtisch = new Date()
  let nextMonth = 0

  let shouldSkip = false

  do {
    // Create date object for 1st of current month
    nextStammtisch = new Date(Date.UTC(currentYear, currentMonth + nextMonth, 1))

    // Find first Wednesday
    while (nextStammtisch.getUTCDay() !== 3) {
      nextStammtisch.setUTCDate(nextStammtisch.getUTCDate() + 1)
    }

    // Add 2 weeks to get to 3rd Wednesday
    nextStammtisch.setUTCDate(nextStammtisch.getUTCDate() + 14)

    // Set start time to 21:00 UTC which is intentially a bit into the event
    nextStammtisch.setUTCHours(21)

    // Check if this month is in the skipped dates list
    shouldSkip = skippedDates.skippedDates.some(
      (skipped) =>
        skipped.year === nextStammtisch.getUTCFullYear() &&
        skipped.month === nextStammtisch.getUTCMonth()
    )

    console.log(
      `shouldSkip: ${shouldSkip}, date: ${nextStammtisch.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`
    )

    if (shouldSkip) {
      ++nextMonth
      continue
    }

    // If Stammtisch already started/passed this month, move to next month
    ++nextMonth
  } while (nextStammtisch < currentDate || shouldSkip)

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
