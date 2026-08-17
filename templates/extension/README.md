# Powerdesk extension template

A Powerdesk extension is one React component mounted as a sidebar tab.

## Quick start

```bash
cp -r templates/extension ~/my-extension
cd ~/my-extension
pnpm install
# Pick an id and a name — the id must be lowercase letters, digits and dashes.
$EDITOR powerdesk.json
pnpm build && pnpm pack
```

That writes `my-extension-0.0.0.tgz`. Upload it from **DSH Settings →
Powerdesk → Extensions**, then open it from the sidebar `+` menu.

Extensions must be enabled by the operator first — see the main README's
Extensions section for `extensionsEnabled`.

## Layout

| File | What it is |
|---|---|
| `powerdesk.json` | Manifest: id, title, icon, entry, export. The single source of truth for your id. |
| `src/index.tsx` | Your component. The default export is what gets mounted. |
| `tsdown.config.ts` | Build config. Wraps your code in the chunk-factory shape and keeps React external. |

## What your component receives

```ts
interface TabComponentProps {
  scope: { sessionId: string; cwd?: string }
  tab: { id: string; type: string; title: string; meta?: unknown }
  visible: boolean                       // active tab AND panel open
  onOpenFile?: (path: string) => void    // open a file in the sidebar editor
}
```

Pause timers, polling, and sockets when `visible` is false — a background tab
should cost nothing.

## Rules that matter

**Never bundle React.** It is external, and the host passes you its own copy.
A second React has its own hook dispatcher, and every hook you call throws.
The same applies to `react-dom` and the `@deepseek-ai/dsh-client-*` packages.

**Rebuild after changing the manifest id.** The registry key is baked into the
bundle at build time. `pnpm pack` checks this and refuses a stale bundle, so
you will not ship one by accident.

**Use the DSH theme tokens** (`var(--dsw-alias-label-primary)`,
`var(--dsw-alias-bg-layer-1)`, `var(--dsw-font-s-14)`, …) rather than
hard-coded colors, so your tab follows the user's light/dark choice.

**Your bundle is a single self-contained script.** Everything except the host
modules is inlined, so keep your dependency list small — the whole bundle is
downloaded on first open.

## Manifest fields

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | `^[a-z0-9][a-z0-9-]{0,63}$`. Becomes the directory, the URL segment, and the tab type `ext:<id>`. |
| `title` | yes | Tab label, up to 64 chars. |
| `icon` | no | Emoji or up to 4 characters. Rendered as text. |
| `entry` | no | Bundle file name, default `bundle.js`. Must be a plain `.js` name. |
| `export` | no | Which export to mount, default `default`. |
| `order` | no | Sort order in the `+` menu, ascending. |
| `single` | no | `true` = opening focuses the existing tab instead of adding another. |
| `apiVersion` | no | Manifest schema version, currently `1`. |
