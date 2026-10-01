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

import { useSyncExternalStore } from 'react'
import { SHORTCUTS_EVENT, setShortcutsEnabled, shortcutsEnabled } from '@/lib/shortcuts'

/**
 * `localStorage`, or `null` where reading it throws (blocked site data).
 *
 * @returns The storage, if the browser lets the page use it.
 */
function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * Follow the shortcuts choice: this tab announces its own changes with
 * {@link SHORTCUTS_EVENT}, other tabs with the `storage` event.
 *
 * @param onChange - Called after the choice may have changed.
 * @returns A function that stops following it.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(SHORTCUTS_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(SHORTCUTS_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/**
 * The "Shortcuts: on/off" toggle beside the theme switch (`SPEC.md` D44). It
 * turns the single-key nav hotkeys of `app/hotkeys.tsx` on or off, as WCAG 2.1
 * success criterion 2.1.4 asks. The static HTML shows the default, on; the
 * stored choice is read after hydration.
 */
export default function ShortcutsToggle() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => shortcutsEnabled(storage()),
    () => true
  )
  const toggle = () => {
    const store = storage()
    if (store) setShortcutsEnabled(store, !enabled)
    window.dispatchEvent(new Event(SHORTCUTS_EVENT))
  }

  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={toggle}
      className="text-sm leading-5 font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
    >
      Shortcuts:{' '}
      <span className="font-semibold text-primary-600 dark:text-primary-400">
        {enabled ? 'on' : 'off'}
      </span>
    </button>
  )
}
