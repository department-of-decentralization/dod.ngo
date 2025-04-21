import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/wolpy.png'
import Link from '../Link'
import MobileNav from './MobileNav'
import ThemeSwitch from '../ThemeSwitch'
import SearchButton from '../SearchButton'
import Image from 'next/image'
import SocialIcons from '../SocialIcons'

const Menu = () => {
  return (
    <header className="mx-4 flex flex-shrink-0 flex-row justify-between bg-butter-400 py-4 dark:bg-gray-950 md:fixed md:h-screen md:min-h-screen md:w-64 md:flex-col">
      {/* Logo and Title */}
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex flex-row items-center justify-between font-serif">
          <div className="mr-3 hidden md:block">
            <Image src={Logo} alt="Logo" width={100} height={100} />
          </div>
          <div className="mr-3 block md:hidden">
            <Image src={Logo} alt="Logo" width={54} height={54} />
          </div>

          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="block max-w-48 text-sm font-semibold md:text-base">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      {/* Navigation Links */}
      <div className="mx-1 mt-8 hidden flex-1 flex-col md:flex">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group block text-2xl font-medium leading-10 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
            >
              {(() => {
                // This component renders navigation links with hotkeys
                // Format: "About" with hotkey 'b' becomes "A[b]ut"
                // If no hotkey specified or not found, defaults to first letter [A]bout

                const hotkeyChar = link.hotkey
                const title = link.title
                let beforeChar = '' // Text before the bracketed char
                let char = '' // Character to be bracketed
                let afterChar = '' // Text after the bracketed char

                // If hotkey exists and is found in title (case insensitive)
                if (hotkeyChar && title.toLowerCase().includes(hotkeyChar.toLowerCase())) {
                  const index = title.toLowerCase().indexOf(hotkeyChar.toLowerCase())
                  beforeChar = title.slice(0, index) // Get text before hotkey
                  char = title.charAt(index) // Get actual character at hotkey position
                  afterChar = title.slice(index + 1) // Get remaining text
                } else {
                  // Fallback: use first character
                  char = title.charAt(0)
                  afterChar = title.slice(1)
                }

                return (
                  <>
                    {beforeChar}
                    <span className="relative mx-1">
                      <span className="text-primary-500 dark:text-primary-400">[</span>
                      <span className="">{char}</span>
                      <span className="text-primary-500 dark:text-primary-400">]</span>
                    </span>
                    {afterChar}
                  </>
                )
              })()}
            </Link>
          ))}
        <div className="mt-4">
          <ThemeSwitch />
        </div>
        {/* <SearchButton /> */}
      </div>

      <MobileNav />

      {/* Theme Switch at bottom */}
      <div className="mx-2 hidden flex-row gap-4 md:flex">
        <SocialIcons />
      </div>
    </header>
  )
}

export default Menu
