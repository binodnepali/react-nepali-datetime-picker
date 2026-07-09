import {
  getDefaultBsDateTime,
  mergeBsDateTime,
  splitBsDateTime,
  formatBsDateTime,
} from "@/lib/bs-datetime-picker";
import { formatBsDateTimePattern } from "@/lib/bs-time-picker/time/pattern";
import type { BsDateTime, BsLocale } from "@/lib/bs-time-picker/time/types";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react-native";
import * as React from "react";
import { BsDatePickerDialog } from "./bs-date-picker-dialog.android";
import { BsTimePickerDialog } from "./bs-time-picker-dialog.android";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export type BsDateTimePickerProps = {
  value?: BsDateTime;
  onValueChange?: (value: BsDateTime | undefined) => void;
  locale?: BsLocale;
  is24Hour?: boolean;
  placeholder?: string;
  title?: string;
  cancelLabel?: string;
  confirmLabel?: string;
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
  onValueChange,
  locale = "ne",
  is24Hour = false,
  placeholder,
  title,
  cancelLabel,
  confirmLabel,
  formatPattern,
  formatValue,
  className,
  disabled = false,
}: BsDateTimePickerProps) {
  const resolvedPlaceholder =
    placeholder ??
    (locale === "ne" ? "मिति र समय छान्नुहोस्" : "Select date and time");
  const resolvedTitle = title ?? resolvedPlaceholder;
  const resolvedCancel = cancelLabel ?? "Cancel";
  const resolvedConfirm = confirmLabel ?? "OK";
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [tempValue, setTempValue] = React.useState<BsDateTime>(
    value ?? getDefaultBsDateTime(),
  );

  const handleOpen = () => {
    if (disabled) return;
    setTempValue(value ?? getDefaultBsDateTime());
    setShowDatePicker(true);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
    setTempValue(value ?? getDefaultBsDateTime());
  };

  const handleDateConfirm = () => {
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const handleTimeCancel = () => {
    setShowTimePicker(false);
    setTempValue(value ?? getDefaultBsDateTime());
  };

  const handleTimeConfirm = () => {
    setShowTimePicker(false);
    onValueChange?.(tempValue);
  };

  const displayLabel = value
    ? resolveDateTimeDisplayLabel(
        value,
        locale,
        is24Hour,
        formatValue,
        formatPattern,
      )
    : resolvedPlaceholder;

  const { date: dialogDate, time: dialogTime } = splitBsDateTime(tempValue);

  return (
    <>
      <Button
        variant="outline"
        className={cn("justify-between", className)}
        disabled={disabled}
        onPress={handleOpen}
      >
        <Text className={cn(!value && "text-muted-foreground")}>
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
          );
        }}
        onCancel={handleDateCancel}
        onConfirm={handleDateConfirm}
      />

      <BsTimePickerDialog
        key={showTimePicker ? "open" : "closed"}
        visible={showTimePicker}
        value={dialogTime}
        locale={locale}
        is24Hour={is24Hour}
        cancelLabel={resolvedCancel}
        confirmLabel={resolvedConfirm}
        onChange={(nextTime) => {
          setTempValue((current) =>
            mergeBsDateTime(splitBsDateTime(current).date, nextTime),
          );
        }}
        onCancel={handleTimeCancel}
        onConfirm={handleTimeConfirm}
      />
    </>
  );
}
