/**
 * Lazy chunk entry: the calendar surface (the CalendarView component + the
 * FullCalendar engine it pulls in: core, daygrid, timegrid, interaction).
 * Built as `lib/client-calendar.js` and fetched only when the Calendar tab is
 * first opened (see chunk-loader.ts and tsdown.config.ts). Never import this
 * module from the core client bundle: FullCalendar is tens of KB gzipped,
 * and most sessions never open the calendar.
 */
export { CalendarView } from '../CalendarView.tsx'
export type { CalendarViewProps } from '../CalendarView.tsx'
