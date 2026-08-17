/**
 * Host-side file API for the Explorer/Editor tabs: list a directory, read a
 * file, write a file. Mounted under `/powerdesk/api/fs.*` in src/index.ts
 * behind the same browser-trust fence every route uses.
 *
 * No extra path sandboxing beyond `resolve()`: the plugin already ships a
 * full interactive shell (the terminal), so a user with access to this
 * plugin already has unrestricted local filesystem access — restricting the
 * file API more tightly than the terminal would be theater, not security.
 */
import { readdir, readFile, writeFile, stat, mkdir, rename, rm } from 'node:fs/promises'
import type { Dirent } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve as resolvePath } from 'node:path'
import { ResttyError } from './wire.ts'

/** The host's home directory (the folder-picker's starting point). */
export function fsHome(): { path: string } {
  return { path: homedir() }
}

/** Cap file reads so a giant log/binary does not get pulled into the editor. */
export const FS_READ_LIMIT = 5 * 1024 * 1024

/** One directory entry. */
export interface FsEntry {
  name: string
  isDir: boolean
  /** Byte size (0 for directories, best-effort for files). */
  size: number
}

export interface FsListResult {
  path: string
  entries: FsEntry[]
}

/** List one directory's immediate children: directories first, then A-Z. */
export async function fsList(path: string): Promise<FsListResult> {
  const abs = resolvePath(path)
  let dirents: Dirent[]
  try {
    dirents = await readdir(abs, { withFileTypes: true })
  } catch (error) {
    throw new ResttyError('bad-request', `cannot list "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  const entries: FsEntry[] = []
  for (const dirent of dirents) {
    const isDir = dirent.isDirectory()
    let size = 0
    if (!isDir) {
      try {
        size = (await stat(join(abs, dirent.name))).size
      } catch {
        // Broken symlink or a delete racing the listing: report 0 rather
        // than failing the whole directory.
      }
    }
    entries.push({ name: dirent.name, isDir, size })
  }
  entries.sort((a, b) => (a.isDir !== b.isDir ? (a.isDir ? -1 : 1) : a.name.localeCompare(b.name)))
  return { path: abs, entries }
}

export interface FsReadResult {
  path: string
  content: string
  /** True when the file exceeded {@link FS_READ_LIMIT} and was cut off. */
  truncated: boolean
}

/** Read one file as UTF-8 text, capped at {@link FS_READ_LIMIT} bytes. */
export async function fsRead(path: string): Promise<FsReadResult> {
  const abs = resolvePath(path)
  let info: Awaited<ReturnType<typeof stat>>
  try {
    info = await stat(abs)
  } catch (error) {
    throw new ResttyError('not-found', `cannot read "${abs}": ${error instanceof Error ? error.message : String(error)}`, 404)
  }
  if (info.isDirectory()) throw new ResttyError('bad-request', `"${abs}" is a directory`, 400)
  const truncated = info.size > FS_READ_LIMIT
  const buffer = await readFile(abs)
  const content = (truncated ? buffer.subarray(0, FS_READ_LIMIT) : buffer).toString('utf8')
  return { path: abs, content, truncated }
}

/** Overwrite one file's content (UTF-8; the parent directory must exist). */
export async function fsWrite(path: string, content: string): Promise<{ path: string }> {
  const abs = resolvePath(path)
  try {
    await writeFile(abs, content, 'utf8')
  } catch (error) {
    throw new ResttyError('bad-request', `cannot write "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  return { path: abs }
}

/** Create a NEW empty file (exclusive: fails if it already exists, so
 *  "new note" never silently clobbers one). Parent directory must exist. */
export async function fsCreate(path: string): Promise<{ path: string }> {
  const abs = resolvePath(path)
  try {
    await writeFile(abs, '', { encoding: 'utf8', flag: 'wx' })
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'EEXIST') throw new ResttyError('bad-request', `"${abs}" already exists`, 400)
    throw new ResttyError('bad-request', `cannot create "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  return { path: abs }
}

/** Create a directory (and any missing parents). */
export async function fsMkdir(path: string): Promise<{ path: string }> {
  const abs = resolvePath(path)
  try {
    await mkdir(abs, { recursive: true })
  } catch (error) {
    throw new ResttyError('bad-request', `cannot create folder "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  return { path: abs }
}

/** Rename/move a file or folder. */
export async function fsRename(from: string, to: string): Promise<{ path: string }> {
  const absFrom = resolvePath(from)
  const absTo = resolvePath(to)
  try {
    await rename(absFrom, absTo)
  } catch (error) {
    throw new ResttyError('bad-request', `cannot rename "${absFrom}" to "${absTo}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  return { path: absTo }
}

/** Delete a file or a folder (recursively). */
export async function fsDelete(path: string): Promise<{ path: string }> {
  const abs = resolvePath(path)
  try {
    await rm(abs, { recursive: true, force: true })
  } catch (error) {
    throw new ResttyError('bad-request', `cannot delete "${abs}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  return { path: abs }
}

/** One node of the recursive markdown tree: a `.md`/`.markdown` file, or a
 *  directory that (directly or via a descendant) contains one — directories
 *  with no markdown anywhere under them are pruned entirely, so the Notes
 *  tree only ever shows folders worth expanding. */
export interface MdTreeNode {
  name: string
  path: string
  isDir: boolean
  children?: MdTreeNode[]
}

/** Hard caps so a wrong/huge bound folder (or a symlink loop) can't hang the
 *  route or blow up the response — the notes tree is meant for a personal
 *  notes folder, not an arbitrary large repo. */
const MD_TREE_MAX_DEPTH = 12
const MD_TREE_MAX_NODES = 5000

function isMarkdownFile(name: string): boolean {
  const lower = name.toLowerCase()
  return lower.endsWith('.md') || lower.endsWith('.markdown')
}

/** Recursively walk `path`, keeping only markdown files and the directories
 *  that lead to them. Returns undefined for a directory with no markdown
 *  descendants (pruned by the caller). `budget` is a shared mutable counter
 *  capping total visited nodes across the whole walk. */
async function walkMarkdownTree(abs: string, depth: number, budget: { left: number }): Promise<MdTreeNode[]> {
  if (depth > MD_TREE_MAX_DEPTH || budget.left <= 0) return []
  let dirents: Dirent[]
  try {
    dirents = await readdir(abs, { withFileTypes: true })
  } catch {
    return []
  }
  dirents.sort((a, b) => a.name.localeCompare(b.name))
  const nodes: MdTreeNode[] = []
  for (const dirent of dirents) {
    if (budget.left <= 0) break
    const childAbs = join(abs, dirent.name)
    if (dirent.isDirectory()) {
      const children = await walkMarkdownTree(childAbs, depth + 1, budget)
      if (children.length > 0) {
        nodes.push({ name: dirent.name, path: childAbs, isDir: true, children })
      }
    } else if (isMarkdownFile(dirent.name)) {
      budget.left -= 1
      nodes.push({ name: dirent.name, path: childAbs, isDir: false })
    }
  }
  return nodes
}

/** The Notes tab's recursive `.md` tree over a bound folder. */
export async function fsListMarkdownTree(path: string): Promise<{ path: string; children: MdTreeNode[] }> {
  const abs = resolvePath(path)
  try {
    const info = await stat(abs)
    if (!info.isDirectory()) throw new ResttyError('bad-request', `"${abs}" is not a directory`, 400)
  } catch (error) {
    if (error instanceof ResttyError) throw error
    throw new ResttyError('not-found', `cannot read "${abs}": ${error instanceof Error ? error.message : String(error)}`, 404)
  }
  const budget = { left: MD_TREE_MAX_NODES }
  const children = await walkMarkdownTree(abs, 0, budget)
  return { path: abs, children }
}
