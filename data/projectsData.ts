interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'A Search Engine',
    description: `What if you could look up any information in the world? Webpages, images, videos
    and more. Google has many features to help you find exactly what you're looking
    for.`,
    imgSrc: '/static/images/google.png',
    href: 'https://www.google.com',
  },
  {
    title: 'The Time Machine',
    description: `Imagine being able to travel back in time or to the future. Simple turn the knob
    to the desired date and press "Go". No more worrying about lost keys or
    forgotten headphones with this simple yet affordable solution.`,
    imgSrc: '/static/images/time-machine.jpg',
    href: '/blog/the-time-machine',
  },
  {
    title: '7/Seven Chain — Perpetual Futures Exchange',
    description: `7/Seven Chain is an EVM-compatible blockchain (Chain ID: 70007) powering TheSeven.meme — the world's first on-chain immutable synthetic perpetual futures exchange. Trade 100+ pairs with up to 2001× leverage and zero fees on BSC/Parlia consensus.`,
    imgSrc: '/static/images/google.png',
    href: 'https://theseven.meme',
  },
]

export default projectsData
