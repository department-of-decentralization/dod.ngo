import { describe, expect, it } from 'vitest'

import skippedBerlinMesh from '../data/skippedBerlinMesh.js'
import { getNextMonthlyWeekdayDate } from './recurringEvents'

// Fixed "now" so the recurrence math is deterministic (SPEC D5). On 2026-07-01
// the next un-skipped occurrence falls in July, which is exactly what must be
// skipped.
const now = new Date('2026-07-01T12:00:00Z')

// Schedule of record (SPEC D1/D2, ACCEPTANCE A1): a Wednesday event at c-base.
const WEDNESDAY = 3
const BERLIN_MESH_WEEK = 3
const START_HOUR_UTC = 21

describe('getNextMonthlyWeekdayDate', () => {
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
  // Regression: Berlin Chaos Mesh must skip July 2026 (DWeb Camp) and
  // August 2026 (summer break), landing on the 3rd Wednesday of September.
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
