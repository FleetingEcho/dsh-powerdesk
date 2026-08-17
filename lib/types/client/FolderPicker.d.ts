/**
 * A folder-browser modal: click through subdirectories (fs.list), "Up" to
 * the parent, "Select this folder" to confirm the CURRENT directory.
 *
 * Browsers deliberately never hand a web page a real filesystem path from a
 * native file/folder picker (`<input type=file webkitdirectory>` and
 * `showDirectoryPicker()` both return sandboxed handles, not paths) — and
 * this plugin's fs.* routes need a real path (they run through Node on the
 * host, not the browser's File API). This modal is the workaround: it's our
 * own directory browser, built on the same fs.list the Explorer tab uses,
 * so picking a folder still feels like a native "choose folder" dialog.
 *
 * Shared by Explorer's "Add folder" and Notes' "Bind folder" flows.
 */
import { type ReactNode } from 'react';
export interface FolderPickerProps {
    open: boolean;
    /** Starting directory; defaults to the host's home directory. */
    initialPath?: string;
    onSelect: (path: string) => void;
    onClose: () => void;
}
export declare function FolderPicker({ open, initialPath, onSelect, onClose }: FolderPickerProps): ReactNode;
