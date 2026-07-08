import type { BsCalendarData, BsDate, BsMonth, BsMonthData } from './types'
import { BS_MAX_YEAR, BS_MIN_YEAR } from './constants'
import { getCalendarData } from './formatters'

export function getMonthData(year: number, month: number): BsMonthData | null {
  const data = getCalendarData()
  return data[String(year)]?.[String(month)] ?? null
}

export function getYears(): number[] {
  const data = getCalendarData()
  return Object.keys(data)
    .map(Number)
    .filter((year) => year >= BS_MIN_YEAR && year <= BS_MAX_YEAR)
    .sort((a, b) => a - b)
}

export function addMonths({ year, month }: BsMonth, delta: number): BsMonth {
  let nextMonth = month + delta
  let nextYear = year

  while (nextMonth > 12) {
    nextMonth -= 12
    nextYear += 1
  }

  while (nextMonth < 1) {
    nextMonth += 12
    nextYear -= 1
  }

  return { year: nextYear, month: nextMonth }
}

export function clampMonth({ year, month }: BsMonth): BsMonth {
  const years = getYears()
  const minYear = years[0] ?? BS_MIN_YEAR
  const maxYear = years[years.length - 1] ?? BS_MAX_YEAR

  if (year < minYear) return { year: minYear, month: 1 }
  if (year > maxYear) return { year: maxYear, month: 12 }

  const monthData = getMonthData(year, month)
  if (monthData) return { year, month }

  return { year, month: Math.min(12, Math.max(1, month)) }
}

export function getCurrentBsDate(): BsDate {
  const now = new Date()
  const adToday = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  const data = getCalendarData()
  for (const yearKey of Object.keys(data)) {
    const yearData = data[yearKey]
    if (!yearData) continue
    for (const monthKey of Object.keys(yearData)) {
      const monthData = yearData[monthKey]
      if (!monthData) continue
      for (const day of monthData.days) {
        if (day.adDate === adToday) {
          return {
            year: day.bsYear,
            month: day.bsMonth,
            day: day.bsDay,
          }
        }
      }
    }
  }

  return { year: 2083, month: 1, day: 1 }
}

export function findDayInData(date: BsDate) {
  const monthData = getMonthData(date.year, date.month)
  return monthData?.days.find(
    (day) =>
      day.bsYear === date.year &&
      day.bsMonth === date.month &&
      day.bsDay === date.day,
  )
}

export function isDateDisabled(
  date: BsDate,
  disabled?: boolean | ((date: BsDate) => boolean),
): boolean {
  if (typeof disabled === 'boolean') return disabled
  if (typeof disabled === 'function') return disabled(date)
  return false
}

export function mergeCalendarData(
  target: BsCalendarData,
  source: BsCalendarData,
): BsCalendarData {
  const merged: BsCalendarData = { ...target }

  for (const [year, months] of Object.entries(source)) {
    merged[year] = { ...(merged[year] ?? {}), ...months }
  }

  return merged
}

let cachedAllBsDates: BsDate[] | null = null
let cachedBsDateIndexByKey: Map<string, number> | null = null

export function getAllBsDates(): readonly BsDate[] {
  if (cachedAllBsDates) return cachedAllBsDates

  const dates: BsDate[] = []
  const indexByKey = new Map<string, number>()

  for (const year of getYears()) {
    for (let month = 1; month <= 12; month++) {
      const monthData = getMonthData(year, month)
      if (!monthData) continue

      for (const day of monthData.days) {
        if (day.bsYear !== year || day.bsMonth !== month) continue

        const date: BsDate = {
          year: day.bsYear,
          month: day.bsMonth,
          day: day.bsDay,
        }
        const key = `${date.year}-${date.month}-${date.day}`
        if (indexByKey.has(key)) continue

        indexByKey.set(key, dates.length)
        dates.push(date)
      }
    }
  }

  cachedAllBsDates = dates
  cachedBsDateIndexByKey = indexByKey
  return dates
}

export function getBsDateIndex(date: BsDate): number {
  getAllBsDates()
  return cachedBsDateIndexByKey?.get(`${date.year}-${date.month}-${date.day}`) ?? -1
}
