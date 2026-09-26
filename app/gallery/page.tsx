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
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import { events } from '@/data/dodEvents'
import galleries from '@/data/galleries'
import { cardMeta } from '@/lib/gallery'
import { genPageMetadata } from 'app/seo'
import GalleryPreview from './GalleryPreview'

/** Page metadata: the title "Gallery" (`SPEC.md` D21). */
export const metadata = genPageMetadata({ title: 'Gallery' })

/**
 * Renders the gallery index at `/gallery`: one card per event gallery, newest
 * event first (`SPEC.md` D22).
 *
 * The page is static. Each card's preview is a client component that picks
 * its photos in the browser (`SPEC.md` D25).
 */
export default function GalleryIndex() {
  return (
    <>
      <PageTitle>Gallery</PageTitle>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-8 gap-y-12 py-8">
        {galleries.map((gallery) => (
          <li key={gallery.slug}>
            <Link
              href={`/gallery/${gallery.slug}`}
              className="block text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
            >
              <GalleryPreview
                repo={gallery.photos?.repo}
                names={gallery.photos ? gallery.photos.list.map((photo) => photo.name) : []}
              />
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-pretty">
                {gallery.title}
              </h2>
              <div className="text-base font-medium text-gray-500 dark:text-gray-400">
                {cardMeta(gallery, events)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
