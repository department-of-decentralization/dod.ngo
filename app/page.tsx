import { genPageMetadata } from './seo'
import PageTitle from '@/components/PageTitle'

export const metadata = genPageMetadata({ title: 'Department of Decentralization' })

export default function Page() {
  return (
    <>
      <PageTitle>Department of Decentralization</PageTitle>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <div>
          The Department of Decentralization is a collective of people from various crypto,
          decentralization and peer-to-peer communities in and around Berlin. The group assembled in
          2018 to organize ETHBerlin and has been active since.
        </div>
        <div>
          We aim to be an agnostic vehicle to drive adoption, educate newcomers, and raise awareness
          of the challenges and benefits of decentralization and open-source software.
        </div>
      </div>
    </>
  )
}
