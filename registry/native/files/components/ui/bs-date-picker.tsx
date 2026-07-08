import { getDefaultBsDate } from '@/lib/bs-picker'
import { formatBsDateWheelLabel } from '@/lib/bs-day-picker/formatters'
import type { BsDate } from '@/lib/bs-day-picker/types'
import { cn } from '@/lib/utils'
import { Calendar } from 'lucide-react-native'
import * as React from 'react'
import { Modal, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BsDatePickerWheels } from './bs-date-picker-wheels'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

export type BsDatePickerProps = {
  value?: BsDate
  onValueChange?: (value: BsDate | undefined) => void
  locale?: 'en' | 'ne'
  placeholder?: string
  title?: string
  cancelLabel?: string
  confirmLabel?: string
  className?: string
  disabled?: boolean
}

export function BsDatePicker({
  value,
  onValueChange,
  locale = 'ne',
  placeholder,
  title: _title,
  cancelLabel,
  confirmLabel,
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
    ? formatBsDateWheelLabel(value, locale)
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
              <View
                className="rounded-t-lg bg-white dark:bg-gray-800"
                style={{ paddingBottom: Math.max(insets.bottom, 8) }}
              >
                <View className="flex-row items-center justify-between border-b border-gray-200 p-2 dark:border-gray-700">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="px-4"
                    onPress={handleCancel}
                  >
                    <Text className="font-semibold">{resolvedCancel}</Text>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="px-4"
                    onPress={handleConfirm}
                  >
                    <Text className="font-semibold">{resolvedConfirm}</Text>
                  </Button>
                </View>

                <View className="w-full items-center justify-center py-1">
                  <BsDatePickerWheels
                    value={tempDate}
                    locale={locale}
                    onChange={setTempDate}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}
