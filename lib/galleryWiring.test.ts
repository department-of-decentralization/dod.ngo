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
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

/**
 * `yarn test` exercises `lib/` and never renders a page, so a gallery component
 * that picked its preview during render, or fetched its photo list, would pass
 * every other test. That is the blind spot `SPEC.md` D6 records; the checks
 * below read the gallery sources as text.
 */

/**
 * Recursively collect source files under a directory.
 *
 * @param dir - Directory to walk.
 * @param acc - Accumulator, for recursion.
 * @returns Paths of every `.ts` and `.tsx` file found, tests excluded,
 *   relative to the repository root.
 */
function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) sourceFiles(full, acc)
    else if (/\.tsx?$/.test(entry) && !entry.endsWith('.test.ts')) acc.push(full)
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

/**
 * Read a repository file.
 *
 * @param path - Path relative to the repository root.
 * @returns Its contents.
 */
const read = (path: string) => readFileSync(path, 'utf8')

describe('gallery wiring (SPEC.md D23, D25)', () => {
  it('picks previews in a client component, after hydration', () => {
    const source = read(join('app', 'gallery', 'GalleryPreview.tsx'))
    expect(afterLeadingComments(source).startsWith("'use client'")).toBe(true)
    // The pick must wait for hydration: picked during the server render or the
    // hydrating render, it would differ between the static HTML and the
    // browser and fail hydration. The server snapshot, false, gates it.
    expect(source).toMatch(
      /useSyncExternalStore\(\s*subscribeToNothing,\s*\(\) => true,\s*\(\) => false\s*\)/
    )
    expect(source).toMatch(/hydrated \? pickPreview\(names, Math\.random\) : null/)
    expect(source.split('pickPreview(').length - 1).toBe(1)
  })

  it('no gallery source fetches anything', () => {
    // The build reads the checked-in photo list (SPEC.md D23, I3).
    const offenders = sourceFiles(join('app', 'gallery')).filter((file) =>
      read(file).includes('fetch(')
    )
    expect(offenders).toEqual([])
  })

  it('writes the photo host in lib/gallery.ts only', () => {
    const offenders = ['app', 'components', 'data', 'lib']
      .flatMap((dir) => sourceFiles(dir))
      .filter((file) => read(file).includes('raw.githubusercontent.com'))
    expect(offenders).toEqual([join('lib', 'gallery.ts')])
  })
})

describe('stylesheets under Tailwind 4 compatibility mode (SPEC.md D31)', () => {
  it('read theme colours through theme(), never var(--color-*)', () => {
    // With a JavaScript config loaded by @config, Tailwind emits no --color-*
    // variables, so var(--color-...) in plain CSS resolves to nothing and the
    // gallery's stripes and lightbox colours vanish, with no build error.
    for (const file of [join('css', 'tailwind.css'), join('css', 'prism.css')]) {
      expect(read(file), file).not.toContain('var(--color-')
    }
    expect(read(join('css', 'tailwind.css'))).toContain('theme(colors.butter.500)')
  })
})

describe('gallery page wiring (SPEC.md D22, D26 to D28)', () => {
  const page = read(join('app', 'gallery', '[slug]', 'page.tsx'))
  const grid = read(join('app', 'gallery', '[slug]', 'PhotoGrid.tsx'))

  it('prebuilds one page per registry gallery and no other', () => {
    // A static export cannot render an unknown slug on demand (SPEC.md I3).
    expect(page).toMatch(/export const dynamicParams = false/)
    expect(page).toMatch(/export function generateStaticParams\(\) \{\s*return galleries\.map\(/)
  })

  it('renders the grid and lightbox in a client component', () => {
    expect(afterLeadingComments(grid).startsWith("'use client'")).toBe(true)
  })

  it('adds no key listener of its own', () => {
    // The lightbox handles its keys on its own element; a document-level
    // handler could replace every nav hotkey (SPEC.md D19).
    expect(grid).not.toMatch(/keydown/i)
    expect(page).not.toMatch(/keydown/i)
  })

  it('mirrors the open photo in the URL without adding history entries', () => {
    expect(grid).toContain('history.replaceState(')
    expect(grid).not.toContain('pushState(')
  })

  it('closes the lightbox on a click anywhere on its backdrop', () => {
    // The library closes on the slide; BackdropClose covers the padding
    // around it and the gap between slides (SPEC.md D26).
    expect(grid).toContain('controller={{ closeOnBackdropClick: true }}')
    expect(grid).toMatch(/controls: \(\) => \(\s*<>\s*<BackdropClose \/>/)
    expect(grid).toContain('subscribeSensors(EVENT_ON_POINTER_UP,')
    expect(grid).toMatch(/isLightboxBackdrop\(target\.classList\)\) close\(\)/)
    // The caption and the legend let clicks through to the backdrop.
    expect(grid.match(/className="pointer-events-none absolute /g)).toHaveLength(2)
  })

  it('shows the placeholder text from COMING_SOON (SPEC.md D24)', () => {
    expect(page).toContain('{`${COMING_SOON}.`}')
    expect(page).not.toContain('Photos coming soon')
  })

  it('takes the credit from photoCredits (SPEC.md D28, D39)', () => {
    // lib/gallery.test.ts covers the credit's cases; the page only renders it.
    expect(page).toContain('photoCredits(photos)')
    expect(page).not.toContain('photographerCredit(')
    expect(page).not.toContain('photographer unknown')
    expect(page).not.toContain('photos.photographer')
    expect(page).not.toContain('photos.parts')
    // Each part's label follows its photographer, in parentheses.
    expect(page).toContain('{credit.label && ` (${credit.label})`}')
  })

  it('reads the removal address from siteMetadata', () => {
    for (const source of [page, grid]) expect(source).not.toContain('hello@dod')
    expect(page).toContain('mailto:${siteMetadata.email}')
  })
})
