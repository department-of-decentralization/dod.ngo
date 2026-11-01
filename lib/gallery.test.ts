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
  LICENSES,
  LIGHTBOX_BACKDROP_CLASSES,
  PHOTOGRAPHER_UNKNOWN,
  PREVIEW_LAYOUTS,
  type DodEvent,
  type LightboxPointer,
  type LightboxPress,
  type RandomFn,
  aspectRatio,
  cardMeta,
  findEvent,
  findGallery,
  followPress,
  formatGalleryDate,
  hashForPhoto,
  isDrag,
  isLightboxBackdrop,
  neighbours,
  newestFirst,
  openPhotoLabel,
  originalUrl,
  photoAlt,
  photoCountLabel,
  photoCredits,
  photoFromHash,
  photographerCredit,
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

/** The Protocol Berg v2 gallery, the first one imported (`SPEC.md` D23). */
const pbv2 = findGallery(galleries, 'protocol-v2')!

/** A gallery without its photos: all that event lookups and page order read. */
type GalleryStub = Pick<Gallery, 'slug' | 'title' | 'event'>

/** A stand-in gallery for lookups against synthetic event lists. */
const probe: GalleryStub = { slug: 'probe', title: 'Probe', event: 'Probe Event' }

/**
 * A minimal event for synthetic event lists.
 *
 * @param title - The event title.
 * @returns An event dated 2025-06-01.
 */
const event = (title: string) => ({ title, date: '2025-06-01', description: '' }) as DodEvent

describe('gallery registry (SPEC.md D22)', () => {
  it('lists the seven galleries, newest event first', () => {
    expect(galleries.map((g) => g.slug)).toEqual([
      'dweb-camp-2026',
      'protocol-v2',
      'ethberlin-4',
      'protocol-v1',
      'ethberlin-3',
      'ethberlin-2',
      'ethberlin-1',
    ])
    expect(galleries.map((g) => g.title)).toEqual([
      'DWeb Camp 2026',
      'Protocol Berg v2',
      'ETHBerlin 4',
      'Protocol Berg',
      'ETHBerlin 3',
      'ETHBerlin ZWEI',
      'ETHBerlin',
    ])
  })

  it('takes the page order from the event dates in data/dodEvents.ts', () => {
    const dates = galleries.map((gallery) => findEvent(gallery, events).date)
    expect(dates).toEqual([...dates].sort().reverse())
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

  it('imports photos for all seven galleries (SPEC.md D23, D38, D40)', () => {
    const counts = galleries.map((g) => [g.slug, g.photos.list.length] as const)
    expect(counts).toEqual([
      ['dweb-camp-2026', 366],
      ['protocol-v2', 204],
      ['ethberlin-4', 88],
      ['protocol-v1', 444],
      ['ethberlin-3', 238],
      ['ethberlin-2', 270],
      ['ethberlin-1', 237],
    ])
  })

  it('every gallery has photos (SPEC.md D41)', () => {
    // An event gets a gallery once its photos are in a photo repository.
    for (const gallery of galleries) {
      expect(gallery.photos.list.length, gallery.slug).toBeGreaterThan(0)
    }
  })

  it('lists every photo once, with a positive size', () => {
    for (const gallery of galleries) {
      const list = gallery.photos.list
      const names = list.map((p) => p.name)
      expect(new Set(names).size, gallery.slug).toBe(names.length)
      for (const photo of list) {
        expect(photo.width, `${gallery.slug} ${photo.name}`).toBeGreaterThan(0)
        expect(photo.height, `${gallery.slug} ${photo.name}`).toBeGreaterThan(0)
      }
    }
  })

  it('names a repository and a known license for every gallery (SPEC.md D28)', () => {
    for (const gallery of galleries) {
      const photos = gallery.photos
      expect(photos.repo, gallery.slug).toMatch(/^[\w.-]+\/[\w.-]+$/)
      expect(LICENSES[photos.license], gallery.slug).toBeDefined()
      expect(photos.license, gallery.slug).toBe('CC-BY-SA-4.0')
    }
  })

  it("credits each gallery's photographers (SPEC.md D28, D39)", () => {
    // photoCredits also throws on a gallery that breaks D39's rules.
    const credits = galleries.map((g) => [g.slug, photoCredits(g.photos)] as const)
    const anton = { name: 'Anton Tal', href: 'https://www.antontal.com/' }
    expect(credits).toEqual([
      ['dweb-camp-2026', [anton]],
      ['protocol-v2', [anton]],
      ['ethberlin-4', [anton]],
      ['protocol-v1', [anton]],
      ['ethberlin-3', [anton]],
      // Anton Tal took the conference photos; nobody knows who took the weekend's.
      [
        'ethberlin-2',
        [
          { ...anton, label: 'conference' },
          { name: PHOTOGRAPHER_UNKNOWN, label: 'weekend' },
        ],
      ],
      // The photographer of ETHBerlin's photos is not known.
      ['ethberlin-1', [{ name: PHOTOGRAPHER_UNKNOWN }]],
    ])
    expect(PHOTOGRAPHER_UNKNOWN).toBe('photographer unknown')
  })

  it("splits ETHBerlin ZWEI's credit into its conference and weekend photos (SPEC.md D39)", () => {
    const photos = findGallery(galleries, 'ethberlin-2')!.photos
    // The parts carry the photographers; the gallery names none of its own.
    expect(photos.photographer).toBeUndefined()
    expect(photos.photographerHref).toBeUndefined()
    const count = (prefix: string) => photos.list.filter((p) => p.name.startsWith(prefix)).length
    expect(photos.parts!.map((part) => [part.label, part.prefix, count(part.prefix)])).toEqual([
      ['conference', 'conference-', 150],
      ['weekend', 'weekend-', 120],
    ])
    // Every photo falls in exactly one part: photoCredits would throw otherwise.
    expect(() => photoCredits(photos)).not.toThrow()
  })
})

describe('photographerCredit (SPEC.md D28)', () => {
  it('links a named photographer to their website', () => {
    expect(photographerCredit(pbv2.photos)).toEqual({
      name: 'Anton Tal',
      href: 'https://www.antontal.com/',
    })
  })

  it('shows a named photographer without a website unlinked', () => {
    expect(photographerCredit({ photographer: 'Jane Doe' })).toEqual({ name: 'Jane Doe' })
  })

  it('says the photographer is unknown when nobody is named, and links nothing', () => {
    expect(photographerCredit(findGallery(galleries, 'ethberlin-1')!.photos)).toEqual({
      name: PHOTOGRAPHER_UNKNOWN,
    })
    // A website without a name has nothing to link from.
    expect(photographerCredit({ photographerHref: 'https://example.org/' })).toEqual({
      name: PHOTOGRAPHER_UNKNOWN,
    })
  })
})

describe('photoCredits (SPEC.md D39)', () => {
  const repo = 'owner/photos'
  const list = ['a-1.jpg', 'a-2.jpg', 'b-1.jpg'].map((name, i) => ({
    filenumber: i + 1,
    name,
    width: 3,
    height: 2,
  }))
  const jane = { photographer: 'Jane Doe', photographerHref: 'https://example.org/' }

  it('credits a gallery without parts as photographerCredit does', () => {
    expect(photoCredits({ repo, list, ...jane })).toEqual([
      { name: 'Jane Doe', href: 'https://example.org/' },
    ])
    expect(photoCredits({ repo, list })).toEqual([{ name: PHOTOGRAPHER_UNKNOWN }])
  })

  it('credits each part in the order of parts, with its label', () => {
    const parts = [
      { label: 'first', prefix: 'a-', ...jane },
      { label: 'second', prefix: 'b-' },
    ]
    expect(photoCredits({ repo, list, parts })).toEqual([
      { name: 'Jane Doe', href: 'https://example.org/', label: 'first' },
      { name: PHOTOGRAPHER_UNKNOWN, label: 'second' },
    ])
  })

  it('refuses a photo that belongs to no part, or to more than one', () => {
    expect(() => photoCredits({ repo, list, parts: [{ label: 'a', prefix: 'a-' }] })).toThrow(
      'Photo "b-1.jpg" of owner/photos belongs to 0 parts'
    )
    const overlapping = [
      { label: 'all', prefix: '' },
      { label: 'a', prefix: 'a-' },
    ]
    expect(() => photoCredits({ repo, list, parts: overlapping })).toThrow(
      'Photo "a-1.jpg" of owner/photos belongs to 2 parts'
    )
  })

  it('refuses a photographer for the whole gallery beside parts', () => {
    const parts = [{ label: 'all', prefix: '' }]
    for (const photographer of [
      { photographer: 'Jane Doe' },
      { photographerHref: jane.photographerHref },
    ]) {
      expect(() => photoCredits({ repo, list, parts, ...photographer })).toThrow(
        'owner/photos is credited by part and names a photographer of its own'
      )
    }
  })
})

describe('formatGalleryDate', () => {
  const originalTz = process.env.TZ
  afterEach(() => {
    // process.env stores strings: assigning undefined would leave TZ set to
    // "undefined", which Node reads as UTC, not as the machine's zone.
    if (originalTz === undefined) delete process.env.TZ
    else process.env.TZ = originalTz
  })

  it('formats a single date as month, day and year', () => {
    expect(formatGalleryDate({ date: '2023-09-15' })).toBe('September 15, 2023')
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
      expect(formatGalleryDate({ date: '2025-06-01' }), zone).toBe('June 1, 2025')
      expect(formatGalleryDate({ date: '2026-07-08', endDate: '2026-07-12' }), zone).toBe(
        'July 8-12, 2026'
      )
    }
  })

  it('shows the date of record for each of the seven galleries', () => {
    const shown = Object.fromEntries(
      galleries.map((g) => [g.slug, formatGalleryDate(findEvent(g, events))])
    )
    // The dates of record, supplied by the maintainer on 2026-09-27 and matching
    // each event's own website (SPEC.md D22).
    expect(shown).toEqual({
      'dweb-camp-2026': 'July 8-12, 2026',
      'protocol-v2': 'June 12-13, 2025',
      'ethberlin-4': 'May 24-26, 2024',
      'protocol-v1': 'September 15, 2023',
      'ethberlin-3': 'September 16-18, 2022',
      'ethberlin-2': 'August 23-25, 2019',
      'ethberlin-1': 'September 7-9, 2018',
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
    // With no photos at all, every tile keeps the stripe pattern.
    expect(pickPreview([], seeded(7)).photos).toEqual([])
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

  it('builds URLs inside the folder a repository keeps its photos in', () => {
    const eth4 = findGallery(galleries, 'ethberlin-4')!.photos
    expect(eth4.dir).toBe('images')
    expect(thumbnailUrl(eth4, eth4.list[0])).toBe(
      'https://raw.githubusercontent.com/Department-of-Decentralization/ethberlin-4-photos/main/images/thumbnails/IMG-1000.jpg'
    )
    expect(originalUrl(eth4, eth4.list[0])).toBe(
      'https://raw.githubusercontent.com/Department-of-Decentralization/ethberlin-4-photos/main/images/IMG-1000.jpg'
    )
    // Each folder name is encoded on its own; the separators stay.
    expect(thumbnailUrl({ repo: 'o/r', dir: 'a b/c' }, { name: 'x.jpg' })).toBe(
      'https://raw.githubusercontent.com/o/r/main/a%20b/c/thumbnails/x.jpg'
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

  it('writes a card meta line from the event date (SPEC.md D22)', () => {
    expect(cardMeta(pbv2, events)).toBe('June 12-13, 2025 • 204 photos')
    expect(cardMeta(findGallery(galleries, 'protocol-v1')!, events)).toBe(
      'September 15, 2023 • 444 photos'
    )
    expect(cardMeta(findGallery(galleries, 'ethberlin-1')!, events)).toBe(
      'September 7-9, 2018 • 237 photos'
    )
    expect(cardMeta(findGallery(galleries, 'ethberlin-2')!, events)).toBe(
      'August 23-25, 2019 • 270 photos'
    )
    expect(cardMeta(findGallery(galleries, 'dweb-camp-2026')!, events)).toBe(
      'July 8-12, 2026 • 366 photos'
    )
  })

  it('names the grid buttons and the lightbox photos', () => {
    expect(openPhotoLabel(12, 204)).toBe('Open photo 12 of 204')
    expect(photoAlt('Protocol Berg v2', 12, 204)).toBe('Protocol Berg v2, photo 12 of 204')
  })
})

describe('lightbox backdrop click (SPEC.md D26)', () => {
  /**
   * The class list of an element carrying the given classes.
   *
   * @param names - The element's classes.
   * @returns An object answering `contains` as a DOMTokenList does.
   */
  const classes = (...names: string[]) => ({ contains: (name: string) => names.includes(name) })

  it('treats the container, the carousel and the toolbar as backdrop', () => {
    expect(isLightboxBackdrop(classes('yarl__container', 'yarl__flex_center'))).toBe(true)
    expect(isLightboxBackdrop(classes('yarl__carousel', 'yarl__carousel_with_slides'))).toBe(true)
    // The ring of toolbar padding around the close button.
    expect(isLightboxBackdrop(classes('yarl__toolbar'))).toBe(true)
  })

  it('treats the slide and its wrapper as backdrop too [regression 2026-11-01]', () => {
    // The slide's padding, and the zoom plugin's wrapper around the photo
    // inside it. The library's own close took these and closed on a drag
    // there as well (SPEC.md D26, amended 2026-11-01).
    expect(
      isLightboxBackdrop(classes('yarl__slide', 'yarl__slide_current', 'yarl__flex_center'))
    ).toBe(true)
    expect(
      isLightboxBackdrop(classes('yarl__fullsize', 'yarl__flex_center', 'yarl__slide_wrapper'))
    ).toBe(true)
    expect(LIGHTBOX_BACKDROP_CLASSES).toEqual([
      'yarl__container',
      'yarl__carousel',
      'yarl__toolbar',
      'yarl__slide',
      'yarl__slide_wrapper',
    ])
  })

  it("leaves out the photo, a zoomed photo's wrapper and the controls", () => {
    expect(isLightboxBackdrop(classes('yarl__slide_image'))).toBe(false)
    // While the photo is zoomed, its wrapper is the zoom plugin's: a press
    // there pans the photo, and a double click zooms it out.
    expect(
      isLightboxBackdrop(
        classes(
          'yarl__fullsize',
          'yarl__flex_center',
          'yarl__slide_wrapper',
          'yarl__slide_wrapper_interactive'
        )
      )
    ).toBe(false)
    expect(isLightboxBackdrop(classes('yarl__button', 'yarl__navigation_next'))).toBe(false)
    expect(isLightboxBackdrop(classes('yarl__button'))).toBe(false)
    expect(isLightboxBackdrop(classes('yarl__icon'))).toBe(false)
    expect(isLightboxBackdrop(classes())).toBe(false)
  })

  it('stops counting a press as a click past 30 pixels on either axis', () => {
    expect(isDrag(0, 0)).toBe(false)
    expect(isDrag(30, -30)).toBe(false)
    expect(isDrag(31, 0)).toBe(true)
    expect(isDrag(-31, 0)).toBe(true)
    expect(isDrag(0, 31)).toBe(true)
    expect(isDrag(0, -31)).toBe(true)
  })

  describe('followPress', () => {
    const slide = { name: 'slide' }
    const photo = { name: 'photo' }

    /**
     * A pointer event, by pointer 1 on the slide unless given otherwise.
     *
     * @param type - The DOM event type.
     * @param clientX - Viewport x.
     * @param clientY - Viewport y.
     * @param target - The element the event targets.
     * @param pointerId - The pointer.
     * @returns The fields {@link followPress} reads.
     */
    const pointer = (
      type: string,
      clientX: number,
      clientY: number,
      target: unknown = slide,
      pointerId = 1
    ): LightboxPointer => ({ type, pointerId, target, clientX, clientY })

    /**
     * Run events through {@link followPress}, starting with no press.
     *
     * @param events - The pointer events, in order.
     * @returns Whether each event was the release of a click.
     */
    const clicks = (...events: LightboxPointer[]) => {
      let press: LightboxPress | null = null
      return events.map((event) => {
        const step = followPress(press, event)
        press = step.press
        return step.click
      })
    }

    it('counts a still press and release on one element as a click', () => {
      expect(clicks(pointer('pointerdown', 80, 200), pointer('pointerup', 80, 200))).toEqual([
        false,
        true,
      ])
    })

    it('counts up to 30 pixels of travel as a click', () => {
      expect(
        clicks(
          pointer('pointerdown', 80, 200),
          pointer('pointermove', 80, 225),
          pointer('pointerup', 80, 230)
        )
      ).toEqual([false, false, true])
    })

    it('is no click after a vertical drag past 30 pixels [regression 2026-11-01]', () => {
      // At 1280x900 a drag from (80, 102) to (80, 400) on the slide's padding
      // closed the lightbox (SPEC.md D26, amended 2026-11-01).
      expect(
        clicks(
          pointer('pointerdown', 80, 102),
          pointer('pointermove', 80, 133),
          pointer('pointermove', 80, 400),
          pointer('pointerup', 80, 400)
        )
      ).toEqual([false, false, false, false])
    })

    it('is no click after a drag out and back', () => {
      expect(
        clicks(
          pointer('pointerdown', 640, 72),
          pointer('pointermove', 640, 400),
          pointer('pointermove', 640, 80),
          pointer('pointerup', 640, 72)
        )
      ).toEqual([false, false, false, false])
    })

    it('is no click when released more than 30 pixels away, with no move seen', () => {
      expect(clicks(pointer('pointerdown', 640, 6), pointer('pointerup', 640, 58))).toEqual([
        false,
        false,
      ])
    })

    it('is no click once a second pointer has pressed', () => {
      // A pinch with one finger still on the backdrop and one on the photo.
      expect(
        clicks(
          pointer('pointerdown', 100, 30),
          pointer('pointerdown', 188, 406, photo, 2),
          pointer('pointerup', 100, 30)
        )
      ).toEqual([false, false, false])
    })

    it('is no click when released on another element', () => {
      expect(clicks(pointer('pointerdown', 80, 200), pointer('pointerup', 80, 200, photo))).toEqual(
        [false, false]
      )
    })

    it('ignores the moves and the release of another pointer', () => {
      expect(
        clicks(
          pointer('pointerdown', 80, 200),
          pointer('pointermove', 400, 200, slide, 2),
          pointer('pointerup', 400, 200, slide, 2),
          pointer('pointerup', 80, 200)
        )
      ).toEqual([false, false, false, true])
    })

    it('forgets the press on a cancel, or when the pointer leaves the lightbox', () => {
      for (const end of ['pointercancel', 'pointerleave']) {
        expect(
          clicks(
            pointer('pointerdown', 80, 200),
            pointer(end, 80, 200),
            pointer('pointerup', 80, 200)
          )
        ).toEqual([false, false, false])
      }
    })

    it('ignores a release without a press, and other event types', () => {
      expect(clicks(pointer('pointerup', 80, 200))).toEqual([false])
      expect(
        clicks(
          pointer('pointerdown', 80, 200),
          pointer('pointerover', 80, 200),
          pointer('pointerup', 80, 200)
        )
      ).toEqual([false, false, true])
    })
  })
})

describe('gallery navigation', () => {
  it('finds a gallery by slug', () => {
    expect(findGallery(galleries, 'protocol-v2')?.title).toBe('Protocol Berg v2')
    expect(findGallery(galleries, 'nope')).toBeNull()
  })

  it('links each gallery to its neighbours in page order', () => {
    const slugs = (n: ReturnType<typeof neighbours<Gallery>>) => [n.previous?.slug, n.next?.slug]
    expect(slugs(neighbours(galleries, 'dweb-camp-2026'))).toEqual([undefined, 'protocol-v2'])
    expect(slugs(neighbours(galleries, 'protocol-v2'))).toEqual(['dweb-camp-2026', 'ethberlin-4'])
    expect(slugs(neighbours(galleries, 'protocol-v1'))).toEqual(['ethberlin-4', 'ethberlin-3'])
    expect(slugs(neighbours(galleries, 'ethberlin-1'))).toEqual(['ethberlin-2', undefined])
    expect(neighbours(galleries, 'nope')).toEqual({ previous: null, next: null })
  })
})

describe('page order (SPEC.md D22)', () => {
  /**
   * A gallery named after its event, for synthetic lists.
   *
   * @param title - The event title, also used as the slug.
   * @returns The gallery, without photos: page order reads none.
   */
  const gallery = (title: string): GalleryStub => ({ slug: title, title, event: title })

  /**
   * An event on a given date, for synthetic lists.
   *
   * @param title - The event title.
   * @param date - The event's ISO date.
   * @returns The event.
   */
  const dated = (title: string, date: string) => ({ title, date }) as DodEvent

  const list = [
    gallery('2019'),
    gallery('2024'),
    gallery('2022-a'),
    gallery('2026'),
    gallery('2022-b'),
  ]
  const eventList = [
    dated('2026', '2026-07-08'),
    dated('2022-b', '2022-09-01'),
    dated('2024', '2024-05-01'),
    dated('2022-a', '2022-09-01'),
    dated('2019', '2019-08-01'),
  ]

  it('puts the newest event first', () => {
    expect(newestFirst(list, eventList).map((g) => g.slug)).toEqual([
      '2026',
      '2024',
      '2022-a',
      '2022-b',
      '2019',
    ])
  })

  it('keeps galleries on the same date in the order given', () => {
    const swapped = [list[4], list[2]]
    expect(newestFirst(swapped, eventList).map((g) => g.slug)).toEqual(['2022-b', '2022-a'])
  })

  it('returns a new array and leaves its input alone', () => {
    const before = list.map((g) => g.slug)
    expect(newestFirst(list, eventList)).not.toBe(list)
    expect(list.map((g) => g.slug)).toEqual(before)
  })

  it('refuses a gallery whose event is not listed', () => {
    expect(() => newestFirst([gallery('2026'), probe], eventList)).toThrow('matches 0 entries')
  })
})
