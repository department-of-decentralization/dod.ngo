type HeaderNavLink = {
  href: string
  title: string
  hotkey?: string
}

const headerNavLinks: HeaderNavLink[] = [
  { href: '/', title: 'Home' },
  { href: '/events', title: 'Events' },
  { href: '/blog', title: 'Blog' },
  { href: '/gallery', title: 'Gallery', hotkey: 'g' },
  { href: '/people', title: 'People' },
  { href: '/services', title: 'Services', hotkey: 's' },
  { href: '/donate', title: 'Donate' },
  { href: '/contact', title: 'Contact' },
]

export default headerNavLinks
