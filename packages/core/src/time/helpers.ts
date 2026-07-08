import type { BsPeriod, BsTime } from './types'

export function clampBsTime(time: BsTime): BsTime {
  const hour = Math.min(23, Math.max(0, Math.round(time.hour)))
  const minute = Math.min(59, Math.max(0, Math.round(time.minute)))
  return { hour, minute }
}

export function getDefaultBsTime(): BsTime {
  const now = new Date()
  return { hour: now.getHours(), minute: now.getMinutes() }
}

export function getHourOptions(is24Hour: boolean): number[] {
  if (is24Hour) {
    return Array.from({ length: 24 }, (_, index) => index)
  }
  return Array.from({ length: 12 }, (_, index) => index + 1)
}

export function getMinuteOptions(): number[] {
  return Array.from({ length: 60 }, (_, index) => index)
}

export function getPeriodOptions(): BsPeriod[] {
  return ['am', 'pm']
}

export function to12Hour(hour24: number): { hour: number; period: BsPeriod } {
  const normalized = ((hour24 % 24) + 24) % 24
  const period: BsPeriod = normalized >= 12 ? 'pm' : 'am'
  const hour12 = normalized % 12 || 12
  return { hour: hour12, period }
}

export function from12Hour(hour12: number, period: BsPeriod): number {
  const normalized = ((hour12 % 12) + 12) % 12 || 12
  if (period === 'am') {
    return normalized === 12 ? 0 : normalized
  }
  return normalized === 12 ? 12 : normalized + 12
}

export function bsTimeToDate(time: BsTime, base = new Date()): Date {
  const date = new Date(base)
  date.setHours(time.hour, time.minute, 0, 0)
  return date
}

export function dateToBsTime(date: Date): BsTime {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  }
}
