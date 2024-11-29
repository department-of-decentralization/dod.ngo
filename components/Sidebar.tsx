import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/wolpy.png'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Image from 'next/image'

const Sidebar = () => {
  return (
    <header className="mx-4 flex h-screen flex-col bg-butter-400 pb-12 dark:bg-gray-950">
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
      <div className="mx-1 mt-8 flex flex-1 flex-col">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group block text-2xl font-medium leading-10 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
            >
              <span className="relative">
                <span className="text-primary-500 dark:text-primary-400">[</span>
                <span className="">{link.title.charAt(0)}</span>
                <span className="text-primary-500 dark:text-primary-400">]</span>
              </span>
              <span className=""> {link.title.slice(1)}</span>
            </Link>
          ))}
        {/* <SearchButton /> */}
        <MobileNav />
      </div>
      {/* Theme Switch at bottom */}
      <div className="mx-1 mb-8">
        <ThemeSwitch />
      </div>
    </header>
  )
}

export default Sidebar
