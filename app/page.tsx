import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import YouTubeConsentEmbed from '@/components/YouTubeConsentEmbed'
import Image from '@/components/Image'

// No metadata of its own: the root layout's title and social preview name the
// site once (SPEC.md, Bugfix: Design Review, #14).

/** A link outside the prose, coloured as the prose colours its links (#3). */
const LINK =
  'font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'

/** A figure's caption: upright, 14 px, gray-600, 12 px below its media (#15). */
const CAPTION = 'mt-3 text-sm text-gray-600 dark:text-gray-400'

/** A call to action below the copy: Donate and Next events (#8, SPEC.md D45). */
const CTA =
  'text-base font-semibold text-primary-600 hover:text-primary-700 md:text-lg dark:text-primary-400 dark:hover:text-primary-300'

/**
 * Renders the Department of Decentralization homepage content.
 */
export default function Page() {
  return (
    <>
      <PageTitle>Department of Decentralization</PageTitle>
      <div className="prose max-w-none pt-8 pb-8 dark:prose-invert">
        {/* The first paragraph leads (#14); the body text keeps the prose's
            38rem cap (#4). */}
        <p className="mt-0 max-w-[44rem] text-xl leading-[30px] text-gray-900 md:text-2xl md:leading-9 dark:text-gray-100">
          The Department of Decentralization is a collective of people from Berlin. The group
          assembled in 2018 to organize the{' '}
          <a href="https://2018.ethberlin.org" target="_blank" rel="noopener noreferrer">
            ETHBerlin
          </a>{' '}
          hackathon and has been active since.
        </p>
        <p className="text-base leading-7 md:text-lg md:leading-[30px]">
          We aim to be an agnostic vehicle to drive adoption, educate newcomers, and raise awareness
          of the challenges and benefits of decentralization and open-source software.
        </p>
        <p className="text-base leading-7 md:text-lg md:leading-[30px]">
          All our events are free to attend and we try, whenever possible, to deliver a
          distraction-free experience by not hosting sponsors, paid talks, or any other commercial
          components. Our collective entirely runs on donations.
        </p>
        <p className="not-prose mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/donate" className={CTA}>
            Donate →
          </Link>
          <Link href="/events" className={CTA}>
            Next events →
          </Link>
        </p>
        <figure className="not-prose mt-9 md:mt-16">
          <Image
            alt="The DoD team at Protocol Berg v1 in 2023"
            src="/static/images/team.jpg"
            width={1200}
            height={800}
            className="h-auto w-full rounded-md"
          />
          <figcaption className={CAPTION}>
            The DoD team and friends at{' '}
            <a
              href="https://v1.protocol.berlin"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              Protocol Berg v1
            </a>{' '}
            in 2023.
          </figcaption>
        </figure>
        <YouTubeConsentEmbed
          className="mt-8 md:mt-12"
          videoId="a6Ee1sas5IQ"
          title="Collective, Non-Profit. Private | Afri Schoedon | Web3Privacy Now, Berlin, 2024"
          heading="Collective, Non-Profit. Private"
          thumbnailSrc="/static/youtube-cover.png"
          caption="Insights on how we work by Afri at W3PN meetup, 2024."
        />
      </div>
    </>
  )
}
