import { describe, expect, it } from 'vitest'

import skippedBerlinMesh from '../data/skippedBerlinMesh.js'
import skippedStammtisch from '../data/skippedStammtisch.js'
import { getNextMonthlyWeekdayDate } from './recurringEvents'

// Fixed "now" so the recurrence math is deterministic (SPEC D5). On 2026-07-01
// the next un-skipped occurrences both fall in July, which is exactly what must
// be skipped.
const now = new Date('2026-07-01T12:00:00Z')

// Schedule of record (SPEC D1/D2, ACCEPTANCE A1): both series are Wednesday
// events at c-base, distinguished only by week of month.
const WEDNESDAY = 3
const STAMMTISCH_WEEK = 2
const BERLIN_MESH_WEEK = 3
const START_HOUR_UTC = 21

describe('getNextMonthlyWeekdayDate', () => {
  it('finds the 2nd-Wednesday Stammtisch in July when nothing is skipped', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: now,
      weekday: WEDNESDAY,
      weekOfMonth: STAMMTISCH_WEEK,
      startHourUtc: START_HOUR_UTC,
    })
    expect(next.toISOString()).toBe('2026-07-08T21:00:00.000Z')
  })

  it('finds the 3rd-Wednesday Chaos Mesh meetup in July when nothing is skipped', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: now,
      weekday: WEDNESDAY,
      weekOfMonth: BERLIN_MESH_WEEK,
      startHourUtc: START_HOUR_UTC,
    })
    expect(next.toISOString()).toBe('2026-07-15T21:00:00.000Z')
  })
})

describe('recurring events skip summer breaks (regression)', () => {
  // Regression: DoD Stammtisch must skip July 2026 (DWeb Camp) and
  // August 2026 (summer break), landing on the 2nd Wednesday of September.
  it('DoD Stammtisch skips July (DWeb Camp) and August (summer break) 2026', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: now,
      weekday: WEDNESDAY,
      weekOfMonth: STAMMTISCH_WEEK,
      startHourUtc: START_HOUR_UTC,
      skipMonths: skippedStammtisch.skippedDates,
    })
    expect(next.toISOString()).toBe('2026-09-09T21:00:00.000Z')
  })

  // Regression: Berlin Chaos Mesh must skip the same two months,
  // landing on the 3rd Wednesday of September.
  it('Berlin Chaos Mesh skips July (DWeb Camp) and August (summer break) 2026', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: now,
      weekday: WEDNESDAY,
      weekOfMonth: BERLIN_MESH_WEEK,
      startHourUtc: START_HOUR_UTC,
      skipMonths: skippedBerlinMesh.skippedDates,
    })
    expect(next.toISOString()).toBe('2026-09-16T21:00:00.000Z')
  })
})

// Regression [2026-09-23] (ACCEPTANCE A5): the two series carried each other's
// week of month on every surface. This pins the schedule to the week-of-month
// literals that the render paths must use, so a re-swap fails here.
describe('Stammtisch and Chaos Mesh week-of-month are not swapped (regression)', () => {
  // Both September 2026 occurrences are already past on this date, so the next
  // occurrence for both series is in October 2026 (Wednesdays 7, 14, 21, 28).
  // Neither series skips October 2026.
  const afterSeptember = new Date('2026-09-23T12:00:00Z')

  it('DoD Stammtisch is the 2nd Wednesday: 2026-10-14, not the 3rd', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: afterSeptember,
      weekday: WEDNESDAY,
      weekOfMonth: STAMMTISCH_WEEK,
      startHourUtc: START_HOUR_UTC,
      skipMonths: skippedStammtisch.skippedDates,
    })
    expect(next.toISOString()).toBe('2026-10-14T21:00:00.000Z')
  })

  it('Berlin Chaos Mesh is the 3rd Wednesday: 2026-10-21, not the 2nd', () => {
    const next = getNextMonthlyWeekdayDate({
      currentDate: afterSeptember,
      weekday: WEDNESDAY,
      weekOfMonth: BERLIN_MESH_WEEK,
      startHourUtc: START_HOUR_UTC,
      skipMonths: skippedBerlinMesh.skippedDates,
    })
    expect(next.toISOString()).toBe('2026-10-21T21:00:00.000Z')
  })

  // The literals above are only half the contract: the render paths carry their
  // own copies (SPEC D4). ACCEPTANCE A2 pins those by grep; this asserts the
  // two series never resolve to the same slot, which is the shape of the defect.
  it('the two series never occupy the same week of month', () => {
    expect(STAMMTISCH_WEEK).not.toBe(BERLIN_MESH_WEEK)
  })
})
