# hello-powerdesk

A minimal example Powerdesk extension — a smoke test for the extension
pipeline. If it renders as a sidebar tab and the button counts up when
clicked, the whole chain works: upload → unpack → manifest parse → chunk
load → tab register → mount → props → hooks → render.

## What it proves

- **Tab registration**: it appears in the `+` card page (icon 👋, "Hello
  Powerdesk") and opens as a tab.
- **Props received**: it reads `tab.id`, `tab.type`, `scope.sessionId`,
  `scope.cwd`, and `visible` from the host and displays them — so you can
  see the host actually passed the tab component props.
- **Hooks work**: `useState` drives the counter — proves the extension is
  using the **host's** React (not a bundled second copy, which would throw
  on every hook call). `react` is marked `external` in `tsdown.config.ts`.
- **Theme tokens**: styles use `var(--dsw-alias-*)` tokens, so the card
  follows the user's light/dark theme automatically.

## Build + pack

```sh
cd examples/hello-powerdesk
pnpm install        # build deps (react types, tsdown, typescript)
pnpm typecheck      # optional
pnpm build          # → dist/bundle.js
pnpm run pack       # → hello-powerdesk-0.0.0.tgz  (the file you upload)
```

`pnpm run pack` runs `node ../../scripts/pack-extension.mjs .`, which
reads `powerdesk.json`, validates it the way the host does, checks that
`dist/bundle.js` registers the `ext:hello-powerdesk` chunk key, and writes
a gzipped tar whose root contains exactly `powerdesk.json` + `bundle.js`.

## Install

Upload `hello-powerdesk-0.0.0.tgz` from **DSH Settings → Powerdesk →
Extensions**. The tab then appears in the `+` card page.

> An extension runs with the same privileges as the page — only install
> extensions you trust. This one does nothing but render and count clicks.
