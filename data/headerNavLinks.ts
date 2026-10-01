type HeaderNavLink = {
  href: string
  title: string
  hotkey?: string
}

const headerNavLinks: HeaderNavLink[] = [
  { href: '/', title: 'Home' },
  { href: '/events', title: 'Events' },
  { href: '/gallery', title: 'Gallery', hotkey: 'g' },
  { href: '/blog', title: 'Blog' },
  { href: '/people', title: 'People' },
  { href: '/contact', title: 'Contact' },
  { href: '/services', title: 'Services', hotkey: 's' },
  { href: '/donate', title: 'Donate' },
]

export default headerNavLinks
