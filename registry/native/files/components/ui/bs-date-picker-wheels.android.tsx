import {
  clampBsDate,
  formatBsDayOption,
  formatBsYearOption,
  getBsDayOptions,
  getBsMonthOptions,
  getBsYearOptions,
} from '@/lib/bs-picker'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import { View } from 'react-native'
import { BsWheelColumn } from './bs-wheel-column'

type BsDatePickerWheelsProps = {
  value: BsDate
  locale: BsLocale
  onChange: (value: BsDate) => void
}

export function BsDatePickerWheels({
  value,
  locale,
  onChange,
}: BsDatePickerWheelsProps) {
  const years = getBsYearOptions()
  const months = getBsMonthOptions(locale, true)
  const days = getBsDayOptions(value.year, value.month)

  const update = (patch: Partial<BsDate>) => {
    onChange(clampBsDate({ ...value, ...patch }))
  }

  return (
    <View className="w-full flex-row px-1">
      <BsWheelColumn
        items={years}
        selected={value.year}
        onSelect={(year) => update({ year })}
        formatLabel={(year) => formatBsYearOption(year, locale)}
      />
      <BsWheelColumn
        loop
        items={months.map((month) => month.value)}
        selected={value.month}
        onSelect={(month) => update({ month })}
        formatLabel={(month) =>
          months.find((entry) => entry.value === month)?.label ??
          String(month)
        }
      />
      <BsWheelColumn
        loop
        items={days}
        selected={value.day}
        onSelect={(day) => update({ day })}
        formatLabel={(day) => formatBsDayOption(day, locale)}
      />
    </View>
  )
}
