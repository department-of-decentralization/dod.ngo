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
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import services from '../data/services'

/**
 * `yarn test` exercises `lib/` and never reads the `.tsx` call sites, so a
 * probe added to the wrong component is invisible to every other test in this
 * suite. That is the same blind spot `SPEC.md` D6 records and §7 shows the cost
 * of, so the checks below read the component tree as source.
 */

/**
 * Recursively collect every `.tsx` file under a directory.
 *
 * @param dir - Directory to walk.
 * @param acc - Accumulator, for recursion.
 * @returns Paths of every `.tsx` file found, relative to the repository root.
 */
function tsxFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) tsxFiles(full, acc)
    else if (entry.endsWith('.tsx')) acc.push(full)
  }
  return acc
}

/**
 * Strip leading block comments and whitespace, so a directive prologue can be
 * found beneath a license header.
 *
 * @param source - File contents.
 * @returns The source from its first statement onward.
 */
function afterLeadingComments(source: string): string {
  return source.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)*/, '')
}

/** Hostnames of every probe endpoint in the registry. */
const probeHosts = services.map((s) => new URL(s.probeUrl).hostname)

describe('probe blast radius (SPEC.md D12, acceptance S8)', () => {
  it('names a probe host only under app/services', () => {
    // A visitor who never opens /services must make no request to any of the nine.
    // app/privacy is no longer excluded here: SPEC.md D12 was amended on
    // 2026-09-24 to drop the privacy-page disclosure, so that file names no
    // probe host either and the radius is exactly one directory.
    const offenders = tsxFiles('app')
      .concat(tsxFiles('components'))
      .filter((file) => {
        if (file.startsWith(join('app', 'services'))) return false
        const source = readFileSync(file, 'utf8')
        return probeHosts.some((host) => source.includes(host))
      })
    expect(offenders).toEqual([])
  })

  it('hardcodes no probe host under app/services, since the registry owns them', () => {
    // SPEC.md D14: one definition, one consumer. The page renders from the
    // registry, so a hostname literal there would be a second definition.
    const offenders = tsxFiles(join('app', 'services')).filter((file) => {
      const source = readFileSync(file, 'utf8')
      return probeHosts.some((host) => source.includes(host))
    })
    expect(offenders).toEqual([])
  })
})

describe('registry wiring', () => {
  it('is imported by the services page', () => {
    const page = readFileSync(join('app', 'services', 'page.tsx'), 'utf8')
    const client = tsxFiles(join('app', 'services'))
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n')
    expect(page + client).toMatch(/from '@\/data\/services'|from '.*data\/services'/)
  })

  it('probes from the client, never at build time', () => {
    // SPEC.md D9: I3 was amended to permit a browser-issued request, not to
    // permit baking a status into the HTML. A status true only at build time
    // is not a status.
    const hasClientDirective = tsxFiles(join('app', 'services')).some((f) =>
      // The directive must be the first statement, but a license header may
      // precede it, so compare after stripping leading block comments.
      afterLeadingComments(readFileSync(f, 'utf8')).startsWith("'use client'")
    )
    expect(hasClientDirective).toBe(true)
  })
})
