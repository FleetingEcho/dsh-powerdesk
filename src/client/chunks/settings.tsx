/**
 * Lazy chunk entry: the terminal appearance settings panel (a `@radix-ui/
 * react-select` combobox for font family/size). Built as `lib/client-
 * settings.js` and fetched only when the user actually opens the Powerdesk
 * settings card (see chunk-loader.ts and tsdown.config.ts). Never import this
 * module from the core client bundle: `@radix-ui/react-select` drags in the
 * whole popper/floating-ui/dismissable-layer/focus-scope/portal stack, and
 * most sessions never open Settings.
 */
export { TerminalAppearancePanel } from '../TerminalAppearancePanel.tsx'
