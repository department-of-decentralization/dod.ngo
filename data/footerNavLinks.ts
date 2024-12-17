import siteMetadata from './siteMetadata'

type FooterNavLink = {
  href: string
  title: string
  hotkey?: string
}

const footerNavLinks: FooterNavLink[] = [
  { href: '/impressum', title: 'Impressum' },
  { href: '/code-of-conduct', title: 'Code of Conduct', hotkey: 'o' },
  { href: '/privacy-policy', title: 'Privacy Policy' },
  { href: siteMetadata.siteRepo, title: 'Source' },
]

export default footerNavLinks
