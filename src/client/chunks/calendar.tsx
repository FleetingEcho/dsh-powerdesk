/**
 * Lazy chunk entry: the calendar surface (the CalendarView component + the
 * schedule-x calendar engine, preact, and temporal-polyfill it pulls in).
 * Built as `lib/client-calendar.js` and fetched only when the Calendar tab is
 * first opened (see chunk-loader.ts and tsdown.config.ts). Never import this
 * module from the core client bundle: schedule-x + preact + temporal-polyfill
 * are ~80KB gzipped together, and most sessions never open the calendar.
 */
export { CalendarView } from '../CalendarView.tsx'
export type { CalendarViewProps } from '../CalendarView.tsx'
