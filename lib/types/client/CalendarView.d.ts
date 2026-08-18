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
 * Global identity: `@schedule-x/calendar` lists `temporal-polyfill` as a
 * peer dependency but its bundled core never imports it — `validateEvents`
 * does a bare, unimported `instanceof Temporal.ZonedDateTime` check, i.e. it
 * expects `Temporal` as a GLOBAL, not a module import. Recent Chrome (135+)
 * now ships `Temporal` natively on `globalThis`. If we build events with the
 * `temporal-polyfill` package's own class while schedule-x's bare reference
 * resolves to the native global class, `instanceof` fails on two unrelated
 * constructors even though the value is a real Temporal instant — this is
 * exactly the "[Schedule-X error]: Event start time needs to be a
 * Temporal.ZonedDateTime or Temporal.PlainDate" crash. Fix: use whichever
 * `Temporal` already lives on `globalThis` (installing the polyfill there
 * only if no native one exists) so our instances and schedule-x's
 * `instanceof` checks share one identity.
 *
 * CRUD is wired through the calendar's `onEventUpdate` callback (drag-move
 * via `@schedule-x/drag-and-drop` and drag-resize via `@schedule-x/resize`
 * both funnel into this one callback → DB update) plus a "New event"
 * toolbar affordance and double-clicking an empty grid slot (both →
 * `createEventAt`, prompt for a title, DB create) and `onEventClick` →
 * confirm-delete; each mutation syncs to SQLite via the API, with the DB as
 * source of truth (a failed mutation refetches and reconciles).
 */
import { type ReactNode } from 'react';
import '@schedule-x/theme-default/dist/index.css';
export interface CalendarViewProps {
    /** Forwarded by the tab shell so a hidden tab can skip rendering work. */
    visible?: boolean;
}
export declare function CalendarView(props: CalendarViewProps): ReactNode;
