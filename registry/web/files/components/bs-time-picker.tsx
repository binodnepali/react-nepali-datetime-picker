"use client"

import * as React from "react"
import { ClockIcon } from "lucide-react"

import {
  clampBsTime,
  formatBsTimeWheelLabel,
  formatHourOption,
  formatMinuteOption,
  formatPeriodOption,
  getDefaultBsTime,
  getHourOptions,
  getMinuteOptions,
  getPeriodOptions,
  resolveDisplayHour,
  resolveDisplayPeriod,
  resolveWheelHour,
} from "@/lib/bs-time-picker"
import type { BsLocale, BsPeriod, BsTime } from "@/lib/bs-time-picker/time/types"
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
  className?: string
  disabled?: boolean
}

function TimeSelects({
  value,
  locale,
  is24Hour,
  onChange,
}: {
  value: BsTime
  locale: BsLocale
  is24Hour: boolean
  onChange: (value: BsTime) => void
}) {
  const clamped = clampBsTime(value)
  const hourOptions = getHourOptions(is24Hour)
  const minuteOptions = getMinuteOptions()
  const periodOptions = getPeriodOptions()
  const displayHour = resolveDisplayHour(clamped.hour, is24Hour)
  const displayPeriod = resolveDisplayPeriod(clamped.hour, is24Hour)

  const updateTime = (
    nextHour: number,
    nextMinute: number,
    nextPeriod: BsPeriod,
  ) => {
    onChange(
      clampBsTime({
        hour: resolveWheelHour(nextHour, nextPeriod, is24Hour),
        minute: nextMinute,
      }),
    )
  }

  const selectClassName =
    "h-9 rounded-md border border-input bg-background px-2 text-sm"

  return (
    <div className="flex flex-wrap items-center gap-2 p-3">
      <select
        className={selectClassName}
        value={displayHour}
        onChange={(event) =>
          updateTime(Number(event.target.value), clamped.minute, displayPeriod)
        }
      >
        {hourOptions.map((hour) => (
          <option key={hour} value={hour}>
            {formatHourOption(hour, locale, is24Hour)}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        className={selectClassName}
        value={clamped.minute}
        onChange={(event) =>
          updateTime(displayHour, Number(event.target.value), displayPeriod)
        }
      >
        {minuteOptions.map((minute) => (
          <option key={minute} value={minute}>
            {formatMinuteOption(minute, locale)}
          </option>
        ))}
      </select>
      {!is24Hour ? (
        <select
          className={selectClassName}
          value={displayPeriod}
          onChange={(event) =>
            updateTime(
              displayHour,
              clamped.minute,
              event.target.value as BsPeriod,
            )
          }
        >
          {periodOptions.map((period) => (
            <option key={period} value={period}>
              {formatPeriodOption(period, locale)}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  )
}

export function BsTimePicker({
  value,
  onChange,
  locale = "ne",
  is24Hour = false,
  placeholder = "Select time",
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
              ? formatBsTimeWheelLabel(value, locale, is24Hour)
              : placeholder}
          </span>
          <ClockIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <TimeSelects
          value={tempTime}
          locale={locale}
          is24Hour={is24Hour}
          onChange={setTempTime}
        />
        <div className="flex justify-end border-t p-2">
          <Button
            size="sm"
            onClick={() => {
              onChange?.(tempTime)
              setOpen(false)
            }}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
