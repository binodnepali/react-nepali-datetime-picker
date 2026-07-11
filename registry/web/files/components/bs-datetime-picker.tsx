"use client";

import * as React from "react";
import { CalendarClockIcon } from "lucide-react";

import { BsCalendar, type BsDate } from "@/components/bs-calendar";
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
} from "../lib/bs-time-picker";
import {
  formatBsDateTime,
  getDefaultBsDateTime,
  mergeBsDateTime,
  splitBsDateTime,
} from "../lib/bs-datetime-picker";
import { formatBsDateTimePattern } from "@/lib/bs-time-picker/time/pattern";
import type { BsDateTime } from "@/lib/bs-time-picker/time/types";
import type {
  BsLocale,
  BsPeriod,
  BsTime,
} from "@/lib/bs-time-picker/time/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type BsDateTimePickerProps = {
  value?: BsDateTime;
  onChange?: (value: BsDateTime | undefined) => void;
  locale?: BsLocale;
  is24Hour?: boolean;
  placeholder?: string;
  /** date-fns-style BS tokens, e.g. `EEEE, d MMMM yyyy, h:mm a` */
  formatPattern?: string;
  formatValue?: (
    value: BsDateTime,
    locale: BsLocale,
    is24Hour: boolean,
  ) => string;
  className?: string;
  disabled?: boolean;
};

function resolveDateTimeDisplayLabel(
  value: BsDateTime,
  locale: BsLocale,
  is24Hour: boolean,
  formatValue?: BsDateTimePickerProps["formatValue"],
  formatPattern?: string,
): string {
  if (formatValue) return formatValue(value, locale, is24Hour);
  if (formatPattern) {
    return formatBsDateTimePattern(value, formatPattern, locale, is24Hour);
  }
  return formatBsDateTime(value, locale, is24Hour);
}

function InlineTimeSelects({
  value,
  locale,
  is24Hour,
  onChange,
}: {
  value: BsTime;
  locale: BsLocale;
  is24Hour: boolean;
  onChange: (value: BsTime) => void;
}) {
  const clamped = clampBsTime(value);
  const hourOptions = getHourOptions(is24Hour);
  const minuteOptions = getMinuteOptions();
  const periodOptions = getPeriodOptions();
  const displayHour = resolveDisplayHour(clamped.hour, is24Hour);
  const displayPeriod = resolveDisplayPeriod(clamped.hour, is24Hour);

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
    );
  };

  const selectClassName =
    "h-9 rounded-md border border-input bg-background px-2 text-sm";

  return (
    <div className="flex flex-wrap items-center gap-2 border-t px-3 py-3">
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
  );
}

export function BsDateTimePicker({
  value,
  onChange,
  locale = "ne",
  is24Hour = false,
  placeholder = "Select date and time",
  formatPattern,
  formatValue,
  className,
  disabled = false,
}: BsDateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempValue, setTempValue] = React.useState<BsDateTime>(
    value ?? getDefaultBsDateTime(),
  );

  React.useEffect(() => {
    if (open) {
      setTempValue(value ?? getDefaultBsDateTime());
    }
  }, [open, value]);

  const handleDateSelect = (date: BsDate | undefined) => {
    if (!date) return;
    setTempValue((current) =>
      mergeBsDateTime(date, splitBsDateTime(current).time),
    );
  };

  const handleTimeChange = (time: BsTime) => {
    setTempValue((current) =>
      mergeBsDateTime(splitBsDateTime(current).date, time),
    );
  };

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
              ? resolveDateTimeDisplayLabel(
                  value,
                  locale,
                  is24Hour,
                  formatValue,
                  formatPattern,
                )
              : placeholder}
          </span>
          <CalendarClockIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <BsCalendar
          mode="single"
          locale={locale}
          selected={splitBsDateTime(tempValue).date}
          onSelect={handleDateSelect}
          captionLayout="dropdown"
        />
        <InlineTimeSelects
          value={splitBsDateTime(tempValue).time}
          locale={locale}
          is24Hour={is24Hour}
          onChange={handleTimeChange}
        />
        <div className="flex justify-end border-t p-2">
          <Button
            size="sm"
            onClick={() => {
              onChange?.(tempValue);
              setOpen(false);
            }}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
