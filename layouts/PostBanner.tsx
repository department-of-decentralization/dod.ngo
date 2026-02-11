import { ReactNode } from 'react'
import Image from '@/components/Image'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Authors, Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  authorDetails: CoreContent<Authors>[]
}

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const bskyHref = (value: string) =>
  value.trim().startsWith('http')
    ? value.trim()
    : `https://bsky.app/profile/${value.trim().replace(/^@/, '')}`

const bskyLabel = (value: string) => {
  const trimmed = value.trim()
  if (trimmed.startsWith('http')) {
    const match = trimmed.match(/bsky\.app\/profile\/([^/?#]+)/)
    return match ? `@${match[1]}` : trimmed
  }
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}

export default function PostMinimal({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { slug, title, images, summary, date, path, filePath } = content
  const displayImage = images && images.length > 0 ? images[0] : null

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="text-center dark:border-gray-700">
            <div className="relative pt-10">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <PageTitle>{title}</PageTitle>
            </div>
            <div className="prose flex max-w-none justify-center py-2 dark:prose-invert">
              <p className="max-w-xl text-center text-lg">{summary}</p>
            </div>
            <div className="flex flex-row justify-center">
              <dl className="py-4">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex flex-row flex-wrap justify-center gap-4 sm:space-x-8">
                    {authorDetails.map((author) => (
                      <li className="flex items-center space-x-2" key={author.name}>
                        {author.avatar && (
                          <Image
                            src={author.avatar}
                            width={38}
                            height={38}
                            alt="avatar"
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                        <dl className="whitespace-nowrap text-sm font-medium leading-5">
                          <dt className="sr-only">Name</dt>
                          <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                          <dt className="sr-only">Bluesky</dt>
                          <dd>
                            {author.bsky && (
                              <Link
                                href={bskyHref(author.bsky)}
                                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                              >
                                {bskyLabel(author.bsky)}
                              </Link>
                            )}
                          </dd>
                          <dt className="sr-only">Twitter</dt>
                          <dd>
                            {author.twitter && (
                              <Link
                                href={author.twitter}
                                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                              >
                                {author.twitter
                                  .replace('https://twitter.com/', '@')
                                  .replace('https://x.com/', '@')}
                              </Link>
                            )}
                          </dd>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </div>
          </div>
          {displayImage && (
            <div className="w-full">
              <Bleed>
                <div className="relative aspect-[2/1] w-full">
                  <Image src={displayImage} alt={title} fill className="object-contain" />
                </div>
              </Bleed>
            </div>
          )}
          <div className="prose max-w-none py-4 dark:prose-invert">{children}</div>
          <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
            <Link href={editUrl(filePath)}>View on GitHub</Link>
          </div>
          {siteMetadata.comments && (
            <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <Comments slug={slug} />
            </div>
          )}

          <footer className="mb-24">
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}
