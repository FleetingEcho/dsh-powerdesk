/**
 * The Calendar tab: a schedule-x calendar (Month / Week / Day views) over
 * events persisted in a local SQLite DB via the host's
 * `/powerdesk/api/calendar.*` routes (see calendar-api.ts / rust-sqlite-deps.ts
 * on the host half). Built as a lazy chunk (`lib/client-calendar.js`, see
 * chunks/calendar.tsx + tsdown.config.ts) so schedule-x + preact +
 * temporal-polyfill only download on first calendar-open — not at plugin
 * startup, per the lazy-loading requirement.
 *
 * Mount model: vanilla schedule-x (NOT the `@schedule-x/react` adapter — it
 * lags the core 4.6 line and would pin us to 4.1). `createCalendar()` returns
 * a `CalendarApp` with a `render(el)` method; we append it to a ref'd div and
 * `destroy()` on unmount. CRUD is wired through the calendar's `onEventUpdate`
 * callback (drag-resize → DB update) plus a "New event" affordance and
 * `onEventClick` → confirm-delete; each mutation syncs to SQLite via the API,
 * with the DB as source of truth (a failed mutation refetches and reconciles).
 *
 * schedule-x's `CalendarEventExternal` types `start`/`end` as Temporal types
 * but accepts ISO strings at runtime (the documented usage); we cast at the
 * boundary since our wire type stores ISO strings.
 */
import { createElement, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  createCalendar,
  viewDay,
  viewMonthGrid,
  viewWeek,
  type CalendarApp,
  type CalendarEventExternal,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { api, ResttyApiError, type CalendarDepsStatus, type CalendarEvent } from './api.ts'
import { isDarkScheme, subscribeColorScheme } from './theme.ts'
import { t } from './locales.ts'
import css from './sidebar.module.css'

export interface CalendarViewProps {
  /** Forwarded by the tab shell so a hidden tab can skip rendering work. */
  visible?: boolean
}

type DepsMissing = Extract<CalendarDepsStatus, { ok: false }>

type ViewState =
  | { status: 'loading' }
  | { status: 'deps-missing'; info: DepsMissing }
  | { status: 'error'; message: string }
  | { status: 'ready' }

/** ISO datetime (yyyy-MM-ddTHH:mm) for "now rounded up to the next hour". */
function nextHourIso(): string {
  const d = new Date()
  d.setMinutes(0, 0, 0)
  d.setHours(d.getHours() + 1)
  return d.toISOString().slice(0, 16)
}

/** ISO datetime one hour after the given yyyy-MM-ddTHH:mm. */
function plusOneHour(iso: string): string {
  const d = new Date(`${iso}:00`)
  d.setHours(d.getHours() + 1)
  return d.toISOString().slice(0, 16)
}

/** A deps-missing repair banner (mirrors SearchView's SearchDepsBanner). */
function CalendarDepsBanner(props: { info: DepsMissing }): ReactNode {
  const { info } = props
  return (
    <div className={css.terminalDepsBanner}>
      <div className={css.terminalDepsTitle}>{t('calendarDepsFailed')}</div>
      <div className={css.terminalDepsHint}>{t('calendarDepsHint')}</div>
      <div className={css.terminalDepsCommandRow}>
        <pre className={css.terminalRepairCommand}>{info.command}</pre>
      </div>
      {info.note !== undefined && <div className={css.terminalDepsNote}>{info.note}</div>}
    </div>
  )
}

export function CalendarView(props: CalendarViewProps): ReactNode {
  const { visible = true } = props
  const containerRef = useRef<HTMLDivElement | null>(null)
  const calendarRef = useRef<CalendarApp | null>(null)
  const [state, setState] = useState<ViewState>({ status: 'loading' })

  useEffect(() => {
    if (!visible) return
    let cancelled = false
    let calendar: CalendarApp | null = null

    async function init(): Promise<void> {
      // 1. Check the native SQLite binary is present (mirrors search.deps).
      const deps = await api.calendarDeps()
      if (cancelled) return
      if (deps.ok === false) {
        setState({ status: 'deps-missing', info: deps })
        return
      }
      // 2. Load persisted events from the SQLite store.
      let events: CalendarEvent[]
      try {
        const result = await api.calendarList()
        if (cancelled) return
        events = result.events
      } catch (error) {
        if (cancelled) return
        setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
        return
      }
      // 3. Create + mount the schedule-x calendar (vanilla render, no React adapter).
      calendar = createCalendar({
        views: [viewMonthGrid, viewWeek, viewDay],
        events: events as unknown as CalendarEventExternal[],
        isDark: isDarkScheme(),
        callbacks: {
          // Drag-resize / drag-move: schedule-x already updated its internal
          // state; we persist the new values to SQLite.
          onEventUpdate: (event: CalendarEventExternal) => {
            const id = String(event.id)
            api.calendarUpdate({
              id,
              ...(event.title !== undefined ? { title: event.title } : {}),
              start: String(event.start),
              end: String(event.end),
              ...(event.location !== undefined ? { location: event.location } : {}),
              ...(event.description !== undefined ? { description: event.description } : {}),
              ...(event.calendarId !== undefined ? { calendarId: event.calendarId } : {}),
            }).catch(() => { reconcile(calendar) })
          },
          // Click an event → confirm + delete (DB is source of truth).
          onEventClick: (event: CalendarEventExternal) => {
            const id = String(event.id)
            const label = event.title ?? t('calendarUntitledEvent')
            if (window.confirm(t('calendarDeleteConfirm', { title: label }))) {
              api.calendarDelete(id).then((result) => {
                if (result.changes > 0) calendar?.events.remove(id)
              }).catch(() => { reconcile(calendar) })
            }
          },
        },
      })
      if (cancelled) {
        calendar.destroy()
        return
      }
      calendarRef.current = calendar
      if (containerRef.current !== null) calendar.render(containerRef.current)
      setState({ status: 'ready' })
    }

    init().catch((error: unknown) => {
      if (!cancelled) setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
    })

    // Re-theme on a light/dark scheme flip (mirrors CodeEditor's live re-theme).
    const unsubscribe = subscribeColorScheme(() => {
      try {
        calendarRef.current?.setTheme(isDarkScheme() ? 'dark' : 'light')
      } catch { /* setTheme is safe to call before render; ignore races */ }
    })

    return () => {
      cancelled = true
      unsubscribe()
      calendar?.destroy()
      calendarRef.current = null
    }
  }, [visible])

  /** Create a new 1-hour event (title via prompt; drag to move/resize). */
  function createEvent(): void {
    const title = window.prompt(t('calendarNewEventPrompt'), t('calendarUntitledEvent'))
    if (title === null) return
    const start = nextHourIso()
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: title === '' ? t('calendarUntitledEvent') : title,
      start,
      end: plusOneHour(start),
    }
    api.calendarCreate(event).then(() => {
      calendarRef.current?.events.add(event as unknown as CalendarEventExternal)
    }).catch((error: unknown) => {
      if (error instanceof ResttyApiError) {
        setState({ status: 'error', message: error.message })
      }
    })
  }

  if (state.status === 'loading') {
    return <div className={css.editorPlaceholder}>{t('loading')}</div>
  }
  if (state.status === 'deps-missing') {
    return <CalendarDepsBanner info={state.info} />
  }
  if (state.status === 'error') {
    return (
      <div className={css.editorError}>
        <span>{state.message}</span>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ padding: '6px 8px', flex: '0 0 auto' }}>
        <button type="button" className={css.terminalRetry} onClick={createEvent}>
          {t('calendarNewEvent')}
        </button>
      </div>
      <div ref={containerRef} style={{ flex: '1 1 auto', minHeight: 0, overflow: 'auto' }} />
    </div>
  )
}

/** Refetch all events from the DB and reconcile the calendar (source of truth). */
async function reconcile(calendar: CalendarApp | null): Promise<void> {
  if (calendar === null) return
  try {
    const result = await api.calendarList()
    calendar.events.set(result.events as unknown as CalendarEventExternal[])
  } catch { /* a failed reconcile leaves the local view as-is; next open refetches */ }
}
