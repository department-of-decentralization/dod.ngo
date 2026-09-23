import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

/**
 * Regression [2026-09-23] (ACCEPTANCE A2/A3/A5).
 *
 * `getNextMonthlyWeekdayDate` is generic, so `recurringEvents.test.ts` cannot
 * see a series wired to the wrong slot: it passes whatever literal it is given.
 * The shipped defect was exactly that — DoD Stammtisch and Berlin Chaos Mesh
 * carried each other's `weekOfMonth` at every call site, and the unit suite was
 * green throughout (SPEC D6).
 *
 * These checks read the render paths as source and pin each series' literal, so
 * the wiring itself is covered until the D4 refactor folds the duplicated
 * literals into one constant per series.
 */

/** Schedule of record: SPEC D1/D2, ACCEPTANCE A1. */
const STAMMTISCH_WEEK = 2
const BERLIN_MESH_WEEK = 3

/** Reads a repository file as UTF-8 text, relative to the repository root. */
function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

/**
 * Extracts the `weekOfMonth` literal from the `getNextMonthlyWeekdayDate` call
 * that begins at `anchor`, so each call site can be pinned independently.
 */
function weekOfMonthAt(source: string, anchor: string): number {
  const start = source.indexOf(anchor)
  expect(start, `call site not found: ${anchor}`).toBeGreaterThanOrEqual(0)

  const block = source.slice(start, source.indexOf('})', start))
  const match = block.match(/weekOfMonth:\s*(\d+)/)
  expect(match, `weekOfMonth not found at: ${anchor}`).not.toBeNull()

  return Number(match![1])
}

describe('recurring series are wired to the right week of month (regression)', () => {
  it('app/NextStammtisch.tsx uses the 2nd Wednesday', () => {
    const source = readSource('app/NextStammtisch.tsx')
    expect(weekOfMonthAt(source, 'getNextMonthlyWeekdayDate({')).toBe(STAMMTISCH_WEEK)
    // Skip lists belong to the series, not the slot (SPEC 4.3, ACCEPTANCE A4).
    expect(source).toContain("from '@/data/skippedStammtisch'")
  })

  it('app/NextBerlinMeshMeetup.tsx uses the 3rd Wednesday', () => {
    const source = readSource('app/NextBerlinMeshMeetup.tsx')
    expect(weekOfMonthAt(source, 'getNextMonthlyWeekdayDate({')).toBe(BERLIN_MESH_WEEK)
    expect(source).toContain("from '@/data/skippedBerlinMesh'")
  })

  it('app/events/EventsList.tsx agrees with both components', () => {
    const source = readSource('app/events/EventsList.tsx')
    expect(weekOfMonthAt(source, 'const nextStammtischDate = getNextMonthlyWeekdayDate({')).toBe(
      STAMMTISCH_WEEK
    )
    expect(weekOfMonthAt(source, 'const nextBerlinMeshDate = getNextMonthlyWeekdayDate({')).toBe(
      BERLIN_MESH_WEEK
    )
  })
})

describe('prose agrees with the schedule (regression)', () => {
  it('app/contact/page.tsx announces the Stammtisch as the 2nd Wednesday', () => {
    // JSX wraps the sentence across lines, so collapse whitespace before matching.
    const source = readSource('app/contact/page.tsx').replace(/\s+/g, ' ')
    const match = source.match(/happens every (\d)(?:st|nd|rd|th) Wednesday/)
    expect(match, 'Stammtisch schedule sentence not found').not.toBeNull()
    expect(Number(match![1])).toBe(STAMMTISCH_WEEK)
  })
})
