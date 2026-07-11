"use client"

import * as React from "react"
import { ClockIcon } from "lucide-react"

import { BsTimeSelects } from "./bs-time-selects"
import {
  getDefaultBsTime,
} from "../lib/bs-time-picker"
import {
  BS_TIME_DISPLAY_PATTERN,
  formatBsTimePattern,
} from "@/lib/bs-time-picker/time/pattern"
import type { BsLocale, BsTime } from "@/lib/bs-time-picker/time/types"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type BsTimePickerProps = {
  value?: BsTime
  onChange?: (value: BsTime | undefined) => void
  locale?: BsLocale
  is24Hour?: boolean
  placeholder?: string
  /** date-fns-style BS time tokens, e.g. `h:mm a` */
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
  onChange,
  locale = "ne",
  is24Hour = false,
  placeholder = "Select time",
  formatPattern,
  formatValue,
  className,
  disabled = false,
}: BsTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempTime, setTempTime] = React.useState<BsTime>(
    value ?? getDefaultBsTime(),
  )

  React.useEffect(() => {
    if (open) {
      setTempTime(value ?? getDefaultBsTime())
    }
  }, [open, value])

  const confirmLabel = locale === "ne" ? "ठीक" : "OK"

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
              ? resolveTimeDisplayLabel(
                  value,
                  locale,
                  is24Hour,
                  formatValue,
                  formatPattern,
                )
              : placeholder}
          </span>
          <ClockIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <BsTimeSelects
          value={tempTime}
          locale={locale}
          is24Hour={is24Hour}
          onChange={setTempTime}
          className="p-3"
        />
        <div className="flex justify-end border-t p-2">
          <Button
            size="sm"
            onClick={() => {
              onChange?.(tempTime)
              setOpen(false)
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
