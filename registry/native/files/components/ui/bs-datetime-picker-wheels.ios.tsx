import {
  clampBsDate,
  formatBsDateWheelKey,
  getBsDateWheelKeys,
  parseBsDateWheelKey,
} from '@/lib/bs-picker'
import { getBsDateIndex } from '@/lib/bs-day-picker/navigation'
import { bsDateKey } from '@/lib/bs-day-picker/types'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import {
  clampBsTime,
  formatHourOption,
  formatMinuteOption,
  formatPeriodOption,
  getHourOptions,
  getMinuteOptions,
  getPeriodOptions,
  resolveDisplayHour,
  resolveDisplayPeriod,
  resolveWheelHour,
} from '../../lib/bs-time-picker'
import type { BsDateTime, BsPeriod, BsTime } from '@/lib/bs-time-picker/time/types'
import { mergeBsDateTime, splitBsDateTime } from '../../lib/bs-datetime-picker'
import {
  BS_WHEEL_DATE_COL_WIDTH,
  BS_WHEEL_HOUR_COL_WIDTH,
  BS_WHEEL_MIN_COL_WIDTH,
  BS_WHEEL_PERIOD_COL_WIDTH,
  BsWheelColumn,
  BsWheelRow,
} from './bs-wheel-column'

type BsDateTimePickerWheelsProps = {
  value: BsDateTime
  locale: BsLocale
  is24Hour?: boolean
  onChange: (value: BsDateTime) => void
}

export function BsDateTimePickerWheels({
  value,
  locale,
  is24Hour = false,
  onChange,
}: BsDateTimePickerWheelsProps) {
  const { date, time } = splitBsDateTime(value)
  const dateKeys = getBsDateWheelKeys()
  const clampedDate = clampBsDate(date)
  const clampedTime = clampBsTime(time)
  const selectedKey = bsDateKey(clampedDate)
  const selectedIndex = getBsDateIndex(clampedDate)

  const hourOptions = getHourOptions(is24Hour)
  const minuteOptions = getMinuteOptions()
  const periodOptions = getPeriodOptions()
  const displayHour = resolveDisplayHour(clampedTime.hour, is24Hour)
  const displayPeriod = resolveDisplayPeriod(clampedTime.hour, is24Hour)

  const handleDateChange = (nextDate: BsDate) => {
    onChange(mergeBsDateTime(clampBsDate(nextDate), clampedTime))
  }

  const updateTime = (
    nextHour: number,
    nextMinute: number,
    nextPeriod: BsPeriod,
  ) => {
    const nextTime: BsTime = clampBsTime({
      hour: resolveWheelHour(nextHour, nextPeriod, is24Hour),
      minute: nextMinute,
    })
    onChange(mergeBsDateTime(clampedDate, nextTime))
  }

  return (
    <BsWheelRow>
      <BsWheelColumn
        showOverlay={false}
        columnWidth={BS_WHEEL_DATE_COL_WIDTH}
        items={dateKeys}
        selected={selectedKey}
        selectedIndex={selectedIndex >= 0 ? selectedIndex : undefined}
        onSelect={(key) => {
          const next = parseBsDateWheelKey(key)
          if (next) handleDateChange(clampBsDate(next))
        }}
        formatLabel={(key) => formatBsDateWheelKey(key, locale)}
      />
      <BsWheelColumn
        showOverlay={false}
        compact
        columnWidth={BS_WHEEL_HOUR_COL_WIDTH}
        items={hourOptions}
        selected={displayHour}
        onSelect={(hour) => updateTime(hour, clampedTime.minute, displayPeriod)}
        formatLabel={(hour) => formatHourOption(hour, locale, is24Hour)}
        loop
      />
      <BsWheelColumn
        showOverlay={false}
        compact
        columnWidth={BS_WHEEL_MIN_COL_WIDTH}
        items={minuteOptions}
        selected={clampedTime.minute}
        onSelect={(minute) => updateTime(displayHour, minute, displayPeriod)}
        formatLabel={(minute) => formatMinuteOption(minute, locale)}
        loop
      />
      {!is24Hour ? (
        <BsWheelColumn
          showOverlay={false}
          compact
          columnWidth={BS_WHEEL_PERIOD_COL_WIDTH}
          items={periodOptions}
          selected={displayPeriod}
          onSelect={(period) =>
            updateTime(displayHour, clampedTime.minute, period)
          }
          formatLabel={(period) => formatPeriodOption(period, locale)}
        />
      ) : null}
    </BsWheelRow>
  )
}
