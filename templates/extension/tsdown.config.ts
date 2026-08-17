/**
 * Build one Powerdesk extension into the chunk-factory shape the loader
 * expects:
 *
 *   globalThis.__dshPowerdeskChunks__ ||= {};
 *   globalThis.__dshPowerdeskChunks__["ext:<id>"] = (require) => { …exports };
 *
 * Two things make this work and are the reason this file exists instead of a
 * plain library build:
 *
 * 1. The registry key is read from `powerdesk.json`, so the manifest is the
 *    single source of truth for the id. The loader derives the same key from
 *    the same manifest — they cannot drift.
 * 2. `react` and the DSH client packages are EXTERNAL. The host resolves them
 *    through its own module table and passes them to your factory via
 *    `require`. Bundling your own React would give you a second copy with its
 *    own hook dispatcher, and every hook you call would throw.
 */
import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

const manifest = JSON.parse(readFileSync(new URL('./powerdesk.json', import.meta.url), 'utf8')) as {
  id: string
  entry?: string
}

/** Must mirror CLIENT_EXTERNALS in dsh-powerdesk's own tsdown.config.ts. */
const HOST_MODULES = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-runtime/client',
]

const CHUNK_KEY = `ext:${manifest.id}`

export default defineConfig({
  entry: { bundle: 'src/index.tsx' },
  outDir: 'dist',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: true,
  external: HOST_MODULES,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  inputOptions: {
    resolve: {
      conditionNames: ['browser', 'import', 'require', 'default'],
      mainFields: ['browser', 'module', 'main'],
    },
  },
  // Everything that is NOT a host module gets inlined: an extension is a
  // single self-contained script, so your own dependencies must be bundled.
  noExternal: (id: string) => (HOST_MODULES.includes(id) ? undefined : true),
  outputOptions: {
    entryFileNames: manifest.entry ?? 'bundle.js',
    banner: `globalThis.__dshPowerdeskChunks__ = globalThis.__dshPowerdeskChunks__ || {}; globalThis.__dshPowerdeskChunks__[${JSON.stringify(CHUNK_KEY)}] = (require) => {`,
    footer: 'return module.exports; };',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
    codeSplitting: false,
  },
})
