'use client'

export default function NextStammtisch() {
  const currentDate = new Date()
  const currentMonth = currentDate.getUTCMonth()
  const currentYear = currentDate.getUTCFullYear()
  let nextStammtisch = new Date()
  let nextMonth = 0

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

    // Check if this is June 2025 because of ProtocolBerg v2 (month 5, since January is 0)
    if (nextStammtisch.getUTCFullYear() === 2025 && nextStammtisch.getUTCMonth() === 5) {
      // Skip June 2025
      nextMonth++
      continue
    }

    // If Stammtisch already started/passed this month, move to next month
    nextMonth++
  } while (nextStammtisch < currentDate)

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
