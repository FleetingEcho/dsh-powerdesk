import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  calendarCreate,
  calendarDelete,
  calendarList,
  calendarUpdate,
  __setCalendarDbPathForTests,
} from '../src/calendar-api.ts'
import { loadRustSqlite, resetRustSqliteCache } from '../src/rust-sqlite-deps.ts'
import { ResttyError } from '../src/wire.ts'

/**
 * CRUD integration test over the REAL dsh-powerdesk-sqlite native module +
 * the real calendar-api SQL (schema migration, insert/update/delete, row
 * mapping). Mirrors search-api.spec.ts's "use the real binary when present"
 * philosophy. Gracefully skipped on platforms without the committed prebuilt
 * (the sqlite binary is built per-platform; only linux-x64-gnu is committed
 * in this session — mac/windows prebuilts land via the release workflow).
 */
const SQLITE_AVAILABLE = loadRustSqlite() !== null
const describeOrSkip = SQLITE_AVAILABLE ? describe : describe.skip

let tmpDir: string

beforeEach(() => {
  resetRustSqliteCache()
  tmpDir = mkdtempSync(join(tmpdir(), 'dsh-powerdesk-calendar-'))
  __setCalendarDbPathForTests(join(tmpDir, 'calendar.db'))
})

afterEach(() => {
  __setCalendarDbPathForTests(null)
  resetRustSqliteCache()
  rmSync(tmpDir, { recursive: true, force: true })
})

describeOrSkip('calendar-api', () => {
  it('list returns empty before any event is created (and migrates the schema)', async () => {
    const result = await calendarList()
    expect(result.events).toEqual([])
  })

  it('create inserts an event and list returns it', async () => {
    const created = await calendarCreate({ id: 'e1', title: 'Standup', start: '2026-08-18 09:00', end: '2026-08-18 09:30' })
    expect(created.event.id).toBe('e1')
    const result = await calendarList()
    expect(result.events).toHaveLength(1)
    expect(result.events[0]).toMatchObject({ id: 'e1', title: 'Standup', start: '2026-08-18 09:00', end: '2026-08-18 09:30' })
  })

  it('create omits undefined optional fields from the returned event', async () => {
    const created = await calendarCreate({ id: 'e2', start: '2026-08-18 10:00', end: '2026-08-18 11:00' })
    expect(created.event).not.toHaveProperty('title')
    expect(created.event).not.toHaveProperty('location')
  })

  it('update merges unspecified fields with the existing row (drag-resize sends only id/start/end)', async () => {
    await calendarCreate({ id: 'e3', title: 'Review', start: '2026-08-18 14:00', end: '2026-08-18 15:00', location: 'Room A' })
    const { changes } = await calendarUpdate({ id: 'e3', start: '2026-08-18 14:30', end: '2026-08-18 16:00' })
    expect(changes).toBe(1)
    const result = await calendarList()
    expect(result.events[0]).toMatchObject({ id: 'e3', title: 'Review', start: '2026-08-18 14:30', end: '2026-08-18 16:00', location: 'Room A' })
  })

  it('create/list round-trips color and tag', async () => {
    await calendarCreate({ id: 'e3b', title: 'Retro', start: '2026-08-18 16:00', end: '2026-08-18 17:00', color: '#e5484d', tag: 'work' })
    const result = await calendarList()
    expect(result.events[0]).toMatchObject({ id: 'e3b', color: '#e5484d', tag: 'work' })
  })

  it('create omits color/tag from the returned event when not given', async () => {
    const created = await calendarCreate({ id: 'e3c', start: '2026-08-18 09:00', end: '2026-08-18 09:30' })
    expect(created.event).not.toHaveProperty('color')
    expect(created.event).not.toHaveProperty('tag')
  })

  it('update can set color/tag on an existing event', async () => {
    await calendarCreate({ id: 'e3d', start: '2026-08-18 09:00', end: '2026-08-18 09:30' })
    const { changes } = await calendarUpdate({ id: 'e3d', color: '#0091ff', tag: 'urgent' })
    expect(changes).toBe(1)
    const result = await calendarList()
    expect(result.events[0]).toMatchObject({ id: 'e3d', color: '#0091ff', tag: 'urgent' })
  })

  it('update returns 0 changes for an unknown id', async () => {
    const { changes } = await calendarUpdate({ id: 'nope', start: '2026-08-18 14:30', end: '2026-08-18 16:00' })
    expect(changes).toBe(0)
  })

  it('delete removes an event and returns the change count', async () => {
    await calendarCreate({ id: 'e4', start: '2026-08-18 09:00', end: '2026-08-18 10:00' })
    const { changes } = await calendarDelete('e4')
    expect(changes).toBe(1)
    expect((await calendarList()).events).toEqual([])
  })

  it('delete returns 0 for an unknown id', async () => {
    const { changes } = await calendarDelete('nope')
    expect(changes).toBe(0)
  })

  it('create validates required fields', () => {
    // requireEventFields throws synchronously (the host route wrapper catches it),
    // so these are sync throws rather than rejected promises.
    expect(() => calendarCreate({ id: '', start: 's', end: 'e' })).toThrow(ResttyError)
    expect(() => calendarCreate({ id: 'x', start: '', end: 'e' })).toThrow(ResttyError)
    expect(() => calendarCreate({ id: 'x', start: 's', end: '' })).toThrow(ResttyError)
  })

  it('persists across handle reopens (the DB file survives)', async () => {
    await calendarCreate({ id: 'persist', title: 'Weekly', start: '2026-08-20 10:00', end: '2026-08-20 11:00' })
    // Drop the in-memory handle so the next call reopens the same file.
    __setCalendarDbPathForTests(join(tmpDir, 'calendar.db'))
    const result = await calendarList()
    expect(result.events).toHaveLength(1)
    expect(result.events[0]?.id).toBe('persist')
    expect(existsSync(join(tmpDir, 'calendar.db'))).toBe(true)
  })
})
