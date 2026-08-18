/**
 * The "create event" modal for the Calendar tab: replaces a bare
 * `window.prompt()` (title-only, no location/description, and start/end
 * times fixed to wherever the drag landed with no way to fine-tune them)
 * with a real form. Opened by CalendarView after a drag-to-create selection;
 * closing without submitting leaves nothing behind (the calendar's
 * `unselect()` already clears the drag highlight independently of this
 * modal's own open/close state).
 */
import { useEffect, useState, type ReactNode } from 'react'
import { Modal, Input } from '@deepseek-ai/dsh-client-ui-primitives'
import { t } from './locales.ts'
import css from './sidebar.module.css'

export interface CalendarEventDraft {
  title: string
  start: Date
  end: Date
  location: string
  description: string
}

export interface CalendarEventModalProps {
  open: boolean
  /** The drag-selected range; null only briefly before the first open. */
  initialStart: Date | null
  initialEnd: Date | null
  onCreate: (draft: CalendarEventDraft) => void
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
  const { open, initialStart, initialEnd, onCreate, onClose } = props
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [startValue, setStartValue] = useState('')
  const [endValue, setEndValue] = useState('')

  // Reset the form and seed start/end from the drag selection each time the
  // modal opens (not just on mount — the same instance is reused across
  // every "drag to create" gesture).
  useEffect(() => {
    if (!open) return
    setTitle('')
    setLocation('')
    setDescription('')
    setStartValue(initialStart !== null ? toLocalInputValue(initialStart) : '')
    setEndValue(initialEnd !== null ? toLocalInputValue(initialEnd) : '')
  }, [open, initialStart, initialEnd])

  function handleCreate(): void {
    if (startValue === '' || endValue === '') return
    const start = new Date(startValue)
    const end = new Date(endValue)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return
    onCreate({
      title: title.trim() === '' ? t('calendarUntitledEvent') : title.trim(),
      start,
      end,
      location: location.trim(),
      description: description.trim(),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('calendarEventModalTitle')}
      closeLabel={t('close')}
      footer={(
        <div className={css.folderPickerFooter}>
          <button type="button" className={css.explorerPill} onClick={onClose}>{t('cancel')}</button>
          <button type="button" className={css.explorerPill} onClick={handleCreate}>{t('calendarEventCreate')}</button>
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
      </div>
    </Modal>
  )
}
