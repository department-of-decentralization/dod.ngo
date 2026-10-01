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

/** The part of `navigator.clipboard` that copying needs. */
export type ClipboardLike = Pick<Clipboard, 'writeText'>

/**
 * Copy a payment detail for the Copy buttons on `/donate` (SPEC.md, Bugfix:
 * Design Review, #12). The clipboard is a parameter, as `fetch` is for the
 * service probes (`SPEC.md` D13), so tests need no browser.
 *
 * @param text - What to copy.
 * @param clipboard - `navigator.clipboard`, or `undefined` where the browser
 *   has none (an insecure origin, an old browser).
 * @returns `true` once the text is on the clipboard; `false` when there is no
 *   clipboard or the browser refused, so the page can leave the button as it
 *   was. Nothing is sent anywhere.
 */
export async function copyText(
  text: string,
  clipboard: ClipboardLike | undefined
): Promise<boolean> {
  if (!clipboard) return false
  try {
    await clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
