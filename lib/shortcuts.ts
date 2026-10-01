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
 * The visitor's choice about the single-key nav shortcuts (`SPEC.md` D44): on
 * unless they turned them off. The choice lives in `localStorage` under
 * {@link SHORTCUTS_KEY}; the key is absent while the shortcuts are on.
 */

/** `localStorage` key that holds `off` while the shortcuts are turned off. */
export const SHORTCUTS_KEY = 'dod-shortcuts'

/** Value stored under {@link SHORTCUTS_KEY} while the shortcuts are off. */
export const SHORTCUTS_OFF = 'off'

/** Name of the window event sent when the choice changes in this tab. */
export const SHORTCUTS_EVENT = 'dod-shortcuts-change'

/**
 * Whether the single-key shortcuts are on.
 *
 * @param storage - `localStorage`, or `null` where there is none.
 * @returns `false` only when the visitor turned them off. A storage that
 *   cannot be read (a private window, blocked site data) counts as on, which
 *   is the default.
 */
export function shortcutsEnabled(storage: Pick<Storage, 'getItem'> | null): boolean {
  try {
    return storage?.getItem(SHORTCUTS_KEY) !== SHORTCUTS_OFF
  } catch {
    return true
  }
}

/**
 * Turn the single-key shortcuts on or off.
 *
 * @param storage - `localStorage`.
 * @param enabled - `true` to turn them on, `false` to turn them off.
 * @returns Whether the choice was stored; `false` when the storage refused it.
 */
export function setShortcutsEnabled(
  storage: Pick<Storage, 'setItem' | 'removeItem'>,
  enabled: boolean
): boolean {
  try {
    if (enabled) storage.removeItem(SHORTCUTS_KEY)
    else storage.setItem(SHORTCUTS_KEY, SHORTCUTS_OFF)
    return true
  } catch {
    return false
  }
}
