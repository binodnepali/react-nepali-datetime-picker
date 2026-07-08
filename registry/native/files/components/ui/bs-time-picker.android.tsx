import { getDefaultBsTime } from '@/lib/bs-time-picker'
import { formatBsTimeWheelLabel } from '@/lib/bs-time-picker'
import type { BsTime } from '@/lib/bs-time-picker/time/types'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react-native'
import * as React from 'react'
import { BsTimePickerDialog } from './bs-time-picker-dialog.android'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

export type BsTimePickerProps = {
  value?: BsTime
  onValueChange?: (value: BsTime | undefined) => void
  locale?: 'en' | 'ne'
  is24Hour?: boolean
  placeholder?: string
  title?: string
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
  title,
  cancelLabel,
  confirmLabel,
  className,
  disabled = false,
}: BsTimePickerProps) {
  const resolvedPlaceholder =
    placeholder ?? (locale === 'ne' ? 'समय छान्नुहोस्' : 'Select time')
  const resolvedTitle = title ?? resolvedPlaceholder
  const resolvedCancel = cancelLabel ?? 'Cancel'
  const resolvedConfirm = confirmLabel ?? 'OK'
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

      <BsTimePickerDialog
        key={showPicker ? 'open' : 'closed'}
        visible={showPicker}
        value={tempTime}
        locale={locale}
        is24Hour={is24Hour}
        title={resolvedTitle}
        cancelLabel={resolvedCancel}
        confirmLabel={resolvedConfirm}
        onChange={setTempTime}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}
