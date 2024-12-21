import siteMetadata from './siteMetadata'

type FooterNavLink = {
  href: string
  title: string
  hotkey?: string
}

const footerNavLinks: FooterNavLink[] = [
  { href: '/impressum', title: 'Impressum' },
  { href: '/conduct', title: 'Code of Conduct', hotkey: 'o' },
  { href: '/privacy', title: 'Privacy Policy' },
  { href: siteMetadata.siteRepo, title: 'Source' },
]

export default footerNavLinks
