import { getDefaultBsDate } from '@/lib/bs-picker'
import {
  BS_DATE_DISPLAY_PATTERN,
  formatBsDatePattern,
} from '@/lib/bs-day-picker/pattern'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import { cn } from '@/lib/utils'
import { Calendar } from 'lucide-react-native'
import * as React from 'react'
import { Modal, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BsDatePickerWheels } from './bs-date-picker-wheels'
import { BsWheelSheetChrome } from './bs-wheel-sheet'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

export type BsDatePickerProps = {
  value?: BsDate
  onValueChange?: (value: BsDate | undefined) => void
  locale?: BsLocale
  placeholder?: string
  title?: string
  cancelLabel?: string
  confirmLabel?: string
  formatPattern?: string
  formatValue?: (value: BsDate, locale: BsLocale) => string
  className?: string
  disabled?: boolean
}

function resolveDateDisplayLabel(
  value: BsDate,
  locale: BsLocale,
  formatValue?: BsDatePickerProps['formatValue'],
  formatPattern?: string,
): string {
  if (formatValue) return formatValue(value, locale)
  return formatBsDatePattern(
    value,
    formatPattern ?? BS_DATE_DISPLAY_PATTERN,
    locale,
  )
}

export function BsDatePicker({
  value,
  onValueChange,
  locale = 'ne',
  placeholder,
  title: _title,
  cancelLabel,
  confirmLabel,
  formatPattern,
  formatValue,
  className,
  disabled = false,
}: BsDatePickerProps) {
  const insets = useSafeAreaInsets()
  const resolvedPlaceholder =
    placeholder ?? (locale === 'ne' ? 'मिति छान्नुहोस्' : 'Select date')
  const resolvedCancel = cancelLabel ?? 'Cancel'
  const resolvedConfirm = confirmLabel ?? 'Confirm'
  const [showPicker, setShowPicker] = React.useState(false)
  const [tempDate, setTempDate] = React.useState<BsDate>(
    value ?? getDefaultBsDate(),
  )

  const handleOpen = () => {
    if (disabled) return
    setTempDate(value ?? getDefaultBsDate())
    setShowPicker(true)
  }

  const handleCancel = () => {
    setShowPicker(false)
    setTempDate(value ?? getDefaultBsDate())
  }

  const handleConfirm = () => {
    setShowPicker(false)
    onValueChange?.(tempDate)
  }

  const displayLabel = value
    ? resolveDateDisplayLabel(value, locale, formatValue, formatPattern)
    : resolvedPlaceholder

  return (
    <>
      <Button
        variant="outline"
        className={cn('justify-between', className)}
        disabled={disabled}
        onPress={handleOpen}
      >
        <Text className={cn(!value && 'text-muted-foreground')}>
          {displayLabel}
        </Text>
        <Icon as={Calendar} className="size-4 text-muted-foreground" />
      </Button>

      <Modal visible={showPicker} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View className="flex-1 justify-end bg-black/70">
            <TouchableWithoutFeedback onPress={() => {}}>
              <BsWheelSheetChrome
                cancelLabel={resolvedCancel}
                confirmLabel={resolvedConfirm}
                bottomInset={insets.bottom}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
              >
                <BsDatePickerWheels
                  value={tempDate}
                  locale={locale}
                  onChange={setTempDate}
                />
              </BsWheelSheetChrome>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}
