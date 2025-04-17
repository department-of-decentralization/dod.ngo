import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Donate' })

export default function Donate() {
  return (
    <>
      <PageTitle>Donate</PageTitle>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <p>
          The Department of Decentralization is a non-profit organization accepting donations either
          via cryptographic transactions or traditional wire transfers.
        </p>
        <h3>Crypto</h3>
        <p>
          Donations on Ethereum mainnet: <code>ethberlin.eth</code>; on other EVM chains:{' '}
          <code>0xd22dC63e2388AE8226b5CAA0341fc0c1294b6B40</code>
        </p>
        <p>
          Our old, secondary account is: <code>dezent.eth</code>; on other EVM chains:{' '}
          <code>0x59cc3Fc56B8B2988F259EC1E6f3446907130f728</code>; do not use if possible.
        </p>
        <h3>Fiat</h3>
        <p>
          Wire (SEPA) donations:
          <br />
          Beneficiary: <code>Goerli Dezentral gGmbH</code>
          <br />
          International Bank Account Number: <code>DE16 1005 0000 0190 8447 44</code>
          <br />
          Bank Identifier Code: <code>BELADEBEXXX</code>
          <br />
          Subject: <code>Spende Department of Decentralization</code>
        </p>
        <p>
          To donate on other platforms or to get a donation receipt, please message us at{' '}
          <a href="mailto:donations@dod.ngo">donations@dod.ngo</a>.
        </p>
      </div>
    </>
  )
}
