import {
  clampBsTime,
  formatHourOption,
  formatMinuteOption,
  formatPeriodOption,
  getDefaultBsTime,
  getHourOptions,
  getMinuteOptions,
  getPeriodOptions,
  resolveDisplayHour,
  resolveDisplayPeriod,
  resolveWheelHour,
} from '@/lib/bs-time-picker'
import type { BsLocale, BsPeriod, BsTime } from '@/lib/bs-time-picker/time/types'
import {
  BS_WHEEL_HOUR_COL_WIDTH,
  BS_WHEEL_MIN_COL_WIDTH,
  BS_WHEEL_PERIOD_COL_WIDTH,
  BsWheelColumn,
  BsWheelRow,
} from './bs-wheel-column'

type BsTimePickerWheelsProps = {
  value: BsTime
  locale: BsLocale
  is24Hour?: boolean
  onChange: (value: BsTime) => void
}

export function BsTimePickerWheelColumns({
  value,
  locale,
  is24Hour = false,
  onChange,
}: BsTimePickerWheelsProps) {
  const clamped = clampBsTime(value)
  const hourOptions = getHourOptions(is24Hour)
  const minuteOptions = getMinuteOptions()
  const periodOptions = getPeriodOptions()

  const displayHour = resolveDisplayHour(clamped.hour, is24Hour)
  const displayPeriod = resolveDisplayPeriod(clamped.hour, is24Hour)

  const updateTime = (
    nextHour: number,
    nextMinute: number,
    nextPeriod: BsPeriod,
  ) => {
    onChange(
      clampBsTime({
        hour: resolveWheelHour(nextHour, nextPeriod, is24Hour),
        minute: nextMinute,
      }),
    )
  }

  return (
    <>
      <BsWheelColumn
        showOverlay={false}
        compact
        columnWidth={BS_WHEEL_HOUR_COL_WIDTH}
        items={hourOptions}
        selected={displayHour}
        onSelect={(hour) => updateTime(hour, clamped.minute, displayPeriod)}
        formatLabel={(hour) => formatHourOption(hour, locale, is24Hour)}
        loop
      />
      <BsWheelColumn
        showOverlay={false}
        compact
        columnWidth={BS_WHEEL_MIN_COL_WIDTH}
        items={minuteOptions}
        selected={clamped.minute}
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
            updateTime(displayHour, clamped.minute, period)
          }
          formatLabel={(period) => formatPeriodOption(period, locale)}
        />
      ) : null}
    </>
  )
}

export function BsTimePickerWheels({
  ...props
}: BsTimePickerWheelsProps) {
  return (
    <BsWheelRow>
      <BsTimePickerWheelColumns {...props} />
    </BsWheelRow>
  )
}

export { getDefaultBsTime }
