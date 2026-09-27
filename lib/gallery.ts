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
import type { Gallery, GalleryPhotos, PhotoEntry, PhotoLicense } from '../data/galleries'

/**
 * The fields of a `data/dodEvents.ts` entry that a gallery reads. Callers pass
 * the event list in, so this module imports no data and stays cheap to bundle
 * into a client component.
 */
export type DodEvent = {
  /** Event title; a gallery names its event by it (`SPEC.md` D22). */
  title: string
  /** ISO date of the event, or of its first day. */
  date: string
  /** ISO date of the last day, for a multi-day event. */
  endDate?: string
  /** Whether only the year is known. */
  yearOnly?: boolean
  /** The event's own website. */
  link?: { url: string; label: string }
}

/**
 * A source of uniformly distributed numbers in [0, 1). The page passes the
 * browser's; tests pass a seeded one, so a pick is reproducible
 * (`SPEC.md` D25, following D5 and D13).
 */
export type RandomFn = () => number

/** Number of tiles a preview shows (`SPEC.md` D25). */
export type TileCount = 3 | 4 | 5

/** A preview: how many tiles to lay out, and the photos to fill them with. */
export type Preview<T> = {
  /** Tile count, which selects the layout. */
  tiles: TileCount
  /** Photos for the first tiles; any tile beyond them shows the stripe pattern. */
  photos: T[]
}

/** One tile's place in a preview grid. */
export type PreviewCell = { column: string; row: string }

/** A preview grid: CSS track sizes, and each tile's column and row. */
export type PreviewLayout = { columns: string; rows: string; cells: readonly PreviewCell[] }

/** The only place the photo host is written (`SPEC.md` D23). */
const PHOTO_HOST = 'https://raw.githubusercontent.com'

/** Branch every photo repository serves its photos from (`SPEC.md` D23). */
const PHOTO_BRANCH = 'main'

/** Meta line of a gallery that has no photos yet (`SPEC.md` D24). */
export const COMING_SOON = 'Photos coming soon'

/** Display label and deed of every license a gallery's photos may carry. */
export const LICENSES: Record<PhotoLicense, { label: string; href: string }> = {
  'CC-BY-SA-4.0': {
    label: 'CC BY-SA 4.0',
    href: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
}

/** The design's preview grids, one per tile count. */
export const PREVIEW_LAYOUTS: Record<TileCount, PreviewLayout> = {
  3: {
    columns: '2fr 1fr',
    rows: '1fr 1fr',
    cells: [
      { column: '1', row: '1 / span 2' },
      { column: '2', row: '1' },
      { column: '2', row: '2' },
    ],
  },
  4: {
    columns: '2fr 1fr',
    rows: '1fr 1fr 1fr',
    cells: [
      { column: '1', row: '1 / span 3' },
      { column: '2', row: '1' },
      { column: '2', row: '2' },
      { column: '2', row: '3' },
    ],
  },
  5: {
    columns: '1fr 1fr 1fr',
    rows: '2fr 1fr',
    cells: [
      { column: '1 / span 2', row: '1' },
      { column: '3', row: '1' },
      { column: '1', row: '2' },
      { column: '2', row: '2' },
      { column: '3', row: '2' },
    ],
  },
}

/**
 * Find the entry in `data/dodEvents.ts` that a gallery names (`SPEC.md` D22).
 *
 * @param gallery - The gallery.
 * @param eventList - Events to search: `events` from `data/dodEvents.ts`.
 * @returns The one event whose title equals `gallery.event`.
 * @throws If no event, or more than one, carries that title. The build then
 *   fails rather than publish a gallery with no date, or with a guessed one.
 */
export function findEvent(gallery: Gallery, eventList: readonly DodEvent[]): DodEvent {
  const matches = eventList.filter((event) => event.title === gallery.event)
  if (matches.length !== 1) {
    throw new Error(
      `Gallery "${gallery.slug}" names event "${gallery.event}", which matches ${matches.length} entries in data/dodEvents.ts`
    )
  }
  return matches[0]
}

/**
 * Month name of a date, read in UTC.
 *
 * @param date - The date.
 * @returns The English month name, e.g. `June`.
 */
function monthName(date: Date): string {
  return date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })
}

/**
 * Format an event's date for a gallery card or page (`SPEC.md` D22).
 *
 * Every part is read in UTC. The pages are rendered on the build machine, and
 * a local-time reading would let its time zone move `2025-06-01` into May.
 *
 * @param event - The event's `date`, optional `endDate` and optional `yearOnly`.
 * @returns `June 2025`, `July 8-12, 2026`, `June 30-July 2, 2026`,
 *   `December 30, 2026 - January 2, 2027`, or `2018` for a year-only event.
 */
export function formatGalleryDate(event: Pick<DodEvent, 'date' | 'endDate' | 'yearOnly'>): string {
  const start = new Date(event.date)
  const year = start.getUTCFullYear()
  if (event.yearOnly) return String(year)
  if (!event.endDate) return `${monthName(start)} ${year}`

  const end = new Date(event.endDate)
  const endYear = end.getUTCFullYear()
  if (endYear !== year) {
    return `${monthName(start)} ${start.getUTCDate()}, ${year} - ${monthName(end)} ${end.getUTCDate()}, ${endYear}`
  }
  if (end.getUTCMonth() !== start.getUTCMonth()) {
    return `${monthName(start)} ${start.getUTCDate()}-${monthName(end)} ${end.getUTCDate()}, ${year}`
  }
  return `${monthName(start)} ${start.getUTCDate()}-${end.getUTCDate()}, ${year}`
}

/**
 * URL of the folder holding a gallery's originals, with a trailing slash
 * (`SPEC.md` D23): the repository's root, or its `dir` when it has one.
 *
 * @param photos - The gallery's photo source.
 * @returns The folder's URL, each path segment encoded.
 */
function photoFolder(photos: Pick<GalleryPhotos, 'repo' | 'dir'>): string {
  const dir = photos.dir ? `${photos.dir.split('/').map(encodeURIComponent).join('/')}/` : ''
  return `${PHOTO_HOST}/${photos.repo}/${PHOTO_BRANCH}/${dir}`
}

/**
 * URL of a photo's thumbnail, shown in the grid and in previews (`SPEC.md` D23).
 *
 * @param photos - The gallery's photo source.
 * @param entry - The photo.
 * @returns The thumbnail URL, with the file name encoded.
 */
export function thumbnailUrl(
  photos: Pick<GalleryPhotos, 'repo' | 'dir'>,
  entry: Pick<PhotoEntry, 'name'>
): string {
  return `${photoFolder(photos)}thumbnails/${encodeURIComponent(entry.name)}`
}

/**
 * URL of a photo's original, shown in the lightbox (`SPEC.md` D23, D26).
 *
 * @param photos - The gallery's photo source.
 * @param entry - The photo.
 * @returns The original's URL, with the file name encoded.
 */
export function originalUrl(
  photos: Pick<GalleryPhotos, 'repo' | 'dir'>,
  entry: Pick<PhotoEntry, 'name'>
): string {
  return `${photoFolder(photos)}${encodeURIComponent(entry.name)}`
}

/**
 * Link to a gallery's photo repository, part of the license credit (`SPEC.md` D28).
 *
 * @param photos - The gallery's photo source.
 * @returns The repository's GitHub URL.
 */
export function repoHref(photos: Pick<GalleryPhotos, 'repo'>): string {
  return `https://github.com/${photos.repo}`
}

/**
 * A photo's aspect ratio. The justified grid grows each tile by it
 * (`SPEC.md` D26).
 *
 * @param entry - The photo.
 * @returns Width divided by height.
 */
export function aspectRatio(entry: Pick<PhotoEntry, 'width' | 'height'>): number {
  return entry.width / entry.height
}

/**
 * Photo count as shown on a card and a gallery page.
 *
 * @param count - Number of photos.
 * @returns `1 photo` or `204 photos`.
 */
export function photoCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'photo' : 'photos'}`
}

/**
 * Meta line under a gallery card's title: its date, then its photo count or
 * that photos are coming (`SPEC.md` D22, D24).
 *
 * @param gallery - The gallery.
 * @param eventList - Events to read the date from: `events` from `data/dodEvents.ts`.
 * @returns For example `June 2025 • 204 photos` or `2019 • Photos coming soon`.
 */
export function cardMeta(gallery: Gallery, eventList: readonly DodEvent[]): string {
  const date = formatGalleryDate(findEvent(gallery, eventList))
  const photos = gallery.photos ? photoCountLabel(gallery.photos.list.length) : COMING_SOON
  return `${date} • ${photos}`
}

/**
 * Classes of the lightbox elements that show nothing but backdrop
 * (`SPEC.md` D26): the container, whose padding keeps the photo clear of the
 * caption and the key legend; the carousel, which shows between two slides;
 * and the toolbar, whose padding rings the close button. The lightbox library
 * closes on a click on the slide itself only.
 */
export const LIGHTBOX_BACKDROP_CLASSES = [
  'yarl__container',
  'yarl__carousel',
  'yarl__toolbar',
] as const

/**
 * Pointer travel, in pixels, past which a press on the lightbox is a drag
 * rather than a click. It is the lightbox library's own swipe threshold.
 */
const CLICK_TRAVEL = 30

/**
 * Whether a click landed on the lightbox backdrop (`SPEC.md` D26).
 *
 * @param classList - Classes of the element the press and release landed on.
 * @returns `true` for the lightbox's container, carousel or toolbar.
 */
export function isLightboxBackdrop(classList: { contains(token: string): boolean }): boolean {
  return LIGHTBOX_BACKDROP_CLASSES.some((name) => classList.contains(name))
}

/**
 * Whether a press on the lightbox has travelled too far to be a click
 * (`SPEC.md` D26). A swipe to the next photo, or a pan across a zoomed one,
 * may start on the backdrop, and must not close the lightbox.
 *
 * @param dx - Horizontal travel since the press, in pixels.
 * @param dy - Vertical travel since the press, in pixels.
 * @returns `true` once the press has moved more than 30 pixels along either axis.
 */
export function isDrag(dx: number, dy: number): boolean {
  return Math.max(Math.abs(dx), Math.abs(dy)) > CLICK_TRAVEL
}

/**
 * Alternative text of a photo in the lightbox. The photo lists carry no
 * descriptions, so it names the photo's place in its gallery.
 *
 * @param title - Gallery title.
 * @param n - 1-based photo number.
 * @param count - Photos in the gallery.
 * @returns For example `Protocol Berg v2, photo 12 of 204`.
 */
export function photoAlt(title: string, n: number, count: number): string {
  return `${title}, photo ${n} of ${count}`
}

/**
 * Accessible name of the grid button that opens a photo.
 *
 * @param n - 1-based photo number.
 * @param count - Photos in the gallery.
 * @returns For example `Open photo 12 of 204`.
 */
export function openPhotoLabel(n: number, count: number): string {
  return `Open photo ${n} of ${count}`
}

/**
 * Draw a preview's tile count: 3, 4 or 5, each equally likely (`SPEC.md` D25).
 *
 * @param random - Source of randomness.
 * @returns The tile count.
 */
export function pickTileCount(random: RandomFn): TileCount {
  return (3 + Math.min(2, Math.floor(random() * 3))) as TileCount
}

/**
 * Draw a preview: a tile count, then that many distinct photos of the gallery
 * (`SPEC.md` D25). A gallery with fewer photos, or none (a placeholder), fills
 * the remaining tiles with the stripe pattern.
 *
 * @param list - The gallery's photos; empty for a placeholder.
 * @param random - Source of randomness.
 * @returns The preview.
 */
export function pickPreview<T>(list: readonly T[], random: RandomFn): Preview<T> {
  const tiles = pickTileCount(random)
  const count = Math.min(tiles, list.length)
  const pool = [...list]
  // Partial Fisher-Yates shuffle: the first `count` slots become a uniform sample.
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(random() * (pool.length - i))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return { tiles, photos: pool.slice(0, count) }
}

/**
 * The photo a URL fragment opens (`SPEC.md` D27): `#12` opens photo 12.
 *
 * @param hash - `location.hash`, including its leading `#`.
 * @param count - Photos in the gallery.
 * @returns The 1-based photo number, or `null` when the fragment names no
 *   photo of this gallery.
 */
export function photoFromHash(hash: string, count: number): number | null {
  const match = /^#(\d+)$/.exec(hash)
  if (!match) return null
  const n = Number(match[1])
  return n >= 1 && n <= count ? n : null
}

/**
 * The URL fragment for an open photo (`SPEC.md` D27).
 *
 * @param n - 1-based photo number.
 * @returns For example `#12`.
 */
export function hashForPhoto(n: number): string {
  return `#${n}`
}

/**
 * Put galleries in page order: newest event first, by the date of each
 * gallery's entry in `data/dodEvents.ts` (`SPEC.md` D22). Galleries whose
 * events share a date keep the order they were given in.
 *
 * @param list - The galleries.
 * @param eventList - Events to read the dates from: `events` from `data/dodEvents.ts`.
 * @returns A new array, newest event first.
 * @throws If a gallery names no event, or more than one ({@link findEvent}).
 */
export function newestFirst<T extends Gallery>(
  list: readonly T[],
  eventList: readonly DodEvent[]
): T[] {
  const time = (gallery: T) => new Date(findEvent(gallery, eventList).date).getTime()
  // Array.prototype.sort is stable, which keeps same-date galleries in order.
  return [...list].sort((a, b) => time(b) - time(a))
}

/**
 * Look a gallery up by its slug.
 *
 * @param list - The registry, or any list of galleries.
 * @param slug - The slug from the URL.
 * @returns The gallery, or `null` if no gallery has that slug.
 */
export function findGallery<T extends { slug: string }>(
  list: readonly T[],
  slug: string
): T | null {
  return list.find((gallery) => gallery.slug === slug) ?? null
}

/**
 * The galleries before and after one, in page order: the targets of a
 * gallery page's previous and next links.
 *
 * @param list - The galleries, in page order.
 * @param slug - The current gallery's slug.
 * @returns The neighbours; `null` at either end, or both for an unknown slug.
 */
export function neighbours<T extends { slug: string }>(
  list: readonly T[],
  slug: string
): { previous: T | null; next: T | null } {
  const i = list.findIndex((gallery) => gallery.slug === slug)
  if (i < 0) return { previous: null, next: null }
  return { previous: list[i - 1] ?? null, next: list[i + 1] ?? null }
}
