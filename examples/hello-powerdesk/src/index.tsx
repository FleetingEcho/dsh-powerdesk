/**
 * Hello Powerdesk — a minimal example extension that proves the whole
 * extension contract works end to end.
 *
 * It mounts as a sidebar tab and exercises everything an extension needs to:
 *  - receives its {@link TabComponentProps} (scope + visibility),
 *  - uses React hooks (useState — proves the host's React is shared, not a
 *    bundled second copy that would throw on every hook call),
 *  - reads DSH theme tokens (so it follows the user's light/dark choice),
 *  - renders an interactive counter (proves events + re-render work).
 *
 * If this renders and the button counts up when clicked, the extension
 * pipeline is healthy: upload → unpack → manifest parse → chunk load → tab
 * register → mount → props → hooks → render.
 */
import { useState, type ReactNode } from 'react'

/**
 * Every tab component receives this. `ctx` and `store` are the plugin's
 * internals — typed loosely here so the example has no dependency on
 * dsh-powerdesk's private types. See templates/extension for the full set.
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

export default function HelloPowerdesk({ scope, tab, visible }: TabComponentProps): ReactNode {
  const [count, setCount] = useState(0)
  const mounted = useState(() => Date.now())[0]

  return (
    <div
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h3
          style={{
            margin: 0,
            font: 'var(--dsw-font-s-strong-14)',
            color: 'var(--dsw-alias-label-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span aria-hidden="true">👋</span> Hello Powerdesk
        </h3>
        <p style={{ margin: 0, font: 'var(--dsw-font-xxs-12)', color: 'var(--dsw-alias-label-tertiary)' }}>
          A minimal example extension — if you can read this and the button
          counts up, the extension pipeline works.
        </p>
      </header>

      {/* Props receipt + visibility plumbing. Reads DSH theme tokens so it
          follows light/dark automatically. */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: 10,
          borderRadius: 8,
          border: '1px solid var(--dsw-alias-border-l1)',
          background: 'var(--dsw-alias-bg-layer-1)',
        }}
      >
        <Row label="tab id" value={tab.id} />
        <Row label="tab type" value={tab.type} />
        <Row label="session" value={scope.sessionId} mono />
        <Row label="cwd" value={scope.cwd ?? '(none)'} mono />
        <Row
          label="visible"
          value={visible ? 'yes' : 'no'}
          tone={visible ? 'success' : 'muted'}
        />
        <Row label="mounted at" value={new Date(mounted).toLocaleTimeString()} mono />
      </section>

      {/* Interactive state — proves events + re-render + the host's React. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          onClick={() => { setCount(n => n + 1) }}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid var(--dsw-alias-border-l2)',
            background: 'var(--dsw-alias-bg-layer-1)',
            color: 'var(--dsw-alias-label-primary)',
            cursor: 'pointer',
            font: 'var(--dsw-font-s-14)',
          }}
        >
          clicked {count} {count === 1 ? 'time' : 'times'}
        </button>
        <button
          type="button"
          onClick={() => { setCount(0) }}
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid var(--dsw-alias-border-l1)',
            background: 'transparent',
            color: 'var(--dsw-alias-label-tertiary)',
            cursor: 'pointer',
            font: 'var(--dsw-font-xxs-12)',
          }}
        >
          reset
        </button>
      </div>
    </div>
  )
}

/** One label/value row, using theme tokens. `tone` tints the value. */
function Row({
  label,
  value,
  mono,
  tone,
}: {
  label: string
  value: string
  mono?: boolean
  tone?: 'success' | 'muted'
}): ReactNode {
  const color =
    tone === 'success'
      ? 'var(--dsw-alias-state-success-primary)'
      : tone === 'muted'
        ? 'var(--dsw-alias-label-tertiary)'
        : 'var(--dsw-alias-label-secondary)'
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', minWidth: 0 }}>
      <span
        style={{
          flex: 'none',
          width: 64,
          font: 'var(--dsw-font-xxs-12)',
          color: 'var(--dsw-alias-label-tertiary)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          minWidth: 0,
          font: mono ? 'var(--dsw-font-markdown-code-block-small)' : 'var(--dsw-font-xxs-12)',
          color,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={value}
      >
        {value}
      </span>
    </div>
  )
}
