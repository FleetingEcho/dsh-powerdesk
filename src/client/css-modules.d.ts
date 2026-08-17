/** Ambient CSS-Modules declarations: `import css from '*.module.css'` yields
 *  a record of hashed class names (keys are the source class identifiers;
 *  values are the hashed strings the CSS-modules plugin emits at build time).
 *  Mirrors dsh-better-sidebar's own css-modules.d.ts. */
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
