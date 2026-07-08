import { getDefaultBsDateTime } from '@/lib/bs-datetime-picker'
import { formatBsDateTime } from '@/lib/bs-datetime-picker'
import type { BsDateTime } from '@/lib/bs-time-picker/time/types'
import { cn } from '@/lib/utils'
import { CalendarClock } from 'lucide-react-native'
import * as React from 'react'
import { Modal, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BsDateTimePickerWheels } from './bs-datetime-picker-wheels'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

export type BsDateTimePickerProps = {
  value?: BsDateTime
  onValueChange?: (value: BsDateTime | undefined) => void
  locale?: 'en' | 'ne'
  is24Hour?: boolean
  placeholder?: string
  cancelLabel?: string
  confirmLabel?: string
  className?: string
  disabled?: boolean
}

export function BsDateTimePicker({
  value,
  onValueChange,
  locale = 'ne',
  is24Hour = false,
  placeholder,
  cancelLabel,
  confirmLabel,
  className,
  disabled = false,
}: BsDateTimePickerProps) {
  const insets = useSafeAreaInsets()
  const resolvedPlaceholder =
    placeholder ??
    (locale === 'ne' ? 'मिति र समय छान्नुहोस्' : 'Select date and time')
  const resolvedCancel = cancelLabel ?? 'Cancel'
  const resolvedConfirm = confirmLabel ?? 'Confirm'
  const [showPicker, setShowPicker] = React.useState(false)
  const [tempValue, setTempValue] = React.useState<BsDateTime>(
    value ?? getDefaultBsDateTime(),
  )

  const handleOpen = () => {
    if (disabled) return
    setTempValue(value ?? getDefaultBsDateTime())
    setShowPicker(true)
  }

  const handleCancel = () => {
    setShowPicker(false)
    setTempValue(value ?? getDefaultBsDateTime())
  }

  const handleConfirm = () => {
    setShowPicker(false)
    onValueChange?.(tempValue)
  }

  const displayLabel = value
    ? formatBsDateTime(value, locale, is24Hour)
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
        <Icon as={CalendarClock} className="size-4 text-muted-foreground" />
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
                  <BsDateTimePickerWheels
                    value={tempValue}
                    locale={locale}
                    is24Hour={is24Hour}
                    onChange={setTempValue}
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
