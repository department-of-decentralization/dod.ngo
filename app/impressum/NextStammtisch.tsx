'use client'

export default function NextStammtisch() {
  const today = new Date()
  const yesterday = new Date(today.getDate() - 1)
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Create date object for 1st of current month
  let date = new Date(currentYear, currentMonth, 1)

  // Find first Wednesday
  while (date.getDay() !== 3) {
    date.setDate(date.getDate() + 1)
  }

  // Add 2 weeks to get to 3rd Wednesday
  date.setDate(date.getDate() + 14)

  // If 3rd Wednesday already passed this month, move to next month
  if (date < yesterday) {
    date = new Date(currentYear, currentMonth + 1, 1)
    while (date.getDay() !== 3) {
      date.setDate(date.getDate() + 1)
    }
    date.setDate(date.getDate() + 14)
  }

  return (
    <span className="font-medium">
      {date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  )
}
