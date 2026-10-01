import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/wolpy.png'
import Link from '../Link'
import MobileNav from './MobileNav'
import NavLinks from './NavLinks'
import SearchButton from '../SearchButton'
import Image from 'next/image'
import SocialIcons from '../SocialIcons'

const Menu = () => {
  return (
    <header className="mx-4 flex shrink-0 flex-row justify-between bg-butter-400 py-4 md:fixed md:h-screen md:min-h-screen md:w-64 md:flex-col dark:bg-gray-950">
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
      {/* Navigation Links, the theme switch and the shortcuts toggle */}
      <NavLinks />

      <MobileNav />

      {/* Theme Switch at bottom */}
      <div className="mx-2 hidden flex-row gap-4 md:flex">
        <SocialIcons />
      </div>
    </header>
  )
}

export default Menu
