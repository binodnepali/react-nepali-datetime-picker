import { getDefaultBsTime } from '@/lib/bs-time-picker'
import { formatBsTimeWheelLabel } from '@/lib/bs-time-picker'
import type { BsTime } from '@/lib/bs-time-picker/time/types'
import * as React from 'react'
import { Modal, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BsTimePickerWheels } from './bs-time-picker-wheels'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

export type BsTimePickerProps = {
  value?: BsTime
  onValueChange?: (value: BsTime | undefined) => void
  locale?: 'en' | 'ne'
  is24Hour?: boolean
  placeholder?: string
  cancelLabel?: string
  confirmLabel?: string
  className?: string
  disabled?: boolean
}

export function BsTimePicker({
  value,
  onValueChange,
  locale = 'ne',
  is24Hour = false,
  placeholder,
  cancelLabel,
  confirmLabel,
  className,
  disabled = false,
}: BsTimePickerProps) {
  const insets = useSafeAreaInsets()
  const resolvedPlaceholder =
    placeholder ?? (locale === 'ne' ? 'समय छान्नुहोस्' : 'Select time')
  const resolvedCancel = cancelLabel ?? 'Cancel'
  const resolvedConfirm = confirmLabel ?? 'Confirm'
  const [showPicker, setShowPicker] = React.useState(false)
  const [tempTime, setTempTime] = React.useState<BsTime>(
    value ?? getDefaultBsTime(),
  )

  const handleOpen = () => {
    if (disabled) return
    setTempTime(value ?? getDefaultBsTime())
    setShowPicker(true)
  }

  const handleCancel = () => {
    setShowPicker(false)
    setTempTime(value ?? getDefaultBsTime())
  }

  const handleConfirm = () => {
    setShowPicker(false)
    onValueChange?.(tempTime)
  }

  const displayLabel = value
    ? formatBsTimeWheelLabel(value, locale, is24Hour)
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
        <Icon as={Clock} className="size-4 text-muted-foreground" />
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
                  <BsTimePickerWheels
                    value={tempTime}
                    locale={locale}
                    is24Hour={is24Hour}
                    onChange={setTempTime}
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
