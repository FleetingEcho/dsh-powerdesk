/**
 * Lazy chunk entry: the editor surface (the CodeEditor component + the
 * CodeMirror language packages it pulls in) and the Notes tab (which embeds
 * CodeEditor inline, so it shares this same chunk rather than downloading
 * CodeMirror twice). Built as `lib/client-editor.js` and fetched only when a
 * file is first opened or the Notes tab is first opened (see
 * chunk-loader.ts and tsdown.config.ts). Never import this module from the
 * core client bundle: CodeMirror is a few hundred KB, and most sessions
 * never open a file.
 */
export { CodeEditor } from '../CodeEditor.tsx';
export type { CodeEditorProps } from '../CodeEditor.tsx';
export { NotesView } from '../NotesView.tsx';
export type { NotesViewProps } from '../NotesView.tsx';
