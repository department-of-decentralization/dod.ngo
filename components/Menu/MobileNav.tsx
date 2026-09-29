'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Fragment, useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from '../Link'
import headerNavLinks from '@/data/headerNavLinks'
import { isCurrentPath } from '@/lib/nav'
import ThemeSwitch from '../ThemeSwitch'
import SocialIcons from '../SocialIcons'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const navRef = useRef(null)
  const pathname = usePathname()

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })

  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-60 bg-black/25" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <DialogPanel className="fixed top-0 left-0 z-70 h-full w-full bg-butter-400 duration-300 dark:bg-gray-950">
              <nav
                ref={navRef}
                aria-label="Main"
                className="mt-8 flex h-full basis-0 flex-col items-start overflow-y-auto pt-2 pl-12 text-left"
              >
                {headerNavLinks.map((link) => {
                  // The desktop nav's type and current-page mark, and a focus
                  // ring (SPEC.md, Bugfix: Design Review, #10).
                  const current = isCurrentPath(pathname, link.href)
                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      aria-current={current ? 'page' : undefined}
                      className={`mb-4 py-2 pr-4 text-2xl leading-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                        current
                          ? 'font-semibold text-primary-600 underline decoration-2 underline-offset-[6px] dark:text-primary-400'
                          : 'font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'
                      }`}
                      onClick={onToggleNav}
                    >
                      {link.title}
                    </Link>
                  )
                })}
                <div className="mt-4 block md:hidden">
                  <ThemeSwitch large />
                </div>
                <div className="mt-8">
                  <SocialIcons />
                </div>
              </nav>

              <button
                className="fixed top-7 right-4 z-80 h-16 w-16 p-4 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                aria-label="Toggle Menu"
                onClick={onToggleNav}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
