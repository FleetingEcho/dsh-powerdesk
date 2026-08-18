/**
 * Host-side calendar persistence for the Calendar tab: CRUD over a local
 * SQLite database file (managed by the `dsh-powerdesk-sqlite` Rust napi
 * module — see rust-sqlite-deps.ts) at `findProfileDir()/powerdesk-calendar.db`.
 * Mounted under `/powerdesk/api/calendar.*` in src/index.ts, same trust fence
 * and buffered-JSON-request/response convention as fs-api.ts's and
 * search-api.ts's routes.
 *
 * The event shape mirrors schedule-x's `CalendarEventExternal` so the client
 * can pass events straight to/from `calendar.events.set()` with no reshaping:
 * `{ id, title?, start, end, location?, description?, calendarId? }`. `start`
 * and `end` are ISO datetime strings (schedule-x accepts ISO strings).
 *
 * The DB handle is a module-level singleton opened lazily on first use and
 * reused for the process lifetime (SQLite under WAL handles concurrent reads
 * fine; writes are serialized by the connection mutex inside the crate).
 */
import { join } from 'node:path'
import {
  findProfileDir,
  loadRequiredRustSqlite,
} from './rust-sqlite-deps.ts'
import type { RustSqliteDatabase } from './rust-sqlite-deps.ts'
import { ResttyError } from './wire.ts'

/** The calendar DB filename inside the DSH profile directory. */
const DB_FILENAME = 'powerdesk-calendar.db'

/** The idempotent schema migration run on first open. */
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS calendar_events (
  id          TEXT PRIMARY KEY,
  title       TEXT,
  start       TEXT NOT NULL,
  end         TEXT NOT NULL,
  location    TEXT,
  description TEXT,
  calendar_id TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON calendar_events (start);
`

/** An event as the client sends / receives it (mirrors schedule-x). */
export interface CalendarEvent {
  id: string
  title?: string
  /** ISO datetime string, e.g. '2026-08-18 10:00' or '2026-08-18T10:00:00'. */
  start: string
  /** ISO datetime string. */
  end: string
  location?: string
  description?: string
  calendarId?: string
}

/** The raw DB row (snake_case columns) before mapping to {@link CalendarEvent}. */
interface EventRow {
  id: string
  title: string | null
  start: string
  end: string
  location: string | null
  description: string | null
  calendar_id: string | null
}

/** Map a DB row to the client-facing event shape. */
function rowToEvent(row: EventRow): CalendarEvent {
  return {
    id: row.id,
    start: row.start,
    end: row.end,
    ...(row.title !== null ? { title: row.title } : {}),
    ...(row.location !== null ? { location: row.location } : {}),
    ...(row.description !== null ? { description: row.description } : {}),
    ...(row.calendar_id !== null ? { calendarId: row.calendar_id } : {}),
  }
}

let dbHandle: RustSqliteDatabase | null = null
/** Test-only override of the DB path (avoids the profile-dir walk-up so CRUD
 *  tests can point at a tmpdir). `null` restores production behavior. */
let dbPathOverride: string | null = null

/** @internal Tests only — redirect the DB to a temp path and drop the handle. */
export function __setCalendarDbPathForTests(path: string | null): void {
  dbPathOverride = path
  dbHandle = null
}

/** Resolve the DB file path under the DSH profile directory. */
function dbPath(): string {
  if (dbPathOverride !== null) return dbPathOverride
  const profileDir = findProfileDir()
  if (profileDir === null) {
    throw new ResttyError(
      'calendar-no-profile',
      'could not locate the DSH profile directory for the calendar database',
      500,
    )
  }
  return join(profileDir, DB_FILENAME)
}

/** Open the DB (creating the file + schema on first use) and cache the handle. */
function getDb(): RustSqliteDatabase {
  if (dbHandle !== null) return dbHandle
  const mod = loadRequiredRustSqlite()
  const db = mod.Database.open(dbPath())
  db.exec(SCHEMA_SQL)
  dbHandle = db
  return db
}

/** Validate the fields an insert/update requires. */
function requireEventFields(input: Partial<CalendarEvent> & { id?: unknown }): asserts input is CalendarEvent {
  if (typeof input.id !== 'string' || input.id === '') {
    throw new ResttyError('bad-request', 'calendar event "id" is required (non-empty string)')
  }
  if (typeof input.start !== 'string' || input.start === '') {
    throw new ResttyError('bad-request', 'calendar event "start" is required (ISO datetime string)')
  }
  if (typeof input.end !== 'string' || input.end === '') {
    throw new ResttyError('bad-request', 'calendar event "end" is required (ISO datetime string)')
  }
}

/** List all events, earliest first. */
export function calendarList(): { events: CalendarEvent[] } {
  const rows = getDb().query<EventRow>('SELECT id, title, start, end, location, description, calendar_id FROM calendar_events ORDER BY start ASC')
  return { events: rows.map(rowToEvent) }
}

/** Create an event. Returns the created event. */
export function calendarCreate(input: Partial<CalendarEvent> & { id?: unknown }): { event: CalendarEvent } {
  requireEventFields(input)
  getDb().run(
    'INSERT INTO calendar_events (id, title, start, end, location, description, calendar_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [input.id, input.title ?? null, input.start, input.end, input.location ?? null, input.description ?? null, input.calendarId ?? null],
  )
  return { event: rowToEvent({ id: input.id, title: input.title ?? null, start: input.start, end: input.end, location: input.location ?? null, description: input.description ?? null, calendar_id: input.calendarId ?? null }) }
}

/** Update an event by id. Returns the number of rows changed (0 = not found). */
export function calendarUpdate(input: Partial<CalendarEvent> & { id?: unknown }): { changes: number } {
  if (typeof input.id !== 'string' || input.id === '') {
    throw new ResttyError('bad-request', 'calendar event "id" is required for update')
  }
  // Coalesce to the existing row for fields the client didn't send (a
  // schedule-x drag-resize only sends id/start/end; title etc. must persist).
  const existing = getDb().query<EventRow>('SELECT id, title, start, end, location, description, calendar_id FROM calendar_events WHERE id = ?', [input.id])[0]
  if (existing === undefined) return { changes: 0 }
  const merged: EventRow = {
    id: existing.id,
    title: input.title ?? existing.title,
    start: input.start ?? existing.start,
    end: input.end ?? existing.end,
    location: input.location ?? existing.location,
    description: input.description ?? existing.description,
    calendar_id: input.calendarId ?? existing.calendar_id,
  }
  const changes = getDb().run(
    'UPDATE calendar_events SET title = ?, start = ?, end = ?, location = ?, description = ?, calendar_id = ?, updated_at = datetime(\'now\') WHERE id = ?',
    [merged.title, merged.start, merged.end, merged.location, merged.description, merged.calendar_id, merged.id],
  )
  return { changes }
}

/** Delete an event by id. Returns the number of rows changed (0 = not found). */
export function calendarDelete(id: unknown): { changes: number } {
  if (typeof id !== 'string' || id === '') {
    throw new ResttyError('bad-request', 'calendar event "id" is required for delete')
  }
  const changes = getDb().run('DELETE FROM calendar_events WHERE id = ?', [id])
  return { changes }
}
