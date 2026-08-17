/**
 * Terminal font resolution: the user's restty font prefs turned into the
 * restty options. Kept pure (no DOM, no restty) so the clamp chain is unit-
 * testable without mounting a terminal.
 */
import { type ResttyPrefs } from './prefs.ts';
/**
 * Resolve the restty font options for the given prefs.
 * @param prefs - the current restty preferences.
 * @param themeFontFamily - the app's theme code font (`--ds-font-family-code`
 *   token value, read live by the caller); undefined when the token is absent.
 */
export declare function resolveTerminalFont(prefs: ResttyPrefs, themeFontFamily: string | undefined): {
    fontFamily: string;
    fontSize: number;
};
