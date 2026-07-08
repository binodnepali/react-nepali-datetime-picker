import type { BsDate, BsSelectionMode } from './types'
import { bsDatesEqual } from './types'

export function selectSingleDate(
  current: BsDate | undefined,
  next: BsDate | undefined,
  mode: BsSelectionMode,
): BsDate | undefined {
  if (mode !== 'single') {
    console.warn(
      `[BsDayPicker] mode "${mode}" is not implemented in v2. Falling back to single.`,
    )
  }

  if (!next) return undefined
  if (current && bsDatesEqual(current, next)) return undefined
  return next
}

export function isSelectedDate(
  date: BsDate,
  selected: BsDate | undefined,
  mode: BsSelectionMode,
): boolean {
  if (mode !== 'single') return false
  return selected ? bsDatesEqual(date, selected) : false
}
