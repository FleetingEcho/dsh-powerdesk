/**
 * The editor tab: a CodeMirror 6 text editor over one file (`tab.path`).
 * Registered as the 'editor' tab type — `service.openFile(scope, path)` (see
 * service.ts) hardcodes that type id, so the descriptor registering this
 * component MUST keep `id: 'editor'`. Loads via fs.read, saves via fs.write
 * (Cmd/Ctrl+S); the tab header shows a dirty dot while unsaved edits exist.
 *
 * The theme comes from the global prefs (`editorTheme`, edited in the
 * Settings → Powerdesk appearance panel; palettes live in
 * {@link ./editor-theme.ts}). A pref change — or an app-scheme flip while
 * the pref follows the scheme — re-themes the MOUNTED view live through
 * `StateEffect.reconfigure`, which preserves the doc, the selection, and the
 * undo history (it is a pure appearance swap, not a reload).
 *
 * Lives in the 'editor' lazy chunk (CodeMirror + its language packages are
 * a few hundred KB) — never import this from the core client bundle.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorSelection, EditorState, StateEffect, type Extension } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting, type TagStyle } from '@codemirror/language'
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
import { editorThemeSpec, resolveEditorThemeId, type EditorThemeSpec } from './editor-theme.ts'
import { isDarkScheme, subscribeColorScheme } from './theme.ts'
import { useTerminalPrefs } from './useTerminalPrefs.ts'
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
 * Build the CodeMirror theme extensions (base surface + syntax highlighting)
 * for one theme spec. Hand-rolled as a plain `EditorView.theme` +
 * `HighlightStyle` rather than pulling in `@uiw/codemirror-theme-*`: those
 * packages' CJS builds require `@babel/runtime` helpers that don't resolve in
 * this browser bundle (no Node module resolution at runtime), and their ESM
 * builds weren't picked up by the bundler's export-conditions resolution
 * either. The palettes themselves live in {@link ./editor-theme.ts} (pure
 * data, unit-testable without CodeMirror); this function just materializes
 * one spec into extensions. A theme is fixed regardless of the app's own
 * light/dark scheme — the user picks a palette, not "this palette when dark".
 */
function themeExtensions(spec: EditorThemeSpec): readonly [Extension, Extension] {
  const { base, tokens } = spec
  // Rule ORDER MATTERS: at equal specificity the later rule wins, so the
  // link-specific rule must come AFTER the operator group (which also tags
  // `tags.link` with the operator color) — the same ordering as the original
  // hand-rolled Dracula list this generalizes.
  const rules: TagStyle[] = []
  if (tokens.keyword !== undefined) rules.push({ tag: tags.keyword, color: tokens.keyword })
  rules.push({ tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: base.foreground })
  if (tokens.function !== undefined) rules.push({ tag: [tags.function(tags.variableName), tags.labelName], color: tokens.function })
  if (tokens.constant !== undefined) rules.push({ tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: tokens.constant })
  rules.push({ tag: [tags.definition(tags.name), tags.separator], color: base.foreground })
  if (tokens.type !== undefined) rules.push({ tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: tokens.type })
  if (tokens.operator !== undefined) rules.push({ tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)], color: tokens.operator })
  if (tokens.comment !== undefined) rules.push({ tag: [tags.meta, tags.comment], color: tokens.comment })
  rules.push({ tag: tags.strong, fontWeight: 'bold' })
  rules.push({ tag: tags.emphasis, fontStyle: 'italic' })
  rules.push({ tag: tags.strikethrough, textDecoration: 'line-through' })
  if (tokens.link !== undefined) rules.push({ tag: tags.link, color: tokens.link, textDecoration: 'underline' })
  if (tokens.heading !== undefined) rules.push({ tag: tags.heading, fontWeight: 'bold', color: tokens.heading })
  if (tokens.atom !== undefined) rules.push({ tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: tokens.atom })
  if (tokens.string !== undefined) rules.push({ tag: [tags.processingInstruction, tags.string, tags.inserted], color: tokens.string })
  if (tokens.invalid !== undefined) rules.push({ tag: tags.invalid, color: tokens.invalid })
  return [
    EditorView.theme({
      '&': { height: '100%', backgroundColor: base.background, color: base.foreground },
      '.cm-content': { caretColor: base.caret, fontFamily: 'var(--ds-font-family-code)' },
      '.cm-cursor, .cm-dropCursor': { borderLeftColor: base.caret },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: base.selection },
      '.cm-activeLine': { backgroundColor: base.activeLine },
      '.cm-gutters': { backgroundColor: base.gutterBackground, color: base.gutterForeground, border: 'none' },
      '.cm-activeLineGutter': { backgroundColor: base.activeLineGutter },
      '.cm-selectionMatch': { backgroundColor: base.selection },
    }, { dark: spec.dark }),
    syntaxHighlighting(HighlightStyle.define(rules)),
  ]
}

/**
 * The FULL extension list for a freshly-built (or reconfigured) editor view.
 * Module-scoped (not a component closure) so the mount effect and the
 * live-retheme effect build identical state from the same source — a
 * reconfigure that silently dropped the keymap or the dirty listener would
 * break save/unsaved reporting.
 *
 * @param path - the open file (drives the language extension).
 * @param themePref - the raw stored theme pref (`'auto'` / a preset id).
 * @param saveFn - the Cmd/Ctrl+S handler.
 * @param onDocChange - called with the new doc text on every doc change.
 */
function editorExtensions(path: string, themePref: string, saveFn: () => void, onDocChange: (content: string) => void): Extension[] {
  const spec = editorThemeSpec(resolveEditorThemeId(themePref, isDarkScheme()))
  return [
    basicSetup,
    ...themeExtensions(spec),
    ...languageFor(path),
    // Soft-wrap long lines instead of relying on horizontal scroll:
    // this editor's main use is Notes (prose/markdown), where
    // horizontal scrolling to read a long line is much worse than
    // wrapping. Applies to code files too — a bare CSS/JS line
    // rarely runs long enough for wrapping to hurt readability.
    EditorView.lineWrapping,
    keymap.of([{ key: 'Mod-s', run: (): boolean => { saveFn(); return true } }]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) onDocChange(update.state.doc.toString())
    }),
  ]
}

type LoadState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready' }

export function CodeEditor({ path, initialLine, onDirtyChange }: CodeEditorProps): ReactNode {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)
  const savedContentRef = useRef('')
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // --- Theme (Settings → Powerdesk → Appearance → "Codemirror theme") ----
  const prefs = useTerminalPrefs()
  const themeId = prefs.editorTheme
  // Latest-value refs: the mount effect builds the view after an awaited
  // fsRead, and the live-retheme effects read through these, so a prefs
  // change landing mid-load (or a path change reusing a stale closure) must
  // never see a stale theme/file. Assigning during render is the standard
  // "latest value" pattern for refs a component owns.
  const themeIdRef = useRef(themeId)
  themeIdRef.current = themeId
  const pathRef = useRef(path)
  pathRef.current = path
  // The CONCRETE theme id the mounted view was (re)built with — the guard
  // for both live-retheme paths (a pref change, or a scheme flip while the
  // pref follows the scheme). Null until the first view is built.
  const viewThemeIdRef = useRef<string | null>(null)

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

  /**
   * Re-theme the MOUNTED view for a given raw pref value. A
   * `StateEffect.reconfigure` swap — the doc, selection, and undo history
   * survive (rebuilding the state would drop them). No-ops while no view is
   * mounted (the mount effect builds one with the current pref) and while
   * the view already carries the resolved theme.
   */
  const applyTheme = (themePref: string): void => {
    const view = viewRef.current
    if (view === null) return
    const concrete = resolveEditorThemeId(themePref, isDarkScheme())
    if (viewThemeIdRef.current === concrete) return
    viewThemeIdRef.current = concrete
    view.dispatch({
      effects: StateEffect.reconfigure.of(
        editorExtensions(pathRef.current, themePref, save, (content) => { setDirty(content !== savedContentRef.current) }),
      ),
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
      // Build with the LATEST theme pref (the ref, not the mount-render
      // closure — a prefs write may have landed while fsRead was in flight)
      // and record the concrete theme the view now carries.
      const builtThemePref = themeIdRef.current
      viewRef.current = new EditorView({
        parent: host,
        state: EditorState.create({
          doc: result.content,
          extensions: editorExtensions(path, builtThemePref, save, (content) => { setDirty(content !== savedContentRef.current) }),
        }),
      })
      viewThemeIdRef.current = resolveEditorThemeId(builtThemePref, isDarkScheme())
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

  // Live re-theme when the stored pref CHANGES (no remount — a
  // StateEffect.reconfigure preserves the doc, selection, and undo history).
  // `applyTheme` is deliberately not a dep (it gains a fresh identity every
  // render): the guard inside it no-ops when the view already carries the
  // resolved theme, so the extra re-runs it would cause are harmless. On a
  // `path` change the mount effect rebuilds the view with the CURRENT pref
  // and sets viewThemeIdRef, so this effect's guard no-ops for that too.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { applyTheme(themeId) }, [themeId])

  // Live re-theme on an app-scheme flip while the pref follows the scheme
  // ('' / 'auto') — mirrors ResttyTerminal's subscribeColorScheme re-theme,
  // so "System default" tracks light/dark like the terminal's does.
  const followsScheme = themeId.trim() === '' || themeId.trim() === 'auto'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!followsScheme) return undefined
    return subscribeColorScheme(() => { applyTheme(themeIdRef.current) })
  }, [followsScheme])

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
