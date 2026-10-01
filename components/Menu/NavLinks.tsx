/*
 * SPDX-FileCopyrightText: 2026 Department of Decentralization
 * SPDX-License-Identifier: MIT
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use client'

import { usePathname } from 'next/navigation'
import headerNavLinks from '@/data/headerNavLinks'
import { isCurrentPath } from '@/lib/nav'
import Link from '../Link'
import ShortcutsToggle from '../ShortcutsToggle'
import ThemeSwitch from '../ThemeSwitch'

/** Classes of a nav link that is not the current page. */
const LINK =
  'block text-2xl leading-10 font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'

/** Classes of the current page's nav link: primary-600, underlined. */
const CURRENT =
  'block text-2xl leading-10 font-semibold text-primary-600 underline decoration-2 underline-offset-[6px] dark:text-primary-400'

/** Colour of the brackets around a hotkey, except on the current page's link. */
const BRACKET = 'text-primary-500 dark:text-primary-400'

/**
 * The desktop sidebar's navigation: one link per header entry, with its hotkey
 * in brackets, the current page marked, then the theme switch and the
 * shortcuts toggle (SPEC.md, Bugfix: Design Review, #5 to #7). It is a client
 * component because the current page comes from `usePathname()`.
 */
export default function NavLinks() {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className="mx-1 mt-8 hidden flex-1 flex-col md:flex">
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .map((link) => {
          const current = isCurrentPath(pathname, link.href)
          // The hotkey letter goes in brackets: "About" with hotkey 'b'
          // becomes "A[b]out"; without a hotkey found in the title, the first
          // letter does.
          const title = link.title
          const found = link.hotkey ? title.toLowerCase().indexOf(link.hotkey.toLowerCase()) : -1
          const index = found >= 0 ? found : 0
          return (
            <Link
              key={link.title}
              href={link.href}
              aria-current={current ? 'page' : undefined}
              className={current ? CURRENT : LINK}
            >
              {title.slice(0, index)}
              <span className="relative">
                <span className={current ? undefined : BRACKET}>[</span>
                <span>{title.charAt(index)}</span>
                <span className={current ? undefined : BRACKET}>]</span>
              </span>
              {title.slice(index + 1)}
            </Link>
          )
        })}
      <div className="mt-4 flex items-center gap-5">
        <ThemeSwitch />
        <ShortcutsToggle />
      </div>
    </nav>
  )
}
