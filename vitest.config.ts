import { defineConfig, type Plugin } from 'vitest/config'

/**
 * Stub plain `.css` side-effect imports coming from inlined dependencies
 * (e.g. `katex/dist/katex.min.css`, pulled transitively by
 * `@deepseek-ai/dsh-client-ui-primitives`) so vitest's jsdom loader does not
 * throw "Unknown file extension .css". CSS Modules (`.module.css`) are left
 * to vitest's default handling (a class-name proxy) — only bare `.css`
 * side-effect imports are stubbed to an empty module.
 */
const stubPlainCss: Plugin = {
  name: 'stub-plain-css',
  enforce: 'pre',
  resolveId(source: string): string | null {
    if (source.endsWith('.css') && !source.endsWith('.module.css')) {
      return '\0plaincss:' + source
    }
    return null
  },
  load(id: string): string | null {
    if (id.startsWith('\0plaincss:')) {
      return 'export default {}'
    }
    return null
  },
}

export default defineConfig({
  test: {
    // jsdom covers the DOM-touching units (theme tokens, localStorage prefs,
    // MutationObserver scheme flips) and is harmless for the pure-logic specs.
    environment: 'jsdom',
    globals: false,
    include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
    coverage: { reporter: ['text'], include: ['src/**/*.ts'] },
    // Inlined deps are processed by vitest's esbuild optimizer; the stub
    // plugin above then neutralizes their bare .css imports.
    server: {
      deps: {
        inline: ['@deepseek-ai/dsh-client-ui-primitives', 'katex'],
      },
    },
  },
  plugins: [stubPlainCss],
})
