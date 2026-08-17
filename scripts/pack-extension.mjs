#!/usr/bin/env node
/**
 * Pack a built Powerdesk extension into the .tgz the Settings card accepts.
 *
 *   node scripts/pack-extension.mjs [extension-dir] [--out <file>]
 *
 * Input:  <dir>/powerdesk.json  and  <dir>/dist/<entry>  (from `pnpm build`)
 * Output: <dir>/<id>-<version>.tgz  — a gzipped tar whose ROOT contains
 *         powerdesk.json and the entry script, which is exactly the layout
 *         src/extensions/install.ts reads.
 *
 * The tar writer here is deliberately tiny and only emits regular files with
 * short, ASCII, root-level names — the one shape the installer accepts. It
 * validates the manifest the same way the host does before writing anything,
 * so a bad manifest fails at pack time (where the author can see it) rather
 * than at upload time.
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const BLOCK = 512
const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/

/** Print an error and exit non-zero. */
function fail(message) {
  console.error(`pack-extension: ${message}`)
  process.exit(1)
}

/** Build one 512-byte ustar header with a correct checksum. */
function header(name, size) {
  if (Buffer.byteLength(name) > 100) {
    fail(`file name "${name}" is longer than 100 bytes; rename it`)
  }
  const block = Buffer.alloc(BLOCK, 0)
  block.write(name, 0, 'latin1')
  block.write('0000644\0', 100, 'latin1')
  block.write('0000000\0', 108, 'latin1')
  block.write('0000000\0', 116, 'latin1')
  block.write(`${size.toString(8).padStart(11, '0')}\0`, 124, 'latin1')
  block.write(`${Math.floor(Date.now() / 1000).toString(8).padStart(11, '0')}\0`, 136, 'latin1')
  block.write('0', 156, 'latin1')
  block.write('ustar\0', 257, 'latin1')
  block.write('00', 263, 'latin1')
  // Checksum: the unsigned sum of every header byte with the checksum field
  // itself read as eight spaces.
  block.write('        ', 148, 'latin1')
  let sum = 0
  for (const byte of block) sum += byte
  block.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148, 'latin1')
  return block
}

/** Assemble a tar archive from [{name, data}] plus the end-of-archive tail. */
function tar(files) {
  const parts = []
  for (const { name, data } of files) {
    parts.push(header(name, data.length))
    const padded = Buffer.alloc(Math.ceil(data.length / BLOCK) * BLOCK, 0)
    data.copy(padded)
    parts.push(padded)
  }
  parts.push(Buffer.alloc(BLOCK * 2, 0))
  return Buffer.concat(parts)
}

/** Reject a manifest the host would reject, with the same rules. */
function validate(manifest) {
  if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest)) {
    fail('powerdesk.json must contain a JSON object')
  }
  if (!ID_PATTERN.test(manifest.id ?? '')) {
    fail(`"id" must match ${ID_PATTERN} (lowercase letters, digits and dashes)`)
  }
  if (typeof manifest.title !== 'string' || manifest.title.trim() === '') {
    fail('"title" must be a non-empty string')
  }
  const entry = manifest.entry ?? 'bundle.js'
  if (!/^[A-Za-z0-9._-]+\.js$/.test(entry)) {
    fail('"entry" must be a plain .js file name with no directory part')
  }
  return { ...manifest, entry }
}

const args = process.argv.slice(2)
let outPath
const positional = []
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--out') {
    outPath = args[i + 1]
    if (outPath === undefined) fail('--out needs a file path')
    i += 1
  } else if (args[i].startsWith('--')) {
    fail(`unknown flag ${args[i]}`)
  } else {
    positional.push(args[i])
  }
}
const dir = resolve(positional[0] ?? '.')

const manifestPath = join(dir, 'powerdesk.json')
if (!existsSync(manifestPath)) fail(`no powerdesk.json in ${dir}`)

let parsed
try {
  parsed = JSON.parse(readFileSync(manifestPath, 'utf8'))
} catch (error) {
  fail(`powerdesk.json is not valid JSON: ${error.message}`)
}
const manifest = validate(parsed)

// The built bundle: `dist/<entry>` when the template's build ran, otherwise
// `<entry>` at the root (for authors who build elsewhere).
const candidates = [join(dir, 'dist', manifest.entry), join(dir, manifest.entry)]
const bundlePath = candidates.find(path => existsSync(path) && statSync(path).isFile())
if (bundlePath === undefined) {
  fail(`no built bundle found — looked for ${candidates.join(' and ')}. Run the build first.`)
}

const bundle = readFileSync(bundlePath)
const expectedKey = `__dshPowerdeskChunks__[${JSON.stringify(`ext:${manifest.id}`)}]`
if (!bundle.includes(expectedKey)) {
  // The single most common packaging mistake: the manifest id was changed
  // after the last build, so the bundle still registers under the old key and
  // the loader would find nothing.
  fail(`${basename(bundlePath)} does not register ${expectedKey} — rebuild after changing the manifest id`)
}

const files = [
  { name: 'powerdesk.json', data: Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, 'utf8') },
  { name: manifest.entry, data: bundle },
]
const archive = gzipSync(tar(files), { level: 9 })
const target = outPath !== undefined
  ? resolve(outPath)
  : join(dir, `${manifest.id}-${manifest.version ?? '0.0.0'}.tgz`)
writeFileSync(target, archive)

console.log(`packed ${target}`)
console.log(`  id      ${manifest.id}`)
console.log(`  title   ${manifest.title}`)
console.log(`  entry   ${manifest.entry} (${bundle.length} bytes)`)
console.log(`  size    ${archive.length} bytes`)
console.log(`  sha256  ${createHash('sha256').update(archive).digest('hex')}`)
console.log('\nUpload it from DSH Settings → Powerdesk → Extensions.')
