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
import { View } from 'react-native'
import { BsWheelColumn, BS_WHEEL_HEIGHT } from './bs-wheel-column'

type BsTimePickerWheelsProps = {
  value: BsTime
  locale: BsLocale
  is24Hour?: boolean
  onChange: (value: BsTime) => void
}

export function BsTimePickerWheels({
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
    <View
      className="w-full flex-row px-1"
      style={{ height: BS_WHEEL_HEIGHT }}
    >
      <BsWheelColumn
        showOverlay
        className="flex-1"
        items={hourOptions}
        selected={displayHour}
        onSelect={(hour) => updateTime(hour, clamped.minute, displayPeriod)}
        formatLabel={(hour) => formatHourOption(hour, locale, is24Hour)}
        loop
      />
      <BsWheelColumn
        showOverlay
        className="flex-1"
        items={minuteOptions}
        selected={clamped.minute}
        onSelect={(minute) =>
          updateTime(displayHour, minute, displayPeriod)
        }
        formatLabel={(minute) => formatMinuteOption(minute, locale)}
        loop
      />
      {!is24Hour ? (
        <BsWheelColumn
          showOverlay
          className="flex-1"
          items={periodOptions}
          selected={displayPeriod}
          onSelect={(period) =>
            updateTime(displayHour, clamped.minute, period)
          }
          formatLabel={(period) => formatPeriodOption(period, locale)}
        />
      ) : null}
    </View>
  )
}

export { getDefaultBsTime }
