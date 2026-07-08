import { getMonthLabel } from '@/lib/bs-day-picker/constants'
import {
  formatBsDateWheelLabel,
  formatDayLabel,
  formatYearLabel,
} from '@/lib/bs-day-picker/formatters'
import {
  clampMonth,
  getAllBsDates,
  getCurrentBsDate,
  getMonthData,
  getYears,
} from '@/lib/bs-day-picker/navigation'
import {
  bsDateKey,
  parseBsDateKey,
  type BsDate,
  type BsLocale,
} from '@/lib/bs-day-picker/types'

export function clampBsDate(date: BsDate): BsDate {
  const month = clampMonth({ year: date.year, month: date.month })
  const monthData = getMonthData(month.year, month.month)
  const daysInMonth = monthData?.daysInMonth ?? 30

  return {
    year: month.year,
    month: month.month,
    day: Math.min(Math.max(1, date.day), daysInMonth),
  }
}

export function getDefaultBsDate(): BsDate {
  return getCurrentBsDate()
}

export function getBsDayOptions(year: number, month: number): number[] {
  const monthData = getMonthData(year, month)
  const count = monthData?.daysInMonth ?? 30
  return Array.from({ length: count }, (_, index) => index + 1)
}

export function getBsYearOptions(): number[] {
  return getYears()
}

export function getBsMonthOptions(locale: BsLocale, short = false) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    return {
      value: month,
      label: getMonthLabel(month, locale, short),
    }
  })
}

export function formatBsYearOption(year: number, locale: BsLocale): string {
  return formatYearLabel(year, locale)
}

export function formatBsDayOption(day: number, locale: BsLocale): string {
  return formatDayLabel(day, locale)
}

let cachedBsDateWheelKeys: string[] | null = null

export function getBsDateWheelKeys(): readonly string[] {
  if (!cachedBsDateWheelKeys) {
    cachedBsDateWheelKeys = getAllBsDates().map(bsDateKey)
  }
  return cachedBsDateWheelKeys
}

export function formatBsDateWheelKey(key: string, locale: BsLocale): string {
  const date = parseBsDateKey(key)
  if (!date) return key
  return formatBsDateWheelLabel(date, locale)
}

export function parseBsDateWheelKey(key: string): BsDate | null {
  return parseBsDateKey(key)
}
