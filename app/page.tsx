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
              The DoD team at{' '}
              <a href="https://v1.protocol.berlin" target="_blank" rel="noopener noreferrer">
                Protocol Berg v1
              </a>{' '}
              in 2023.
            </em>
          </div>
        </div>
      </div>
    </>
  )
}
