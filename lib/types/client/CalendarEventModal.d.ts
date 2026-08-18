/**
 * The Calendar tab's event form modal — both create (opened by dragging on
 * the grid, seeded with the dragged range) and edit (opened by clicking an
 * existing event, seeded with its current fields). One component for both:
 * the field set is identical, only the footer differs (edit adds a Delete
 * button) and the submit handler's target differs (create vs. update),
 * which the caller (CalendarView) decides via `mode`.
 *
 * Delete confirmation: clicking Delete does NOT call `onDelete` directly —
 * it swaps the form body for a small inline confirm step (own local state,
 * not a second `<Modal>` stacked on top, so there's only ever one overlay/
 * mask visible at a time) and only fires `onDelete` once the user confirms.
 */
import { type ReactNode } from 'react';
export interface CalendarEventDraft {
    title: string;
    start: Date;
    end: Date;
    location: string;
    description: string;
    /** A CSS hex color, or '' for the calendar's default color. */
    color: string;
    /** A single free-text label/tag, or '' for none. */
    tag: string;
}
/** A small fixed palette rather than a raw `<input type=color>`: keeps every
 *  event visually consistent and each swatch pre-picked for contrast against
 *  both the light and dark theme (see CalendarView's `textColorFor`, which
 *  derives readable text from whichever of these is chosen). */
export declare const EVENT_COLORS: readonly string[];
export interface CalendarEventModalProps {
    open: boolean;
    mode: 'create' | 'edit';
    /** Seed values: for 'create' typically just the dragged start/end; for
     *  'edit' the clicked event's current fields. Missing fields default to
     *  empty/now. `null` while nothing is open (avoids a flash of stale
     *  values from the previous open on the next one). */
    initialValues: Partial<CalendarEventDraft> | null;
    onSubmit: (draft: CalendarEventDraft) => void;
    /** Only meaningful in 'edit' mode; renders a Delete button when present. */
    onDelete?: () => void;
    onClose: () => void;
}
export declare function CalendarEventModal(props: CalendarEventModalProps): ReactNode;
