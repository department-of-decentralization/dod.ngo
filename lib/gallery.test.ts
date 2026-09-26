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
import galleries, { type Gallery } from '../data/galleries'
import { events } from '../data/dodEvents'
import {
  COMING_SOON,
  LICENSES,
  PREVIEW_LAYOUTS,
  type DodEvent,
  type RandomFn,
  aspectRatio,
  cardMeta,
  findEvent,
  findGallery,
  formatGalleryDate,
  hashForPhoto,
  lightboxCaption,
  neighbours,
  openPhotoLabel,
  originalUrl,
  photoAlt,
  photoCountLabel,
  photoFromHash,
  pickPreview,
  pickTileCount,
  repoHref,
  thumbnailUrl,
} from './gallery'

/**
 * Seeded random source (mulberry32): the same seed always yields the same
 * sequence, so every pick below is reproducible (`SPEC.md` D25).
 *
 * @param seed - Any integer.
 * @returns A function yielding numbers in [0, 1).
 */
function seeded(seed: number): RandomFn {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A random source that replays fixed values, for exact assertions.
 *
 * @param values - Values to return, cycled.
 * @returns A function yielding them in order.
 */
function sequence(...values: number[]): RandomFn {
  let i = 0
  return () => values[i++ % values.length]
}

/** The Protocol Berg v2 gallery, the one with photos. */
const pbv2 = findGallery(galleries, 'protocol-v2') as Gallery & {
  photos: NonNullable<Gallery['photos']>
}

/** A stand-in gallery for lookups against synthetic event lists. */
const probe: Gallery = { slug: 'probe', title: 'Probe', event: 'Probe Event' }

/**
 * A minimal event for synthetic event lists.
 *
 * @param title - The event title.
 * @returns An event dated 2025-06-01.
 */
const event = (title: string) => ({ title, date: '2025-06-01', description: '' }) as DodEvent

describe('gallery registry (SPEC.md D22)', () => {
  it('lists the seven galleries in order', () => {
    expect(galleries.map((g) => g.slug)).toEqual([
      'dweb-camp-2026',
      'protocol-v2',
      'protocol-v1',
      'ethberlin-4',
      'ethberlin-3',
      'ethberlin-2',
      'ethberlin-1',
    ])
    expect(galleries.map((g) => g.title)).toEqual([
      'DWeb Camp 2026',
      'Protocol Berg v2',
      'Protocol Berg v1',
      'ETHBerlin 4',
      'ETHBerlin 3',
      'ETHBerlin 2',
      'ETHBerlin 1',
    ])
  })

  it('each gallery names exactly one event in data/dodEvents.ts', () => {
    for (const gallery of galleries) {
      expect(findEvent(gallery, events).title, gallery.slug).toBe(gallery.event)
    }
  })

  it('refuses an event title that matches no entry, or more than one', () => {
    expect(() => findEvent(probe, [])).toThrow('matches 0 entries')
    expect(() => findEvent(probe, [event('Probe Event'), event('Probe Event')])).toThrow(
      'matches 2 entries'
    )
    expect(findEvent(probe, [event('Other'), event('Probe Event')]).title).toBe('Probe Event')
  })

  it('links every gallery to its event', () => {
    for (const gallery of galleries) {
      expect(findEvent(gallery, events).link?.url, gallery.slug).toMatch(/^https:\/\//)
    }
  })

  it('imports photos for protocol-v2 only (SPEC.md D23)', () => {
    expect(galleries.filter((g) => g.photos).map((g) => g.slug)).toEqual(['protocol-v2'])
    expect(pbv2.photos.list).toHaveLength(204)
  })

  it('lists every photo once, with a positive size', () => {
    const names = pbv2.photos.list.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
    for (const photo of pbv2.photos.list) {
      expect(photo.width, photo.name).toBeGreaterThan(0)
      expect(photo.height, photo.name).toBeGreaterThan(0)
    }
  })

  it('credits a photographer and a known license wherever there are photos (SPEC.md D28)', () => {
    for (const gallery of galleries.filter((g) => g.photos)) {
      const photos = gallery.photos!
      expect(photos.repo).toMatch(/^[\w.-]+\/[\w.-]+$/)
      expect(photos.photographer).not.toBe('')
      expect(photos.photographerHref).toMatch(/^https:\/\//)
      expect(LICENSES[photos.license]).toBeDefined()
    }
    expect(pbv2.photos.photographer).toBe('Anton Tal')
    expect(pbv2.photos.license).toBe('CC-BY-SA-4.0')
  })
})

describe('formatGalleryDate', () => {
  const originalTz = process.env.TZ
  afterEach(() => {
    process.env.TZ = originalTz
  })

  it('formats a single date as month and year', () => {
    expect(formatGalleryDate({ date: '2025-06-01' })).toBe('June 2025')
  })

  it('formats a same-month range', () => {
    expect(formatGalleryDate({ date: '2026-07-08', endDate: '2026-07-12' })).toBe('July 8-12, 2026')
  })

  it('formats a cross-month range', () => {
    expect(formatGalleryDate({ date: '2026-06-30', endDate: '2026-07-02' })).toBe(
      'June 30-July 2, 2026'
    )
  })

  it('formats a cross-year range', () => {
    expect(formatGalleryDate({ date: '2026-12-30', endDate: '2027-01-02' })).toBe(
      'December 30, 2026 - January 2, 2027'
    )
  })

  it('formats a year-only event as the year', () => {
    expect(formatGalleryDate({ date: '2018-09-01', yearOnly: true })).toBe('2018')
  })

  it("formats in UTC regardless of the machine's time zone", () => {
    // West of UTC, 2025-06-01T00:00Z is still May 31 in local time.
    for (const zone of ['America/Los_Angeles', 'Pacific/Kiritimati', 'UTC']) {
      process.env.TZ = zone
      expect(formatGalleryDate({ date: '2025-06-01' }), zone).toBe('June 2025')
      expect(formatGalleryDate({ date: '2026-07-08', endDate: '2026-07-12' }), zone).toBe(
        'July 8-12, 2026'
      )
    }
  })

  it('shows the date of record for each of the seven galleries', () => {
    const shown = Object.fromEntries(
      galleries.map((g) => [g.slug, formatGalleryDate(findEvent(g, events))])
    )
    expect(shown).toEqual({
      'dweb-camp-2026': 'July 8-12, 2026',
      'protocol-v2': 'June 2025',
      'protocol-v1': 'September 2023',
      'ethberlin-4': 'May 2024',
      'ethberlin-3': 'September 2022',
      // Year-only entries in data/dodEvents.ts, shown as on /events.
      'ethberlin-2': '2019',
      'ethberlin-1': '2018',
    })
  })
})

describe('pickPreview', () => {
  it('draws each tile count, 3, 4 and 5', () => {
    expect(pickTileCount(sequence(0))).toBe(3)
    expect(pickTileCount(sequence(0.34))).toBe(4)
    expect(pickTileCount(sequence(0.99))).toBe(5)
    const seen = new Set(Array.from({ length: 300 }, (_, seed) => pickTileCount(seeded(seed))))
    expect([...seen].sort()).toEqual([3, 4, 5])
  })

  it('picks 3 to 5 distinct photos, all from the gallery', () => {
    const list = pbv2.photos.list
    for (let seed = 0; seed < 300; seed++) {
      const { tiles, photos } = pickPreview(list, seeded(seed))
      expect([3, 4, 5]).toContain(tiles)
      expect(photos).toHaveLength(tiles)
      expect(new Set(photos).size).toBe(photos.length)
      for (const photo of photos) expect(list).toContain(photo)
    }
  })

  it('gives the same pick for the same random sequence', () => {
    const list = pbv2.photos.list
    expect(pickPreview(list, seeded(42))).toEqual(pickPreview(list, seeded(42)))
  })

  it('differs across random sequences, so each page load can show new photos', () => {
    const list = pbv2.photos.list
    const picks = new Set(
      Array.from({ length: 20 }, (_, seed) =>
        pickPreview(list, seeded(seed))
          .photos.map((p) => p.name)
          .join('|')
      )
    )
    expect(picks.size).toBeGreaterThan(1)
  })

  it('never picks more photos than the gallery has', () => {
    const { tiles, photos } = pickPreview(['only', 'two'], sequence(0.99, 0))
    expect(tiles).toBe(5)
    expect(photos.sort()).toEqual(['only', 'two'])
  })

  it('gives a placeholder a tile count and no photos (SPEC.md D24)', () => {
    const { tiles, photos } = pickPreview([], seeded(7))
    expect([3, 4, 5]).toContain(tiles)
    expect(photos).toEqual([])
  })

  it('has a layout cell for every tile', () => {
    for (const tiles of [3, 4, 5] as const) {
      expect(PREVIEW_LAYOUTS[tiles].cells).toHaveLength(tiles)
    }
  })
})

describe('photo fragments', () => {
  it('maps #12 to photo 12 and back', () => {
    expect(photoFromHash('#12', 204)).toBe(12)
    expect(hashForPhoto(12)).toBe('#12')
    for (const n of [1, 204]) expect(photoFromHash(hashForPhoto(n), 204)).toBe(n)
  })

  it('opens nothing for an invalid fragment', () => {
    for (const hash of ['', '#', '#0', '#205', '#abc', '#12a', '#-1', '#1.5']) {
      expect(photoFromHash(hash, 204), JSON.stringify(hash)).toBeNull()
    }
  })
})

describe('photo URLs (SPEC.md D23)', () => {
  const first = pbv2.photos.list[0]

  it('builds thumbnail and original URLs with the file name encoded', () => {
    expect(first.name).toBe('250612 - Protocol Berg V2 - Day1-0001.jpg')
    expect(thumbnailUrl(pbv2.photos, first)).toBe(
      'https://raw.githubusercontent.com/Department-of-Decentralization/pbv2-photos/main/thumbnails/250612%20-%20Protocol%20Berg%20V2%20-%20Day1-0001.jpg'
    )
    expect(originalUrl(pbv2.photos, first)).toBe(
      'https://raw.githubusercontent.com/Department-of-Decentralization/pbv2-photos/main/250612%20-%20Protocol%20Berg%20V2%20-%20Day1-0001.jpg'
    )
  })

  it('links the photo repository and the license deed (SPEC.md D28)', () => {
    expect(repoHref(pbv2.photos)).toBe(
      'https://github.com/Department-of-Decentralization/pbv2-photos'
    )
    expect(LICENSES['CC-BY-SA-4.0']).toEqual({
      label: 'CC BY-SA 4.0',
      href: 'https://creativecommons.org/licenses/by-sa/4.0/',
    })
  })

  it('gives each photo its aspect ratio', () => {
    expect(aspectRatio({ width: 6000, height: 4000 })).toBe(1.5)
    expect(aspectRatio({ width: 4000, height: 6000 })).toBeCloseTo(2 / 3)
  })
})

describe('labels', () => {
  it('counts photos', () => {
    expect(photoCountLabel(204)).toBe('204 photos')
    expect(photoCountLabel(1)).toBe('1 photo')
  })

  it('writes a card meta line from the event date (SPEC.md D22, D24)', () => {
    expect(cardMeta(pbv2, events)).toBe('June 2025 • 204 photos')
    expect(cardMeta(findGallery(galleries, 'ethberlin-4')!, events)).toBe(
      `May 2024 • ${COMING_SOON}`
    )
    expect(COMING_SOON).toBe('Photos coming soon')
  })

  it('captions the lightbox and names the grid buttons', () => {
    expect(lightboxCaption('Protocol Berg v2', 12, 204)).toBe('Protocol Berg v2 • 12 / 204')
    expect(openPhotoLabel(12, 204)).toBe('Open photo 12 of 204')
    expect(photoAlt('Protocol Berg v2', 12, 204)).toBe('Protocol Berg v2, photo 12 of 204')
  })
})

describe('gallery navigation', () => {
  it('finds a gallery by slug', () => {
    expect(findGallery(galleries, 'protocol-v2')?.title).toBe('Protocol Berg v2')
    expect(findGallery(galleries, 'nope')).toBeNull()
  })

  it('links each gallery to its neighbours in registry order', () => {
    const slugs = (n: ReturnType<typeof neighbours<Gallery>>) => [n.previous?.slug, n.next?.slug]
    expect(slugs(neighbours(galleries, 'dweb-camp-2026'))).toEqual([undefined, 'protocol-v2'])
    expect(slugs(neighbours(galleries, 'protocol-v2'))).toEqual(['dweb-camp-2026', 'protocol-v1'])
    expect(slugs(neighbours(galleries, 'ethberlin-1'))).toEqual(['ethberlin-2', undefined])
    expect(neighbours(galleries, 'nope')).toEqual({ previous: null, next: null })
  })
})
