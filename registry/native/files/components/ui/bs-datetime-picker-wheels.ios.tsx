import { clampBsDate } from '@/lib/bs-picker'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import type { BsTime } from '@/lib/bs-time-picker/time/types'
import type { BsDateTime } from '@/lib/bs-time-picker/time/types'
import { mergeBsDateTime, splitBsDateTime } from '@/lib/bs-datetime-picker'
import { View } from 'react-native'
import { BsDatePickerWheels } from './bs-date-picker-wheels'
import { BsTimePickerWheels } from './bs-time-picker-wheels'

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

  const handleDateChange = (nextDate: BsDate) => {
    onChange(mergeBsDateTime(clampBsDate(nextDate), time))
  }

  const handleTimeChange = (nextTime: BsTime) => {
    onChange(mergeBsDateTime(date, nextTime))
  }

  return (
    <View className="w-full flex-row">
      <View className="flex-[1.4]">
        <BsDatePickerWheels
          value={date}
          locale={locale}
          onChange={handleDateChange}
        />
      </View>
      <View className="flex-1">
        <BsTimePickerWheels
          value={time}
          locale={locale}
          is24Hour={is24Hour}
          onChange={handleTimeChange}
        />
      </View>
    </View>
  )
}
