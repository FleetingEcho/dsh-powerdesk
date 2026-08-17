/**
 * Wire helpers for the /restty JSON API: bounded body reading, response
 * writing, and the shared error envelope. Every API method returns
 * `{ok: true, value}` on success and `{ok: false, error: {code, message}}`
 * (HTTP 4xx/5xx matching the code) on failure.
 */
import type { ResttyHttpRequest, ResttyHttpResponse } from './context-types.ts';
/** Machine-readable error codes of the restty API. */
export type ResttyErrorCode = 'bad-request' | 'not-found' | 'forbidden' | 'method-error' | 'pty-error' | 'pty-deps-missing' | 'internal';
/** One API failure with its wire code and HTTP status. */
export declare class ResttyError extends Error {
    readonly code: ResttyErrorCode;
    readonly status: number;
    constructor(code: ResttyErrorCode, message: string, status?: number);
}
/** Success envelope of one API method. */
export interface ResttyOk<T> {
    ok: true;
    value: T;
}
/** Failure envelope of one API method. */
export interface ResttyErr {
    ok: false;
    error: {
        code: ResttyErrorCode;
        message: string;
    };
}
/** Read and parse the JSON request body (bounded; malformed → bad-request). */
export declare function readJsonBody(req: ResttyHttpRequest): Promise<unknown>;
/** Write a JSON response with the given status. */
export declare function writeJson(res: ResttyHttpResponse, status: number, body: unknown): void;
/** Write the success envelope. */
export declare function writeOk(res: ResttyHttpResponse, value: unknown): void;
/** Write the failure envelope for any thrown value (unknown → internal 500). */
export declare function writeError(res: ResttyHttpResponse, error: unknown): void;
/** Narrow an unknown payload value to a string, else throw bad-request. */
export declare function requireString(payload: unknown, key: string): string;
