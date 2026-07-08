import type { BsDate, BsDayCell, BsLocale, BsMonth } from './types'
import { getWeekdayLabel } from './constants'
import { findDayInData, getCurrentBsDate, getMonthData } from './navigation'
import { bsDatesEqual } from './types'

function createPlaceholderCell(weekday: number, month: BsMonth): BsDayCell {
  return {
    date: { year: month.year, month: month.month, day: 0 },
    adDate: '',
    weekday,
    currentMonth: false,
    isPlaceholder: true,
    isDisabled: true,
    isToday: false,
    isSelected: false,
  }
}

function buildGridCells(cells: BsDayCell[], month: BsMonth): BsDayCell[] {
  const firstCurrentIndex = cells.findIndex((cell) => cell.currentMonth)
  if (firstCurrentIndex === -1) return []

  const gridCells: BsDayCell[] = []

  if (firstCurrentIndex === 0) {
    const leadingCount = cells[firstCurrentIndex]?.weekday ?? 0
    for (let weekday = 0; weekday < leadingCount; weekday++) {
      gridCells.push(createPlaceholderCell(weekday, month))
    }
  }

  gridCells.push(...cells)

  const remainder = gridCells.length % 7
  if (remainder > 0) {
    const lastWeekday = gridCells[gridCells.length - 1]?.weekday ?? 0
    for (let index = 0; index < 7 - remainder; index++) {
      gridCells.push(createPlaceholderCell((lastWeekday + 1 + index) % 7, month))
    }
  }

  return gridCells
}

export function buildMonthGrid({
  month,
  locale,
  showOutsideDays = true,
  selected,
  today,
  disabled,
}: {
  month: BsMonth
  locale: BsLocale
  showOutsideDays?: boolean
  selected?: BsDate
  today?: BsDate
  disabled?: boolean | ((date: BsDate) => boolean)
}): BsDayCell[][] {
  void showOutsideDays

  const monthData = getMonthData(month.year, month.month)
  if (!monthData) return []

  const cells: BsDayCell[] = monthData.days.map((day) => {
    const date: BsDate = {
      year: day.bsYear,
      month: day.bsMonth,
      day: day.bsDay,
    }
    const currentMonth =
      day.bsYear === month.year && day.bsMonth === month.month

    return {
      date,
      adDate: day.adDate,
      weekday: day.weekday,
      currentMonth,
      events: day.events,
      isHoliday: day.isHoliday,
      isToday: today ? bsDatesEqual(date, today) : false,
      isSelected: selected ? bsDatesEqual(date, selected) : false,
      isDisabled:
        typeof disabled === 'function'
          ? disabled(date)
          : Boolean(disabled),
    }
  })

  const gridCells = buildGridCells(cells, month)
  const weeks: BsDayCell[][] = []

  for (let index = 0; index < gridCells.length; index += 7) {
    weeks.push(gridCells.slice(index, index + 7))
  }

  return weeks
}

export function getWeekdayLabels(locale: BsLocale, short = true): string[] {
  return Array.from({ length: 7 }, (_, index) =>
    getWeekdayLabel(index, locale, short),
  )
}

export function getDefaultMonth(selected?: BsDate): BsMonth {
  if (selected) {
    return { year: selected.year, month: selected.month }
  }

  const today = getCurrentBsDate()
  return { year: today.year, month: today.month }
}

export function getDayAdDate(date: BsDate): string | null {
  return findDayInData(date)?.adDate ?? null
}
