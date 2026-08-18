/** An event as the client sends / receives it (mirrors schedule-x). */
export interface CalendarEvent {
    id: string;
    title?: string;
    /** ISO datetime string, e.g. '2026-08-18 10:00' or '2026-08-18T10:00:00'. */
    start: string;
    /** ISO datetime string. */
    end: string;
    location?: string;
    description?: string;
    calendarId?: string;
}
/** @internal Tests only — redirect the DB to a temp path and drop the handle. */
export declare function __setCalendarDbPathForTests(path: string | null): void;
/** List all events, earliest first. */
export declare function calendarList(): {
    events: CalendarEvent[];
};
/** Create an event. Returns the created event. */
export declare function calendarCreate(input: Partial<CalendarEvent> & {
    id?: unknown;
}): {
    event: CalendarEvent;
};
/** Update an event by id. Returns the number of rows changed (0 = not found). */
export declare function calendarUpdate(input: Partial<CalendarEvent> & {
    id?: unknown;
}): {
    changes: number;
};
/** Delete an event by id. Returns the number of rows changed (0 = not found). */
export declare function calendarDelete(id: unknown): {
    changes: number;
};
