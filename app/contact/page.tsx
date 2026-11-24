import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Contact' })

export default function Contact() {
  return (
    <>
      <PageTitle>Contact</PageTitle>
      <div className="prose max-w-none pt-8 pb-8 dark:prose-invert">
        <h2>On the Internet</h2>
        <p>
          We are chatting on [Matrix]:{' '}
          <a
            href="https://matrix.to/#/%23stammtisch:dod.ngo"
            target="_blank"
            rel="noopener noreferrer"
          >
            #stammtisch:dod.ngo
          </a>
          ,{' '}
          <a
            href="https://matrix.to/#/%23ethberlin:dod.ngo"
            target="_blank"
            rel="noopener noreferrer"
          >
            #ethberlin:dod.ngo
          </a>
          ,{' '}
          <a
            href="https://matrix.to/#/%23protocol:dod.ngo"
            target="_blank"
            rel="noopener noreferrer"
          >
            #protocol:dod.ngo
          </a>
        </p>
        <p>
          Follow us on Bluesky:{' '}
          <a href="https://bsky.app/profile/dod.ngo" target="_blank" rel="noopener noreferrer">
            @dod.ngo
          </a>
          ,{' '}
          <a
            href="https://bsky.app/profile/ethberlin.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ethberlin.org
          </a>
          ,{' '}
          <a
            href="https://bsky.app/profile/protocol.berlin"
            target="_blank"
            rel="noopener noreferrer"
          >
            @protocol.berlin
          </a>
        </p>
        <p>
          Follow us on Twitter:{' '}
          <a href="https://twitter.com/dod_berlin" target="_blank" rel="noopener noreferrer">
            @dod_berlin
          </a>
          ,{' '}
          <a href="https://twitter.com/ETHBerlin" target="_blank" rel="noopener noreferrer">
            @ETHBerlin
          </a>
          ,{' '}
          <a href="https://twitter.com/protocol_berg" target="_blank" rel="noopener noreferrer">
            @protocol_berg
          </a>
        </p>
        <p>
          All event recordings are available on Youtube:{' '}
          <a
            href="https://www.youtube.com/@departmentofdecentralization/playlists"
            target="_blank"
            rel="noopener noreferrer"
          >
            @departmentofdecentralization
          </a>
        </p>
        <p>
          Email us at{' '}
          <a href="mailto:hello@dod.ngo" target="_blank" rel="noreferrer">
            hello@dod.ngo
          </a>
          .
        </p>
      </div>
    </>
  )
}
