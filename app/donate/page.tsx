import type { ReactNode } from 'react'
import CopyButton from '@/components/CopyButton'
import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Donate' })

/** A paragraph of the page's copy. */
const TEXT = 'text-base leading-7 text-gray-700 dark:text-gray-300'

/** A section heading: h2 under the page's h1 (SPEC.md, Bugfix: Design Review, #12). */
const HEADING = 'text-xl leading-7 font-bold tracking-tight text-gray-900 dark:text-gray-100'

/**
 * One payment detail: its label, its value in wrapping monospace, and a Copy
 * button (#12).
 *
 * @param props - The detail's label and value.
 */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div
      data-row
      className="flex items-center gap-3 border-b border-butter-500 py-3 pr-3 pl-3.5 last:border-b-0 dark:border-gray-700"
    >
      <div className="min-w-0 flex-1">
        <div data-label className="text-sm leading-5 text-gray-600 dark:text-gray-400">
          {label}
        </div>
        <div
          data-value
          className="mt-0.5 font-mono text-[15px] leading-[22px] font-medium [overflow-wrap:anywhere] text-gray-900 dark:text-gray-100"
        >
          {value}
        </div>
      </div>
      <CopyButton value={value} label={label} />
    </div>
  )
}

/**
 * A card of payment details.
 *
 * @param props - The details.
 */
function Details({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-butter-600 bg-white dark:border-gray-700 dark:bg-gray-900">
      {children}
    </div>
  )
}

export default function Donate() {
  return (
    <>
      <PageTitle>Donate</PageTitle>
      <div className="max-w-[38rem] pt-8 pb-8">
        <p className={TEXT}>
          The Department of Decentralization is a non-profit organization accepting donations either
          via cryptographic transactions or traditional wire transfers.
        </p>
        <h2 className={`mt-8 mb-3 ${HEADING}`}>Crypto</h2>
        <Details>
          <Detail label="Ethereum mainnet" value="ethberlin.eth" />
          <Detail label="Other EVM chains" value="0xd22dC63e2388AE8226b5CAA0341fc0c1294b6B40" />
        </Details>
        <h2 className={`mt-8 mb-1 ${HEADING}`}>Fiat</h2>
        <p className={`mb-3 ${TEXT}`}>Wire (SEPA) donations:</p>
        <Details>
          <Detail label="Beneficiary" value="Goerli Dezentral gGmbH" />
          <Detail label="IBAN" value="DE16 1005 0000 0190 8447 44" />
          <Detail label="BIC" value="BELADEBEXXX" />
          <Detail label="Subject" value="Spende Department of Decentralization" />
        </Details>
        <p className={`mt-6 ${TEXT}`}>
          To donate on other platforms or to get a donation receipt, please message us at{' '}
          <a
            href="mailto:donations@dod.ngo"
            className="font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            donations@dod.ngo
          </a>
          .
        </p>
      </div>
    </>
  )
}
