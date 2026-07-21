import { describe, expect, it } from 'vitest'

import skippedBerlinMesh from '../data/skippedBerlinMesh.js'
import skippedStammtisch from '../data/skippedStammtisch.js'
import { getNextMonthlyWeekdayDate } from './recurringEvents'

// Fixed "now" so the recurrence math is deterministic. On 2026-07-01 the next
// un-skipped occurrences both fall in July, which is exactly what must be skipped.
const now = new Date('2026-07-01T12:00:00Z')

describe('getNextMonthlyWeekdayDate', () => {
  it('finds the 3rd-Wednesday Stammtisch in July when nothing is skipped', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: now,
      weekday: 3,
      weekOfMonth: 3,
      startHourUtc: 21,
    })
    expect(next.toISOString()).toBe('2026-07-15T21:00:00.000Z')
  })

  it('finds the 2nd-Wednesday Chaos Mesh meetup in July when nothing is skipped', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: now,
      weekday: 3,
      weekOfMonth: 2,
      startHourUtc: 21,
    })
    expect(next.toISOString()).toBe('2026-07-08T21:00:00.000Z')
  })
})

describe('recurring events skip summer breaks (regression)', () => {
  // Regression: DoD Stammtisch must skip July 2026 (DWeb Camp) and
  // August 2026 (summer break), landing on the 3rd Wednesday of September.
  it('DoD Stammtisch skips July (DWeb Camp) and August (summer break) 2026', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: now,
      weekday: 3,
      weekOfMonth: 3,
      startHourUtc: 21,
      skipMonths: skippedStammtisch.skippedDates,
    })
    expect(next.toISOString()).toBe('2026-09-16T21:00:00.000Z')
  })

  // Regression: Berlin Chaos Mesh must skip the same two months,
  // landing on the 2nd Wednesday of September.
  it('Berlin Chaos Mesh skips July (DWeb Camp) and August (summer break) 2026', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: now,
      weekday: 3,
      weekOfMonth: 2,
      startHourUtc: 21,
      skipMonths: skippedBerlinMesh.skippedDates,
    })
    expect(next.toISOString()).toBe('2026-09-09T21:00:00.000Z')
  })
})
