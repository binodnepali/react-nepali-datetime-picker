"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { BsCalendar, type BsDate } from "@/components/bs-calendar"
import {
  BS_DATE_DISPLAY_PATTERN,
  formatBsDatePattern,
} from "@/lib/bs-day-picker/pattern"
import type { BsLocale } from "@/lib/bs-day-picker/types"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type BsDatePickerProps = {
  value?: BsDate
  onChange?: (value: BsDate | undefined) => void
  locale?: BsLocale
  placeholder?: string
  /** date-fns-style BS tokens, e.g. `EEEE, d MMMM yyyy` */
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
  onChange,
  locale = "ne",
  placeholder = "Select date",
  formatPattern,
  formatValue,
  className,
  disabled = false,
}: BsDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between gap-2 text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {value
              ? resolveDateDisplayLabel(value, locale, formatValue, formatPattern)
              : placeholder}
          </span>
          <CalendarIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <BsCalendar
          mode="single"
          locale={locale}
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
