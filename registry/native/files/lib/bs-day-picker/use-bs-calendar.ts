import { useMemo, useState } from 'react'

import { buildMonthGrid, getDefaultMonth } from './calendar-grid'
import { getMonthLabel, getWeekdayLabel, getYearOptions } from './constants'
import { formatBsDateLong } from './formatters'
import { addMonths, clampMonth, getCurrentBsDate } from './navigation'
import { selectSingleDate } from './selection'
import type {
  BsDate,
  BsDayCell,
  BsDisabledMatcher,
  BsLocale,
  BsMonth,
  BsSelectionMode,
} from './types'

export type UseBsCalendarOptions = {
  locale?: BsLocale
  month?: BsMonth
  selected?: BsDate
  mode?: BsSelectionMode
  showOutsideDays?: boolean
  disabled?: BsDisabledMatcher | boolean
  onMonthChange?: (month: BsMonth) => void
  onSelect?: (date: BsDate | undefined) => void
}

export type UseBsCalendarResult = {
  locale: BsLocale
  month: BsMonth
  weeks: BsDayCell[][]
  weekdayLabels: string[]
  years: number[]
  months: Array<{ value: number; label: string }>
  captionLabel: string
  today: BsDate
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  setMonth: (month: BsMonth) => void
  selectDate: (date: BsDate | undefined) => void
}

export function useBsCalendar({
  locale = 'ne',
  month: monthProp,
  selected,
  mode = 'single',
  showOutsideDays = true,
  disabled,
  onMonthChange,
  onSelect,
}: UseBsCalendarOptions = {}): UseBsCalendarResult {
  const [internalMonth, setInternalMonth] = useState<BsMonth>(() =>
    getDefaultMonth(selected),
  )

  const month = monthProp ?? internalMonth
  const today = useMemo(() => getCurrentBsDate(), [])

  const weeks = useMemo(
    () =>
      buildMonthGrid({
        month,
        locale,
        showOutsideDays,
        selected,
        today,
        disabled,
      }),
    [month, locale, showOutsideDays, selected, today, disabled],
  )

  const weekdayLabels = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        getWeekdayLabel(index, locale, true),
      ),
    [locale],
  )

  const years = useMemo(() => getYearOptions(), [])

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const value = index + 1
        return {
          value,
          label: getMonthLabel(value, locale),
        }
      }),
    [locale],
  )

  const setMonth = (nextMonth: BsMonth) => {
    const clamped = clampMonth(nextMonth)
    if (!monthProp) {
      setInternalMonth(clamped)
    }
    onMonthChange?.(clamped)
  }

  const goToPreviousMonth = () => {
    setMonth(addMonths(month, -1))
  }

  const goToNextMonth = () => {
    setMonth(addMonths(month, 1))
  }

  const selectDate = (date: BsDate | undefined) => {
    const next = selectSingleDate(selected, date, mode)
    onSelect?.(next)
  }

  return {
    locale,
    month,
    weeks,
    weekdayLabels,
    years,
    months,
    captionLabel: formatBsDateLong(
      { year: month.year, month: month.month, day: 1 },
      locale,
    ).replace(/^\d+\s/, `${getMonthLabel(month.month, locale)} `),
    today,
    goToPreviousMonth,
    goToNextMonth,
    setMonth,
    selectDate,
  }
}
