import type { BsCalendarData, BsDate, BsLocale } from './types'
import { getMonthLabel, getWeekdayLabel, pad2, toNepaliDigit } from './constants'
import calendarData from './data/bs-calendar.json'

let cachedData: BsCalendarData | null = null

export function getCalendarData(): BsCalendarData {
  if (!cachedData) {
    cachedData = calendarData as BsCalendarData
  }
  return cachedData
}

function weekdayFromAdDate(adDate: string): number {
  const [year, month, day] = adDate.split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

export function getBsDateWeekday(date: BsDate): number {
  const monthData = getCalendarData()[String(date.year)]?.[String(date.month)]
  const dayEntry = monthData?.days.find(
    (day) =>
      day.bsYear === date.year &&
      day.bsMonth === date.month &&
      day.bsDay === date.day,
  )

  if (dayEntry?.adDate) {
    return weekdayFromAdDate(dayEntry.adDate)
  }

  return dayEntry?.weekday ?? 0
}

export function formatBsDate(date: BsDate, locale: BsLocale = 'ne'): string {
  const yearLabel =
    locale === 'ne' ? toNepaliDigit(date.year) : String(date.year)
  const monthLabel = pad2(date.month, locale)
  const dayLabel = pad2(date.day, locale)
  return `${yearLabel}/${monthLabel}/${dayLabel}`
}

export function formatBsDateLong(date: BsDate, locale: BsLocale = 'en'): string {
  const monthName = getMonthLabel(date.month, locale)
  const dayLabel =
    locale === 'ne' ? toNepaliDigit(date.day) : String(date.day)
  const yearLabel =
    locale === 'ne' ? toNepaliDigit(date.year) : String(date.year)
  return `${dayLabel} ${monthName} ${yearLabel}`
}

export function formatBsDateHeadline(date: BsDate, locale: BsLocale = 'en'): string {
  const monthName = getMonthLabel(date.month, locale, locale === 'en')
  const dayLabel =
    locale === 'ne' ? toNepaliDigit(date.day) : String(date.day)
  const yearLabel =
    locale === 'ne' ? toNepaliDigit(date.year) : String(date.year)

  if (locale === 'en') {
    return `${monthName} ${dayLabel}, ${yearLabel}`
  }

  return `${dayLabel} ${monthName} ${yearLabel}`
}

/** Native iOS-style wheel label, e.g. "Sun 26 Apr" → "Sun 26 Bai". */
export function formatBsDateWheelLabel(date: BsDate, locale: BsLocale = 'en'): string {
  const weekdayLabel = getWeekdayLabel(getBsDateWeekday(date), locale, true)
  const dayLabel =
    locale === 'ne' ? toNepaliDigit(date.day) : String(date.day)
  const monthLabel = getMonthLabel(date.month, locale, true)
  return `${weekdayLabel} ${dayLabel} ${monthLabel}`
}

export function formatAdDate(adDate: string, locale: BsLocale = 'en'): string {
  const [year, month, day] = adDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat(locale === 'ne' ? 'ne-NP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kathmandu',
  }).format(date)
}

export function formatDayLabel(day: number, locale: BsLocale): string {
  return locale === 'ne' ? toNepaliDigit(day) : String(day)
}

export function formatYearLabel(year: number, locale: BsLocale): string {
  return locale === 'ne' ? toNepaliDigit(year) : String(year)
}
