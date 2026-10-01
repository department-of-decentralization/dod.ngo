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

import { useState } from 'react'
import { copyText } from '@/lib/clipboard'

/** How long the button reads "Copied" after a copy. */
const CONFIRM_MS = 2000

/**
 * A 44 px Copy button for one payment detail on `/donate` (SPEC.md, Bugfix:
 * Design Review, #12). It reads "Copied" for two seconds after the value is on
 * the clipboard, and stays "Copy" when the browser refuses. Screen readers
 * hear what it copies ("Copy IBAN").
 *
 * @param props - The value to copy and its label.
 */
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (await copyText(value, navigator.clipboard)) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), CONFIRM_MS)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="h-11 flex-none rounded-md border border-butter-600 bg-butter-400 px-3.5 text-sm font-semibold text-primary-600 hover:bg-butter-500 dark:border-gray-700 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700"
    >
      {copied ? 'Copied' : 'Copy'}
      <span className="sr-only"> {label}</span>
    </button>
  )
}
