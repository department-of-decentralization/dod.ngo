import { Nav } from "../nav";
import { Foot } from "../foot";

export default function Events() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Nav></Nav>
      <h2>Events</h2>
      <h3>Upcoming events:</h3>
        <div>
          <ul>
            <li>
                <strong>ETHBerlin 04 - Identity Crisis (2024):</strong>
                the hackathon returns in May 2024: <a
                  href="https://ethberlin.org"
                  target="_blank"
                  rel="noreferrer"
                >
                ethberlin.org
                </a>
            </li>
          </ul>
        </div>
        <h3>Our projects to date:</h3>
        <div>
          <ul>
            <li>
                <strong>Criticial Decentralization Cluster (2023):</strong>
                the #37c3 assembly in collaboration with the Social
                Distortion Protocol, the RIAT Institute, and Swiss Cryptoeconomics: <a
                  href="https://decentral.community"
                  target="_blank"
                  rel="noreferrer"
                >
                decentral.community
                </a>
            </li>
            <li>
                <strong>Protocol Berg (2023):</strong>
                the decentralized protocol and infrastructure conference: <a
                  href="https://protocol.berlin"
                  target="_blank"
                  rel="noreferrer"
                >
                protocol.berlin
                </a>
            </li>
            <li>
                <strong>ETHBerlin³ - to the power of 3 (2022):</strong>
                hackathon, conference, and cultural festival, third edition: <a
                  href="https://ethberlin.ooo"
                  target="_blank"
                  rel="noreferrer"
                >
                ethberlin.ooo
                </a>
            </li>
            <li>
                <strong>Merkle Root (Round Table):</strong> an exploration of the Berlin
                blockchain-art experiments from the early days till present, alongside an expedition.
            </li>
            <li>
                <strong>StrikeDAO (2022):</strong> The Ethereum
                domain of Bundeskunsthalle was squatted by artist Hito Steyerl and the
                DoD. The StrikeDAO voted on three models of the future governance of this
                squatted domain quadratically: <a
                  href="https://strikedao.com"
                  target="_blank"
                  rel="noreferrer"
                >strikedao.com</a>
            </li>
            <li>
                <strong>Wanderer above the Sea of FUD (2021):</strong> a follow-up study
                exploring funding mechanisms for culture through blockchain technologies
                that documented in real time (and accidentally) the start of the 2021 NFT bubble: <a
                  href="https://academia.edu/45026803"
                  target="_blank"
                  rel="noreferrer"
                >academia.edu/45026803</a>
            </li>
            <li>
                <strong>
                TwoPointFive (2020) - The Talk Show:
                </strong>
                TwoPointFive was a white-label virtual conference. No shill, no
                sponsors, from the community for the community and truly in it for the
                tech: <a
                  href="https://web.archive.org/web/20220426113132/https://twopointfive.online/"
                  target="_blank"
                  rel="noreferrer"
                >twopointfive.online</a>
            </li>
            <li>
                <strong>
                ETHParis 2 (2020) - The Un-Hackathon:
                </strong>
                ETHParis 2 was hosted by the Department of Decentralization and
                Ethereum France as an unconference-style hackathon in the
                engineering school l&apos;ESGI: <a
                  href="https://web.archive.org/web/20200318163540/https://www.hackparis.io/"
                  target="_blank"
                  rel="noreferrer"
                >hackparis.com</a>
            </li>
            <li>
                <strong>Crypto grows on trees (2019):</strong> an art exhibition at
                the Ethereum Devcon 4 in Osaka.
            </li>
            <li>
                <strong>Ecosystem Job-Openings (2019): </strong>
                connecting talent with web3-companies during the bear market.
            </li>
            <li>
                <strong>ETHBerlin ZWEI (2019): </strong>hackathon,
                conference, and cultural festival, second edition: <a
                  href="https://ethberlinzwei.com"
                  target="_blank"
                  rel="noreferrer"
                >
                ethberlinzwei.com
                </a>
            </li>
            <li>
                <strong>
                There is no such thing as Blockchain Art (2019):
                </strong>
                a study to explore the art world and the intersection with our
                systems.
            </li>
            <li>
                <strong>
                Blockstars Education Program (2019):
                </strong>
                A partnership with <a
                  href="https://b9lab.com/"
                  target="_blank"
                  rel="noreferrer"
                >B9lab</a>
                to onboard new hackers to web3.
            </li>
            <li>
                <strong>Goerli Testnet (2019): </strong>Born at
                ETHBerlin and launched at GoerliCon, the Goerli Testnet is now
                the essential public-facing Ethereum testnets after the Merge.
            </li>
            <li>
                <strong>G&ouml;rliCon 0 (2019): </strong>The Ethereum
                testnet and infrastructure conference where the Goerli Testnet was
                launched live on stage: <a
                  href="https://goerli.net/"
                  target="_blank"
                  rel="noreferrer"
                >
                goerli.net
                </a>
            </li>
            <li>
                <strong>ETHBerlin (2018):</strong> Hackathon,
                conference, and the first event that ran almost entirely using
                decentralized applications: <a
                  href="https://ethberlin.com"
                  target="_blank"
                  rel="noreferrer"
                >
                ethberlin.com
                </a>
            </li>
          </ul>
        </div>
      <Foot></Foot>
    </main>
  );
}
