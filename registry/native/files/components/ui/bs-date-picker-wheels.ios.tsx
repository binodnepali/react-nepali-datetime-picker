import {
  clampBsDate,
  formatBsDayOption,
  formatBsYearOption,
  getBsDayOptions,
  getBsMonthOptions,
  getBsYearOptions,
} from '@/lib/bs-picker'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import * as React from 'react'
import {
  BS_WHEEL_DATE_ROW_INSET,
  BS_WHEEL_MIN_COL_WIDTH,
  BS_WHEEL_MONTH_COL_WIDTH,
  BS_WHEEL_MONTH_COL_WIDTH_NE,
  BS_WHEEL_YEAR_COL_WIDTH,
  BS_WHEEL_YEAR_COL_WIDTH_NE,
  BsWheelColumn,
  BsWheelRow,
} from './bs-wheel-column'

type BsDatePickerWheelsProps = {
  value: BsDate
  locale: BsLocale
  onChange: (value: BsDate) => void
}

type BsDatePickerDayWheelProps = {
  year: number
  month: number
  day: number
  locale: BsLocale
  onDayChange: (day: number) => void
}

const BsDatePickerDayWheel = React.memo(function BsDatePickerDayWheel({
  year,
  month,
  day,
  locale,
  onDayChange,
}: BsDatePickerDayWheelProps) {
  const days = React.useMemo(
    () => getBsDayOptions(year, month),
    [year, month],
  )
  const formatDay = React.useCallback(
    (value: number) => formatBsDayOption(value, locale),
    [locale],
  )

  return (
    <BsWheelColumn
      showOverlay={false}
      compact
      columnWidth={BS_WHEEL_MIN_COL_WIDTH}
      loop
      items={days}
      selected={day}
      onSelect={onDayChange}
      formatLabel={formatDay}
    />
  )
})

type BsDatePickerMonthWheelProps = {
  month: number
  locale: BsLocale
  onMonthChange: (month: number) => void
}

const BsDatePickerMonthWheel = React.memo(function BsDatePickerMonthWheel({
  month,
  locale,
  onMonthChange,
}: BsDatePickerMonthWheelProps) {
  const months = React.useMemo(() => getBsMonthOptions(locale), [locale])
  const monthValues = React.useMemo(
    () => months.map((entry) => entry.value),
    [months],
  )
  const monthLabels = React.useMemo(
    () => new Map(months.map((entry) => [entry.value, entry.label])),
    [months],
  )
  const formatMonth = React.useCallback(
    (value: number) => monthLabels.get(value) ?? String(value),
    [monthLabels],
  )

  return (
    <BsWheelColumn
      showOverlay={false}
      columnWidth={
        locale === 'ne' ? BS_WHEEL_MONTH_COL_WIDTH_NE : BS_WHEEL_MONTH_COL_WIDTH
      }
      loop
      items={monthValues}
      selected={month}
      onSelect={onMonthChange}
      formatLabel={formatMonth}
    />
  )
})

type BsDatePickerYearWheelProps = {
  year: number
  locale: BsLocale
  onYearChange: (year: number) => void
}

const BsDatePickerYearWheel = React.memo(function BsDatePickerYearWheel({
  year,
  locale,
  onYearChange,
}: BsDatePickerYearWheelProps) {
  const years = React.useMemo(() => getBsYearOptions(), [])
  const formatYear = React.useCallback(
    (value: number) => formatBsYearOption(value, locale),
    [locale],
  )

  return (
    <BsWheelColumn
      showOverlay={false}
      compact
      columnWidth={
        locale === 'ne' ? BS_WHEEL_YEAR_COL_WIDTH_NE : BS_WHEEL_YEAR_COL_WIDTH
      }
      loop
      items={years}
      selected={year}
      onSelect={onYearChange}
      formatLabel={formatYear}
    />
  )
})

export function BsDatePickerWheels({
  value,
  locale,
  onChange,
}: BsDatePickerWheelsProps) {
  const clamped = clampBsDate(value)
  const clampedRef = React.useRef(clamped)
  React.useEffect(() => {
    clampedRef.current = clamped
  }, [clamped])

  const handleDayChange = React.useCallback(
    (day: number) => {
      onChange(clampBsDate({ ...clampedRef.current, day }))
    },
    [onChange],
  )
  const handleMonthChange = React.useCallback(
    (month: number) => {
      onChange(clampBsDate({ ...clampedRef.current, month }))
    },
    [onChange],
  )
  const handleYearChange = React.useCallback(
    (year: number) => {
      onChange(clampBsDate({ ...clampedRef.current, year }))
    },
    [onChange],
  )

  return (
    <BsWheelRow
      horizontalInset={BS_WHEEL_DATE_ROW_INSET}
      columnLayout="even"
    >
      <BsDatePickerDayWheel
        year={clamped.year}
        month={clamped.month}
        day={clamped.day}
        locale={locale}
        onDayChange={handleDayChange}
      />
      <BsDatePickerMonthWheel
        month={clamped.month}
        locale={locale}
        onMonthChange={handleMonthChange}
      />
      <BsDatePickerYearWheel
        year={clamped.year}
        locale={locale}
        onYearChange={handleYearChange}
      />
    </BsWheelRow>
  )
}
