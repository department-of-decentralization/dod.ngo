/* SPDX-License-Identifier: MIT */
'use client'

import { useState } from 'react'
import Image from '@/components/Image'

interface YouTubeConsentEmbedProps {
  /** The YouTube video ID to embed. */
  videoId: string
  /** The iframe title used for accessibility. */
  title: string
  /** The talk's title, shown on the consent gate. */
  heading?: string
  /** Optional local thumbnail image for the consent gate background. */
  thumbnailSrc?: string
  /** Optional caption to display below the embed. */
  caption?: string
  /** Classes for the figure, such as its top margin. */
  className?: string
}

/**
 * Renders a privacy-respecting YouTube embed that only loads after consent
 * (`SPEC.md` I4). Until the visitor clicks "Load video", nothing is requested
 * from YouTube: the gate shows the talk's title, the button and what loading
 * will do, over a darkened local cover image (SPEC.md, Bugfix: Design Review,
 * #9). The figure keeps out of the prose, whose paragraph margins used to push
 * the gate out of its 16:9 box on a phone.
 */
export default function YouTubeConsentEmbed({
  videoId,
  title,
  heading,
  thumbnailSrc,
  caption,
  className,
}: YouTubeConsentEmbedProps) {
  const [isConsented, setIsConsented] = useState(false)

  return (
    <figure className={`not-prose ${className ?? ''}`}>
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-900">
        {isConsented ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0">
            {thumbnailSrc ? (
              <>
                <Image src={thumbnailSrc} alt="" fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gray-950/[0.74]" />
              </>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2.5 p-4 text-white md:gap-5 md:p-10">
              {heading ? (
                <p className="text-lg leading-6 font-bold tracking-tight md:text-4xl md:leading-[42px]">
                  {heading}
                </p>
              ) : null}
              <div className="flex flex-col items-start gap-2.5 md:flex-row md:items-center md:gap-5">
                <button
                  type="button"
                  onClick={() => setIsConsented(true)}
                  className="rounded-md bg-white px-4 py-2 text-[15px] leading-[22px] font-semibold text-gray-900 transition hover:bg-gray-200 md:px-5 md:py-2.5 md:text-base md:leading-6"
                >
                  Load video
                </button>
                <p className="text-xs text-gray-300 md:max-w-[22rem] md:text-[13px] md:leading-[18px]">
                  Loading the video will contact youtube-nocookie.com and may set third-party
                  cookies.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
