import { getDayAdDate } from '../calendar-grid'
import { formatBsDateLong } from '../formatters'
import { getCurrentBsDate } from '../navigation'
import type { BsDate } from '../types'
import { clampBsTime, getDefaultBsTime } from './helpers'
import { formatBsTime } from './formatters'
import type { BsDateTime, BsLocale, BsTime } from './types'

export function clampBsDateTime(value: BsDateTime): BsDateTime {
  return {
    ...value,
    ...clampBsTime(value),
  }
}

export function getDefaultBsDateTime(): BsDateTime {
  const date = getCurrentBsDate()
  const time = getDefaultBsTime()
  return { ...date, ...time }
}

export function mergeBsDateTime(date: BsDate, time: BsTime): BsDateTime {
  return clampBsDateTime({ ...date, ...time })
}

export function splitBsDateTime(value: BsDateTime): { date: BsDate; time: BsTime } {
  return {
    date: { year: value.year, month: value.month, day: value.day },
    time: { hour: value.hour, minute: value.minute },
  }
}

export function formatBsDateTime(
  value: BsDateTime,
  locale: BsLocale = 'en',
  is24Hour = false,
): string {
  const dateLabel = formatBsDateLong(value, locale)
  const timeLabel = formatBsTime(value, locale, is24Hour)
  return `${dateLabel}, ${timeLabel}`
}

/** Map BS datetime to AD `Date` using calendar data (Asia/Kathmandu local fields). */
export function toAdDate(value: BsDateTime): Date | null {
  const adDate = getDayAdDate(value)
  if (!adDate) return null

  const [year, month, day] = adDate.split('-').map(Number)
  if (year == null || month == null || day == null) return null

  const date = new Date(year, month - 1, day, value.hour, value.minute, 0, 0)
  return date
}
