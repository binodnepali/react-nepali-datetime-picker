import { getDefaultBsDate } from '@/lib/bs-picker'
import {
  BS_DATE_DISPLAY_PATTERN,
  formatBsDatePattern,
} from '@/lib/bs-day-picker/pattern'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import { cn } from '@/lib/utils'
import { Calendar } from 'lucide-react-native'
import * as React from 'react'
import { BsDatePickerDialog } from './bs-date-picker-dialog.android'
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
  title,
  cancelLabel,
  confirmLabel,
  formatPattern,
  formatValue,
  className,
  disabled = false,
}: BsDatePickerProps) {
  const resolvedPlaceholder =
    placeholder ?? (locale === 'ne' ? 'मिति छान्नुहोस्' : 'Select date')
  const resolvedTitle = title ?? resolvedPlaceholder
  const resolvedCancel = cancelLabel ?? 'Cancel'
  const resolvedConfirm = confirmLabel ?? 'OK'
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

      <BsDatePickerDialog
        visible={showPicker}
        value={tempDate}
        locale={locale}
        title={resolvedTitle}
        cancelLabel={resolvedCancel}
        confirmLabel={resolvedConfirm}
        onChange={setTempDate}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}
