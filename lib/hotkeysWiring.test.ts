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
import { runInNewContext } from 'vm'
import { afterEach, describe, expect, it } from 'vitest'
import ButtonScript from '../app/hotkeys'
import { SHORTCUTS_KEY, SHORTCUTS_OFF } from './shortcuts'

/**
 * `app/hotkeys.tsx` installs the nav hotkeys through an inline script string
 * that no other test executes. These tests run that exact string, taken from
 * the element the component renders, against a stubbed `document` and
 * `window`, so the thing tested is the thing shipped (`SPEC.md` D29).
 *
 * Importing the component also runs its build-time collision check, so a
 * duplicated hotkey fails this file before any test starts.
 */

/** The parts of a DOM element the hotkey handler reads. */
type FakeTarget = {
  tagName: string
  isContentEditable?: boolean
  closest?: (selector: string) => object | null
}

/** Modifier flags of a keyboard event. */
type Modifiers = Partial<Record<'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey', boolean>>

/** An element outside any menu, as `document.body` looks to the handler. */
const BODY: FakeTarget = { tagName: 'BODY', closest: () => null }

/** A stand-in for `localStorage`; with `broken` set, every read throws. */
type FakeStorage = {
  items: Map<string, string>
  broken: boolean
  getItem(key: string): string | null
}

/**
 * Load the emitted hotkey script into a fresh context.
 *
 * @returns `press`, which dispatches one keydown to the handler the script
 *   registered and returns the path it navigated to, or `null` if the page
 *   stayed put; the `storage` the script reads the shortcuts choice from; and
 *   the `script` itself.
 */
function loadHotkeys() {
  const script: string = ButtonScript().props.dangerouslySetInnerHTML.__html
  let handler: ((event: object) => void) | null = null
  const document = {
    addEventListener: (type: string, listener: (event: object) => void) => {
      if (type === 'keydown') handler = listener
    },
  }
  const storage: FakeStorage = {
    items: new Map(),
    broken: false,
    getItem(key) {
      if (this.broken) throw new Error('blocked')
      return this.items.get(key) ?? null
    },
  }
  const window = { location: { href: '' }, localStorage: storage }
  runInNewContext(script, { document, window })

  const press = (key: string, target: FakeTarget = BODY, modifiers: Modifiers = {}) => {
    window.location.href = ''
    handler?.({ key, target, ...modifiers })
    return window.location.href || null
  }
  return { press, storage, script }
}

const { press, storage, script } = loadHotkeys()

/**
 * The keyspace of record (`SPEC.md` D8, D21), written out rather than read
 * from `data/*NavLinks.ts`: a test that derives its expectations from the code
 * it checks cannot catch the code being wrong (`SPEC.md` §7).
 */
const KEYSPACE: Record<string, string> = {
  h: '/',
  e: '/events',
  b: '/blog',
  g: '/gallery',
  p: '/people',
  s: '/services',
  d: '/donate',
  c: '/contact',
  i: '/impressum',
  o: '/conduct',
  v: '/privacy',
}

describe('nav hotkeys (SPEC.md D21, D29)', () => {
  it('navigates to every nav entry by its key', () => {
    for (const [key, href] of Object.entries(KEYSPACE)) {
      expect(press(key), `key ${key}`).toBe(href)
    }
  })

  it('claims no other letter', () => {
    for (const key of 'abcdefghijklmnopqrstuvwxyz') {
      if (key in KEYSPACE) continue
      expect(press(key), `key ${key}`).toBeNull()
    }
  })

  it('matches a key case-insensitively', () => {
    expect(press('G')).toBe('/gallery')
  })

  it('ignores a key pressed with a modifier', () => {
    for (const modifier of ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'] as const) {
      expect(press('p', BODY, { [modifier]: true }), modifier).toBeNull()
    }
  })
})

describe('keys meant for a focused control fire no nav hotkey [regression 2026-09-26]', () => {
  it('ignores typing in an input, a textarea or a select', () => {
    for (const tagName of ['INPUT', 'TEXTAREA', 'SELECT']) {
      expect(press('p', { tagName, closest: () => null }), tagName).toBeNull()
    }
  })

  it('ignores typing in a content-editable element', () => {
    expect(press('p', { tagName: 'DIV', isContentEditable: true, closest: () => null })).toBeNull()
  })

  it('ignores type-ahead inside an open menu', () => {
    const insideMenu: FakeTarget = {
      tagName: 'DIV',
      closest: (selector) => (selector === '[role="menu"]' ? {} : null),
    }
    expect(press('d', insideMenu)).toBeNull()
    expect(press('s', insideMenu)).toBeNull()
  })

  it('still navigates from a control outside any menu', () => {
    expect(press('d', { tagName: 'A', closest: () => null })).toBe('/donate')
  })
})

describe('the shortcuts can be turned off (SPEC.md D44) [regression 2026-09-29]', () => {
  afterEach(() => {
    storage.items.clear()
    storage.broken = false
  })

  it('listens with addEventListener and assigns no document.onkeydown', () => {
    // An assignment would replace any other keydown handler (SPEC.md D19).
    expect(script).toContain("document.addEventListener('keydown', checkKey)")
    expect(script).not.toContain('document.onkeydown')
  })

  it('navigates nowhere while the visitor has turned them off', () => {
    storage.items.set(SHORTCUTS_KEY, SHORTCUTS_OFF)
    for (const key of Object.keys(KEYSPACE)) {
      expect(press(key), `key ${key}`).toBeNull()
    }
  })

  it('navigates again once they are back on', () => {
    storage.items.set(SHORTCUTS_KEY, SHORTCUTS_OFF)
    expect(press('e')).toBeNull()
    storage.items.delete(SHORTCUTS_KEY)
    expect(press('e')).toBe('/events')
  })

  it('counts a storage it cannot read as on', () => {
    storage.broken = true
    expect(press('e')).toBe('/events')
  })
})
