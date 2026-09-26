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
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

/**
 * Resolve a repository-relative directory to an absolute path.
 *
 * @param dir - Directory relative to the repository root.
 * @returns The absolute path.
 */
const fromRoot = (dir: string) => fileURLToPath(new URL(`./${dir}`, import.meta.url))

/**
 * Vitest configuration.
 *
 * The aliases mirror `tsconfig.json` `paths`, so a wiring test can import a
 * real component (for example `app/hotkeys.tsx`) whose imports use `@/`.
 * Tests live in `lib/` only (`SPEC.md` D6).
 *
 * `yarn test:coverage` fails below 100% line coverage of `lib/`: the floor
 * from `~/.claude/CLAUDE.md`, measured since `SPEC.md` D32.
 */
export default defineConfig({
  // tsconfig.json's `jsx` setting belongs to Next, which rewrites it on build;
  // Vitest compiles JSX with React's automatic runtime regardless.
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: {
    alias: {
      '@/components': fromRoot('components'),
      '@/data': fromRoot('data'),
      '@/layouts': fromRoot('layouts'),
      '@/lib': fromRoot('lib'),
      '@/css': fromRoot('css'),
    },
  },
  test: {
    include: ['lib/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      exclude: ['lib/**/*.test.ts'],
      reporter: ['text'],
      thresholds: { lines: 100 },
    },
  },
})
