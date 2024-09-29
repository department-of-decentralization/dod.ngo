import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/wolpy.png'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Image from 'next/image'

const Header = () => {
  return (
    <header className={'bg-butter-400 fixed mx-8 flex h-screen w-56 flex-col dark:bg-gray-950'}>
      {/* Logo and Title */}
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex flex-row items-center justify-between font-serif">
          <div className="mr-3">
            <Image src={Logo} alt="Logo" width={100} height={100} />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden text-base font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      {/* Navigation Links */}
      <div className="mt-8 flex flex-col">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hover:text-secondary-500 dark:hover:text-secondary-400 group block text-2xl font-medium leading-10 text-gray-900 dark:text-gray-100"
            >
              <span className="relative">
                <span className="text-primary-500 dark:text-primary-400">[</span>
                <span className="">{link.title.charAt(0)}</span>
                <span className="text-primary-500 dark:text-primary-400">]</span>
              </span>
              <span className=""> {link.title.slice(1)}</span>
            </Link>
          ))}
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
