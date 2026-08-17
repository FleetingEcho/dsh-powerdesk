/**
 * Live theme access for the restty terminal surface. restty themes are set
 * at construction; this module reads the resolved scheme and token values so
 * {@link ./ResttyTerminal.tsx} can pick a builtin restty theme that matches
 * the app's scheme and override its surface colors from the DSH tokens, and
 * re-theme on a scheme flip. Mirrors dsh-better-sidebar's theme helpers
 * (behavioral copy — the app's scheme flips via a body attribute).
 */

/** Whether the app shell resolved to the dark scheme. */
export function isDarkScheme(): boolean {
  if (typeof document === 'undefined') return true
  const decided = document.documentElement.style.colorScheme !== ''
  if (decided) return document.body.hasAttribute('data-ds-dark-theme')
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
}

/** One token's computed value on <body> ('' while the theme has not applied). */
export function tokenValue(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.body).getPropertyValue(name).trim()
}

/** Minimal alpha for a token color to count as effectively opaque. */
const OPAQUE_ALPHA_MIN = 0.9

/** The alpha channel of a computed CSS color, or null when not parseable. */
export function colorAlpha(color: string): number | null {
  const s = color.trim()
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(s)
  if (hex !== null) {
    const digits = hex[1]!
    if (digits.length === 3 || digits.length === 4) {
      const a = digits.length === 4 ? digits[3]! : 'f'
      return parseInt(a + a, 16) / 255
    }
    const alphaHex = digits.length === 8 ? digits.slice(6) : 'ff'
    return parseInt(alphaHex, 16) / 255
  }
  const fn = /^(rgba?|hsla?)\(([^)]+)\)$/i.exec(s)
  if (fn !== null) {
    const parts = fn[2]!.split(/[,\s/]+/).filter(Boolean)
    const alphaPart = parts[3]
    if (alphaPart === undefined) return 1
    const alpha = Number.parseFloat(alphaPart)
    return Number.isFinite(alpha) ? alpha : 1
  }
  return null
}

/** A token value that actually paints (filters transparent/translucent glass). */
export function effectiveTokenValue(name: string): string {
  const raw = tokenValue(name)
  switch (raw) {
    case '':
    case 'transparent':
    case 'initial':
    case 'inherit':
    case 'unset':
      return ''
    default: {
      const alpha = colorAlpha(raw)
      if (alpha !== null && alpha < OPAQUE_ALPHA_MIN) return ''
      return raw
    }
  }
}

/** Subscribe to color-scheme flips (the presenter toggles the body attribute). */
export function subscribeColorScheme(callback: () => void): () => void {
  if (typeof document === 'undefined') return () => {}
  const observer = new MutationObserver(() => { callback() })
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
  return () => { observer.disconnect() }
}
