interface Event {
  title: string
  date: string // ISO date string
  yearOnly?: boolean // Flag to indicate if the event only has year specified
  description: string
  link?: {
    url: string
    label: string
  }
}

export const events: Event[] = [
  {
    title: 'Criticial Decentralization Cluster',
    date: '2025-12-01',
    description:
      'the #39c3 assembly in collaboration with the Social Distortion Protocol, the RIAT Institute, and Swiss Cryptoeconomics',
    link: {
      url: 'https://decentral.community',
      label: 'decentral.community',
    },
  },
  {
    title: 'Protocol Berg v2',
    date: '2025-06-01',
    description: 'the decentralized protocol and infrastructure conference',
    link: {
      url: 'https://protocol.berlin',
      label: 'protocol.berlin',
    },
  },
  {
    title: 'Criticial Decentralization Cluster',
    date: '2024-12-01',
    description:
      'the #38c3 assembly in collaboration with the Social Distortion Protocol, the RIAT Institute, and Swiss Cryptoeconomics',
    link: {
      url: 'https://decentral.community',
      label: 'decentral.community',
    },
  },
  {
    title: 'Ethereum Berlin Meetup',
    date: '2024-10-01',
    description: 'Road to DEVCON VII SEA Bangkok.',
    link: {
      url: 'https://www.meetup.com/berlin-ethereum-meetup/events/303919363',
      label: 'meetup.com',
    },
  },
  {
    title: 'Ethereum Berlin Meetup',
    date: '2024-08-01',
    description: '10 years Ethereum Berlin Meetup.',
    link: {
      url: 'https://www.meetup.com/berlin-ethereum-meetup/events/302923436',
      label: 'meetup.com',
    },
  },
  {
    title: 'ETHBerlin 04 - Identity Crisis',
    date: '2024-05-01',
    description: 'the hackathon returns in May 2024',
    link: {
      url: 'https://ethberlin.org',
      label: 'ethberlin.org',
    },
  },
  {
    title: 'Criticial Decentralization Cluster',
    date: '2023-12-01',
    description:
      'the #37c3 assembly in collaboration with the Social Distortion Protocol, the RIAT Institute, and Swiss Cryptoeconomics',
    link: {
      url: 'https://decentral.community',
      label: 'decentral.community',
    },
  },
  {
    title: 'Protocol Berg',
    date: '2023-09-01',
    description: 'the decentralized protocol and infrastructure conference',
    link: {
      url: 'https://v1.protocol.berlin',
      label: 'v1.protocol.berlin',
    },
  },
  {
    title: 'ETHBerlin³ - to the power of 3',
    date: '2022-09-01',
    description: 'hackathon, conference, and cultural festival, third edition',
    link: {
      url: 'https://2022.ethberlin.org',
      label: '2022.ethberlin.org',
    },
  },
  {
    title: 'Merkle Root (Round Table)',
    date: '2022-06-01',
    yearOnly: true,
    description:
      'an exploration of the Berlin blockchain-art experiments from the early days till present, alongside an expedition.',
  },
  {
    title: 'StrikeDAO',
    date: '2022-01-01',
    yearOnly: true,
    description:
      'The Ethereum domain of Bundeskunsthalle was squatted by artist Hito Steyerl and the DoD. The StrikeDAO voted on three models of the future governance of this squatted domain quadratically',
    link: {
      url: 'https://strikedao.com',
      label: 'strikedao.com',
    },
  },
  {
    title: 'Wanderer above the Sea of FUD',
    date: '2021-01-01',
    yearOnly: true,
    description:
      'a follow-up study exploring funding mechanisms for culture through blockchain technologies that documented in real time (and accidentally) the start of the 2021 NFT bubble',
    link: {
      url: 'https://academia.edu/45026803',
      label: 'academia.edu/45026803',
    },
  },
  {
    title: 'TwoPointFive - The Talk Show',
    date: '2020-06-01',
    yearOnly: true,
    description:
      'TwoPointFive was a white-label virtual conference. No shill, no sponsors, from the community for the community and truly in it for the tech',
    link: {
      url: 'https://web.archive.org/web/20220426113132/https://twopointfive.online/',
      label: 'twopointfive.online',
    },
  },
  {
    title: 'ETHParis 2 - The Un-Hackathon',
    date: '2020-03-01',
    yearOnly: true,
    description:
      "ETHParis 2 was hosted by the Department of Decentralization and Ethereum France as an unconference-style hackathon in the engineering school l'ESGI",
    link: {
      url: 'https://web.archive.org/web/20200318163540/https://www.hackparis.io/',
      label: 'hackparis.com',
    },
  },
  {
    title: 'Crypto grows on trees',
    date: '2019-10-01',
    yearOnly: true,
    description: 'an art exhibition at the Ethereum Devcon 4 in Osaka.',
  },
  {
    title: 'Ecosystem Job-Openings',
    date: '2019-09-01',
    yearOnly: true,
    description: 'connecting talent with web3-companies during the bear market.',
  },
  {
    title: 'ETHBerlin ZWEI',
    date: '2019-08-01',
    yearOnly: true,
    description: 'hackathon, conference, and cultural festival, second edition',
    link: {
      url: 'https://2019.ethberlin.org',
      label: '2019.ethberlin.org',
    },
  },
  {
    title: 'There is no such thing as Blockchain Art',
    date: '2019-06-01',
    yearOnly: true,
    description: 'a study to explore the art world and the intersection with our systems.',
  },
  {
    title: 'Blockstars Education Program',
    date: '2019-05-01',
    yearOnly: true,
    description: 'A partnership with B9lab to onboard new hackers to web3.',
    link: {
      url: 'https://b9lab.com/',
      label: 'b9lab.com',
    },
  },
  {
    title: 'Goerli Testnet',
    date: '2019-02-01',
    yearOnly: true,
    description:
      'Born at ETHBerlin and launched at GoerliCon, the Goerli Testnet is now the essential public-facing Ethereum testnets after the Merge.',
  },
  {
    title: 'GörliCon 0',
    date: '2019-01-31',
    yearOnly: true,
    description:
      'The Ethereum testnet and infrastructure conference where the Goerli Testnet was launched live on stage',
    link: {
      url: 'https://goerli.net/',
      label: 'goerli.net',
    },
  },
  {
    title: 'ETHBerlin',
    date: '2018-09-01',
    yearOnly: true,
    description:
      'Hackathon, conference, and the first event that ran almost entirely using decentralized applications',
    link: {
      url: 'https://2018.ethberlin.org',
      label: '2018.ethberlin.org',
    },
  },
]
