import { getMonthLabel, getWeekdayLabel, pad2, toNepaliDigit } from './constants'
import { getBsDateWeekday } from './formatters'
import type { BsDate, BsLocale } from './types'

/** Default date picker trigger pattern (date-fns-style tokens, BS calendar). */
export const BS_DATE_DISPLAY_PATTERN = 'EEEE, d MMMM yyyy'

/** Compact picker label — short weekday and month, e.g. "Fri, 26 Ash 2083". */
export const BS_DATE_COMPACT_DISPLAY_PATTERN = 'EEE, d MMM yyyy'

const PATTERN_TOKEN =
  /'([^']*)'|(EEEE|EEE|MMMM|MMM|yyyy|yy|MM|M|dd|d)/g

function formatBsYear(year: number, token: string, locale: BsLocale): string {
  const label = locale === 'ne' ? toNepaliDigit(year) : String(year)
  if (token === 'yy') {
    const short = String(year).slice(-2)
    return locale === 'ne' ? toNepaliDigit(Number(short)) : short
  }
  return label
}

function formatBsDay(day: number, token: string, locale: BsLocale): string {
  if (token === 'dd') return pad2(day, locale)
  return locale === 'ne' ? toNepaliDigit(day) : String(day)
}

function formatBsMonthNumber(month: number, token: string, locale: BsLocale): string {
  if (token === 'MM') return pad2(month, locale)
  return locale === 'ne' ? toNepaliDigit(month) : String(month)
}

function resolveDateToken(
  date: BsDate,
  token: string,
  locale: BsLocale,
): string {
  switch (token) {
    case 'EEEE':
      return getWeekdayLabel(getBsDateWeekday(date), locale, false)
    case 'EEE':
      return getWeekdayLabel(getBsDateWeekday(date), locale, true)
    case 'MMMM':
      return getMonthLabel(date.month, locale, false)
    case 'MMM':
      return getMonthLabel(date.month, locale, true)
    case 'yyyy':
    case 'yy':
      return formatBsYear(date.year, token, locale)
    case 'MM':
    case 'M':
      return formatBsMonthNumber(date.month, token, locale)
    case 'dd':
    case 'd':
      return formatBsDay(date.day, token, locale)
    default:
      return token
  }
}

/** Format a BS date with date-fns-style tokens (BS weekday/month names). */
export function formatBsDatePattern(
  date: BsDate,
  pattern: string,
  locale: BsLocale = 'en',
): string {
  return pattern.replace(PATTERN_TOKEN, (match, literal, token) => {
    if (literal != null) return literal
    return resolveDateToken(date, token, locale)
  })
}
