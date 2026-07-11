import { getDayAdDate } from '../calendar-grid'
import { getCalendarData } from '../formatters'
import { getCurrentBsDate } from '../navigation'
import type { BsDate } from '../types'
import { clampBsTime, getDefaultBsTime } from './helpers'
import {
  BS_DATETIME_DISPLAY_PATTERN,
  formatBsDateTimePattern,
} from './pattern'
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
  return formatBsDateTimePattern(
    value,
    BS_DATETIME_DISPLAY_PATTERN,
    locale,
    is24Hour,
  )
}

function formatAdDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Map AD `Date` to BS datetime using calendar data. */
export function fromAdDate(date: Date): BsDateTime | null {
  const adStr = formatAdDateKey(date)
  const data = getCalendarData()

  for (const yearKey of Object.keys(data)) {
    const yearData = data[yearKey]
    if (!yearData) continue
    for (const monthKey of Object.keys(yearData)) {
      const monthData = yearData[monthKey]
      if (!monthData) continue
      for (const day of monthData.days) {
        if (day.adDate === adStr) {
          return {
            year: day.bsYear,
            month: day.bsMonth,
            day: day.bsDay,
            hour: date.getHours(),
            minute: date.getMinutes(),
          }
        }
      }
    }
  }

  return null
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
