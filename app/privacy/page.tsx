import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Privacy Policy' })

export default function Privacy() {
  return (
    <>
      <PageTitle>Privacy Policy</PageTitle>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <p>Angaben gemäß § 5 TMG: Goerli Dezentral gGmbH, Mariannenstraße 9-10, 10999 Berlin</p>

        <p>
          Handelsregister: HRB 207663 B, Registergericht: Amtsgericht Charlottenburg, Berlin,
          Umstatzsteuer-ID: DE325917754; vertreten durch A. Schoedon, Telefon: +49 (0) 30 20613410,
          E-Mail: schoedon@dod.ngo
        </p>

        <p>
          Goerli Dezentral gGmbH is a non-profit organization serving tax-privileged purposes,
          according to the articles of association. The organization meets the statutory
          requirements under §§ 51, 59, 60, and 61 AO.
        </p>
      </div>
    </>
  )
}
