/**
 * Lazy chunk entry: the restty terminal view (the heavy restty renderer +
 * its transport/theme logic). Built as `lib/client-terminal.js` and
 * registered under `dsh-powerdesk/terminal` — fetched only when a
 * terminal tab is first opened (see chunk-loader.ts and tsdown.config.ts).
 * Never import this module from the core client bundle: it pulls restty
 * (WASM + WebGPU/WebGL2) into the startup path.
 */
export { ResttyTerminal } from '../ResttyTerminal.tsx'
export type { ResttyTerminalProps } from '../ResttyTerminal.tsx'
