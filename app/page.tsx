import { genPageMetadata } from './seo'
import PageTitle from '@/components/PageTitle'

export const metadata = genPageMetadata({ title: 'Department of Decentralization' })

export default function Page() {
  return (
    <>
      <PageTitle>Department of Decentralization</PageTitle>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <div>
          The Department of Decentralization is a collective of people from Berlin. The group
          assembled in 2018 to organize the{' '}
          <a href="https://ethberlin.com" target="_blank" rel="noopener noreferrer">
            ETHBerlin
          </a>{' '}
          hackathon and has been active since.
        </div>
        <div>
          We aim to be an agnostic vehicle to drive adoption, educate newcomers, and raise awareness
          of the challenges and benefits of decentralization and open-source software.
        </div>
        <div>
          All our events are free to attend and we try, whenever possible, to deliver a
          distraction-free experience by not hosting sponsors, paid talks, or any other commercial
          components. Our collective entirely runs on donations.
        </div>
        <div>
          <img
            alt="The DoD team at Protocol Berg v1 in 2023"
            src="/static/images/team.jpg"
            style={{ marginBottom: 0 }}
          />
          <div style={{ textAlign: 'center' }}>
            <em>
              The DoD team and friends at{' '}
              <a href="https://v1.protocol.berlin" target="_blank" rel="noopener noreferrer">
                Protocol Berg v1
              </a>{' '}
              in 2023.
            </em>
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <iframe
            title="Collective, Non-Profit. Private | Afri Schoedon | Web3Privacy Now, Berlin, 2024"
            src="https://www.youtube.com/embed/NW6ViGipnT8"
            style={{ width: '100%', aspectRatio: '16 / 9', border: 0 }}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}a{display:block;width:100%;height:100%;position:relative}img,svg{position:absolute;width:100%;height:100%;top:0;left:0;object-fit:cover}svg{background:rgba(0,0,0,0.35);mix-blend-mode:screen}</style><a href="https://www.youtube.com/embed/NW6ViGipnT8?autoplay=1" target="_blank" rel="noopener noreferrer"><img src="/youtube-cover.png" alt="Insights on how we work by Afri at W3PN meetup, 2024" loading="lazy" /><svg viewBox="0 0 68 48" aria-hidden="true" focusable="false"><path d="M66.52 7.52a8 8 0 0 0-5.65-5.65C55.95.67 34 .67 34 .67s-21.95 0-26.87 1.2a8 8 0 0 0-5.65 5.65C.29 12.44.29 24 .29 24s0 11.56 1.2 16.48a8 8 0 0 0 5.65 5.65c4.92 1.2 26.86 1.2 26.86 1.2s21.95 0 26.87-1.2a8 8 0 0 0 5.65-5.65C67.71 35.56 67.71 24 67.71 24s0-11.56-1.2-16.48Z" fill="#f00"/><path d="M45.5 24 27.7 14.9v18.2Z" fill="#fff"/></svg></a>`}
          />
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <em>Insights on how we work by Afri at W3PN meetup, 2024.</em>
          </div>
        </div>
      </div>
    </>
  )
}
