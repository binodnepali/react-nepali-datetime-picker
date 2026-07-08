import * as React from "react"
import { Pressable, View } from "react-native"
import { ChevronLeft, ChevronRight } from "lucide-react-native"

import { BsDayPicker } from "@/lib/bs-day-picker/bs-day-picker"
import type { BsDate } from "@/lib/bs-day-picker/types"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const nativeClassNames = {
  root: "rounded-lg border border-border bg-background p-3",
  months: "relative",
  month: "gap-3",
  nav: "mb-2 flex-row items-center justify-between",
  button_previous: "size-8 items-center justify-center rounded-md",
  button_next: "size-8 items-center justify-center rounded-md",
  month_caption: "items-center justify-center",
  dropdowns: "flex-row items-center gap-2",
  dropdown: "rounded-md border border-input px-2 py-1",
  caption_label: "text-sm font-medium text-foreground",
  month_grid: "w-full",
  weekdays: "flex-row",
  weekday: "flex-1 items-center py-2",
  week: "flex-row",
  day: "flex-1 items-center py-1",
  day_button:
    "size-9 items-center justify-center rounded-md border border-transparent",
  outside: "opacity-50",
  selected: "",
  today: "",
  disabled: "opacity-30",
  footer: "pt-2",
}

function BsCalendar({
  className,
  ...props
}: React.ComponentProps<typeof BsDayPicker>) {
  return (
    <BsDayPicker
      className={cn(nativeClassNames.root, className)}
      classNames={nativeClassNames}
      components={{
        Root: ({ className: rootClassName, children }) => (
          <View className={rootClassName}>{children}</View>
        ),
        Chevron: ({ orientation, className: chevronClassName }) => (
          <Icon
            as={orientation === "left" ? ChevronLeft : ChevronRight}
            className={cn("size-4 text-foreground", chevronClassName)}
          />
        ),
        DayButton: ({
          label,
          selected,
          today,
          outside,
          disabled,
          onClick,
          className: dayClassName,
        }) => (
          <Pressable
            className={cn(
              dayClassName,
              selected && "bg-primary",
              today && "border-border",
              outside && "opacity-50",
              disabled && "opacity-30",
            )}
            disabled={disabled}
            onPress={onClick}
          >
            <Text
              className={cn(
                "text-sm",
                selected ? "text-primary-foreground" : "text-foreground",
              )}
            >
              {label}
            </Text>
          </Pressable>
        ),
      }}
      {...props}
    />
  )
}

export { BsCalendar }
export type { BsDate }
