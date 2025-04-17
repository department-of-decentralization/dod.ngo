import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Impressum' })

export default function Impressum() {
  return (
    <>
      <PageTitle>Impressum</PageTitle>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <p>
          Angaben gem&auml;&szlig; &sect; 5 TMG: Goerli Dezentral gGmbH, Mariannenstra&szlig;e 9-10,
          10999 Berlin
        </p>
        <p>
          Handelsregister: HRB 207663 B, Registergericht: Amtsgericht Charlottenburg, Berlin,
          Umstatzsteuer-ID: DE325917754; vertreten durch A. Schoedon, E-Mail:{' '}
          <a href="mailto:schoedon@dod.ngo">schoedon@dod.ngo</a>
        </p>
        <p>
          Goerli Dezentral gGmbH is a non-profit organization serving tax-privileged purposes,
          according to the articles of association. The organization meets the statutory
          requirements under &sect;&sect; 51, 59, 60, and 61 AO.
        </p>
      </div>
    </>
  )
}
