/*
 * SPDX-FileCopyrightText: 2026 Department of Decentralization
 * SPDX-License-Identifier: MIT
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { events } from '../data/dodEvents'
import {
  berlinDay,
  groupByYear,
  isUpcoming,
  meetupDate,
  monthlyCadence,
  pastDate,
  sentenceCase,
  upcomingDate,
} from './eventDates'

/** Zones on both sides of Berlin, as far apart as zones go. */
const ZONES = ['America/Los_Angeles', 'Europe/Berlin', 'Pacific/Kiritimati', 'UTC']

const originalTz = process.env.TZ
afterEach(() => {
  // process.env stores strings: assigning undefined would leave TZ set to
  // "undefined", which Node reads as UTC.
  if (originalTz === undefined) delete process.env.TZ
  else process.env.TZ = originalTz
})

/**
 * Run a check in every zone of {@link ZONES}.
 *
 * @param check - Called once per zone, with the machine's zone set to it.
 */
function inEveryZone(check: (zone: string) => void) {
  for (const zone of ZONES) {
    process.env.TZ = zone
    check(zone)
  }
}

describe('an event stays upcoming through its own day in Berlin [regression 2026-09-29]', () => {
  // SPEC.md K1: the event moved to "Past events" at 00:00 UTC on its own day.
  const event = { date: '2026-10-05' }

  it('is upcoming all day in Berlin, and past from midnight', () => {
    inEveryZone((zone) => {
      expect(isUpcoming(event, new Date('2026-10-05T08:00:00+02:00')), zone).toBe(true)
      expect(isUpcoming(event, new Date('2026-10-05T23:59:00+02:00')), zone).toBe(true)
      expect(isUpcoming(event, new Date('2026-10-06T00:00:00+02:00')), zone).toBe(false)
      expect(isUpcoming(event, new Date('2026-10-04T12:00:00+02:00')), zone).toBe(true)
    })
  })

  it('keeps a multi-day event upcoming through its last day', () => {
    const camp = { date: '2026-07-08', endDate: '2026-07-12' }
    expect(isUpcoming(camp, new Date('2026-07-10T12:00:00+02:00'))).toBe(true)
    expect(isUpcoming(camp, new Date('2026-07-12T23:00:00+02:00'))).toBe(true)
    expect(isUpcoming(camp, new Date('2026-07-13T00:30:00+02:00'))).toBe(false)
  })

  it('reads the day in Berlin across a change of year and of offset', () => {
    expect(berlinDay(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01')
    expect(berlinDay(new Date('2026-10-04T22:30:00Z'))).toBe('2026-10-05')
    expect(berlinDay(new Date('2026-01-15T23:30:00Z'))).toBe('2026-01-16')
  })
})

describe('an event shows its own day in every time zone [regression 2026-09-29]', () => {
  // SPEC.md K2: west of UTC, 2026-10-05 read as October 4, and a year-only
  // 2022 event as 2021.
  it('shows the upcoming weekday and days of the data', () => {
    inEveryZone((zone) => {
      expect(upcomingDate({ date: '2026-10-05' }), zone).toEqual({ weekday: 'Mon', day: 'Oct 5' })
      expect(upcomingDate({ date: '2026-07-08', endDate: '2026-07-12' }), zone).toEqual({
        weekday: 'Wed',
        day: 'Jul 8–12',
      })
      expect(upcomingDate({ date: '2026-06-30', endDate: '2026-07-02' }), zone).toEqual({
        weekday: 'Tue',
        day: 'Jun 30–Jul 2',
      })
    })
  })

  it('shows a past event as precisely as the data knows it', () => {
    inEveryZone((zone) => {
      expect(pastDate({ date: '2026-06-14' }), zone).toBe('Jun 14')
      expect(pastDate({ date: '2026-07-08', endDate: '2026-07-12' }), zone).toBe('Jul 8–12')
      expect(pastDate({ date: '2026-12-30', endDate: '2027-01-02' }), zone).toBe('Dec 30–Jan 2')
      expect(pastDate({ date: '2025-12-01', monthOnly: true }), zone).toBe('Dec')
      expect(pastDate({ date: '2022-01-01', yearOnly: true }), zone).toBe('')
      expect(pastDate({ date: '2026-06-14', endDate: '2026-06-14' }), zone).toBe('Jun 14')
    })
  })

  it("groups past events by their first day's year", () => {
    inEveryZone((zone) => {
      const groups = groupByYear([
        { date: '2022-01-01', title: 'StrikeDAO' },
        { date: '2026-06-14', title: 'Summit' },
        { date: '2022-09-16', title: 'ETHBerlin³' },
      ])
      expect(
        groups.map((g) => [g.year, g.events.map((e) => e.title)]),
        zone
      ).toEqual([
        [2026, ['Summit']],
        [2022, ['ETHBerlin³', 'StrikeDAO']],
      ])
    })
  })

  it("reads a meetup's occurrence in Berlin", () => {
    // getNextMonthlyWeekdayDate returns 21:00 UTC on the Wednesday; east of
    // UTC+3 that instant is already Thursday (SPEC.md K3).
    inEveryZone((zone) => {
      expect(meetupDate(new Date('2026-10-14T21:00:00Z')), zone).toEqual({
        weekday: 'Wed',
        day: 'Oct 14',
      })
    })
  })
})

describe('the rows of /events', () => {
  it("names a monthly meetup's cadence from its occurrence", () => {
    expect(monthlyCadence(new Date('2026-10-07T21:00:00Z'))).toBe('every 1st Wednesday')
    expect(monthlyCadence(new Date('2026-10-14T21:00:00Z'))).toBe('every 2nd Wednesday')
    expect(monthlyCadence(new Date('2026-10-21T21:00:00Z'))).toBe('every 3rd Wednesday')
    expect(monthlyCadence(new Date('2026-10-28T21:00:00Z'))).toBe('every 4th Wednesday')
    expect(monthlyCadence(new Date('2026-09-30T21:00:00Z'))).toBe('every 5th Wednesday')
  })

  it('starts a description with a capital letter', () => {
    expect(sentenceCase('an evening at c-base')).toBe('An evening at c-base')
    expect(sentenceCase('#39c3 assembly')).toBe('#39c3 assembly')
    expect(sentenceCase('')).toBe('')
  })

  it('leaves its input in order', () => {
    const list = [{ date: '2022-01-01' }, { date: '2026-06-14' }]
    groupByYear(list)
    expect(list.map((e) => e.date)).toEqual(['2022-01-01', '2026-06-14'])
  })
})

describe('data/dodEvents.ts marks how precisely each date is known (design review #11)', () => {
  it('marks the five events whose day is not known', () => {
    const monthOnly = events.filter((e) => e.monthOnly).map((e) => `${e.date} ${e.title}`)
    expect(monthOnly).toEqual([
      '2025-12-01 Critical Decentralization Cluster',
      '2024-12-01 Critical Decentralization Cluster',
      '2024-10-01 Ethereum Berlin Meetup',
      '2024-08-01 Ethereum Berlin Meetup',
      '2023-12-01 Critical Decentralization Cluster',
    ])
  })

  it('never marks a date both month-only and year-only', () => {
    expect(events.filter((e) => e.monthOnly && e.yearOnly)).toEqual([])
  })
})
