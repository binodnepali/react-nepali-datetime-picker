"use client";

import * as React from "react";
import { CalendarClockIcon } from "lucide-react";

import { BsCalendar, type BsDate } from "@/components/bs-calendar";
import { BsTimeSelects } from "./bs-time-selects";
import {
  formatBsDateTime,
  getDefaultBsDateTime,
  mergeBsDateTime,
  splitBsDateTime,
} from "../lib/bs-datetime-picker";
import { formatBsDateTimePattern } from "@/lib/bs-time-picker/time/pattern";
import type { BsDateTime } from "@/lib/bs-time-picker/time/types";
import type { BsLocale, BsTime } from "@/lib/bs-time-picker/time/types";
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

  const confirmLabel = locale === "ne" ? "ठीक" : "OK";

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
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <BsCalendar
          mode="single"
          locale={locale}
          selected={splitBsDateTime(tempValue).date}
          onSelect={handleDateSelect}
          captionLayout="dropdown"
        />
        <BsTimeSelects
          value={splitBsDateTime(tempValue).time}
          locale={locale}
          is24Hour={is24Hour}
          onChange={handleTimeChange}
          showLabel
          className="border-t px-3 py-3"
        />
        <div className="flex justify-end border-t p-2">
          <Button
            size="sm"
            onClick={() => {
              onChange?.(tempValue);
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
