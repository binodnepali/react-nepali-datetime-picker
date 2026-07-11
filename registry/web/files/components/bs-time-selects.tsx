"use client"

import * as React from "react"

import {
  clampBsTime,
  formatHourOption,
  formatMinuteOption,
  formatPeriodOption,
  getHourOptions,
  getMinuteOptions,
  getPeriodOptions,
  resolveDisplayHour,
  resolveDisplayPeriod,
  resolveWheelHour,
} from "../lib/bs-time-picker"
import type { BsLocale, BsPeriod, BsTime } from "@/lib/bs-time-picker/time/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type BsTimeSelectsProps = {
  value: BsTime
  locale: BsLocale
  is24Hour: boolean
  onChange: (value: BsTime) => void
  className?: string
  showLabel?: boolean
}

const triggerClassName =
  "h-8 min-w-0 gap-1 px-2 text-sm font-medium shadow-xs [&>span]:truncate"

export function BsTimeSelects({
  value,
  locale,
  is24Hour,
  onChange,
  className,
  showLabel = false,
}: BsTimeSelectsProps) {
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

  const timeLabel = locale === "ne" ? "समय" : "Time"

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabel ? (
        <p className="text-muted-foreground px-1 text-xs font-medium">
          {timeLabel}
        </p>
      ) : null}
      <div className="flex items-center justify-center gap-1.5">
        <Select
          value={String(displayHour)}
          onValueChange={(next) =>
            updateTime(Number(next), clamped.minute, displayPeriod)
          }
        >
          <SelectTrigger className={cn(triggerClassName, "w-[4.25rem]")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            {hourOptions.map((hour) => (
              <SelectItem key={hour} value={String(hour)}>
                {formatHourOption(hour, locale, is24Hour)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span
          aria-hidden
          className="text-muted-foreground shrink-0 text-sm font-medium"
        >
          :
        </span>

        <Select
          value={String(clamped.minute)}
          onValueChange={(next) =>
            updateTime(displayHour, Number(next), displayPeriod)
          }
        >
          <SelectTrigger className={cn(triggerClassName, "w-[4.25rem]")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            {minuteOptions.map((minute) => (
              <SelectItem key={minute} value={String(minute)}>
                {formatMinuteOption(minute, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!is24Hour ? (
          <Select
            value={displayPeriod}
            onValueChange={(next) =>
              updateTime(displayHour, clamped.minute, next as BsPeriod)
            }
          >
            <SelectTrigger className={cn(triggerClassName, "w-[4.75rem]")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((period) => (
                <SelectItem key={period} value={period}>
                  {formatPeriodOption(period, locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>
    </div>
  )
}
