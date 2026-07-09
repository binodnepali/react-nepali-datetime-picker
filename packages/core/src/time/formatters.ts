import { pad2 } from '../constants'
import type { BsLocale } from '../types'
import { to12Hour } from './helpers'
import type { BsTime } from './types'

export function formatTimeDigit(value: number, locale: BsLocale): string {
  return pad2(value, locale)
}

export function formatBsTime(
  time: BsTime,
  locale: BsLocale = 'en',
  is24Hour = false,
): string {
  if (is24Hour) {
    return `${formatTimeDigit(time.hour, locale)}:${formatTimeDigit(time.minute, locale)}`
  }

  const { hour, period } = to12Hour(time.hour)
  const periodLabel =
    locale === 'ne'
      ? period === 'am'
        ? 'पूर्वाह्न'
        : 'अपराह्न'
      : period.toUpperCase()
  return `${formatTimeDigit(hour, locale)}:${formatTimeDigit(time.minute, locale)} ${periodLabel}`
}

export function formatBsTimeWheelLabel(
  time: BsTime,
  locale: BsLocale,
  is24Hour: boolean,
): string {
  return formatBsTime(time, locale, is24Hour)
}

export function formatHourWheelLabel(
  hour: number,
  locale: BsLocale,
  is24Hour: boolean,
): string {
  if (is24Hour) return formatTimeDigit(hour, locale)
  return formatTimeDigit(hour, locale)
}

export function formatMinuteWheelLabel(minute: number, locale: BsLocale): string {
  return formatTimeDigit(minute, locale)
}

export function formatPeriodLabel(period: 'am' | 'pm', locale: BsLocale): string {
  if (locale === 'ne') {
    return period === 'am' ? 'एम' : 'पिम'
  }
  return period.toUpperCase()
}
