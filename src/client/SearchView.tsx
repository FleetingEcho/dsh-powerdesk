/**
 * The Search tab: content search over the session's cwd via ripgrep (see
 * search-api.ts / search-deps.ts on the host half). A debounced query box
 * (mirrors BrowserView's `.browserBar`/`.browserInput`) drives `api.
 * searchGrep`, results are grouped by file (reusing `.explorerRow`/
 * `.explorerName`/`.explorerDir` from FileExplorer.tsx's row styling),
 * clicking a match opens it in the editor at that line via `onOpenFileAtLine`
 * (service.openFileAtLine → CodeEditor's `initialLine`).
 *
 * Deliberately NOT lazy-chunked: unlike Explorer/Editor/Terminal, this view
 * has no heavy dependency (no CodeMirror, no WASM renderer) — it's plain
 * React + fetch, cheap enough to ship in the main bundle.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { Folder, Search as SearchGlyph } from 'lucide-react'
import { api, ResttyApiError, type SearchDepsStatus, type SearchFileResult, type SearchOptions } from './api.ts'
import { t } from './locales.ts'
import css from './sidebar.module.css'

export interface SearchViewProps {
  /** The session's cwd — the search root. */
  cwd?: string
  onOpenFileAtLine: (path: string, line: number) => void
}

type DepsMissing = Extract<SearchDepsStatus, { ok: false }>

type QueryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; files: SearchFileResult[]; truncated: boolean }
  | { status: 'error'; message: string }
  | { status: 'deps-missing'; info: DepsMissing }

const DEBOUNCE_MS = 250

function basenameOf(path: string): string {
  const trimmed = path.replace(/[/\\]+$/, '')
  const idx = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
  return idx >= 0 ? trimmed.slice(idx + 1) : trimmed
}

/** Split `text` into plain/highlighted runs from ripgrep's [start,end) byte ranges. */
function renderHighlighted(text: string, ranges: [number, number][]): ReactNode[] {
  if (ranges.length === 0) return [text]
  const sorted = [...ranges].sort((a, b) => a[0] - b[0])
  const parts: ReactNode[] = []
  let cursor = 0
  sorted.forEach(([start, end], i) => {
    if (start > cursor) parts.push(text.slice(cursor, start))
    parts.push(<mark key={i} className={css.searchMatchHighlight}>{text.slice(start, end)}</mark>)
    cursor = Math.max(cursor, end)
  })
  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

/** One file's matches: a non-interactive group header + its match rows. */
function FileGroup(props: { result: SearchFileResult; onOpenFileAtLine: (path: string, line: number) => void }): ReactNode {
  const { result, onOpenFileAtLine } = props
  return (
    <div className={css.searchGroup}>
      <div className={css.explorerRow} title={result.path}>
        <Folder size={14} aria-hidden="true" />
        <span className={css.explorerName}>{basenameOf(result.path)}</span>
        <span className={css.explorerCopied}>{result.matches.length}</span>
      </div>
      {result.matches.map((match, i) => (
        <div
          key={`${String(match.line)}:${String(i)}`}
          className={css.searchMatchRow}
          role="button"
          tabIndex={0}
          onClick={() => { onOpenFileAtLine(result.path, match.line) }}
          onKeyDown={(event) => { if (event.key === 'Enter') onOpenFileAtLine(result.path, match.line) }}
        >
          <span className={css.searchMatchLine}>{match.line}</span>
          <span className={css.searchMatchText}>{renderHighlighted(match.text, match.ranges)}</span>
        </div>
      ))}
    </div>
  )
}

export function SearchView(props: SearchViewProps): ReactNode {
  const { cwd, onOpenFileAtLine } = props
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<Required<SearchOptions>>({ matchCase: false, wholeWord: false, useRegex: false })
  const [state, setState] = useState<QueryState>({ status: 'idle' })
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    const trimmed = query.trim()
    if (trimmed === '') {
      setState({ status: 'idle' })
      return
    }
    setState({ status: 'loading' })
    const controller = new AbortController()
    abortRef.current = controller
    const timer = window.setTimeout(() => {
      api.searchGrep(cwd ?? '.', trimmed, options, controller.signal).then((result) => {
        if (controller.signal.aborted) return
        setState({ status: 'ready', files: result.files, truncated: result.truncated })
      }).catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof ResttyApiError && error.code === 'search-deps-missing') {
          api.searchDeps().then((info) => {
            if (info.ok === false) setState({ status: 'deps-missing', info })
          }).catch(() => { setState({ status: 'error', message: error.message }) })
          return
        }
        setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
      })
    }, DEBOUNCE_MS)
    return () => { window.clearTimeout(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, cwd, options.matchCase, options.wholeWord, options.useRegex])

  return (
    <div className={css.explorer}>
      <div className={css.browserBar}>
        <SearchGlyph size={14} aria-hidden="true" />
        <input
          className={css.browserInput}
          type="text"
          value={query}
          placeholder={t('searchPlaceholder')}
          onChange={(event) => { setQuery(event.target.value) }}
          autoFocus
        />
        <div className={css.searchModifiers}>
          <button
            type="button"
            className={clsx(css.searchModifierButton, options.matchCase && css.explorerPillActive)}
            title={t('searchMatchCase')}
            aria-label={t('searchMatchCase')}
            aria-pressed={options.matchCase}
            onClick={() => { setOptions(o => ({ ...o, matchCase: !o.matchCase })) }}
          >
            Aa
          </button>
          <button
            type="button"
            className={clsx(css.searchModifierButton, options.wholeWord && css.explorerPillActive)}
            title={t('searchWholeWord')}
            aria-label={t('searchWholeWord')}
            aria-pressed={options.wholeWord}
            onClick={() => { setOptions(o => ({ ...o, wholeWord: !o.wholeWord })) }}
          >
            <span className={css.searchModifierUnderline}>ab</span>
          </button>
          <button
            type="button"
            className={clsx(css.searchModifierButton, options.useRegex && css.explorerPillActive)}
            title={t('searchUseRegex')}
            aria-label={t('searchUseRegex')}
            aria-pressed={options.useRegex}
            onClick={() => { setOptions(o => ({ ...o, useRegex: !o.useRegex })) }}
          >
            .*
          </button>
        </div>
      </div>
      <div className={css.explorerBody}>
        {state.status === 'idle' && <div className={css.explorerEmpty}>{t('searchNoQuery')}</div>}
        {state.status === 'loading' && <div className={css.explorerEmpty}>{t('loading')}</div>}
        {state.status === 'error' && <div className={css.explorerError}>{state.message}</div>}
        {state.status === 'deps-missing' && <SearchDepsBanner info={state.info} />}
        {state.status === 'ready' && (
          state.files.length === 0 ? (
            <div className={css.explorerEmpty}>{t('searchNoResults')}</div>
          ) : (
            <>
              <div className={css.searchSummary}>
                {t('searchResultsSummary', {
                  matches: String(state.files.reduce((sum, f) => sum + f.matches.length, 0)),
                  files: String(state.files.length),
                })}
                {state.truncated ? t('searchTruncated', { matches: String(state.files.reduce((sum, f) => sum + f.matches.length, 0)) }) : ''}
              </div>
              {state.files.map(result => (
                <FileGroup key={result.path} result={result} onOpenFileAtLine={onOpenFileAtLine} />
              ))}
            </>
          )
        )}
      </div>
    </div>
  )
}

/** Deps-missing banner — reuses ResttyTerminal.tsx's `.terminalDeps*` classes
 *  verbatim (also defined in this same sidebar.module.css), no new CSS. */
function SearchDepsBanner(props: { info: DepsMissing }): ReactNode {
  const { info } = props
  return (
    <div className={css.terminalDepsBanner}>
      <div className={css.terminalDepsTitle}>{t('searchDepsFailed')}</div>
      <div className={css.terminalDepsHint}>{t('searchDepsHint')}</div>
      <div className={css.terminalDepsCommandRow}>
        <pre className={css.terminalRepairCommand}>{info.command}</pre>
      </div>
      {info.note !== undefined && <div className={css.terminalDepsNote}>{info.note}</div>}
    </div>
  )
}
