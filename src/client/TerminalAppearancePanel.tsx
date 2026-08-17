/**
 * The Terminal appearance block of the Powerdesk Side card: font family
 * (system font picker), font weight, font size, and terminal theme. Lives
 * ONLY here — never on the terminal page — so terminal tabs stay focused on
 * output and all appearance controls share one home.
 *
 * All interactive controls are built on Radix UI Select primitives so they
 * match the shell's accessible component vocabulary and read consistently
 * (family / weight / theme are the same dropdown shape). Two native controls
 * remain: the manual font-name text entry and the font-size number input
 * (Radix ships no text-input or number primitive); both are styled to match
 * input primitive); it's a styled fallback for browsers without the Local
 * Font Access API and is kept visually consistent with the Radix controls.
 *
 * Source of truth: the global `dsh-powerdesk:prefs` localStorage key (one
 * terminal appearance for every conversation). Reads reactively through
 * {@link ./useTerminalPrefs.ts} (`useSyncExternalStore`); writes through
 * {@link ./prefs.ts}'s `writePrefsToLocalStorage`, which notifies subscribers
 * so any mounted terminal re-renders (font family/weight/size recreate the
 * restty instance; theme re-applies live).
 *
 * Font picker: `navigator.queryLocalFonts()` (the Local Font Access API,
 * Chromium-only + a permission prompt) enumerates the user's installed
 * families — including their Nerd Fonts. On Firefox/Safari (no API) or if the
 * permission is denied, the field falls back to a manual text input. An empty
 * value ("System default") lets the app theme's code font apply, then restty's
 * built-in fallback chain (see {@link ./terminal-font.ts}).
 *
 * Font size: a labeled number input (not a slider or dropdown). A slider over
 * a discrete integer range is finicky — hard to land on an exact px — and a
 * dropdown adds a click for no benefit; a number input lets the user type or
 * step to an exact px directly. min/max mirror the clamp bounds so the
 * browser's own validation matches {@link clampResttyFontSize}, which
 * re-clamps on write (an empty/NaN field reverts to the default).
 *
 * Theme picker: a short curated list (auto / tokyo-night / dracula /
 * high-contrast / …). The full restty catalog is NOT exposed here (kept the
 * dropdown readable); a curated preset covers the well-known themes.
 */
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import * as Select from '@radix-ui/react-select'
import * as Label from '@radix-ui/react-label'
import {
  TERMINAL_FONT_SIZE_DEFAULT,
  TERMINAL_FONT_SIZE_MAX,
  TERMINAL_FONT_SIZE_MIN,
  TERMINAL_FONT_WEIGHTS,
  writePrefsToLocalStorage,
  type ResttyPrefs,
} from './prefs.ts'
import {
  TERMINAL_THEME_PRESETS,
  themePresetLabelKey,
} from './terminal-theme.ts'
import { useTerminalPrefs } from './useTerminalPrefs.ts'
import { t } from './locales.ts'
import css from './sidebar.module.css'

/** The curated preset ids as a set, for "is the current value a preset?" */
const PRESET_IDS: ReadonlySet<string> = new Set(TERMINAL_THEME_PRESETS.map(p => p.id))

/** Font-weight display labels (restty accepts the numeric value). */
const WEIGHT_LABELS: Record<number, string> = {
  400: 'Regular',
  500: 'Medium',
  600: 'Semibold',
  700: 'Bold',
}

/** A small caret glyph for the Select trigger. */
function SelectCaret(): ReactNode {
  return (
    <Select.Icon className={css.appearanceSelectCaret} aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2.5 3.75 5 6.25 7.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Select.Icon>
  )
}

/** A check glyph shown beside the selected item in a Radix Select dropdown. */
function ItemCheck(): ReactNode {
  return (
    <Select.ItemIndicator className={css.appearanceSelectIndicator}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2.5 6.25 5 8.75 9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Select.ItemIndicator>
  )
}

/**
 * A labeled Radix Select wrapper used for the family/weight/theme dropdowns.
 * Reduces the verbose Root/Trigger/Content/Viewport/Item boilerplate to one
 * component per field. The label is a Radix `Label.Root` wired to the trigger
 * for accessible association.
 */
function LabeledSelect(props: {
  labelKey: string
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  full?: boolean
  children: ReactNode
}): ReactNode {
  const { labelKey, value, onValueChange, disabled, full, children } = props
  const id = `powerdesk-appearance-${labelKey}`
  return (
    <div className={`${css.appearanceField} ${full ? css.appearanceFieldFull : ''}`}>
      <Label.Root htmlFor={id} className={css.appearanceFieldLabel}>{t(labelKey)}</Label.Root>
      <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <Select.Trigger id={id} className={css.appearanceSelectTrigger} aria-label={t(labelKey)}>
          <Select.Value />
          <SelectCaret />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={css.appearanceSelectContent} position="popper" sideOffset={4}>
            <Select.Viewport className={css.appearanceSelectViewport}>
              {children}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}

/** One Radix Select item with the check indicator + label. */
function SelectOption(props: { value: string; label: string }): ReactNode {
  return (
    <Select.Item value={props.value} className={css.appearanceSelectItem}>
      <Select.ItemIndicator><ItemCheck /></Select.ItemIndicator>
      <Select.ItemText>{props.label}</Select.ItemText>
    </Select.Item>
  )
}

/** `navigator.queryLocalFonts` typed loosely (not in standard TS DOM libs). */
type QueryLocalFonts = () => Promise<Array<{ family: string; postscriptName: string }>>
function getQueryLocalFonts(): QueryLocalFonts | undefined {
  if (typeof navigator === 'undefined') return undefined
  const q = (navigator as unknown as { queryLocalFonts?: QueryLocalFonts }).queryLocalFonts
  return typeof q === 'function' ? q : undefined
}

/** Dedupe + sort a list of family names. */
function uniqueSorted(families: string[]): string[] {
  return Array.from(new Set(families.filter(f => f !== '')).values()).sort((a, b) => a.localeCompare(b))
}

/**
 * The theme `<select>` value: '' and 'auto' both mean follow-scheme; normalize
 * to 'auto' for the option lookup.
 */
function themeSelectValue(prefs: ResttyPrefs): string {
  const v = prefs.themeName.trim()
  return v === '' ? 'auto' : v
}

/** The terminal appearance panel. */
export function TerminalAppearancePanel(): ReactNode {
  const prefs = useTerminalPrefs()

  // --- System font enumeration (Local Font Access API) -------------------
  const query = getQueryLocalFonts()
  const [families, setFamilies] = useState<string[] | null>(null)
  const [fontsLoading, setFontsLoading] = useState<boolean>(query !== undefined)
  const [fontsDenied, setFontsDenied] = useState<boolean>(false)
  // Manual entry: shown when the API is absent/denied, or when the user opts
  // in (a browser WITH the API may still want to type a name the enumerator
  // didn't surface, e.g. a family only exposed under a postscript name).
  const [manualFont, setManualFont] = useState<boolean>(query === undefined)

  // Font-size number input: kept as a local STRING so the user can type
  // freely — clearing the field to type "16" must NOT clamp the empty
  // intermediate to 8 (which a write-on-every-keystroke controlled input
  // would do, turning "1"→"6" into "81"). Committed (clamped + written) on
  // blur/Enter; resyncs when prefs change externally (e.g. another tab).
  const [sizeInput, setSizeInput] = useState<string>(String(prefs.fontSize))
  useEffect(() => { setSizeInput(String(prefs.fontSize)) }, [prefs.fontSize])

  useEffect(() => {
    if (query === undefined) return // nothing to enumerate
    let cancelled = false
    setFontsLoading(true)
    query()
      .then(list => {
        if (cancelled) return
        setFamilies(uniqueSorted(list.map(f => f.family)))
        setFontsLoading(false)
      })
      .catch(() => {
        // Permission denied or API broken: fall back to manual entry.
        if (cancelled) return
        setFontsDenied(true)
        setManualFont(true)
        setFontsLoading(false)
      })
    return () => { cancelled = true }
  }, [query])

  // --- Writers ----------------------------------------------------------
  const setFontFamily = useCallback((value: string) => {
    writePrefsToLocalStorage({ fontFamily: value })
  }, [])
  const setFontWeight = useCallback((value: string) => {
    writePrefsToLocalStorage({ fontWeight: Number(value) })
  }, [])
  const setFontSize = useCallback((value: number) => {
    writePrefsToLocalStorage({ fontSize: value })
  }, [])
  // Commit the font-size input on blur/Enter. An EMPTY field reverts to the
  // default (16) — NOT 0: Number("") is 0 (finite, not NaN), so a naive
  // `Number.isFinite(n) ? n : default` would commit 0 and clamp it to the
  // minimum, which is how the size previously snapped to 8px when the field
  // was cleared. A real out-of-range number (e.g. 5, 99) still clamps to the
  // nearest bound via clampResttyFontSize on write.
  const commitFontSize = useCallback(() => {
    const trimmed = sizeInput.trim()
    if (trimmed === '') { setFontSize(TERMINAL_FONT_SIZE_DEFAULT); return }
    const n = Number(trimmed)
    setFontSize(Number.isFinite(n) ? n : TERMINAL_FONT_SIZE_DEFAULT)
  }, [sizeInput, setFontSize])
  const setTheme = useCallback((value: string) => {
    // 'auto' is stored as '' so the scheme default resolves.
    writePrefsToLocalStorage({ themeName: value === 'auto' ? '' : value })
  }, [])

  const themeValue = themeSelectValue(prefs)
  // A raw builtin stored as themeName (not a preset id) is shown as-is; the
  // curated list is the only surface now, so a stray value renders as a lone
  // option so the Select never shows blank.
  const themeIsPreset = PRESET_IDS.has(themeValue)

  return (
    <div className={css.appearanceSection}>
      <h4 className={css.appearanceHeading}>{t('appearanceHeading')}</h4>
      <p className={css.settingsIntro}>{t('appearanceIntro')}</p>

      <div className={css.appearanceGrid}>
        {/* Font family — spans the full row. */}
        <div className={`${css.appearanceField} ${css.appearanceFieldFull}`}>
          <Label.Root htmlFor="powerdesk-appearance-font" className={css.appearanceFieldLabel}>
            {t('appearanceFontFamily')}
          </Label.Root>
          {manualFont ? (
            // Radix ships no text-input primitive, so the manual font-name
            // entry is a styled native input (kept visually consistent with
            // the Radix controls). This is the fallback for browsers without
            // the Local Font Access API (Firefox/Safari) or a denied prompt.
            <input
              id="powerdesk-appearance-font"
              type="text"
              className={css.appearanceControl}
              value={prefs.fontFamily}
              placeholder={t('appearanceFontFamilyManual')}
              onChange={(e) => { setFontFamily(e.target.value) }}
            />
          ) : (
            <Select.Root
              value={prefs.fontFamily}
              onValueChange={setFontFamily}
              disabled={fontsLoading}
            >
              <Select.Trigger
                id="powerdesk-appearance-font"
                className={css.appearanceSelectTrigger}
                aria-label={t('appearanceFontFamily')}
              >
                <Select.Value placeholder={fontsLoading ? t('appearanceFontsLoading') : t('appearanceFontFamilyAuto')} />
                <SelectCaret />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className={css.appearanceSelectContent} position="popper" sideOffset={4}>
                  <Select.Viewport className={css.appearanceSelectViewport}>
                    <Select.Item value="" className={css.appearanceSelectItem}>
                      <Select.ItemIndicator><ItemCheck /></Select.ItemIndicator>
                      <Select.ItemText>{t('appearanceFontFamilyAuto')}</Select.ItemText>
                    </Select.Item>
                    {families !== null && families.map(f => (
                      <SelectOption key={f} value={f} label={f} />
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          )}
          {/* Toggle between the picker and manual entry. Hidden when the API
              is unavailable (manual is the only mode then). */}
          {query !== undefined && !fontsDenied && (
            <button
              type="button"
              className={css.appearanceInlineToggle}
              onClick={() => { setManualFont(m => !m) }}
            >
              {manualFont ? t('appearanceFontFamilyAuto') : t('appearanceFontFamilyManual')}
            </button>
          )}
        </div>

        {/* Font weight. */}
        <LabeledSelect
          labelKey="appearanceFontWeight"
          value={String(prefs.fontWeight)}
          onValueChange={setFontWeight}
        >
          {TERMINAL_FONT_WEIGHTS.map(w => (
            <SelectOption key={w} value={String(w)} label={WEIGHT_LABELS[w] ?? String(w)} />
          ))}
        </LabeledSelect>

        {/* Font size — a labeled number input. The earlier control was a
            slider (finicky over a discrete range) and was briefly a Select
            dropdown; a plain number input is the right shape for an exact px
            the user can type or step. The input is a local string committed on
            blur/Enter (not on every keystroke) so typing "16" doesn't clamp
            the empty/"1" intermediate to 8; clampResttyFontSize bounds the
            committed value, and an empty/NaN field reverts to the default. */}
        <div className={css.appearanceField}>
          <Label.Root htmlFor="powerdesk-appearance-size" className={css.appearanceFieldLabel}>
            {t('appearanceFontSize')}
          </Label.Root>
          <input
            id="powerdesk-appearance-size"
            type="number"
            className={css.appearanceControl}
            value={sizeInput}
            min={TERMINAL_FONT_SIZE_MIN}
            max={TERMINAL_FONT_SIZE_MAX}
            step={1}
            aria-label={t('appearanceFontSize')}
            onChange={(e) => { setSizeInput(e.target.value) }}
            onBlur={commitFontSize}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur() }}
          />
        </div>

        {/* Theme. */}
        <LabeledSelect
          labelKey="appearanceTheme"
          value={themeValue}
          onValueChange={setTheme}
          full
        >
          {TERMINAL_THEME_PRESETS.map(p => (
            <SelectOption key={p.id} value={p.id} label={t(themePresetLabelKey(p.id))} />
          ))}
          {/* A stored raw-builtin value (not a preset) is surfaced as a lone
              option so the Select reflects the truth; the curated list is the
              only picker surface now. */}
          {!themeIsPreset && (
            <SelectOption value={themeValue} label={themeValue} />
          )}
        </LabeledSelect>
      </div>

      <p className={css.appearanceHint}>{t('appearanceFontHint')}</p>
      <p className={css.appearanceReopenHint}>{t('appearanceReopenHint')}</p>
    </div>
  )
}
