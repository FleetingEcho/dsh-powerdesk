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
 * CalendarEventModal seeded with the dragged range (a bare `window.prompt`
 * only asked for a title and gave no way to add a location/description or
 * fine-tune the times after a rough drag). `eventClick` → confirm-delete,
 * same as before. No standalone "new event" affordance — drag-to-create on
 * the grid is the only entry point, since the modal needs a start/end to
 * seed itself with and a button click has no natural one to anchor to.
 *
 * Theming: FullCalendar themes purely through CSS custom properties on its
 * own `.fc` root class (see sidebar.module.css's Calendar section) — our
 * design tokens are already light/dark-reactive, so unlike schedule-x
 * (which needed an explicit `setTheme()` call on scheme flips) or
 * ResttyTerminal's canvas renderer (which can't read CSS vars at all and
 * needs isDark injected at construction), no JS-driven theme tracking is
 * needed here.
 */
import { type ReactNode } from 'react';
export interface CalendarViewProps {
    /** Forwarded by the tab shell so a hidden tab can skip rendering work. */
    visible?: boolean;
}
export declare function CalendarView(props: CalendarViewProps): ReactNode;
