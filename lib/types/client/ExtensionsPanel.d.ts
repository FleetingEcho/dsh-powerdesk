/**
 * The Extensions block of the Powerdesk settings card: install, list, inspect,
 * and remove user-installed extensions.
 *
 * Two upload shapes are handled, decided by the HOST from the uploaded bytes
 * (see src/extensions/install.ts), not here:
 *
 * - an archive carrying `powerdesk.json` installs directly;
 * - a bare bundle script has no manifest, so the host rejects it with a
 *   message and this panel then asks for an id + display name and retries.
 *
 * Doing it that way — attempt, then prompt on the specific rejection — keeps
 * a single source of truth for what an archive is. The alternative (sniffing
 * gzip/tar magic in the browser to decide which dialog to show) would put a
 * second, drifting copy of the format rules on the client.
 *
 * Trust: an extension runs with this page's full privileges, so the warning
 * is always visible rather than shown once. The on-disk location and the
 * upload's sha256 are surfaced per extension so a user can audit what is
 * actually being executed.
 */
import { type ReactNode } from 'react';
import type { ExtensionHost } from './extensions.ts';
/** Props: the host-side registration owner the panel refreshes after writes. */
export interface ExtensionsPanelProps {
    extensions: ExtensionHost | undefined;
}
/**
 * Render the Extensions block.
 * @param props - the ExtensionHost whose registrations follow this UI.
 */
export declare function ExtensionsPanel({ extensions }: ExtensionsPanelProps): ReactNode;
