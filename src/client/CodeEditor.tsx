/**
 * The editor tab: a CodeMirror 6 text editor over one file (`tab.path`).
 * Registered as the 'editor' tab type — `service.openFile(scope, path)` (see
 * service.ts) hardcodes that type id, so the descriptor registering this
 * component MUST keep `id: 'editor'`. Loads via fs.read, saves via fs.write
 * (Cmd/Ctrl+S or the save button); the header shows a dirty dot while
 * unsaved edits exist.
 *
 * Lives in the 'editor' lazy chunk (CodeMirror + its language packages are
 * a few hundred KB) — never import this from the core client bundle.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorSelection, EditorState, type Extension } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { json } from '@codemirror/lang-json'
import { css as cssLang } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { markdown } from '@codemirror/lang-markdown'
import { rust } from '@codemirror/lang-rust'
import { yaml } from '@codemirror/lang-yaml'
import { api } from './api.ts'
import { t } from './locales.ts'
import css from './sidebar.module.css'

export interface CodeEditorProps {
  path: string
  visible: boolean
  /** Scroll to and select this 1-based line on mount, and again whenever it
   *  changes while the SAME file stays open (Search tab result clicks —
   *  see EditorTabView / service.openFileAtLine). */
  initialLine?: number
  /** Reports unsaved-changes state so the TAB ITSELF shows the indicator
   *  (see TabBar.tsx's `tab.meta.dirty` dot) — there is no in-pane header
   *  bar for this anymore. */
  onDirtyChange?: (dirty: boolean) => void
}

/** Move the cursor to (and center-scroll) a 1-based line, clamped to the doc. */
function jumpToLine(view: EditorView, line: number): void {
  const clamped = Math.max(1, Math.min(line, view.state.doc.lines))
  const pos = view.state.doc.line(clamped).from
  view.dispatch({
    selection: EditorSelection.cursor(pos),
    effects: EditorView.scrollIntoView(pos, { y: 'center' }),
  })
  view.focus()
}

/** Syntax highlighting extension by file extension; plain text otherwise
 *  (basicSetup's own default highlight style still applies). */
function languageFor(path: string): Extension[] {
  const ext = (path.split('.').pop() ?? '').toLowerCase()
  switch (ext) {
    case 'ts': case 'tsx': return [javascript({ jsx: ext === 'tsx', typescript: true })]
    case 'js': case 'jsx': case 'mjs': case 'cjs': return [javascript({ jsx: ext === 'jsx' })]
    case 'py': return [python()]
    case 'json': return [json()]
    case 'css': return [cssLang()]
    case 'html': case 'htm': return [html()]
    case 'md': case 'markdown': return [markdown()]
    case 'rs': return [rust()]
    case 'yml': case 'yaml': return [yaml()]
    default: return []
  }
}

/**
 * Dracula palette (the standard published color set — draculatheme.com),
 * hand-rolled as a plain EditorView.theme + HighlightStyle rather than
 * pulling in `@uiw/codemirror-theme-dracula`: that package's CJS build
 * requires `@babel/runtime` helpers that don't resolve in this browser
 * bundle (no Node module resolution at runtime), and its ESM build wasn't
 * being picked up by the bundler's export-conditions resolution either.
 * A fixed dark theme regardless of the app's own light/dark scheme — the
 * user asked for Dracula specifically, not "Dracula in dark mode only".
 */
const dracula: readonly [Extension, Extension] = [
  EditorView.theme({
    '&': { height: '100%', backgroundColor: '#282a36', color: '#f8f8f2' },
    '.cm-content': { caretColor: '#f8f8f2', fontFamily: 'var(--ds-font-family-code)' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#f8f8f2' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: '#44475a' },
    '.cm-activeLine': { backgroundColor: '#44475a55' },
    '.cm-gutters': { backgroundColor: '#282a36', color: '#6272a4', border: 'none' },
    '.cm-activeLineGutter': { backgroundColor: '#44475a55' },
    '.cm-selectionMatch': { backgroundColor: '#44475a' },
  }, { dark: true }),
  syntaxHighlighting(HighlightStyle.define([
    { tag: tags.keyword, color: '#ff79c6' },
    { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: '#f8f8f2' },
    { tag: [tags.function(tags.variableName), tags.labelName], color: '#50fa7b' },
    { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#bd93f9' },
    { tag: [tags.definition(tags.name), tags.separator], color: '#f8f8f2' },
    { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#bd93f9' },
    { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)], color: '#ff79c6' },
    { tag: [tags.meta, tags.comment], color: '#6272a4' },
    { tag: tags.strong, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
    { tag: tags.link, color: '#8be9fd', textDecoration: 'underline' },
    { tag: tags.heading, fontWeight: 'bold', color: '#bd93f9' },
    { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#bd93f9' },
    { tag: [tags.processingInstruction, tags.string, tags.inserted], color: '#f1fa8c' },
    { tag: tags.invalid, color: '#ff5555' },
  ])),
]

type LoadState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready' }

export function CodeEditor({ path, initialLine, onDirtyChange }: CodeEditorProps): ReactNode {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)
  const savedContentRef = useRef('')
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const save = (): void => {
    // No Save BUTTON gates this anymore (Cmd/Ctrl+S only — see the keymap
    // below), so guard against overlapping writes from a rapid repeat press
    // here instead of relying on a disabled prop that no longer exists.
    if (saving) return
    const view = viewRef.current
    if (view === null) return
    const content = view.state.doc.toString()
    if (content === savedContentRef.current) return
    setSaving(true)
    setSaveError('')
    api.fsWrite(path, content).then(() => {
      savedContentRef.current = content
      setDirty(false)
      setSaving(false)
    }).catch((error: unknown) => {
      setSaving(false)
      setSaveError(error instanceof Error ? error.message : String(error))
    })
  }

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    setDirty(false)
    setSaveError('')
    api.fsRead(path).then((result) => {
      if (cancelled) return
      savedContentRef.current = result.content
      const host = hostRef.current
      if (host === null) return
      viewRef.current?.destroy()
      viewRef.current = new EditorView({
        parent: host,
        state: EditorState.create({
          doc: result.content,
          extensions: [
            basicSetup,
            ...dracula,
            ...languageFor(path),
            // Soft-wrap long lines instead of relying on horizontal scroll:
            // this editor's main use is Notes (prose/markdown), where
            // horizontal scrolling to read a long line is much worse than
            // wrapping. Applies to code files too — a bare CSS/JS line
            // rarely runs long enough for wrapping to hurt readability.
            EditorView.lineWrapping,
            keymap.of([{ key: 'Mod-s', run: (): boolean => { save(); return true } }]),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) setDirty(update.state.doc.toString() !== savedContentRef.current)
            }),
          ],
        }),
      })
      // Initial jump for a freshly-opened tab: by the time this mounts,
      // `service.openFileAtLine` has already set tab.meta.line synchronously
      // (openFile then updateTab, both before React's next render), so the
      // FIRST render already carries the right `initialLine` — captured here
      // via closure (this effect only re-runs on `path` change, by design;
      // a line change on an ALREADY-open file is handled by the separate
      // effect below instead, which doesn't force a reload).
      if (initialLine !== undefined) jumpToLine(viewRef.current, initialLine)
      setState({ status: 'ready' })
    }).catch((error: unknown) => {
      if (cancelled) return
      setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
    })
    return () => {
      cancelled = true
      viewRef.current?.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  // A search-result click on a file that is ALREADY open (same `path`, so
  // the mount effect above doesn't rerun and the view stays alive) still
  // needs the cursor to jump to the new match — `initialLine` changing is
  // exactly that signal. No-ops while the view hasn't mounted yet (the
  // mount effect's own inline jump above covers that first-paint case).
  useEffect(() => {
    if (initialLine === undefined) return
    const view = viewRef.current
    if (view === null) return
    jumpToLine(view, initialLine)
  }, [initialLine])

  // CodeMirror's own internal resize handling can miss layout changes that
  // happen to its container without the container's OWN size ever settling
  // at construction time — e.g. this tab was built while inactive (hidden
  // via display:none, which reports a 0×0 box to any observer) and only
  // later became visible, or the panel it lives in (the bottom panel, a
  // multi-pane split) resized/settled after mount. A ResizeObserver we own
  // on the host div, nudging `requestMeasure()` on every size change,
  // covers both cases — the standard pattern for CodeMirror 6 inside
  // dynamically sized or tab-hidden containers.
  useEffect(() => {
    const host = hostRef.current
    if (host === null) return
    const observer = new ResizeObserver(() => { viewRef.current?.requestMeasure() })
    observer.observe(host)
    return () => { observer.disconnect() }
  }, [])

  // Report unsaved-changes state up to the tab strip (TabBar.tsx's
  // `tab.meta.dirty` dot) instead of a persistent in-pane header bar.
  // `onDirtyChange` is deliberately NOT a dep: SplitPane.tsx's TabContent
  // passes a fresh inline closure every render, and calling it triggers a
  // store update that re-renders TabContent — including it here re-fires
  // the effect on THAT re-render (new closure identity) even though `dirty`
  // itself hasn't changed, an infinite loop (caught live as React error
  // #185 / "Maximum update depth exceeded").
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onDirtyChange?.(dirty) }, [dirty])

  return (
    <div className={css.editor}>
      {saveError !== '' && <div className={css.editorError}>{saveError}</div>}
      {state.status === 'loading' && <div className={css.editorPlaceholder}>{t('loading')}</div>}
      {state.status === 'error' && <div className={css.editorError}>{state.message}</div>}
      {/* `display: 'block'`, NOT 'flex' — this div is CodeMirror's mount
          parent (`hostRef`, passed as `EditorView({ parent })`). Toggling it
          to `display: 'flex'` would make it a flex CONTAINER, turning
          CodeMirror's own root (`.cm-editor`, itself `display: flex`) into
          a flex ITEM — flex items default to `flex-grow: 0`, so `.cm-editor`
          would size to its content's natural width (the longest line, sans
          wrapping) instead of stretching to fill, leaving a gap on the
          right. `.editorCm`'s OWN width already comes from `.editor`'s
          `align-items: stretch` (a flex ITEM, not container, of that
          column layout) — `block` here only needs to show/hide it. */}
      <div className={css.editorCm} style={{ display: state.status === 'ready' ? 'block' : 'none' }} ref={hostRef} />
    </div>
  )
}
