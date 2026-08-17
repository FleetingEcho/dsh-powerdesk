/** The bound notes folder, or null when never bound. */
export declare function readNotesFolder(): string | null;
/** Bind (or rebind) the notes folder; pass null to unbind. */
export declare function writeNotesFolder(path: string | null): void;
export declare const NOTES_TREE_WIDTH_DEFAULT = 240;
export declare const NOTES_TREE_WIDTH_MIN = 160;
/** The persisted tree column width, or the default when never dragged. */
export declare function readNotesTreeWidth(): number;
/** Persist the tree column width. */
export declare function writeNotesTreeWidth(width: number): void;
