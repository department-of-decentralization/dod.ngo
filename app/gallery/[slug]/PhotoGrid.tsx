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
'use client'

import Image from 'next/image'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import Lightbox, {
  EVENT_ON_POINTER_CANCEL,
  EVENT_ON_POINTER_DOWN,
  EVENT_ON_POINTER_LEAVE,
  EVENT_ON_POINTER_MOVE,
  EVENT_ON_POINTER_UP,
  cleanup,
  useController,
} from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import {
  aspectRatio,
  hashForPhoto,
  isDrag,
  isLightboxBackdrop,
  openPhotoLabel,
  originalUrl,
  photoAlt,
  photoFromHash,
  thumbnailUrl,
} from '@/lib/gallery'

/** One photo, as the grid and the lightbox need it. */
type Photo = { name: string; width: number; height: number }

/** A press on the open lightbox, followed until its release. */
type Press = { pointerId: number; target: EventTarget; x: number; y: number; drag: boolean }

/** Props of {@link PhotoGrid}. */
type Props = {
  /** Gallery title, shown in the lightbox caption. */
  title: string
  /** Photo repository as `owner/name` (`SPEC.md` D23). */
  repo: string
  /** Folder in the repository holding the photos, if not its root (`SPEC.md` D23). */
  dir?: string
  /** The gallery's photos, in list order. */
  photos: Photo[]
}

/**
 * Replace the URL fragment without adding a history entry (`SPEC.md` D27).
 * Next.js keeps its router state in `history.state`, so that is passed on
 * unchanged.
 *
 * @param hash - The new fragment, such as `#12`, or `''` to remove it.
 */
function replaceFragment(hash: string) {
  const { pathname, search } = window.location
  window.history.replaceState(window.history.state, '', `${pathname}${search}${hash}`)
}

/**
 * A key name in the lightbox legend, bracketed like the nav hotkeys.
 *
 * @param props - The key's label.
 * @returns The bracketed key.
 */
function Key({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="text-primary-400">[</span>
      {children}
      <span className="text-primary-400">]</span>
    </>
  )
}

/**
 * Closes the lightbox on a click on its backdrop (`SPEC.md` D26).
 *
 * The library closes on a click on the slide only. The design frames the
 * photo with padding that keeps it clear of the caption and the key legend,
 * and a click there lands on the lightbox's container, or on its carousel
 * between two slides. This closes on those as well: a press and a release by
 * one pointer on the same backdrop element, with no drag and no second pointer
 * in between.
 *
 * It listens through the library's own pointer sensors on the lightbox
 * element, and adds no document or window listener.
 *
 * @returns Nothing visible.
 */
function BackdropClose() {
  const { subscribeSensors, close } = useController()

  useEffect(() => {
    let press: Press | null = null
    const forget = () => {
      press = null
    }
    return cleanup(
      subscribeSensors(EVENT_ON_POINTER_DOWN, (event) => {
        // A second pointer turns the press into a pinch.
        if (press) press.drag = true
        else {
          const { pointerId, target, clientX: x, clientY: y } = event
          press = { pointerId, target, x, y, drag: false }
        }
      }),
      subscribeSensors(EVENT_ON_POINTER_MOVE, (event) => {
        if (press?.pointerId !== event.pointerId) return
        if (isDrag(event.clientX - press.x, event.clientY - press.y)) press.drag = true
      }),
      subscribeSensors(EVENT_ON_POINTER_UP, (event) => {
        if (press?.pointerId !== event.pointerId) return
        const { target } = event
        const click = !press.drag && target === press.target
        press = null
        if (click && target instanceof HTMLElement && isLightboxBackdrop(target.classList)) close()
      }),
      subscribeSensors(EVENT_ON_POINTER_CANCEL, forget),
      subscribeSensors(EVENT_ON_POINTER_LEAVE, forget)
    )
  }, [subscribeSensors, close])

  return null
}

/**
 * A gallery's photos: the design's justified grid of thumbnails, and a
 * lightbox showing the originals (`SPEC.md` D26).
 *
 * The grid is rendered into the static HTML, so it needs no JavaScript to
 * appear. Each row grows its tiles in proportion to their aspect ratios; the
 * last, zero-height flex item absorbs the free space of the final row so it is
 * not stretched.
 *
 * The lightbox is `yet-another-react-lightbox`, configured as in protocol-v2.
 * It handles its keys on its own element and adds no document listener
 * (`SPEC.md` D19). A click anywhere on its backdrop closes it
 * ({@link BackdropClose}). The open photo is mirrored in the URL fragment
 * (D27).
 */
export default function PhotoGrid({ title, repo, dir, photos }: Props) {
  const count = photos.length
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  // Open the photo a shared link names, on load and when the fragment changes.
  useEffect(() => {
    const openFromFragment = () => {
      const n = photoFromHash(window.location.hash, count)
      if (n === null) return
      setIndex(n - 1)
      setOpen(true)
    }
    openFromFragment()
    window.addEventListener('hashchange', openFromFragment)
    return () => window.removeEventListener('hashchange', openFromFragment)
  }, [count])

  const slides = useMemo(
    () =>
      photos.map((photo, i) => ({
        src: originalUrl({ repo, dir }, photo),
        width: photo.width,
        height: photo.height,
        alt: photoAlt(title, i + 1, count),
      })),
    [photos, repo, dir, title, count]
  )

  return (
    <>
      <div className="flex flex-wrap items-start gap-2 [--row-h:120px] sm:[--row-h:200px]">
        {photos.map((photo, i) => {
          const ratio = aspectRatio(photo)
          return (
            <button
              key={photo.name}
              type="button"
              aria-label={openPhotoLabel(i + 1, count)}
              onClick={() => {
                setIndex(i)
                setOpen(true)
              }}
              className="bg-stripes relative block min-w-0 shrink transition-opacity duration-150 hover:opacity-80"
              style={{
                flexGrow: ratio,
                flexBasis: `calc(var(--row-h) * ${ratio})`,
                aspectRatio: `${photo.width} / ${photo.height}`,
              }}
            >
              <Image
                src={thumbnailUrl({ repo, dir }, photo)}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 640px) 300px, 180px"
                className="object-cover"
              />
            </button>
          )
        })}
        <div aria-hidden="true" className="h-0 grow-1000000 basis-0" />
      </div>
      <Lightbox
        className="gallery-lightbox"
        open={open}
        index={index}
        close={() => {
          setOpen(false)
          replaceFragment('')
        }}
        slides={slides}
        plugins={[Zoom]}
        labels={{ Previous: 'Previous photo', Next: 'Next photo', Close: 'Close' }}
        animation={{ fade: 330, swipe: 250 }}
        carousel={{
          finite: false,
          preload: 1,
          padding: '16px',
          spacing: '30%',
          imageFit: 'contain',
        }}
        controller={{ closeOnBackdropClick: true }}
        zoom={{
          maxZoomPixelRatio: 1,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 500,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 150,
          pinchZoomDistanceFactor: 150,
          scrollToZoom: false,
        }}
        on={{
          view: ({ index: current }) => {
            setIndex(current)
            replaceFragment(hashForPhoto(current + 1))
          },
        }}
        render={{
          // The design's toolbar has only the close button; zoom stays on
          // double click, pinch and ctrl+wheel.
          buttonZoom: () => null,
          // Caption and legend let clicks through to the backdrop, which closes.
          controls: () => (
            <>
              <BackdropClose />
              <div className="pointer-events-none absolute top-0 left-6 flex h-16 items-center gap-2 text-sm font-medium text-gray-300">
                <span>{title}</span>{' '}
                <span aria-hidden="true" className="text-gray-500">
                  •
                </span>{' '}
                <span>
                  {index + 1} / {count}
                </span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-16 items-center justify-center gap-6 text-sm text-gray-400 md:flex">
                <span>
                  <Key>&larr;</Key> previous
                </span>
                <span>
                  <Key>&rarr;</Key> next
                </span>
                <span>
                  <Key>Esc</Key> close
                </span>
              </div>
            </>
          ),
        }}
      />
    </>
  )
}
