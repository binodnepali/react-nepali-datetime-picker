import {
  clampBsDate,
  formatBsDateWheelKey,
  getBsDateWheelKeys,
  parseBsDateWheelKey,
} from '@/lib/bs-picker'
import { getBsDateIndex } from '@/lib/bs-day-picker/navigation'
import { bsDateKey } from '@/lib/bs-day-picker/types'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import { BsWheelColumn, BsWheelRow, BS_WHEEL_DATE_COL_WIDTH } from './bs-wheel-column'

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
    <BsWheelRow>
      <BsWheelColumn
        showOverlay={false}
        columnWidth={BS_WHEEL_DATE_COL_WIDTH}
        items={dateKeys}
        selected={selectedKey}
        selectedIndex={selectedIndex >= 0 ? selectedIndex : undefined}
        onSelect={(key) => {
          const next = parseBsDateWheelKey(key)
          if (next) onChange(clampBsDate(next))
        }}
        formatLabel={(key) => formatBsDateWheelKey(key, locale)}
      />
    </BsWheelRow>
  )
}
