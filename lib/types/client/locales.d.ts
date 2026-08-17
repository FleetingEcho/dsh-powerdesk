/**
 * Minimal i18n for the restty terminal surface. The plugin follows the DSH
 * i18n system: {@link attachLocale} subscribes to the locale service so the
 * module-level {@link t} resolves the Host-backed language preference, and
 * the dictionaries register into the service's namespace registry under
 * `powerdesk`. The lazy chunk (src/client/chunks/terminal.tsx) imports
 * `t` only — it reads the module-level locale, never the cordis service, so
 * the chunk stays cordis-coupling-free.
 */
import type { ResttyLocaleService } from '../context-types.ts';
/** The locale namespace this plugin registers its dictionaries under. */
export declare const LOCALE_NS = "powerdesk";
/** Whether the active locale is Chinese. */
export declare function isZh(): boolean;
/** Translate one key, substituting `{param}` placeholders. */
export declare function t(key: string, params?: Record<string, string>): string;
/** The current active locale. */
export declare function getLocale(): string;
/**
 * Attach the module's locale to the DSH locale service: register the
 * dictionaries under {@link LOCALE_NS} and keep the module-level locale in
 * sync with the Host-backed preference. Returns the disposer.
 */
export declare function attachLocale(locale: ResttyLocaleService): () => void;
