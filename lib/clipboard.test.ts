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
import { copyText } from './clipboard'

describe('copyText (design review #12)', () => {
  it('puts the text on the clipboard', async () => {
    const written: string[] = []
    const clipboard = { writeText: async (text: string) => void written.push(text) }
    expect(await copyText('DE16 1005 0000 0190 8447 44', clipboard)).toBe(true)
    expect(written).toEqual(['DE16 1005 0000 0190 8447 44'])
  })

  it('reports a browser without a clipboard', async () => {
    expect(await copyText('BELADEBEXXX', undefined)).toBe(false)
  })

  it('reports a refused write', async () => {
    const clipboard = {
      writeText: async () => {
        throw new Error('NotAllowedError')
      },
    }
    expect(await copyText('BELADEBEXXX', clipboard)).toBe(false)
  })
})
