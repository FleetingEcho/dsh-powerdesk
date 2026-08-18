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
/** The search box's modifier toggles (VSCode's "Aa" / "ab" / ".*"). */
export interface SearchOptions {
    /** "Aa" — case-sensitive. Off (default) is case-INsensitive (`rg -i`); rg
     *  is case-sensitive by default, so "on" needs no extra flag. */
    matchCase?: boolean;
    /** "ab" (underlined) — whole-word only (`rg -w`). */
    wholeWord?: boolean;
    /** ".*" — treat `query` as a regex (rg's own default). Off (default)
     *  treats it as a literal string (`rg -F`) — matches VSCode's default
     *  (plain-text search unless you opt into regex). */
    useRegex?: boolean;
}
/** Search `path` recursively for `query`, honoring the search box's modifier toggles. */
export declare function searchGrep(path: string, query: string, options?: SearchOptions): Promise<SearchGrepResult>;
