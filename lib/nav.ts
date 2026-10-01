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

/**
 * Whether a nav entry is the page being shown, so the menus can mark it
 * (`aria-current="page"`; SPEC.md, Bugfix: Design Review, #6 and #10).
 *
 * @param pathname - The current path, as `usePathname()` returns it; `null`
 *   before the router knows it.
 * @param href - The nav entry's path, such as `/gallery`.
 * @returns `true` for the entry's own page and, except for `/`, for any page
 *   below it: `/gallery/protocol-v2` belongs to Gallery. A trailing slash on
 *   the path is ignored.
 */
export function isCurrentPath(pathname: string | null, href: string): boolean {
  if (!pathname) return false
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (href === '/') return path === '/'
  return path === href || path.startsWith(`${href}/`)
}
