export type BsLocale = 'en' | 'ne'

export type BsDate = {
  year: number
  month: number
  day: number
}

export type BsMonth = {
  year: number
  month: number
}

export type BsSelectionMode = 'single' | 'multiple' | 'range'

export type BsCaptionLayout = 'label' | 'dropdown'

export type BsDayCell = {
  date: BsDate
  adDate: string
  weekday: number
  currentMonth: boolean
  isPlaceholder?: boolean
  events?: string[]
  isHoliday?: boolean
  isToday?: boolean
  isSelected?: boolean
  isDisabled?: boolean
}

export type BsMonthDay = {
  bsYear: number
  bsMonth: number
  bsDay: number
  adDate: string
  weekday: number
  events?: string[]
  isHoliday?: boolean
}

export type BsMonthData = {
  daysInMonth: number
  weekdayOffset: number
  days: BsMonthDay[]
}

export type BsCalendarData = Record<string, Record<string, BsMonthData>>

export type BsDisabledMatcher = (date: BsDate) => boolean

export function bsDateKey(date: BsDate): string {
  return `${date.year}-${date.month}-${date.day}`
}

export function bsDatesEqual(a?: BsDate, b?: BsDate): boolean {
  if (!a || !b) return false
  return a.year === b.year && a.month === b.month && a.day === b.day
}

export function parseBsDateKey(key: string): BsDate | null {
  const match = key.match(/^(\d+)-(\d+)-(\d+)$/)
  if (!match) return null
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}
