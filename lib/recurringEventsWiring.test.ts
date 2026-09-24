/* SPDX-FileCopyrightText: 2026 Department of Decentralization */
/* SPDX-License-Identifier: MIT */
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
 * These checks read the render paths as source and pin each series' full
 * wiring — weekday, week of month, and skip list — so any re-crossing of the
 * two series fails here, until the D4 refactor folds the duplicated literals
 * into one constant per series.
 */

/** Schedule of record: SPEC D1/D2, ACCEPTANCE A1. Both series meet Wednesday. */
const WEDNESDAY = '3'
const STAMMTISCH_WEEK = '2'
const BERLIN_MESH_WEEK = '3'

/** Skip lists belong to the series, not the slot (SPEC 4.3, ACCEPTANCE A4). */
const STAMMTISCH_DATA = '@/data/skippedStammtisch'
const BERLIN_MESH_DATA = '@/data/skippedBerlinMesh'

/** Reads a repository file as UTF-8 text, relative to the repository root. */
function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

/**
 * Returns the body of the `getNextMonthlyWeekdayDate` call beginning at
 * `anchor`, so each call site can be pinned independently of the others.
 */
function callBlockAt(source: string, anchor: string): string {
  const start = source.indexOf(anchor)
  expect(start, `call site not found: ${anchor}`).toBeGreaterThanOrEqual(0)

  // Guard the not-found case explicitly: slice(start, -1) would silently widen
  // the block to near-EOF and could then match a foreign call's fields.
  const end = source.indexOf('})', start)
  expect(end, `unterminated call site: ${anchor}`).toBeGreaterThan(start)

  return source.slice(start, end)
}

/** Reads one option's literal out of a call body extracted by `callBlockAt`. */
function optionIn(block: string, option: string, anchor: string): string {
  const match = block.match(new RegExp(`${option}:\\s*([^,\\n]+)`))
  expect(match, `${option} not found at: ${anchor}`).not.toBeNull()
  return match![1].trim()
}

/** Resolves which data module an identifier was imported from. */
function importedFrom(source: string, identifier: string): string {
  const match = source.match(new RegExp(`import\\s+${identifier}\\s+from\\s+'([^']+)'`))
  expect(match, `import not found: ${identifier}`).not.toBeNull()
  return match![1]
}

/**
 * Asserts one call site uses the whole expected wiring for its series, and
 * returns nothing. `skipIdentifier` is the variable passed to `skipMonths`,
 * whose import is then resolved back to a data module.
 */
function expectSeriesWiring(
  source: string,
  anchor: string,
  expected: { weekOfMonth: string; data: string }
) {
  const block = callBlockAt(source, anchor)

  expect(optionIn(block, 'weekday', anchor), 'weekday').toBe(WEDNESDAY)
  expect(optionIn(block, 'weekOfMonth', anchor), 'weekOfMonth').toBe(expected.weekOfMonth)

  const skipIdentifier = optionIn(block, 'skipMonths', anchor).split('.')[0]
  expect(importedFrom(source, skipIdentifier), 'skip list').toBe(expected.data)
}

describe('recurring series are wired to the right week of month (regression)', () => {
  it('app/NextStammtisch.tsx uses the 2nd Wednesday and the Stammtisch skip list', () => {
    expectSeriesWiring(readSource('app/NextStammtisch.tsx'), 'getNextMonthlyWeekdayDate({', {
      weekOfMonth: STAMMTISCH_WEEK,
      data: STAMMTISCH_DATA,
    })
  })

  it('app/NextBerlinMeshMeetup.tsx uses the 3rd Wednesday and the Chaos Mesh skip list', () => {
    expectSeriesWiring(readSource('app/NextBerlinMeshMeetup.tsx'), 'getNextMonthlyWeekdayDate({', {
      weekOfMonth: BERLIN_MESH_WEEK,
      data: BERLIN_MESH_DATA,
    })
  })

  it('app/events/EventsList.tsx agrees with both components', () => {
    const source = readSource('app/events/EventsList.tsx')

    expectSeriesWiring(source, 'const nextStammtischDate = getNextMonthlyWeekdayDate({', {
      weekOfMonth: STAMMTISCH_WEEK,
      data: STAMMTISCH_DATA,
    })
    expectSeriesWiring(source, 'const nextBerlinMeshDate = getNextMonthlyWeekdayDate({', {
      weekOfMonth: BERLIN_MESH_WEEK,
      data: BERLIN_MESH_DATA,
    })
  })
})

describe('prose agrees with the schedule (regression)', () => {
  it('app/contact/page.tsx announces the Stammtisch as the 2nd Wednesday', () => {
    // JSX wraps the sentence across lines, so collapse whitespace before matching.
    const source = readSource('app/contact/page.tsx').replace(/\s+/g, ' ')
    const matches = [...source.matchAll(/happens every (\d)(?:st|nd|rd|th) Wednesday/g)]

    // Exactly one claim, so a second contradictory sentence cannot hide behind it.
    expect(matches, 'Stammtisch schedule sentence').toHaveLength(1)
    expect(matches[0][1]).toBe(STAMMTISCH_WEEK)
  })
})
