import { getDefaultBsTime } from '@/lib/bs-time-picker'
import {
  BS_TIME_DISPLAY_PATTERN,
  formatBsTimePattern,
} from '@/lib/bs-time-picker/time/pattern'
import type { BsLocale, BsTime } from '@/lib/bs-time-picker/time/types'
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
  locale?: BsLocale
  is24Hour?: boolean
  placeholder?: string
  title?: string
  cancelLabel?: string
  confirmLabel?: string
  formatPattern?: string
  formatValue?: (value: BsTime, locale: BsLocale, is24Hour: boolean) => string
  className?: string
  disabled?: boolean
}

function resolveTimeDisplayLabel(
  value: BsTime,
  locale: BsLocale,
  is24Hour: boolean,
  formatValue?: BsTimePickerProps['formatValue'],
  formatPattern?: string,
): string {
  if (formatValue) return formatValue(value, locale, is24Hour)
  return formatBsTimePattern(
    value,
    formatPattern ?? BS_TIME_DISPLAY_PATTERN,
    locale,
    is24Hour,
  )
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
  formatPattern,
  formatValue,
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
    ? resolveTimeDisplayLabel(
        value,
        locale,
        is24Hour,
        formatValue,
        formatPattern,
      )
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
