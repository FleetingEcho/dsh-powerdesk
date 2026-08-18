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
import { type ReactNode } from 'react';
import '@schedule-x/theme-default/dist/index.css';
export interface CalendarViewProps {
    /** Forwarded by the tab shell so a hidden tab can skip rendering work. */
    visible?: boolean;
}
export declare function CalendarView(props: CalendarViewProps): ReactNode;
