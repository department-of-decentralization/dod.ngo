/* SPDX-License-Identifier: MIT */
'use client'

import { useState } from 'react'
import Image from '@/components/Image'

interface YouTubeConsentEmbedProps {
  /** The YouTube video ID to embed. */
  videoId: string
  /** The iframe title used for accessibility. */
  title: string
  /** Optional local thumbnail image for the consent gate background. */
  thumbnailSrc?: string
  /** Optional caption to display below the embed. */
  caption?: string
}

/**
 * Renders a privacy-respecting YouTube embed that only loads after consent.
 */
export default function YouTubeConsentEmbed({
  videoId,
  title,
  thumbnailSrc,
  caption,
}: YouTubeConsentEmbedProps) {
  const [isConsented, setIsConsented] = useState(false)

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
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
                <Image
                  src={thumbnailSrc}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover blur-md"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : null}
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center text-white">
              <p className="text-base font-semibold">
                This video is hosted on YouTube. Click below to load the privacy-enhanced embed.
              </p>
              <button
                type="button"
                onClick={() => setIsConsented(true)}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
              >
                Load video
              </button>
              <p className="text-xs text-gray-300">
                Loading the video will contact youtube-nocookie.com and may set third-party cookies.
              </p>
            </div>
          </div>
        )}
      </div>
      {caption ? (
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <em>{caption}</em>
        </div>
      ) : null}
    </div>
  )
}
