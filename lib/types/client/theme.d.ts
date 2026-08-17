/**
 * Live theme access for the restty terminal surface. restty themes are set
 * at construction; this module reads the resolved scheme and token values so
 * {@link ./ResttyTerminal.tsx} can pick a builtin restty theme that matches
 * the app's scheme and override its surface colors from the DSH tokens, and
 * re-theme on a scheme flip. Mirrors dsh-better-sidebar's theme helpers
 * (behavioral copy — the app's scheme flips via a body attribute).
 */
/** Whether the app shell resolved to the dark scheme. */
export declare function isDarkScheme(): boolean;
/** One token's computed value on <body> ('' while the theme has not applied). */
export declare function tokenValue(name: string): string;
/** The alpha channel of a computed CSS color, or null when not parseable. */
export declare function colorAlpha(color: string): number | null;
/** A token value that actually paints (filters transparent/translucent glass). */
export declare function effectiveTokenValue(name: string): string;
/** Subscribe to color-scheme flips (the presenter toggles the body attribute). */
export declare function subscribeColorScheme(callback: () => void): () => void;
