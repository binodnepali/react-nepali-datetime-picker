import type { BsDate, BsLocale } from '../types'

export type { BsLocale }

export type BsTime = {
  hour: number
  minute: number
}

export type BsDateTime = BsDate & BsTime

export type BsPeriod = 'am' | 'pm'

export function bsTimeKey(time: BsTime): string {
  return `${time.hour}:${time.minute}`
}

export function parseBsTimeKey(key: string): BsTime | null {
  const match = key.match(/^(\d+):(\d+)$/)
  if (!match) return null
  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
  }
}

export function bsTimesEqual(a?: BsTime, b?: BsTime): boolean {
  if (!a || !b) return false
  return a.hour === b.hour && a.minute === b.minute
}
