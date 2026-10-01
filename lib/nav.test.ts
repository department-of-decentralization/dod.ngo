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
import { describe, expect, it } from 'vitest'
import headerNavLinks from '../data/headerNavLinks'
import { isCurrentPath } from './nav'

describe('isCurrentPath (design review #6, #10)', () => {
  it("marks an entry's own page", () => {
    expect(isCurrentPath('/events', '/events')).toBe(true)
    expect(isCurrentPath('/', '/')).toBe(true)
  })

  it('marks an entry for the pages below it, but Home only for itself', () => {
    expect(isCurrentPath('/gallery/protocol-v2', '/gallery')).toBe(true)
    expect(isCurrentPath('/blog/2018/back-to-basics', '/blog')).toBe(true)
    expect(isCurrentPath('/events', '/')).toBe(false)
  })

  it('does not mark an entry whose path is only a prefix of the name', () => {
    expect(isCurrentPath('/galleryx', '/gallery')).toBe(false)
    expect(isCurrentPath('/events', '/gallery')).toBe(false)
  })

  it('ignores a trailing slash, and marks nothing before the path is known', () => {
    expect(isCurrentPath('/events/', '/events')).toBe(true)
    expect(isCurrentPath('/gallery/protocol-v2/', '/gallery')).toBe(true)
    expect(isCurrentPath(null, '/events')).toBe(false)
  })
})

describe('the main menu (maintainer feedback on PR #80, 2026-10-01)', () => {
  it('lists Events, Gallery, Blog, People, Contact, Services and Donate, in that order', () => {
    expect(headerNavLinks.map((link) => link.href)).toEqual([
      '/',
      '/events',
      '/gallery',
      '/blog',
      '/people',
      '/contact',
      '/services',
      '/donate',
    ])
  })
})
