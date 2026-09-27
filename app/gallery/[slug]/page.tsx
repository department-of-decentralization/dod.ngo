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
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import { events } from '@/data/dodEvents'
import galleries from '@/data/galleries'
import siteMetadata from '@/data/siteMetadata'
import {
  COMING_SOON,
  LICENSES,
  findEvent,
  findGallery,
  formatGalleryDate,
  neighbours,
  photoCountLabel,
  repoHref,
} from '@/lib/gallery'
import { genPageMetadata } from 'app/seo'
import PhotoGrid from './PhotoGrid'

/** Route parameters of a gallery page; Next.js passes them as a promise. */
type Params = { params: Promise<{ slug: string }> }

/** Colour of every link on the page, as on the rest of the site. */
const LINK = 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'

/** Only the registry's galleries exist; any other slug is a 404 (`SPEC.md` I3). */
export const dynamicParams = false

/**
 * Prebuild one page per gallery in the registry, placeholders included
 * (`SPEC.md` D22, D24).
 *
 * @returns One parameter set per gallery.
 */
export function generateStaticParams() {
  return galleries.map((gallery) => ({ slug: gallery.slug }))
}

/**
 * Page metadata: the gallery's title.
 *
 * @param params - Route parameters.
 * @returns The metadata.
 */
export async function generateMetadata({ params }: Params) {
  const gallery = findGallery(galleries, (await params).slug)
  return genPageMetadata({ title: gallery ? gallery.title : 'Gallery' })
}

/**
 * Renders one gallery at `/gallery/<slug>`: its event's date and link, the
 * photo grid with its lightbox, the photographer and license credit, and links
 * to the neighbouring galleries (`SPEC.md` D22 to D28). A gallery without
 * photos says so instead (D24).
 */
export default async function GalleryPage({ params }: Params) {
  const gallery = findGallery(galleries, (await params).slug)
  if (!gallery) notFound()

  const event = findEvent(gallery, events)
  const { previous, next } = neighbours(galleries, gallery.slug)
  const photos = gallery.photos
  const license = photos ? LICENSES[photos.license] : null

  return (
    <>
      <PageTitle>{gallery.title}</PageTitle>
      <div className="mt-2 flex flex-wrap gap-x-2 text-base font-medium text-gray-500 md:mt-5 dark:text-gray-400">
        <span>{formatGalleryDate(event)}</span>
        {event.link && (
          <>
            <span aria-hidden="true">•</span>
            <Link href={event.link.url} className={LINK}>
              {event.link.label}
            </Link>
          </>
        )}
        {photos && (
          <>
            <span aria-hidden="true">•</span>
            <span>{photoCountLabel(photos.list.length)}</span>
          </>
        )}
      </div>

      <div className="py-8">
        {photos ? (
          <PhotoGrid
            title={gallery.title}
            repo={photos.repo}
            dir={photos.dir}
            photos={photos.list.map(({ name, width, height }) => ({ name, width, height }))}
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{`${COMING_SOON}.`}</p>
        )}
      </div>

      {photos && license && (
        <div className="flex flex-col gap-1 border-t border-gray-200 py-6 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <p>
            Photos:{' '}
            <Link href={photos.photographerHref} className={LINK}>
              {photos.photographer}
            </Link>{' '}
            •{' '}
            <Link href={license.href} className={LINK}>
              {license.label}
            </Link>{' '}
            •{' '}
            <Link href={repoHref(photos)} className={LINK}>
              Source
            </Link>
          </p>
          <p>
            To request removal of a photo, email{' '}
            <a href={`mailto:${siteMetadata.email}`} className={LINK}>
              {siteMetadata.email}
            </a>
            .
          </p>
        </div>
      )}

      {(previous || next) && (
        <div className="flex justify-between gap-6 border-t border-gray-200 py-4 text-sm font-medium dark:border-gray-700">
          {previous && (
            <div>
              <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Previous Gallery
              </h2>
              <div className={LINK}>
                <Link href={`/gallery/${previous.slug}`}>{previous.title}</Link>
              </div>
            </div>
          )}
          {next && (
            <div className="ml-auto">
              <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Next Gallery
              </h2>
              <div className={LINK}>
                <Link href={`/gallery/${next.slug}`}>{next.title}</Link>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-4">
        <Link href="/gallery" className={LINK} aria-label="Back to the gallery">
          &larr; Back to the gallery
        </Link>
      </div>
    </>
  )
}
