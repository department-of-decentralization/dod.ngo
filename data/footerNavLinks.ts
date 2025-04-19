import siteMetadata from './siteMetadata'

type FooterNavLink = {
  href: string
  title: string
  hotkey?: string
}

const footerNavLinks: FooterNavLink[] = [
  { href: '/impressum', title: 'Impressum', hotkey: 'i' },
  { href: '/conduct', title: 'Code of Conduct', hotkey: 'o' },
  { href: '/privacy', title: 'Privacy Policy', hotkey: 'v' },
]

export default footerNavLinks
