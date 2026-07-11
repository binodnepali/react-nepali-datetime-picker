import {
  formatBsDateTime,
  getDefaultBsDateTime,
} from "../../lib/bs-datetime-picker";
import { formatBsDateTimePattern } from "@/lib/bs-time-picker/time/pattern";
import type { BsDateTime, BsLocale } from "@/lib/bs-time-picker/time/types";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react-native";
import * as React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BsDateTimePickerWheels } from "./bs-datetime-picker-wheels.ios";
import { BsWheelSheetChrome } from "./bs-wheel-sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export type BsDateTimePickerProps = {
  value?: BsDateTime;
  onValueChange?: (value: BsDateTime | undefined) => void;
  locale?: BsLocale;
  is24Hour?: boolean;
  placeholder?: string;
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
  cancelLabel,
  confirmLabel,
  formatPattern,
  formatValue,
  className,
  disabled = false,
}: BsDateTimePickerProps) {
  const insets = useSafeAreaInsets();
  const resolvedPlaceholder =
    placeholder ??
    (locale === "ne" ? "मिति र समय छान्नुहोस्" : "Select date and time");
  const resolvedCancel = cancelLabel ?? "Cancel";
  const resolvedConfirm = confirmLabel ?? "Confirm";
  const [showPicker, setShowPicker] = React.useState(false);
  const [tempValue, setTempValue] = React.useState<BsDateTime>(
    value ?? getDefaultBsDateTime(),
  );

  const handleOpen = () => {
    if (disabled) return;
    setTempValue(value ?? getDefaultBsDateTime());
    setShowPicker(true);
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempValue(value ?? getDefaultBsDateTime());
  };

  const handleConfirm = () => {
    setShowPicker(false);
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

      <Modal visible={showPicker} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View className="flex-1 justify-end bg-black/70">
            <TouchableWithoutFeedback onPress={() => {}}>
              <BsWheelSheetChrome
                cancelLabel={resolvedCancel}
                confirmLabel={resolvedConfirm}
                bottomInset={insets.bottom}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
              >
                <BsDateTimePickerWheels
                  value={tempValue}
                  locale={locale}
                  is24Hour={is24Hour}
                  onChange={setTempValue}
                />
              </BsWheelSheetChrome>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
