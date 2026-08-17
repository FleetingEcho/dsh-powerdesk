/** The host's home directory (the folder-picker's starting point). */
export declare function fsHome(): {
    path: string;
};
/** Cap file reads so a giant log/binary does not get pulled into the editor. */
export declare const FS_READ_LIMIT: number;
/** One directory entry. */
export interface FsEntry {
    name: string;
    isDir: boolean;
    /** Byte size (0 for directories, best-effort for files). */
    size: number;
}
export interface FsListResult {
    path: string;
    entries: FsEntry[];
}
/** List one directory's immediate children: directories first, then A-Z. */
export declare function fsList(path: string): Promise<FsListResult>;
export interface FsReadResult {
    path: string;
    content: string;
    /** True when the file exceeded {@link FS_READ_LIMIT} and was cut off. */
    truncated: boolean;
}
/** Read one file as UTF-8 text, capped at {@link FS_READ_LIMIT} bytes. */
export declare function fsRead(path: string): Promise<FsReadResult>;
/** Overwrite one file's content (UTF-8; the parent directory must exist). */
export declare function fsWrite(path: string, content: string): Promise<{
    path: string;
}>;
/** Create a NEW empty file (exclusive: fails if it already exists, so
 *  "new note" never silently clobbers one). Parent directory must exist. */
export declare function fsCreate(path: string): Promise<{
    path: string;
}>;
/** Create a directory (and any missing parents). */
export declare function fsMkdir(path: string): Promise<{
    path: string;
}>;
/** Rename/move a file or folder. */
export declare function fsRename(from: string, to: string): Promise<{
    path: string;
}>;
/** Delete a file or a folder (recursively). */
export declare function fsDelete(path: string): Promise<{
    path: string;
}>;
/** One node of the recursive markdown tree: a `.md`/`.markdown` file, or a
 *  directory that (directly or via a descendant) contains one — directories
 *  with no markdown anywhere under them are pruned entirely, so the Notes
 *  tree only ever shows folders worth expanding. */
export interface MdTreeNode {
    name: string;
    path: string;
    isDir: boolean;
    children?: MdTreeNode[];
}
/** The Notes tab's recursive `.md` tree over a bound folder. */
export declare function fsListMarkdownTree(path: string): Promise<{
    path: string;
    children: MdTreeNode[];
}>;
