import { useCallback, useEffect, useMemo, useState } from 'react'

import { Language } from '@/types/Language'
import { NepaliDate, Month, Year } from '@/types/NepaliDate'
import {
  getCurrentNepaliDate,
  getMonthDatesByYear,
  getWeekDays,
  getMonths,
  getYears,
  YEAR_MONTH_DATE_SEPARATOR,
} from '@/utils/nepaliDate'
import { addLeadingNepaliZero, addLeadingZero } from '@/utils/digit'
import { days } from '@/constants/days'

interface UseNepaliCalendarParams {
  lang?: Language
}

export const useNepaliCalendar = ({ lang = 'ne' }: UseNepaliCalendarParams) => {
  const {
    date: currentDate,
    month: currentMonth,
    year: currentYear,
  } = getCurrentNepaliDate()

  const years = useMemo(() => getYears(lang), [lang])
  const months = useMemo(() => getMonths(lang), [lang])
  const weekDays = useMemo(() => getWeekDays(lang), [lang])

  const [selectedLocalisedYear, setSelectedLocalisedYear] = useState<Year>(
    years.find((y) => y.value === currentYear) as Year,
  )
  const [selectedLocalisedMonth, setSelectedLocalisedMonth] = useState<Month>(
    months.find((m) => m.value === currentMonth) as Month,
  )
  const selectedLocalisedDates = useMemo(
    () =>
      getMonthDatesByYear({
        year: selectedLocalisedYear.value,
        month: selectedLocalisedMonth.value,
        lang,
      }),
    [selectedLocalisedMonth.value, selectedLocalisedYear.value, lang],
  )

  const currentLocalisedDate = useMemo(() => {
    const dates = getMonthDatesByYear({
      year: currentYear,
      month: currentMonth,
      lang,
    })

    return dates.find(
      (d) =>
        d?.id ===
        `${currentYear}${YEAR_MONTH_DATE_SEPARATOR}${currentMonth}${YEAR_MONTH_DATE_SEPARATOR}${currentDate}`,
    )
  }, [currentDate, currentMonth, currentYear, lang])

  const validateDate = useCallback(
    (
      value: string,
    ): {
      valid: boolean
      value?: NepaliDate
    } => {
      if (lang === 'ne') {
        const [year, month, date] = value.split(YEAR_MONTH_DATE_SEPARATOR)

        if (!year || !month || !date) {
          return {
            valid: false,
          }
        }

        const foundYear = years.find((y) => y.label === year)

        if (!foundYear) {
          return {
            valid: false,
          }
        }

        const foundMonth = months.find(
          (m) => addLeadingNepaliZero(m.value + 1) === month,
        )
        if (!foundMonth) {
          return {
            valid: false,
          }
        }

        const foundDate = days.find((d) => d.label.ne === date)

        if (!foundDate) {
          return {
            valid: false,
          }
        }

        return {
          valid: true,
          value: {
            year: foundYear,
            month: {
              ...foundMonth,
              value: foundMonth.value + 1,
            },
            date: {
              id: `${foundYear.value}${YEAR_MONTH_DATE_SEPARATOR}${foundMonth.value}${YEAR_MONTH_DATE_SEPARATOR}${foundDate.value}`,
              value: foundDate.value,
              label: foundDate.label.ne,
            },
          },
        }
      }

      const [year, month, date] = value.split(YEAR_MONTH_DATE_SEPARATOR)

      const foundYear = years.find((y) => y.label === year)
      const foundMonth = months.find(
        (m) => addLeadingZero(m.value + 1) === month,
      )

      const foundDate = days.find((d) => d.label.en === date)

      if (!foundYear || !foundMonth || !foundDate) {
        return {
          valid: false,
        }
      }

      return {
        valid: true,
        value: {
          year: foundYear,
          month: {
            ...foundMonth,
            value: foundMonth.value + 1,
          },
          date: {
            id: `${foundYear.value}${YEAR_MONTH_DATE_SEPARATOR}${foundMonth.value}${YEAR_MONTH_DATE_SEPARATOR}${foundDate.value}`,
            value: foundDate.value,
            label: foundDate.label.en,
          },
        },
      }
    },
    [lang, months, years],
  )

  useEffect(() => {
    const foundCurrentYear = years.find((y) => y.value === currentYear)
    if (!foundCurrentYear) {
      console.log('No current year found')
      return
    }

    const foundCurrentMonth = months.find((m) => m.value === currentMonth)
    if (!foundCurrentMonth) {
      console.log('No current month found')
      return
    }

    setSelectedLocalisedYear(() => foundCurrentYear)
    setSelectedLocalisedMonth(() => foundCurrentMonth)
  }, [currentMonth, currentYear, months, years])

  return {
    selectedLocalisedYear,
    setSelectedLocalisedYear,
    selectedLocalisedMonth,
    setSelectedLocalisedMonth,
    selectedLocalisedDates,
    currentLocalisedDate,
    validateDate,
    years,
    months,
    days: weekDays,
    currentYear,
    currentMonth,
    currentDate,
  }
}
