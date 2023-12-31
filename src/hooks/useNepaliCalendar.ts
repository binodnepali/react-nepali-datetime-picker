import { useMemo, useState } from 'react'

import { Language } from '@/types/Language'
import { Day, Month, Year } from '@/types/NepaliDate'
import {
  getCurrentNepaliDate,
  getMonthDatesByYear,
  getMonths,
  getWeekDays,
  getYears,
  YEAR_MONTH_DATE_SEPARATOR,
} from '@/utils/nepaliDate'

interface UseNepaliCalendarParams {
  lang?: Language
  shortMonth?: boolean
}

export const useNepaliCalendar = ({
  lang = 'ne',
  shortMonth = false,
}: UseNepaliCalendarParams) => {
  const {
    date: currentDate,
    month: currentMonth,
    year: currentYear,
  } = getCurrentNepaliDate(lang)

  const years = useMemo(() => getYears(lang), [lang])
  const months = useMemo(() => getMonths(lang, shortMonth), [lang, shortMonth])
  const weekDays = useMemo(() => getWeekDays(lang), [lang])

  const [selectedLocalisedYear, setSelectedLocalisedYear] = useState<Year>(
    years.find((y) => y.value === currentYear.value) as Year,
  )
  const [selectedLocalisedMonth, setSelectedLocalisedMonth] = useState<Month>(
    months.find((m) => m.value === currentMonth.value) as Month,
  )
  const [selectedLocalisedDate, setSelectedLocalisedDate] = useState<Day>()

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
      year: currentYear.value,
      month: currentMonth.value,
      lang,
    })

    return dates.find(
      (d) =>
        d?.id ===
        `${currentYear.value}${YEAR_MONTH_DATE_SEPARATOR}${currentMonth.value}${YEAR_MONTH_DATE_SEPARATOR}${currentDate.value}`,
    )
  }, [currentDate, currentMonth, currentYear, lang])

  // useEffect(() => {
  //   const foundCurrentYear = years.find((y) => y.value === currentYear.value)
  //   if (!foundCurrentYear) {
  //     return
  //   }

  //   const foundCurrentMonth = months.find((m) => m.value === currentMonth.value)
  //   if (!foundCurrentMonth) {
  //     return
  //   }

  //    setSelectedLocalisedYear(() => foundCurrentYear)
  //   setSelectedLocalisedMonth(() => foundCurrentMonth)
  // }, [currentMonth, currentYear, months, years])

  return {
    selectedLocalisedYear,
    setSelectedLocalisedYear,
    selectedLocalisedMonth,
    setSelectedLocalisedMonth,
    selectedLocalisedDate,
    setSelectedLocalisedDate,
    selectedLocalisedDates,
    currentLocalisedDate,
    years,
    months,
    days: weekDays,
    currentYear,
    currentMonth,
    currentDate,
  }
}
