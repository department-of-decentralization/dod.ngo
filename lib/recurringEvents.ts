type SkipMonth = {
  year: number
  month: number
}

type NextMonthlyWeekdayOptions = {
  currentDate?: Date
  weekday: number
  weekOfMonth: number
  startHourUtc?: number
  skipMonths?: SkipMonth[]
}

export function getNextMonthlyWeekdayDate({
  currentDate = new Date(),
  weekday,
  weekOfMonth,
  startHourUtc = 21,
  skipMonths = [],
}: NextMonthlyWeekdayOptions) {
  const currentMonth = currentDate.getUTCMonth()
  const currentYear = currentDate.getUTCFullYear()
  let nextDate = new Date()
  let nextMonth = 0
  let shouldSkip = false

  do {
    nextDate = new Date(Date.UTC(currentYear, currentMonth + nextMonth, 1))

    while (nextDate.getUTCDay() !== weekday) {
      nextDate.setUTCDate(nextDate.getUTCDate() + 1)
    }

    nextDate.setUTCDate(nextDate.getUTCDate() + 7 * (weekOfMonth - 1))
    nextDate.setUTCHours(startHourUtc)

    shouldSkip = skipMonths.some(
      (skipped) =>
        skipped.year === nextDate.getUTCFullYear() &&
        skipped.month === nextDate.getUTCMonth()
    )

    ++nextMonth
  } while (nextDate < currentDate || shouldSkip)

  return nextDate
}
