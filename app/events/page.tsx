import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Impressum' })

export default function Impressum() {
  return (
    <>
      <PageTitle>Events</PageTitle>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <h2>Upcoming events:</h2>
        <ul>
          <li>
            <strong>Protocol Berg v2</strong> - 2025 -{' '}
            <a href="https://protocol.berlin">protocol.berlin</a>
          </li>
        </ul>

        <h2>Our projects to date:</h2>
        <ul>
          <li>
            <strong>ETHBerlin</strong> - 2024 - <a href="https://ethberlin.org">ethberlin.org</a>:
            the hackathon returns in May 2024
          </li>
          <li>
            <strong>Criticial Decentralization Cluster</strong> - 2023 -{' '}
            <a href="https://decentral.community">decentral.community</a>: the #37c3 assembly in
            collaboration with the Social Distortion Protocol, the RIAT Institute, and Swiss
            Cryptoeconomics
          </li>
          <li>
            <strong>Protocol Berg</strong> - 2023 -{' '}
            <a href="https://protocol.berlin">protocol.berlin</a>: the decentralized protocol and
            infrastructure conference
          </li>
          <li>
            <strong>ETHBerlin³ - to the power of 3</strong> - 2022 -{' '}
            <a href="https://ethberlin.ooo">ethberlin.ooo</a>: hackathon, conference, and cultural
            festival, third edition
          </li>
          <li>
            <strong>StrikeDAO</strong> - 2022 - <a href="https://strikedao.com">strikedao.com</a>:
            The Ethereum domain of Bundeskunsthalle was squatted by artist Hito Steyerl and the DoD.
            The StrikeDAO voted on three models of the future governance of this squatted domain
            quadratically
          </li>
          <li>
            <strong>TwoPointFive</strong> - 2020 -{' '}
            <a href="https://twopointfive.online">twopointfive.online</a>: TwoPointFive was a
            white-label virtual conference. No shill, no sponsors, from the community for the
            community and truly in it for the tech
          </li>
          <li>
            <strong>ETHParis 2</strong> - 2020 - <a href="https://hackparis.com">hackparis.com</a>:
            ETHParis 2 was hosted by the Department of Decentralization and Ethereum France as an
            unconference-style hackathon in the engineering school l'ESGI
          </li>
          <li>
            <strong>Ecosystem Job-Openings</strong> - 2019: connecting talent with web3-companies
            during the bear market
          </li>
          <li>
            <strong>ETHBerlin ZWEI</strong> - 2019 -{' '}
            <a href="https://ethberlinzwei.com">ethberlinzwei.com</a>: hackathon, conference, and
            cultural festival, second edition
          </li>
          <li>
            <strong>There is no such thing as Blockchain Art</strong> - 2019: a study to explore the
            art world and the intersection with our systems
          </li>
          <li>
            <strong>Blockstars Education Program</strong> - 2019: A partnership with B9lab to
            onboard new hackers to web3
          </li>
          <li>
            <strong>Goerli Testnet</strong> - 2019: Born at ETHBerlin and launched at GoerliCon, the
            Goerli Testnet is now the essential public-facing Ethereum testnets after the Merge
          </li>
          <li>
            <strong>GörliCon 0</strong> - 2019 - <a href="https://goerli.net">goerli.net</a>: The
            Ethereum testnet and infrastructure conference where the Goerli Testnet was launched
            live on stage
          </li>
          <li>
            <strong>ETHBerlin</strong> - 2018 - <a href="https://ethberlin.com">ethberlin.com</a>:
            Hackathon, conference, and the first event that ran almost entirely using decentralized
            applications
          </li>
        </ul>

        <p>
          Currently, the Department is primarily run from Berlin. The collective is composed of
          around a dozen members who contribute voluntarily.
        </p>
      </div>
    </>
  )
}
