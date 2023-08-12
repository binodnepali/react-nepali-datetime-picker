import ExpandMoreIcon from '@assets/More.svg'
import NextIcon from '@assets/Next.svg'
import PrevIcon from '@assets/Prev.svg'
import { useNepaliCalendar } from '@hooks/useNepaliCalendar'
import { Button } from '@ui/Button/Button'
import { useEffect, useState } from 'react'

import { cn } from '@/plugins/twMerge'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'

export interface NepaliCalendarProps {
  className?: string
  lang?: Language
  separator?: string
  selectedDate?: NepaliDate
  openYearSelector?: boolean
  onDateSelect?: (date: NepaliDate) => void
}

export const NepaliCalendar = ({
  className = '',
  lang = 'ne',
  selectedDate,
  onDateSelect,
  openYearSelector = false,
}: NepaliCalendarProps) => {
  const [showYearSelector, setShowYearSelector] = useState(false)
  useEffect(() => {
    setShowYearSelector(() => openYearSelector)
  }, [openYearSelector])

  const {
    selectedLocalisedYear,
    selectedLocalisedMonth,
    setSelectedLocalisedYear,
    setSelectedLocalisedMonth,
    selectedLocalisedDates,
    currentLocalisedDate,
    years,
    months,
    days,
  } = useNepaliCalendar({
    lang,
  })

  const handleOnSelectDate = (date: {
    id: string
    value: number
    label: string
  }) => {
    if (!selectedLocalisedYear || !selectedLocalisedMonth) {
      return
    }

    onDateSelect?.({
      year: selectedLocalisedYear,
      month: {
        ...selectedLocalisedMonth,
        value: selectedLocalisedMonth.value + 1,
      },
      date,
    })
  }

  const handleOnYearClick = (year: number) => {
    const selectedYear = years.find((y) => y.value === year)
    if (!selectedYear) {
      return
    }

    setSelectedLocalisedYear(() => selectedYear)
    setShowYearSelector(() => false)
  }

  const handleOnPrevClick = () => {
    if (!selectedLocalisedYear || !selectedLocalisedMonth) {
      return
    }

    const prevMonth = selectedLocalisedMonth.value - 1
    const prevYear = selectedLocalisedYear.value - 1

    if (prevMonth < 0 && years.find((y) => y.value === prevYear)) {
      const foundPrevYear = years.find((y) => y.value === prevYear)
      if (!foundPrevYear) {
        return
      }

      const foundPrevMonth = months.find((m) => m.value === 11)
      if (!foundPrevMonth) {
        return
      }

      setSelectedLocalisedYear(() => foundPrevYear)
      setSelectedLocalisedMonth(() => foundPrevMonth)

      return
    }

    if (prevMonth < 0) {
      return
    }

    const foundPrevMonth = months.find((m) => m.value === prevMonth)
    if (!foundPrevMonth) {
      return
    }

    setSelectedLocalisedMonth(() => foundPrevMonth)
  }

  const handleOnNextClick = () => {
    if (!selectedLocalisedYear || !selectedLocalisedMonth) {
      return
    }

    const nextMonth = selectedLocalisedMonth.value + 1
    const nextYear = selectedLocalisedYear.value + 1

    if (
      nextMonth > months.length - 1 &&
      years.find((y) => y.value === nextYear)
    ) {
      const foundNextYear = years.find((y) => y.value === nextYear)
      if (!foundNextYear) {
        return
      }

      const foundNextMonth = months.find((m) => m.value === 0)
      if (!foundNextMonth) {
        return
      }

      setSelectedLocalisedYear(() => foundNextYear)
      setSelectedLocalisedMonth(() => foundNextMonth)
      return
    }

    if (nextMonth > months.length - 1) {
      return
    }

    const foundNextMonth = months.find((m) => m.value === nextMonth)
    if (!foundNextMonth) {
      return
    }

    setSelectedLocalisedMonth(() => foundNextMonth)
  }

  useEffect(() => {
    if (!selectedDate) return

    const foundYear = years.find((y) => y.value === selectedDate.year.value)
    if (!foundYear) {
      return
    }

    const foundMonth = months.find(
      (m) => m.value === selectedDate.month.value - 1,
    )
    if (!foundMonth) {
      return
    }

    setSelectedLocalisedYear(() => foundYear)
    setSelectedLocalisedMonth(() => foundMonth)
  }, [
    months,
    selectedDate,
    setSelectedLocalisedMonth,
    setSelectedLocalisedYear,
    years,
  ])

  return (
    <div
      className={cn(
        'ne-dt-bg-neutral-50 ne-dt-py-4 ne-dt-px-4 ne-dt-rounded-md',
        className,
      )}
    >
      <div className="ne-dt-flex ne-dt-flex-row ne-dt-justify-between">
        <div className="ne-dt-flex ne-dt-flex-row ne-dt-gap-2 ne-dt-items-center">
          <span>{selectedLocalisedMonth?.label}</span>
          <span>{selectedLocalisedYear?.label}</span>
          <Button onClick={() => setShowYearSelector((value) => !value)}>
            <ExpandMoreIcon
              width="36"
              height="36"
              className={cn(
                'ne-dt-transition-transform ne-dt-duration-500',
                showYearSelector && 'ne-dt-transform ne-dt-rotate-180',
              )}
            />
          </Button>
        </div>

        <div
          className={cn(
            'ne-dt-grid ne-dt-grid-cols-2 ne-dt-gap-2',
            showYearSelector && 'ne-dt-hidden',
          )}
        >
          <Button onClick={handleOnPrevClick}>
            <PrevIcon width="36" height="36" />
          </Button>
          <Button onClick={handleOnNextClick}>
            <NextIcon width="36" height="36" />
          </Button>
        </div>
      </div>

      {!showYearSelector && (
        <>
          <div className="ne-dt-grid ne-dt-grid-cols-7 ne-dt-gap-2 ne-dt-justify-items-center ne-dt-mt-4">
            {days.map((day) => (
              <span key={day.value}>{day.label}</span>
            ))}
          </div>

          <div className="ne-dt-grid ne-dt-grid-cols-7 ne-dt-gap-2 ne-dt-justify-items-center ne-dt-mt-4">
            {selectedLocalisedDates.map((date) => (
              <Button
                key={date.id}
                id={date.id}
                className="ne-dt-w-9 ne-dt-h-9 ne-dt-p-2"
                active={date.id === currentLocalisedDate?.id}
                inactive={!date.currentMonth}
                selected={date.id === selectedDate?.date?.id}
                onClick={() => handleOnSelectDate(date)}
              >
                <span>{date.label}</span>
              </Button>
            ))}
          </div>
        </>
      )}

      {showYearSelector && (
        <div className="ne-dt-max-h-72 ne-dt-overflow-y-auto">
          <div className="ne-dt-grid ne-dt-grid-cols-4 ne-dt-gap-2 ne-dt-justify-items-center ne-dt-mt-4 ne-dt-max-h-xs">
            {years.map((y) => (
              <Button
                key={y.value}
                onClick={() => handleOnYearClick(y.value)}
                active={currentLocalisedDate?.id.includes(y.value.toString())}
                selected={selectedLocalisedYear?.label.includes(
                  y.value.toString(),
                )}
                variant="pilled"
              >
                <span>{y.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
