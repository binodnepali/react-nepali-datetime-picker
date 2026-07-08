import {
  clampBsTime,
  formatHourWheelLabel,
  formatMinuteWheelLabel,
  formatPeriodLabel,
  formatBsTime,
  from12Hour,
  getDefaultBsTime,
  getHourOptions,
  getMinuteOptions,
  getPeriodOptions,
  to12Hour,
} from '@/lib/bs-time-picker/time'
import type { BsLocale, BsPeriod, BsTime } from '@/lib/bs-time-picker/time/types'

export {
  clampBsTime,
  getDefaultBsTime,
  getHourOptions,
  getMinuteOptions,
  getPeriodOptions,
  to12Hour,
  from12Hour,
}

export function formatBsTimeWheelLabel(
  time: BsTime,
  locale: BsLocale,
  is24Hour: boolean,
): string {
  return formatBsTime(time, locale, is24Hour)
}

export function formatHourOption(
  hour: number,
  locale: BsLocale,
  is24Hour: boolean,
): string {
  return formatHourWheelLabel(hour, locale, is24Hour)
}

export function formatMinuteOption(minute: number, locale: BsLocale): string {
  return formatMinuteWheelLabel(minute, locale)
}

export function formatPeriodOption(period: BsPeriod, locale: BsLocale): string {
  return formatPeriodLabel(period, locale)
}

export function resolveWheelHour(
  displayHour: number,
  period: BsPeriod,
  is24Hour: boolean,
): number {
  if (is24Hour) return displayHour
  return from12Hour(displayHour, period)
}

export function resolveDisplayHour(hour24: number, is24Hour: boolean): number {
  if (is24Hour) return hour24
  return to12Hour(hour24).hour
}

export function resolveDisplayPeriod(hour24: number, is24Hour: boolean): BsPeriod {
  if (is24Hour) return 'am'
  return to12Hour(hour24).period
}
