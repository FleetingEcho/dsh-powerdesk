import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { searchGrep } from '../src/search-api.ts'
import { resetRipgrepCache, resolveRipgrepPath } from '../src/search-deps.ts'

// Exercises the REAL committed prebuilt `rg` binary (this repo's own
// prebuilt/linux-x64-gnu/rg on CI/dev linux boxes) rather than mocking
// child_process — the thing worth verifying here is the whole pipeline
// (candidate resolution -> spawn -> --json parsing -> capping), which a
// mock would just assume works.

let dir: string

beforeEach(() => {
  resetRipgrepCache()
  dir = mkdtempSync(join(tmpdir(), 'dsh-powerdesk-search-'))
  writeFileSync(join(dir, 'a.txt'), 'hello world\nneedle here\nanother needle\n')
  writeFileSync(join(dir, 'b.txt'), 'nothing to see\n')
})

afterEach(() => {
  rmSync(dir, { recursive: true, force: true })
  resetRipgrepCache()
})

describe('search-api', () => {
  it('finds matches grouped by file with line numbers and highlight ranges', async () => {
    const result = await searchGrep(dir, 'needle')
    expect(result.truncated).toBe(false)
    expect(result.files).toHaveLength(1)
    const file = result.files[0]!
    expect(file.path.endsWith('a.txt')).toBe(true)
    expect(file.matches).toHaveLength(2)
    expect(file.matches[0]).toMatchObject({ line: 2, text: 'needle here' })
    expect(file.matches[0]!.ranges).toEqual([[0, 6]])
  })

  it('returns an empty result for a query with no matches', async () => {
    const result = await searchGrep(dir, 'nonexistent-pattern-xyz')
    expect(result).toEqual({ files: [], truncated: false })
  })

  it('returns an empty result for a blank query without spawning rg', async () => {
    const result = await searchGrep(dir, '   ')
    expect(result).toEqual({ files: [], truncated: false })
  })

  it('rejects with a bad-request ResttyError on an invalid regex', async () => {
    await expect(searchGrep(dir, '(unclosed')).rejects.toMatchObject({
      code: 'bad-request',
    })
  })

  it('throws search-deps-missing when no rg candidate resolves', async () => {
    resetRipgrepCache()
    // Pre-seed the module-level resolution cache to "nothing resolves" —
    // searchGrep's own internal resolveRipgrepPath() call (default prober)
    // then just reads this cached outcome. Using a real bogus env path
    // instead would still fall through to a real `rg` on PATH on any dev
    // machine that has one installed (this sandbox does), defeating the test.
    resolveRipgrepPath(() => false)
    await expect(searchGrep(dir, 'needle')).rejects.toMatchObject({
      code: 'search-deps-missing',
    })
  })
})
