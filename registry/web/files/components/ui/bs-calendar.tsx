"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { BsDayPicker } from "@/lib/bs-day-picker/bs-day-picker"
import type {
  BsDate,
  BsDayPickerClassNames,
} from "@/lib/bs-day-picker"
import { cn } from "@/lib/utils"

const defaultClassNames: BsDayPickerClassNames = {
  root: "w-fit",
  months: "flex gap-4 flex-col md:flex-row relative",
  month: "flex flex-col w-full gap-4",
  nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
  button_previous:
    "inline-flex items-center justify-center size-8 rounded-md hover:bg-accent",
  button_next:
    "inline-flex items-center justify-center size-8 rounded-md hover:bg-accent",
  month_caption:
    "flex items-center justify-center h-8 w-full px-8 text-sm font-medium",
  dropdowns: "flex items-center gap-2",
  dropdown:
    "rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs",
  caption_label: "select-none font-medium text-sm",
  month_grid: "w-full border-collapse mt-10",
  weekdays: "",
  weekday:
    "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none p-2",
  week: "",
  day: "relative p-0 text-center aspect-square select-none",
  day_button:
    "inline-flex size-8 items-center justify-center rounded-md text-sm hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[today=true]:bg-accent data-[outside=true]:text-muted-foreground",
  outside: "",
  selected: "",
  today: "",
  disabled: "opacity-50 pointer-events-none",
  footer: "pt-3 text-sm text-muted-foreground",
}

function BsCalendar({
  className,
  classNames,
  buttonVariant: _buttonVariant,
  ...props
}: React.ComponentProps<typeof BsDayPicker> & {
  buttonVariant?: "default" | "ghost" | "outline"
}) {
  return (
    <BsDayPicker
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem]",
        className,
      )}
      classNames={{ ...defaultClassNames, ...classNames }}
      components={{
        Root: ({ className: rootClassName, children }) => (
          <div data-slot="bs-calendar" className={rootClassName}>
            {children}
          </div>
        ),
        Chevron: ({ orientation, className: chevronClassName }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", chevronClassName)} />
            )
          }
          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", chevronClassName)} />
            )
          }
          return (
            <ChevronDownIcon className={cn("size-4", chevronClassName)} />
          )
        },
        DayButton: ({
          label,
          selected,
          today,
          outside,
          disabled,
          onClick,
          className: dayClassName,
          date,
        }) => (
          <button
            type="button"
            className={dayClassName}
            onClick={onClick}
            disabled={disabled}
            data-selected={selected || undefined}
            data-today={today || undefined}
            data-outside={outside || undefined}
            data-day={`${date.year}-${date.month}-${date.day}`}
          >
            {label}
          </button>
        ),
      }}
      {...props}
    />
  )
}

export { BsCalendar, defaultClassNames }
export type { BsDate }
