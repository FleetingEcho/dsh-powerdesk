/**
 * The "create event" modal for the Calendar tab: replaces a bare
 * `window.prompt()` (title-only, no location/description, and start/end
 * times fixed to wherever the drag landed with no way to fine-tune them)
 * with a real form. Opened by CalendarView after a drag-to-create selection;
 * closing without submitting leaves nothing behind (the calendar's
 * `unselect()` already clears the drag highlight independently of this
 * modal's own open/close state).
 */
import { type ReactNode } from 'react';
export interface CalendarEventDraft {
    title: string;
    start: Date;
    end: Date;
    location: string;
    description: string;
}
export interface CalendarEventModalProps {
    open: boolean;
    /** The drag-selected range; null only briefly before the first open. */
    initialStart: Date | null;
    initialEnd: Date | null;
    onCreate: (draft: CalendarEventDraft) => void;
    onClose: () => void;
}
export declare function CalendarEventModal(props: CalendarEventModalProps): ReactNode;
