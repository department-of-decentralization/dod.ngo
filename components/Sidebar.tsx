import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/wolpy.png'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Image from 'next/image'
import SocialIcon from './social-icons'

const Sidebar = () => {
  return (
    <header className="mx-4 flex flex-shrink-0 flex-row justify-between bg-butter-400 pb-12 dark:bg-gray-950 md:fixed md:h-screen md:w-64 md:flex-col">
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
              <span className="relative">
                <span className="text-primary-500 dark:text-primary-400">[</span>
                <span className="">{link.title.charAt(0)}</span>
                <span className="text-primary-500 dark:text-primary-400">]</span>
              </span>
              <span className=""> {link.title.slice(1)}</span>
            </Link>
          ))}
        <div className="mt-4">
          <ThemeSwitch />
        </div>
        {/* <SearchButton /> */}
      </div>

      <MobileNav />

      {/* Theme Switch at bottom */}
      <div className="mx-2 hidden flex-row  gap-4 md:flex">
        <SocialIcon kind="github" href={siteMetadata.github} size={5} />
        <SocialIcon kind="x" href={siteMetadata.x} size={5} />
      </div>
    </header>
  )
}

export default Sidebar
