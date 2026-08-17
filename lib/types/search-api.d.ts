export interface SearchMatch {
    line: number;
    text: string;
    /** [start, end) byte offsets of each matched run within `text`. */
    ranges: [number, number][];
}
export interface SearchFileResult {
    path: string;
    matches: SearchMatch[];
}
export interface SearchGrepResult {
    files: SearchFileResult[];
    /** True when MAX_MATCHES or TIMEOUT_MS cut the search short. */
    truncated: boolean;
}
/** Search `path` recursively for `query` (a ripgrep regex pattern). */
export declare function searchGrep(path: string, query: string): Promise<SearchGrepResult>;
