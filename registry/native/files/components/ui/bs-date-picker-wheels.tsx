import { Picker } from '@expo/ui/community/picker'
import {
  clampBsDate,
  formatBsDayOption,
  formatBsYearOption,
  getBsDayOptions,
  getBsMonthOptions,
  getBsYearOptions,
} from '@/lib/bs-picker'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import { Platform, View } from 'react-native'

type BsDatePickerWheelsProps = {
  value: BsDate
  locale: BsLocale
  onChange: (value: BsDate) => void
}

const pickerStyle =
  Platform.OS === 'ios' ? { flex: 1, height: 196 } : { flex: 1, minHeight: 48 }

export function BsDatePickerWheels({
  value,
  locale,
  onChange,
}: BsDatePickerWheelsProps) {
  const years = getBsYearOptions()
  const months = getBsMonthOptions(locale, Platform.OS === 'android')
  const days = getBsDayOptions(value.year, value.month)

  const update = (patch: Partial<BsDate>) => {
    onChange(clampBsDate({ ...value, ...patch }))
  }

  return (
    <View className="w-full flex-row gap-1">
      <Picker
        selectedValue={value.year}
        onValueChange={(year) => update({ year: Number(year) })}
        style={pickerStyle}
      >
        {years.map((year) => (
          <Picker.Item
            key={year}
            label={formatBsYearOption(year, locale)}
            value={year}
          />
        ))}
      </Picker>

      <Picker
        selectedValue={value.month}
        onValueChange={(month) => update({ month: Number(month) })}
        style={pickerStyle}
      >
        {months.map((month) => (
          <Picker.Item
            key={month.value}
            label={month.label}
            value={month.value}
          />
        ))}
      </Picker>

      <Picker
        selectedValue={value.day}
        onValueChange={(day) => update({ day: Number(day) })}
        style={pickerStyle}
      >
        {days.map((day) => (
          <Picker.Item
            key={day}
            label={formatBsDayOption(day, locale)}
            value={day}
          />
        ))}
      </Picker>
    </View>
  )
}
