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
 * a `CalendarApp` with a `render(el)` method. The render is split across two
 * effects: the init effect creates the calendar (after loading deps + events)
 * and sets state to 'ready'; a second effect renders it into the container —
 * which only mounts once state is 'ready'. Calling `render()` while the
 * component is still showing the loading placeholder would pass a null ref
 * (the container div isn't in the DOM yet) and silently skip the render.
 *
 * CRUD is wired through the calendar's `onEventUpdate` callback (drag-resize →
 * DB update) plus a "New event" affordance and `onEventClick` → confirm-delete;
 * each mutation syncs to SQLite via the API, with the DB as source of truth
 * (a failed mutation refetches and reconciles).
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

  // ── Effect 1: init — load deps + events, create the calendar instance ──────
  // Does NOT call calendar.render(): the container div only exists once state
  // becomes 'ready' (the early returns for loading/error render different JSX),
  // so rendering here would pass a null ref. The render happens in Effect 2.
  useEffect(() => {
    if (!visible) return
    let cancelled = false

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
      // 3. Create the schedule-x calendar (vanilla, no React adapter).
      const calendar = createCalendar({
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
            }).catch(() => { reconcile(calendarRef.current) })
          },
          // Click an event → confirm + delete (DB is source of truth).
          onEventClick: (event: CalendarEventExternal) => {
            const id = String(event.id)
            const label = event.title ?? t('calendarUntitledEvent')
            if (window.confirm(t('calendarDeleteConfirm', { title: label }))) {
              api.calendarDelete(id).then((result) => {
                if (result.changes > 0) calendarRef.current?.events.remove(id)
              }).catch(() => { reconcile(calendarRef.current) })
            }
          },
        },
      })
      if (cancelled) {
        calendar.destroy()
        return
      }
      calendarRef.current = calendar
      // State change → re-render shows the container div → Effect 2 renders.
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
      calendarRef.current?.destroy()
      calendarRef.current = null
    }
  }, [visible])

  // ── Effect 2: render the calendar into the container once it's mounted ────
  // Runs after the 'ready' re-render commits the container div to the DOM, so
  // containerRef.current is set. This is the fix for the "calendar never
  // appears" bug: calling render() in Effect 1 passed a null ref because the
  // container div wasn't in the DOM yet (the loading placeholder was showing).
  useEffect(() => {
    if (state.status !== 'ready') return
    const cal = calendarRef.current
    const el = containerRef.current
    if (cal !== null && el !== null) {
      cal.render(el)
    }
  }, [state.status])

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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ padding: '6px 8px', flex: '0 0 auto' }}>
        <button type="button" className={css.terminalRetry} onClick={createEvent}>
          {t('calendarNewEvent')}
        </button>
      </div>
      {/* schedule-x's .sx__calendar-wrapper sets height:100%, so this container
          needs a definite height. flex:1 (basis 0) breaks the circular height
          dependency that flex-basis:auto would create (container needs content
          height, content needs container height → both collapse to 0). */}
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }} />
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
