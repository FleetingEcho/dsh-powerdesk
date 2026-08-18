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
 * Temporal boundary: the SQLite store holds naive ISO datetime strings
 * (e.g. '2026-08-18T10:00:00') with NO timezone — they're local wall-clock
 * times. schedule-x v4.6.1 requires `Temporal.ZonedDateTime` or
 * `Temporal.PlainDate` for event start/end (its CalendarEventBuilder calls
 * `.withTimeZone()` on them; a string has no such method and would throw
 * "[Schedule-X error]: Event start time needs to be a Temporal.ZonedDateTime
 * or Temporal.PlainDate."). So we convert at both boundaries:
 *  - API string → schedule-x: `toTemporal(iso)` wraps the string with the
 *    local timezone and parses to a `Temporal.ZonedDateTime` (date-only
 *    strings fall back to `Temporal.PlainDate` for all-day events).
 *  - schedule-x → API string: `toIso(temporal)` extracts the naive local
 *    wall-clock string back out (`.toPlainDateTime().toString()` for ZDT,
 *    `.toString()` for PlainDate).
 * The calendar is configured with `timezone: Temporal.Now.timeZoneId()` so
 * it renders in the user's local time, matching the naive strings we store.
 *
 * CRUD is wired through the calendar's `onEventUpdate` callback (drag-resize →
 * DB update) plus a "New event" affordance and `onEventClick` → confirm-delete;
 * each mutation syncs to SQLite via the API, with the DB as source of truth
 * (a failed mutation refetches and reconciles).
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
import { Temporal } from 'temporal-polyfill'
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

/** The user's local IANA timezone (e.g. 'America/Vancouver'); resolved once. */
const LOCAL_TIMEZONE = Temporal.Now.timeZoneId()

/**
 * Convert a naive ISO string from the SQLite store to a schedule-x Temporal
 * value. A datetime string with a time component ('2026-08-18T10:00:00')
 * becomes a `Temporal.ZonedDateTime` in the local timezone; a date-only string
 * ('2026-08-18') becomes a `Temporal.PlainDate` for an all-day event.
 */
function toTemporal(iso: string): Temporal.ZonedDateTime | Temporal.PlainDate {
  if (iso.includes('T')) {
    return Temporal.ZonedDateTime.from(`${iso}[${LOCAL_TIMEZONE}]`)
  }
  return Temporal.PlainDate.from(iso)
}

/**
 * Convert a schedule-x Temporal value back to a naive ISO string for the
 * SQLite store. `Temporal.ZonedDateTime` → local wall-clock datetime
 * (`.toPlainDateTime().toString()`); `Temporal.PlainDate` → date string.
 */
function toIso(value: Temporal.ZonedDateTime | Temporal.PlainDate): string {
  if (value instanceof Temporal.ZonedDateTime) {
    return value.toPlainDateTime().toString()
  }
  return value.toString()
}

/** Pad a number to 2 digits (for building local-time ISO strings). */
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/** Local wall-clock ISO (yyyy-MM-ddTHH:mm) for "now rounded up to the next
 *  hour". Uses local getters (not toISOString, which would give UTC). */
function nextHourIso(): string {
  const d = new Date()
  d.setMinutes(0, 0, 0)
  d.setHours(d.getHours() + 1)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

/** Local wall-clock ISO one hour after the given yyyy-MM-ddTHH:mm. */
function plusOneHour(iso: string): string {
  const zdt = Temporal.ZonedDateTime.from(`${iso}[${LOCAL_TIMEZONE}]`)
  return zdt.add({ hours: 1 }).toPlainDateTime().toString()
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
      // 2. Load persisted events from the SQLite store and convert the naive
      // ISO strings to Temporal values schedule-x requires.
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
      const sxEvents = events.map((e) => ({
        id: e.id,
        ...(e.title !== undefined ? { title: e.title } : {}),
        start: toTemporal(e.start),
        end: toTemporal(e.end),
        ...(e.location !== undefined ? { location: e.location } : {}),
        ...(e.description !== undefined ? { description: e.description } : {}),
        ...(e.calendarId !== undefined ? { calendarId: e.calendarId } : {}),
      }) as unknown as CalendarEventExternal)
      // 3. Create the schedule-x calendar (vanilla, no React adapter) in the
      // user's local timezone so rendered times match the stored naive strings.
      const calendar = createCalendar({
        views: [viewMonthGrid, viewWeek, viewDay],
        events: sxEvents,
        isDark: isDarkScheme(),
        timezone: LOCAL_TIMEZONE,
        callbacks: {
          // Drag-resize / drag-move: schedule-x already updated its internal
          // state; we convert the Temporal values back to naive ISO strings
          // and persist to SQLite.
          onEventUpdate: (event: CalendarEventExternal) => {
            const id = String(event.id)
            api.calendarUpdate({
              id,
              ...(event.title !== undefined ? { title: event.title } : {}),
              start: toIso(event.start as Temporal.ZonedDateTime | Temporal.PlainDate),
              end: toIso(event.end as Temporal.ZonedDateTime | Temporal.PlainDate),
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
    const end = plusOneHour(start)
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: title === '' ? t('calendarUntitledEvent') : title,
      start,
      end,
    }
    api.calendarCreate(event).then(() => {
      // Convert to the Temporal value schedule-x expects before adding.
      calendarRef.current?.events.add({
        id: event.id,
        title: event.title,
        start: toTemporal(event.start),
        end: toTemporal(event.end),
      } as unknown as CalendarEventExternal)
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
    calendar.events.set(
      result.events.map((e) => ({
        id: e.id,
        ...(e.title !== undefined ? { title: e.title } : {}),
        start: toTemporal(e.start),
        end: toTemporal(e.end),
        ...(e.location !== undefined ? { location: e.location } : {}),
        ...(e.description !== undefined ? { description: e.description } : {}),
        ...(e.calendarId !== undefined ? { calendarId: e.calendarId } : {}),
      }) as unknown as CalendarEventExternal),
    )
  } catch { /* a failed reconcile leaves the local view as-is; next open refetches */ }
}
