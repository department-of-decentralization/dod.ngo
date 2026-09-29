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

/**
 * Dates on `/events` (SPEC.md, Bugfix: Design Review, #11).
 *
 * Two kinds of date reach the page, and each is read in the one way that
 * cannot drift with the visitor's time zone (`SPEC.md` I1, K1, K2):
 *
 * - An event's `date` and `endDate` are calendar days (`2026-10-05`). They are
 *   read as that day, whatever the zone: parsed and formatted in UTC.
 * - A meetup's next occurrence is an instant (`getNextMonthlyWeekdayDate`
 *   returns 21:00 UTC). It is read in Berlin, where the meetup happens.
 */

/** The zone the meetups happen in. */
const BERLIN = 'Europe/Berlin'

/** The fields of a `data/dodEvents.ts` entry the dates are read from. */
export type EventDay = {
  /** ISO date of the event, or of its first day. */
  date: string
  /** ISO date of the last day, for a multi-day event. */
  endDate?: string
  /** Only the year is known; the month and day in `date` carry no meaning. */
  yearOnly?: boolean
  /** Only the month is known; the day in `date` carries no meaning. */
  monthOnly?: boolean
}

/** A date as the upcoming rows show it: `Mon` over `Oct 5`. */
export type UpcomingDate = { weekday: string; day: string }

/** A group of past events sharing a year. */
export type YearGroup<T> = { year: number; events: T[] }

/**
 * Format part of a date in English.
 *
 * @param date - The date.
 * @param timeZone - The zone to read it in.
 * @param options - What to show.
 * @returns For example `Oct` or `Mon`.
 */
function part(date: Date, timeZone: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone }).format(date)
}

/**
 * Midnight UTC of a calendar day, so that UTC getters read the day itself.
 *
 * @param iso - An ISO date such as `2026-10-05`.
 * @returns The instant.
 */
function utcDay(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`)
}

/**
 * The calendar day an instant falls on in Berlin.
 *
 * @param instant - Any instant, such as the visitor's "now".
 * @returns The day as an ISO date, for example `2026-10-05`.
 */
export function berlinDay(instant: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BERLIN,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant)
  const value = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  return `${value.year}-${value.month}-${value.day}`
}

/**
 * Whether an event is still to come: through its last day, in Berlin
 * (`SPEC.md` K1). A one-day event on October 5 is upcoming until midnight
 * ending that day in Berlin, and past from then.
 *
 * @param event - The event's dates.
 * @param now - The current instant.
 * @returns `true` while the event's last day has not ended in Berlin.
 */
export function isUpcoming(event: Pick<EventDay, 'date' | 'endDate'>, now: Date): boolean {
  // ISO dates of equal length compare as the days they name.
  return (event.endDate ?? event.date) >= berlinDay(now)
}

/**
 * A span of calendar days, abbreviated: `Oct 5`, `Jul 8–12`, `Jun 30–Jul 2`.
 *
 * @param start - The first day, as an ISO date.
 * @param end - The last day, if the span has more than one.
 * @returns The span.
 */
function daySpan(start: string, end?: string): string {
  const from = utcDay(start)
  const first = `${part(from, 'UTC', { month: 'short' })} ${from.getUTCDate()}`
  if (!end || end === start) return first
  const to = utcDay(end)
  const sameMonth =
    from.getUTCMonth() === to.getUTCMonth() && from.getUTCFullYear() === to.getUTCFullYear()
  const last = sameMonth
    ? String(to.getUTCDate())
    : `${part(to, 'UTC', { month: 'short' })} ${to.getUTCDate()}`
  return `${first}–${last}`
}

/**
 * The date of an upcoming event: the weekday of its first day, and its days.
 *
 * @param event - The event's dates.
 * @returns For example `{ weekday: 'Mon', day: 'Oct 5' }`.
 */
export function upcomingDate(event: Pick<EventDay, 'date' | 'endDate'>): UpcomingDate {
  return {
    weekday: part(utcDay(event.date), 'UTC', { weekday: 'short' }),
    day: daySpan(event.date, event.endDate),
  }
}

/**
 * The date of a meetup's next occurrence, read in Berlin.
 *
 * @param instant - The occurrence, as `getNextMonthlyWeekdayDate` returns it.
 * @returns For example `{ weekday: 'Wed', day: 'Oct 14' }`.
 */
export function meetupDate(instant: Date): UpcomingDate {
  return {
    weekday: part(instant, BERLIN, { weekday: 'short' }),
    day: `${part(instant, BERLIN, { month: 'short' })} ${part(instant, BERLIN, { day: 'numeric' })}`,
  }
}

/**
 * The date of a past event, as precise as the data is: its days, the month
 * alone when the day is not known, nothing when only the year is (its year
 * group shows the year).
 *
 * @param event - The event's dates.
 * @returns For example `Jul 8–12`, `Jun 14`, `Dec` or `''`.
 */
export function pastDate(event: EventDay): string {
  if (event.yearOnly) return ''
  if (event.monthOnly) return part(utcDay(event.date), 'UTC', { month: 'short' })
  return daySpan(event.date, event.endDate)
}

/**
 * Group past events by the year of their first day, newest first; within a
 * year, the newest event first.
 *
 * @param events - The past events, in any order.
 * @returns The groups.
 */
export function groupByYear<T extends Pick<EventDay, 'date'>>(
  events: readonly T[]
): YearGroup<T>[] {
  const groups = new Map<number, T[]>()
  for (const event of [...events].sort((a, b) => b.date.localeCompare(a.date))) {
    const year = utcDay(event.date).getUTCFullYear()
    groups.set(year, [...(groups.get(year) ?? []), event])
  }
  return [...groups].map(([year, list]) => ({ year, events: list }))
}

/**
 * How often a monthly meetup happens, read from one of its occurrences: the
 * occurrence's weekday and which of the month's weekdays it is, in Berlin.
 * Deriving it from the date keeps the schedule defined once (`SPEC.md` I2).
 *
 * @param instant - An occurrence of the meetup.
 * @returns For example `every 2nd Wednesday`.
 */
export function monthlyCadence(instant: Date): string {
  const nth = Math.ceil(Number(part(instant, BERLIN, { day: 'numeric' })) / 7)
  const suffix = ['st', 'nd', 'rd'][nth - 1] ?? 'th'
  return `every ${nth}${suffix} ${part(instant, BERLIN, { weekday: 'long' })}`
}

/**
 * Start a description with a capital letter, as the rows show it.
 *
 * @param text - The description, as `data/dodEvents.ts` writes it.
 * @returns The same text, its first letter upper case.
 */
export function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
