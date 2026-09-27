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
import { newestFirst } from '../lib/gallery'
import { events } from './dodEvents'
import ethberlin1Photos from './galleries/ethberlin-1.json'
import ethberlin2Photos from './galleries/ethberlin-2.json'
import ethberlin3Photos from './galleries/ethberlin-3.json'
import ethberlin4Photos from './galleries/ethberlin-4.json'
import protocolV1Photos from './galleries/protocol-v1.json'
import protocolV2Photos from './galleries/protocol-v2.json'

/**
 * One photo, exactly as its photo repository's `images.json` lists it
 * (`SPEC.md` D23).
 */
export type PhotoEntry = {
  /** Position in the repository's list, 1-based. */
  filenumber: number
  /** File name, shared by the original and its thumbnail. */
  name: string
  /** Width of the original, in pixels. */
  width: number
  /** Height of the original, in pixels. */
  height: number
}

/** License of a gallery's photos, as an SPDX identifier. */
export type PhotoLicense = 'CC-BY-SA-4.0'

/** Who took a gallery's photos, or one part of them (`SPEC.md` D28, D39). */
export type Photographer = {
  /**
   * Photographer credited on the gallery page (`SPEC.md` D28). Omitted when
   * nobody knows who took the photos; the credit then says so.
   */
  photographer?: string
  /** The photographer's website, linked from the credit. */
  photographerHref?: string
}

/**
 * The photos of a gallery whose names start with `prefix`, credited on their
 * own (`SPEC.md` D39).
 */
export type PhotoPart = Photographer & {
  /** Shown after the part's photographer in the credit, in parentheses. */
  label: string
  /** File-name prefix shared by the part's photos. */
  prefix: string
}

/** Where a gallery's photos live, and whom and what the page credits. */
export type GalleryPhotos = Photographer & {
  /**
   * Photo repository on GitHub, as `owner/name`. It keeps originals at its
   * root or in `dir`, one thumbnail per original under `thumbnails/` beside
   * them, and `images.json` at its root (`SPEC.md` D23).
   */
  repo: string
  /**
   * Folder that holds the originals, with `thumbnails/` inside it, when the
   * repository keeps them there rather than at its root (`SPEC.md` D23).
   */
  dir?: string
  /** The photo list: a verbatim copy of the repository's `images.json`. */
  list: PhotoEntry[]
  /**
   * The credit by part, when more than one photographer took the photos
   * (`SPEC.md` D39). Every photo belongs to exactly one part, and a gallery
   * with parts names no photographer of its own.
   */
  parts?: PhotoPart[]
  /** License of the photos. */
  license: PhotoLicense
}

/** One event gallery (`SPEC.md` D22). */
export type Gallery = {
  /** URL segment: the page lives at `/gallery/<slug>`. */
  slug: string
  /** Display title. */
  title: string
  /**
   * Exact title of the gallery's entry in `data/dodEvents.ts`. The gallery's
   * date and event link are read from that entry, never copied here.
   */
  event: string
  /** The photos. Omitted while the gallery is a placeholder (`SPEC.md` D24). */
  photos?: GalleryPhotos
}

/**
 * The photographer of every gallery with photos but ETHBerlin, and of ETHBerlin
 * ZWEI's conference photos (`SPEC.md` D28, D39).
 */
const ANTON_TAL = {
  photographer: 'Anton Tal',
  photographerHref: 'https://www.antontal.com/',
} satisfies Photographer

/**
 * The single registry of event galleries (`SPEC.md` D22). It is written in
 * page order, but the order comes from the events: see the default export.
 *
 * Importing the next gallery takes a photo repository in the D23 layout, a
 * verbatim copy of its `images.json` under `data/galleries/`, and a `photos`
 * entry here. No code.
 */
const galleries: Gallery[] = [
  { slug: 'dweb-camp-2026', title: 'DWeb Camp 2026', event: 'DWeb Camp 2026' },
  {
    slug: 'protocol-v2',
    title: 'Protocol Berg v2',
    event: 'Protocol Berg v2',
    photos: {
      repo: 'Department-of-Decentralization/pbv2-photos',
      list: protocolV2Photos,
      ...ANTON_TAL,
      license: 'CC-BY-SA-4.0',
    },
  },
  {
    slug: 'ethberlin-4',
    title: 'ETHBerlin 4',
    event: 'ETHBerlin 04 - Identity Crisis',
    photos: {
      repo: 'Department-of-Decentralization/ethberlin-4-photos',
      dir: 'images',
      list: ethberlin4Photos,
      ...ANTON_TAL,
      license: 'CC-BY-SA-4.0',
    },
  },
  {
    slug: 'protocol-v1',
    title: 'Protocol Berg',
    event: 'Protocol Berg',
    photos: {
      repo: 'Department-of-Decentralization/pb23-photos',
      list: protocolV1Photos,
      ...ANTON_TAL,
      license: 'CC-BY-SA-4.0',
    },
  },
  {
    slug: 'ethberlin-3',
    title: 'ETHBerlin 3',
    event: 'ETHBerlin³ - to the power of 3',
    photos: {
      repo: 'Department-of-Decentralization/3-photos',
      list: ethberlin3Photos,
      ...ANTON_TAL,
      license: 'CC-BY-SA-4.0',
    },
  },
  {
    slug: 'ethberlin-2',
    title: 'ETHBerlin ZWEI',
    event: 'ETHBerlin ZWEI',
    photos: {
      repo: 'Department-of-Decentralization/ethberlin-2-photos',
      list: ethberlin2Photos,
      // Anton Tal took the conference photos; nobody knows who took the
      // weekend's. The prefixes are the photo repository's file names
      // (SPEC.md D39).
      parts: [
        { label: 'conference', prefix: 'conference-', ...ANTON_TAL },
        { label: 'weekend', prefix: 'weekend-' },
      ],
      license: 'CC-BY-SA-4.0',
    },
  },
  {
    slug: 'ethberlin-1',
    title: 'ETHBerlin',
    event: 'ETHBerlin',
    photos: {
      repo: 'Department-of-Decentralization/ethberlin-1-photos',
      list: ethberlin1Photos,
      // Nobody knows who took these; the maintainer licenses them as the
      // others are (SPEC.md D28).
      license: 'CC-BY-SA-4.0',
    },
  },
]

/**
 * The galleries in page order: newest event first, by the date of each
 * gallery's entry in `data/dodEvents.ts` (`SPEC.md` D22). It is also the order
 * of the previous and next links on each gallery page. A new gallery takes its
 * place from its event, wherever it is added above.
 */
export default newestFirst(galleries, events)
