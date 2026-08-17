import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // jsdom covers the DOM-touching units (theme tokens, localStorage prefs,
    // MutationObserver scheme flips) and is harmless for the pure-logic specs.
    environment: 'jsdom',
    globals: false,
    include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
    coverage: { reporter: ['text'], include: ['src/**/*.ts'] },
  },
})
