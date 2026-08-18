/**
 * The Calendar tab's event form modal — both create (opened by dragging on
 * the grid, seeded with the dragged range) and edit (opened by clicking an
 * existing event, seeded with its current fields). One component for both:
 * the field set is identical, only the footer differs (edit adds a Delete
 * button) and the submit handler's target differs (create vs. update),
 * which the caller (CalendarView) decides via `mode`.
 *
 * Delete confirmation: clicking Delete does NOT call `onDelete` directly —
 * it swaps the form body for a small inline confirm step (own local state,
 * not a second `<Modal>` stacked on top, so there's only ever one overlay/
 * mask visible at a time) and only fires `onDelete` once the user confirms.
 */
import { useEffect, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { Modal, Input } from '@deepseek-ai/dsh-client-ui-primitives'
import { t } from './locales.ts'
import css from './sidebar.module.css'

export interface CalendarEventDraft {
  title: string
  start: Date
  end: Date
  location: string
  description: string
  /** A CSS hex color, or '' for the calendar's default color. */
  color: string
  /** A single free-text label/tag, or '' for none. */
  tag: string
}

/** A small fixed palette rather than a raw `<input type=color>`: keeps every
 *  event visually consistent and each swatch pre-picked for contrast against
 *  both the light and dark theme (see CalendarView's `textColorFor`, which
 *  derives readable text from whichever of these is chosen). */
export const EVENT_COLORS: readonly string[] = [
  '#e5484d', // red
  '#f76b15', // orange
  '#f5b60d', // yellow
  '#30a46c', // green
  '#0091ff', // blue
  '#8e4ec6', // purple
  '#e93d82', // pink
]

export interface CalendarEventModalProps {
  open: boolean
  mode: 'create' | 'edit'
  /** Seed values: for 'create' typically just the dragged start/end; for
   *  'edit' the clicked event's current fields. Missing fields default to
   *  empty/now. `null` while nothing is open (avoids a flash of stale
   *  values from the previous open on the next one). */
  initialValues: Partial<CalendarEventDraft> | null
  onSubmit: (draft: CalendarEventDraft) => void
  /** Only meaningful in 'edit' mode; renders a Delete button when present. */
  onDelete?: () => void
  onClose: () => void
}

/** Pad a number to 2 digits (for building `datetime-local` input values). */
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/** A `Date` to the value a `<input type="datetime-local">` expects
 *  ('yyyy-MM-ddTHH:mm', local wall-clock — matches what the input gives
 *  back, so no timezone math is needed on either side of this round trip). */
function toLocalInputValue(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export function CalendarEventModal(props: CalendarEventModalProps): ReactNode {
  const { open, mode, initialValues, onSubmit, onDelete, onClose } = props
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('')
  const [tag, setTag] = useState('')
  const [startValue, setStartValue] = useState('')
  const [endValue, setEndValue] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Reset the form (and the delete-confirm step) from the seed values each
  // time the modal opens — the same instance is reused across every
  // create/edit, not remounted.
  useEffect(() => {
    if (!open) return
    setTitle(initialValues?.title ?? '')
    setLocation(initialValues?.location ?? '')
    setDescription(initialValues?.description ?? '')
    setColor(initialValues?.color ?? '')
    setTag(initialValues?.tag ?? '')
    setStartValue(initialValues?.start !== undefined ? toLocalInputValue(initialValues.start) : '')
    setEndValue(initialValues?.end !== undefined ? toLocalInputValue(initialValues.end) : '')
    setConfirmingDelete(false)
  }, [open, initialValues])

  function handleSubmit(): void {
    if (startValue === '' || endValue === '') return
    const start = new Date(startValue)
    const end = new Date(endValue)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return
    onSubmit({
      title: title.trim() === '' ? t('calendarUntitledEvent') : title.trim(),
      start,
      end,
      location: location.trim(),
      description: description.trim(),
      color,
      tag: tag.trim(),
    })
  }

  const modalTitle = mode === 'edit' ? t('calendarEventEditTitle') : t('calendarEventModalTitle')

  if (confirmingDelete) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={t('calendarEventDeleteConfirmTitle')}
        closeLabel={t('close')}
        description={t('calendarEventDeleteConfirmBody', { title: title.trim() === '' ? t('calendarUntitledEvent') : title.trim() })}
        footer={(
          <div className={css.folderPickerFooter}>
            <button type="button" className={css.explorerPill} onClick={() => { setConfirmingDelete(false) }}>{t('cancel')}</button>
            <button type="button" className={clsx(css.explorerPill, css.calendarEventDeleteConfirmButton)} onClick={onDelete}>
              {t('calendarEventDelete')}
            </button>
          </div>
        )}
      />
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      closeLabel={t('close')}
      footer={(
        <div className={css.calendarEventModalFooter}>
          {onDelete !== undefined && (
            <button
              type="button"
              className={clsx(css.explorerPill, css.calendarEventDeleteButton)}
              onClick={() => { setConfirmingDelete(true) }}
            >
              {t('calendarEventDelete')}
            </button>
          )}
          <div className={css.folderPickerFooter}>
            <button type="button" className={css.explorerPill} onClick={onClose}>{t('cancel')}</button>
            <button type="button" className={css.explorerPill} onClick={handleSubmit}>
              {mode === 'edit' ? t('calendarEventSave') : t('calendarEventCreate')}
            </button>
          </div>
        </div>
      )}
    >
      <div className={css.calendarEventForm}>
        <label className={css.calendarEventField}>
          <span className={css.calendarEventLabel}>{t('calendarEventTitleLabel')}</span>
          <Input
            value={title}
            onChange={(e) => { setTitle(e.target.value) }}
            placeholder={t('calendarEventTitlePlaceholder')}
            autoFocus
          />
        </label>
        <div className={css.calendarEventRow}>
          <label className={css.calendarEventField}>
            <span className={css.calendarEventLabel}>{t('calendarEventStartLabel')}</span>
            <input
              type="datetime-local"
              className={css.calendarEventDateInput}
              value={startValue}
              onChange={(e) => { setStartValue(e.target.value) }}
            />
          </label>
          <label className={css.calendarEventField}>
            <span className={css.calendarEventLabel}>{t('calendarEventEndLabel')}</span>
            <input
              type="datetime-local"
              className={css.calendarEventDateInput}
              value={endValue}
              onChange={(e) => { setEndValue(e.target.value) }}
            />
          </label>
        </div>
        <label className={css.calendarEventField}>
          <span className={css.calendarEventLabel}>{t('calendarEventLocationLabel')}</span>
          <Input
            value={location}
            onChange={(e) => { setLocation(e.target.value) }}
            placeholder={t('calendarEventLocationPlaceholder')}
          />
        </label>
        <label className={css.calendarEventField}>
          <span className={css.calendarEventLabel}>{t('calendarEventDescriptionLabel')}</span>
          <textarea
            className={css.calendarEventTextarea}
            value={description}
            onChange={(e) => { setDescription(e.target.value) }}
            placeholder={t('calendarEventDescriptionPlaceholder')}
            rows={3}
          />
        </label>
        <label className={css.calendarEventField}>
          <span className={css.calendarEventLabel}>{t('calendarEventTagLabel')}</span>
          <Input
            value={tag}
            onChange={(e) => { setTag(e.target.value) }}
            placeholder={t('calendarEventTagPlaceholder')}
          />
        </label>
        <div className={css.calendarEventField}>
          <span className={css.calendarEventLabel}>{t('calendarEventColorLabel')}</span>
          <div className={css.calendarEventSwatchRow}>
            <button
              type="button"
              className={clsx(css.calendarEventSwatch, css.calendarEventSwatchNone, color === '' && css.calendarEventSwatchSelected)}
              aria-label={t('calendarEventColorNone')}
              title={t('calendarEventColorNone')}
              onClick={() => { setColor('') }}
            />
            {EVENT_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                className={clsx(css.calendarEventSwatch, color === hex && css.calendarEventSwatchSelected)}
                style={{ backgroundColor: hex }}
                aria-label={hex}
                title={hex}
                onClick={() => { setColor(hex === color ? '' : hex) }}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
