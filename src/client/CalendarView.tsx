/**
 * The Calendar tab: a FullCalendar (Month / Week / Day views) over events
 * persisted in a local SQLite DB via the host's `/powerdesk/api/calendar.*`
 * routes (see calendar-api.ts / rust-sqlite-deps.ts on the host half). Built
 * as a lazy chunk (`lib/client-calendar.js`, see chunks/calendar.tsx +
 * tsdown.config.ts) so FullCalendar only downloads on first calendar-open —
 * not at plugin startup, per the lazy-loading requirement.
 *
 * Library choice: FullCalendar replaced schedule-x (see git history) because
 * schedule-x gates drag-to-create ("draw" a new event by dragging empty grid
 * space) behind a paid Premium tier — everything else (drag-move, resize)
 * is free, but drag-to-create was the one feature actually asked for.
 * FullCalendar's `@fullcalendar/interaction` plugin ships drag-move, resize,
 * AND drag-to-create (`selectable` + `select`) as MIT-licensed core
 * features, no license key. Pinned to the 6.1.x line (not the 7.x line,
 * which is a very recent rewrite whose daygrid/timegrid/interaction plugins
 * haven't been republished to match yet — installing 7.x core with 6.x
 * plugins would mismatch peer deps).
 *
 * Mount model: the official `@fullcalendar/react` adapter (unlike
 * schedule-x, where we deliberately avoided its React adapter because it
 * lagged the core version line — FullCalendar's stays in lockstep). This is
 * a normal controlled React component: events live in this component's own
 * state (fetched once on mount, kept in sync by each CRUD callback), passed
 * straight into the `events` prop — no imperative `calendar.events.add()`
 * escape hatch needed the way schedule-x required.
 *
 * Time handling: FullCalendar's default `timeZone: 'local'` parses a
 * timezone-less ISO string (our SQLite store's naive wall-clock format,
 * e.g. '2026-08-18T10:00:00') as local time directly — no Temporal
 * conversion layer needed at all (schedule-x required one; see the removed
 * toTemporal/toIso machinery in git history). Callbacks hand back native
 * `Date` objects in the browser's local time; `dateToNaiveIso()` converts
 * those back to the naive local string the DB expects, using local getters
 * (not `toISOString()`, which would shift by the UTC offset).
 *
 * CRUD: `editable` enables both drag-move (`eventDrop`) and resize
 * (`eventResize`) — both persist via `calendarUpdate` and call
 * `info.revert()` on failure so the UI snaps back immediately rather than
 * silently drifting from the DB. `selectable` + `select` is genuine
 * drag-to-create: drag across empty grid space, release, open
 * CalendarEventModal in 'create' mode seeded with the dragged range.
 * `eventClick` opens the SAME modal in 'edit' mode, seeded from the clicked
 * event's current fields (location/description/tag live only in
 * `extendedProps` — FullCalendar has no first-class fields for them —
 * color lives in `backgroundColor`); the modal's own Delete button (behind
 * an inline confirm step, not a native `window.confirm`) is what removes an
 * event now. No standalone "new event" affordance — drag-to-create on the
 * grid is the only creation entry point, since the modal needs a start/end
 * to seed itself with and a button click has no natural one to anchor to.
 *
 * Color contrast: `textColorFor()` derives readable event text (near-black
 * or near-white) from the chosen background via a standard luminance
 * formula, rather than storing a second "text color" field the user would
 * have to also pick.
 *
 * Theming: FullCalendar themes purely through CSS custom properties on its
 * own `.fc` root class (see sidebar.module.css's Calendar section) — our
 * design tokens are already light/dark-reactive, so unlike schedule-x
 * (which needed an explicit `setTheme()` call on scheme flips) or
 * ResttyTerminal's canvas renderer (which can't read CSS vars at all and
 * needs isDark injected at construction), no JS-driven theme tracking is
 * needed here.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import FullCalendarImport from '@fullcalendar/react'
import type { CalendarApi, DateSelectArg, EventClickArg, EventContentArg, EventDropArg, EventInput } from '@fullcalendar/core'
import dayGridPluginImport from '@fullcalendar/daygrid'
import timeGridPluginImport from '@fullcalendar/timegrid'
import interactionPluginImport, { type EventResizeDoneArg } from '@fullcalendar/interaction'
import { api, ResttyApiError, type CalendarDepsStatus, type CalendarEvent } from './api.ts'
import { CalendarEventModal, type CalendarEventDraft } from './CalendarEventModal.tsx'
import { t } from './locales.ts'
import css from './sidebar.module.css'

/**
 * Work around a CJS/ESM interop bug shared by every `@fullcalendar/*`
 * package: their `dist|index.cjs` builds do `exports["default"] = X`
 * without setting `exports.__esModule = true`. tsdown's CJS output picks
 * those `.cjs` builds (rolldown prefers the `require` condition when the
 * bundle format is `cjs`), and esbuild-style interop helpers can't tell
 * they're already default exports, so they wrap them AGAIN — `import X from
 * '@fullcalendar/...'` then resolves to `{ default: X }` (an object)
 * instead of the real value. For the React component this crashes render
 * ("Element type is invalid ... got: object", React error #130); for a
 * plugin passed into `plugins={[...]}` it crashes FullCalendar's own init
 * ("defs is not iterable", since it iterates the plugin's `.defs` and gets
 * `undefined` off the wrapper object instead). Unwrap defensively: if the
 * import still carries a nested `.default`, that's the double-wrap.
 */
function unwrapDefault<T>(imported: T): T {
  const wrapped = imported as unknown as { default?: T }
  return wrapped.default ?? imported
}
const FullCalendar = unwrapDefault(FullCalendarImport)
const dayGridPlugin = unwrapDefault(dayGridPluginImport)
const timeGridPlugin = unwrapDefault(timeGridPluginImport)
const interactionPlugin = unwrapDefault(interactionPluginImport)

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

/** The modal's current job: creating a new event from a drag selection, or
 *  editing (and possibly deleting) the event the user clicked. */
type ModalState =
  | { mode: 'create'; start: Date; end: Date }
  | { mode: 'edit'; id: string; values: CalendarEventDraft }
  | null

/** Pad a number to 2 digits (for building local-time ISO strings). */
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/** A `Date` (browser local time) to the naive local-wall-clock ISO string
 *  the SQLite store expects — local getters, not `toISOString()` (UTC). */
function dateToNaiveIso(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

/** Readable event text (near-black or near-white) for a given hex
 *  background, via the standard relative-luminance formula — one fewer
 *  thing for the user to pick, and always legible regardless of theme. */
function textColorFor(bgHex: string): string {
  const hex = bgHex.replace('#', '')
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1c1b1f' : '#ffffff'
}

/** Map a host `CalendarEvent` to the shape FullCalendar's `events` prop
 *  wants. Location/description/tag have no first-class FullCalendar field,
 *  so they ride in `extendedProps` — read back out in `handleEventClick`
 *  and `renderEventContent` below. */
function toEventInput(e: CalendarEvent): EventInput {
  return {
    id: e.id,
    title: e.title ?? t('calendarUntitledEvent'),
    start: e.start,
    end: e.end,
    ...(e.color !== undefined && e.color !== ''
      ? { backgroundColor: e.color, borderColor: e.color, textColor: textColorFor(e.color) }
      : {}),
    extendedProps: {
      location: e.location ?? '',
      description: e.description ?? '',
      tag: e.tag ?? '',
    },
  }
}

/** A small tag badge above the title/time, when the event has one. Kept
 *  minimal (no custom time/title markup) so FullCalendar's own layout CSS
 *  for the rest of the event box still applies. */
function renderEventContent(arg: EventContentArg): ReactNode {
  const tag = arg.event.extendedProps.tag as string | undefined
  return (
    <div className={css.calendarEventContent}>
      {tag !== undefined && tag !== '' && <span className={css.calendarEventTagBadge}>{tag}</span>}
      {arg.timeText !== '' && <span className={css.calendarEventTimeText}>{arg.timeText}</span>}
      <span className={css.calendarEventTitleText}>{arg.event.title}</span>
    </div>
  )
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
  const calendarApiRef = useRef<CalendarApi | null>(null)
  const [state, setState] = useState<ViewState>({ status: 'loading' })
  const [events, setEvents] = useState<EventInput[]>([])
  const [modal, setModal] = useState<ModalState>(null)

  // Load deps + events once the tab is first visible.
  useEffect(() => {
    if (!visible || state.status !== 'loading') return
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
      try {
        const result = await api.calendarList()
        if (cancelled) return
        setEvents(result.events.map(toEventInput))
        setState({ status: 'ready' })
      } catch (error) {
        if (cancelled) return
        setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
      }
    }

    init().catch((error: unknown) => {
      if (!cancelled) setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
    })

    return () => { cancelled = true }
  }, [visible, state.status])

  /** Refetch all events from the DB (DB is the source of truth; used after
   *  a failed mutation, and after edits/deletes rather than hand-patching
   *  local state — simpler and just as fast against a local SQLite file). */
  function reconcile(): void {
    api.calendarList().then((result) => {
      setEvents(result.events.map(toEventInput))
    }).catch(() => { /* leave the local view as-is; next open refetches */ })
  }

  // Drag-to-create opens the modal seeded with the dragged range; the grid's
  // own selection highlight stays visible underneath while the form is open
  // (unselect() only fires once the modal actually closes, below).
  function handleSelect(info: DateSelectArg): void {
    setModal({ mode: 'create', start: info.start, end: info.end })
  }

  // Click an existing event → open the SAME modal in 'edit' mode, seeded
  // from its current fields (extendedProps for location/description/tag,
  // backgroundColor for color — see toEventInput's comment on why those
  // live there instead of first-class FullCalendar fields).
  function handleEventClick(info: EventClickArg): void {
    const { event } = info
    if (event.start === null || event.end === null) return
    setModal({
      mode: 'edit',
      id: event.id,
      values: {
        title: event.title,
        start: event.start,
        end: event.end,
        location: (event.extendedProps.location as string | undefined) ?? '',
        description: (event.extendedProps.description as string | undefined) ?? '',
        color: event.backgroundColor,
        tag: (event.extendedProps.tag as string | undefined) ?? '',
      },
    })
  }

  function closeModal(): void {
    setModal(null)
    calendarApiRef.current?.unselect()
  }

  function handleSubmit(draft: CalendarEventDraft): void {
    if (modal?.mode === 'edit') {
      api.calendarUpdate({
        id: modal.id,
        title: draft.title,
        start: dateToNaiveIso(draft.start),
        end: dateToNaiveIso(draft.end),
        location: draft.location,
        description: draft.description,
        color: draft.color,
        tag: draft.tag,
      }).then(() => { reconcile() }).catch(() => { reconcile() })
    } else if (modal?.mode === 'create') {
      const event: CalendarEvent = {
        id: crypto.randomUUID(),
        title: draft.title,
        start: dateToNaiveIso(draft.start),
        end: dateToNaiveIso(draft.end),
        ...(draft.location !== '' ? { location: draft.location } : {}),
        ...(draft.description !== '' ? { description: draft.description } : {}),
        ...(draft.color !== '' ? { color: draft.color } : {}),
        ...(draft.tag !== '' ? { tag: draft.tag } : {}),
      }
      api.calendarCreate(event).then(() => {
        setEvents((prev) => [...prev, toEventInput(event)])
      }).catch((error: unknown) => {
        if (error instanceof ResttyApiError) {
          setState({ status: 'error', message: error.message })
        }
      })
    }
    closeModal()
  }

  function handleDelete(): void {
    if (modal?.mode !== 'edit') return
    const id = modal.id
    api.calendarDelete(id).then((result) => {
      if (result.changes > 0) setEvents((prev) => prev.filter((e) => e.id !== id))
    }).catch(() => { reconcile() })
    closeModal()
  }

  function handleEventDrop(info: EventDropArg): void {
    const { event } = info
    if (event.start === null || event.end === null) return
    api.calendarUpdate({
      id: event.id,
      start: dateToNaiveIso(event.start),
      end: dateToNaiveIso(event.end),
    }).catch(() => {
      info.revert()
      reconcile()
    })
  }

  function handleEventResize(info: EventResizeDoneArg): void {
    const { event } = info
    if (event.start === null || event.end === null) return
    api.calendarUpdate({
      id: event.id,
      start: dateToNaiveIso(event.start),
      end: dateToNaiveIso(event.end),
    }).catch(() => {
      info.revert()
      reconcile()
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
      {/* FullCalendar's height:"100%" needs a parent with a definite height;
          flex:1 (basis 0) breaks the circular height dependency that
          flex-basis:auto would create. */}
      <div className={css.calendarContainer} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <FullCalendar
          ref={(instance) => { calendarApiRef.current = instance?.getApi() ?? null }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          height="100%"
          timeZone="local"
          editable
          selectable
          selectMirror
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          select={handleSelect}
        />
      </div>
      <CalendarEventModal
        open={modal !== null}
        mode={modal?.mode ?? 'create'}
        initialValues={modal === null ? null : modal.mode === 'create' ? { start: modal.start, end: modal.end } : modal.values}
        onSubmit={handleSubmit}
        onDelete={modal?.mode === 'edit' ? handleDelete : undefined}
        onClose={closeModal}
      />
    </div>
  )
}
