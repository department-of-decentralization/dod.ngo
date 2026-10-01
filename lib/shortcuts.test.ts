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
import {
  SHORTCUTS_EVENT,
  SHORTCUTS_KEY,
  SHORTCUTS_OFF,
  setShortcutsEnabled,
  shortcutsEnabled,
} from './shortcuts'

/**
 * An in-memory stand-in for `localStorage`.
 *
 * @returns The store and its backing map.
 */
function memoryStorage() {
  const map = new Map<string, string>()
  return {
    map,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
  }
}

/** A storage that throws on every call, as blocked site data does. */
const blocked = {
  getItem: (): string | null => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
  removeItem: () => {
    throw new Error('blocked')
  },
}

describe('shortcuts preference (SPEC.md D44)', () => {
  it('is on by default', () => {
    expect(shortcutsEnabled(memoryStorage())).toBe(true)
    expect(shortcutsEnabled(null)).toBe(true)
  })

  it('turns off and on again, keeping nothing stored while on', () => {
    const storage = memoryStorage()
    expect(setShortcutsEnabled(storage, false)).toBe(true)
    expect(storage.map.get(SHORTCUTS_KEY)).toBe(SHORTCUTS_OFF)
    expect(shortcutsEnabled(storage)).toBe(false)
    expect(setShortcutsEnabled(storage, true)).toBe(true)
    expect(storage.map.has(SHORTCUTS_KEY)).toBe(false)
    expect(shortcutsEnabled(storage)).toBe(true)
  })

  it('counts an unreadable storage as on, and reports a refused write', () => {
    expect(shortcutsEnabled(blocked)).toBe(true)
    expect(setShortcutsEnabled(blocked, false)).toBe(false)
  })

  it('names its storage key, value and event', () => {
    expect([SHORTCUTS_KEY, SHORTCUTS_OFF, SHORTCUTS_EVENT]).toEqual([
      'dod-shortcuts',
      'off',
      'dod-shortcuts-change',
    ])
  })
})
