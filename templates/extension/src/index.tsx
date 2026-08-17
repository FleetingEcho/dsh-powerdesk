/**
 * A Powerdesk extension: one React component mounted as a sidebar tab.
 *
 * The default export is what Powerdesk mounts (the export name is
 * `powerdesk.json`'s `export` field). React comes from the host — do NOT
 * bundle your own copy, or hooks will break; `react` is marked external in
 * tsdown.config.ts and resolved through the host's module table at load time.
 */
import { useState, type ReactNode } from 'react'

/**
 * Every tab component receives this. `ctx` and `store` are the plugin's
 * internals — typed loosely here so the template has no dependency on
 * dsh-powerdesk's private types.
 */
export interface TabComponentProps {
  /** The session this tab belongs to, and its working directory. */
  scope: { sessionId: string; cwd?: string }
  /** This tab's own record (id, type, title, and any `meta` you set). */
  tab: { id: string; type: string; title: string; meta?: unknown }
  /** True while this tab is the active one AND the panel is open. Pause
   *  polling, timers, and sockets when it is false. */
  visible: boolean
  /** Open a file in the sidebar editor. */
  onOpenFile?: (path: string) => void
  ctx?: unknown
  store?: unknown
}

export default function MyExtension({ scope, visible }: TabComponentProps): ReactNode {
  const [count, setCount] = useState(0)
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', boxSizing: 'border-box' }}>
      <h3 style={{ margin: 0, font: 'var(--dsw-font-s-strong-14)', color: 'var(--dsw-alias-label-primary)' }}>
        My Extension
      </h3>
      {/* Use the DSH theme tokens rather than hard-coded colors: they follow
          the user's light/dark choice automatically. */}
      <p style={{ margin: 0, font: 'var(--dsw-font-xxs-12)', color: 'var(--dsw-alias-label-secondary)' }}>
        session <code>{scope.sessionId}</code>
        {scope.cwd !== undefined && <> · cwd <code>{scope.cwd}</code></>}
        {' · '}{visible ? 'visible' : 'hidden'}
      </p>
      <button
        type="button"
        onClick={() => { setCount(n => n + 1) }}
        style={{
          alignSelf: 'flex-start',
          padding: '6px 12px',
          borderRadius: 8,
          border: '1px solid var(--dsw-alias-border-l2)',
          background: 'var(--dsw-alias-bg-layer-1)',
          color: 'var(--dsw-alias-label-primary)',
          cursor: 'pointer',
        }}
      >
        clicked {count} times
      </button>
    </div>
  )
}
