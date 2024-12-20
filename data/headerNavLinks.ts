type HeaderNavLink = {
  href: string
  title: string
  hotkey?: string
}

const headerNavLinks: HeaderNavLink[] = [
  { href: '/', title: 'Home' },
  { href: '/about', title: 'About' },
  { href: '/events', title: 'Events' },
  { href: '/blog', title: 'Blog' },
  { href: '/contact', title: 'Contact' },
]

export default headerNavLinks
