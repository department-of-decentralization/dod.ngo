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
import { useMemo, useSyncExternalStore } from 'react'
import { PREVIEW_LAYOUTS, pickPreview, thumbnailUrl } from '@/lib/gallery'

/** Props of {@link GalleryPreview}. */
type Props = {
  /** Photo repository as `owner/name`; omitted for a gallery without photos. */
  repo?: string
  /** File names of the gallery's photos; empty for a gallery without photos. */
  names: string[]
}

/** Subscription for a value that never changes once the page has hydrated. */
const subscribeToNothing = () => () => {}

/**
 * A gallery card's preview: 3 to 5 tiles showing random photos of the gallery
 * (`SPEC.md` D25).
 *
 * The pick happens in the browser after hydration, on every page load. Until
 * then, and without JavaScript, the card shows the stripe pattern, so the
 * static HTML carries no random state and no thumbnail is requested twice. A
 * gallery without photos keeps its tiles striped (`SPEC.md` D24).
 */
export default function GalleryPreview({ repo, names }: Props) {
  // React renders the server snapshot, false, for the static HTML and for
  // hydration, then renders again with true: nothing random reaches either.
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )
  const preview = useMemo(
    () => (hydrated ? pickPreview(names, Math.random) : null),
    [hydrated, names]
  )

  if (!preview) return <div className="bg-stripes aspect-3/2 rounded-md" />

  const layout = PREVIEW_LAYOUTS[preview.tiles]
  return (
    <div
      className="grid aspect-3/2 gap-1 overflow-hidden rounded-md"
      style={{ gridTemplateColumns: layout.columns, gridTemplateRows: layout.rows }}
    >
      {layout.cells.map((cell, i) => {
        const name = preview.photos[i]
        return (
          <div
            key={i}
            className="bg-stripes relative min-h-0 min-w-0"
            style={{ gridColumn: cell.column, gridRow: cell.row }}
          >
            {repo && name && (
              <Image
                src={thumbnailUrl({ repo }, { name })}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
