type HeaderNavLink = {
  href: string
  title: string
  hotkey?: string
}

const headerNavLinks: HeaderNavLink[] = [
  { href: '/', title: 'Home' },
  { href: '/events', title: 'Events' },
  { href: '/blog', title: 'Blog' },
  { href: '/impressum', title: 'Contact' },
  { href: '/people', title: 'People' },
]

export default headerNavLinks
