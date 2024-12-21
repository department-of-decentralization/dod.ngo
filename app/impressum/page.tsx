import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Impressum' })

export default function Impressum() {
  return (
    <>
      <PageTitle>Impressum</PageTitle>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <h2>Contact</h2>
        <div>
          We are (in random order): Raul, Kirill, Eylon, Wesley, Caspar, Phil,
          Franzi, Kaan, Rose, Tim, Ksenya, Ligi, Stina, Helena, MP, Martin,
          Alex, Afri, Nich, Carl, Hany, Jacob, and Peter. Supported by
          countless volunteers and creative contributors. &lt;3
        </div>
        <div>
          Our public, in-person Stammtisch happens every 3rd Wednesday at the <a
          href="https://c-base.org/"
          target="_blank"
          rel="noreferrer">c-base</a> in Berlin. Drop in and say hi!
        </div>
        <div>
          We are coordinating on Matrix:<a
          href="https://matrix.to/#/%23stammtisch:dod.ngo"
          target="_blank"
          rel="noopener noreferrer">#stammtisch:dod.ngo</a>
        </div>
        <div>
        Email us at <a
        href="mailto:hello@dod.ngo"
        target="_blank"
        rel="noreferrer">hello@dod.ngo</a>.
        </div>
        <h3>Donations</h3>
        <div>
          The Department of Decentralization is a non-profit organization
          accepting donations either via cryptographic transactions or
          traditional wire transfers.
        </div>
        <div>
          Donations on Ethereum mainnet: <code>ethberlin.eth</code>; on other EVM
          chains: <code>0xd22dC63e2388AE8226b5CAA0341fc0c1294b6B40</code>
        </div>
        <div>
          Wire (SEPA) donations:<br />
          Beneficiary: <code>Goerli Dezentral gGmbH</code><br />
          International Bank Account Number: <code>DE16 1005 0000 0190 8447 44</code><br />
          Bank Identifier Code: <code>BELADEBEXXX</code><br />
          Subject: <code>Spende Department of Decentralization</code>
        </div>
        <div>
          To donate on other platforms or to get a donation receipt,
          please message us at <a href="mailto:donations@dod.ngo">donations@dod.ngo</a>.
        </div>
        <h3>Impressum</h3>
        <div>
          Angaben gem&auml;&szlig; &sect; 5 TMG:
          Goerli Dezentral gGmbH, Mariannenstra&szlig;e 9-10, 10999 Berlin
        </div>
        <div>
          Handelsregister: HRB 207663 B, Registergericht: Amtsgericht
          Charlottenburg, Berlin, Umstatzsteuer-ID: DE325917754;
          vertreten durch A. Schoedon, E-Mail: <a
          href="mailto:schoedon@dod.ngo">schoedon@dod.ngo</a>
        </div>
        <div>
          Goerli Dezentral gGmbH is a non-profit organization serving
          tax-privileged purposes, according to the articles of association.
          The organization meets the statutory requirements under
          &sect;&sect; 51, 59, 60, and 61 AO.
        </div>
      </div>
    </>
  )
}
