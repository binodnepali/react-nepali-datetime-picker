import {
  getDefaultBsDateTime,
  mergeBsDateTime,
  splitBsDateTime,
} from '@/lib/bs-datetime-picker'
import { formatBsDateTime } from '@/lib/bs-datetime-picker'
import type { BsDateTime } from '@/lib/bs-time-picker/time/types'
import { cn } from '@/lib/utils'
import { CalendarClock } from 'lucide-react-native'
import * as React from 'react'
import { BsDatePickerDialog } from './bs-date-picker-dialog.android'
import { BsTimePickerDialog } from './bs-time-picker-dialog.android'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

export type BsDateTimePickerProps = {
  value?: BsDateTime
  onValueChange?: (value: BsDateTime | undefined) => void
  locale?: 'en' | 'ne'
  is24Hour?: boolean
  placeholder?: string
  title?: string
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
  title,
  cancelLabel,
  confirmLabel,
  className,
  disabled = false,
}: BsDateTimePickerProps) {
  const resolvedPlaceholder =
    placeholder ??
    (locale === 'ne' ? 'मिति र समय छान्नुहोस्' : 'Select date and time')
  const resolvedTitle = title ?? resolvedPlaceholder
  const resolvedCancel = cancelLabel ?? 'Cancel'
  const resolvedConfirm = confirmLabel ?? 'OK'
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [showTimePicker, setShowTimePicker] = React.useState(false)
  const [tempValue, setTempValue] = React.useState<BsDateTime>(
    value ?? getDefaultBsDateTime(),
  )

  const handleOpen = () => {
    if (disabled) return
    setTempValue(value ?? getDefaultBsDateTime())
    setShowDatePicker(true)
  }

  const handleDateCancel = () => {
    setShowDatePicker(false)
    setTempValue(value ?? getDefaultBsDateTime())
  }

  const handleDateConfirm = () => {
    setShowDatePicker(false)
    setShowTimePicker(true)
  }

  const handleTimeCancel = () => {
    setShowTimePicker(false)
    setTempValue(value ?? getDefaultBsDateTime())
  }

  const handleTimeConfirm = () => {
    setShowTimePicker(false)
    onValueChange?.(tempValue)
  }

  const displayLabel = value
    ? formatBsDateTime(value, locale, is24Hour)
    : resolvedPlaceholder

  const { date: dialogDate, time: dialogTime } = splitBsDateTime(tempValue)

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

      <BsDatePickerDialog
        visible={showDatePicker}
        value={dialogDate}
        locale={locale}
        title={resolvedTitle}
        cancelLabel={resolvedCancel}
        confirmLabel={resolvedConfirm}
        onChange={(nextDate) => {
          setTempValue((current) =>
            mergeBsDateTime(nextDate, splitBsDateTime(current).time),
          )
        }}
        onCancel={handleDateCancel}
        onConfirm={handleDateConfirm}
      />

      <BsTimePickerDialog
        key={showTimePicker ? 'open' : 'closed'}
        visible={showTimePicker}
        value={dialogTime}
        locale={locale}
        is24Hour={is24Hour}
        cancelLabel={resolvedCancel}
        confirmLabel={resolvedConfirm}
        onChange={(nextTime) => {
          setTempValue((current) =>
            mergeBsDateTime(splitBsDateTime(current).date, nextTime),
          )
        }}
        onCancel={handleTimeCancel}
        onConfirm={handleTimeConfirm}
      />
    </>
  )
}
