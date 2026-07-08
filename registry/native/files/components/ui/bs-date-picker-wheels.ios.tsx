import {
  clampBsDate,
  formatBsDateWheelKey,
  getBsDateWheelKeys,
  parseBsDateWheelKey,
} from '@/lib/bs-picker'
import { getBsDateIndex } from '@/lib/bs-day-picker/navigation'
import { bsDateKey } from '@/lib/bs-day-picker/types'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import { View } from 'react-native'
import { BsWheelColumn, BS_WHEEL_HEIGHT } from './bs-wheel-column'

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
  const dateKeys = getBsDateWheelKeys()
  const clampedValue = clampBsDate(value)
  const selectedKey = bsDateKey(clampedValue)
  const selectedIndex = getBsDateIndex(clampedValue)

  return (
    <View className="w-full px-1" style={{ height: BS_WHEEL_HEIGHT }}>
      <BsWheelColumn
        showOverlay
        className="w-full"
        items={dateKeys}
        selected={selectedKey}
        selectedIndex={selectedIndex >= 0 ? selectedIndex : undefined}
        onSelect={(key) => {
          const next = parseBsDateWheelKey(key)
          if (next) onChange(clampBsDate(next))
        }}
        formatLabel={(key) => formatBsDateWheelKey(key, locale)}
      />
    </View>
  )
}
