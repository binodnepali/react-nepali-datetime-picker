"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { BsDayPicker } from "@/lib/bs-day-picker/bs-day-picker";
import type { BsDate, BsDayPickerClassNames } from "@/lib/bs-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function BsCalendar({
  className,
  classNames,
  buttonVariant = "ghost",
  captionLayout = "label",
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof BsDayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  return (
    <BsDayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn(
        "bg-background group/calendar rounded-md p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        className,
      )}
      classNames={{
        root: cn("w-full", classNames?.root),
        months: cn(
          "flex w-full flex-col gap-4 md:flex-row",
          classNames?.months,
        ),
        month: cn("relative flex flex-col w-full gap-4", classNames?.month),
        nav: cn(
          "grid w-full grid-cols-[var(--cell-size)_minmax(0,1fr)_var(--cell-size)] items-center gap-1",
          classNames?.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "size-(--cell-size) shrink-0 p-0 select-none",
          classNames?.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "size-(--cell-size) shrink-0 p-0 select-none",
          classNames?.button_next,
        ),
        month_caption: cn(
          "flex min-w-0 items-center justify-center h-(--cell-size)",
          classNames?.month_caption,
        ),
        dropdowns: cn(
          "flex min-w-0 w-full items-center justify-center text-sm font-medium h-(--cell-size) gap-1.5",
          classNames?.dropdowns,
        ),
        dropdown_root: cn(
          "relative min-w-0 max-w-full has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          classNames?.dropdown_root,
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0 w-full h-full cursor-pointer",
          classNames?.dropdown,
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 min-w-0 max-w-full [&>svg]:shrink-0 [&>svg]:text-muted-foreground [&>svg]:size-3.5 [&>:first-child]:truncate",
          classNames?.caption_label,
        ),
        month_grid: cn("w-full", classNames?.month_grid),
        weekdays: cn("flex", classNames?.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 text-center rounded-md font-normal text-[0.8rem] select-none",
          classNames?.weekday,
        ),
        week: cn("mt-2 flex w-full", classNames?.week),
        day: cn(
          "group/day relative aspect-square min-w-0 flex-1 p-0 text-center select-none",
          classNames?.day,
        ),
        day_button: cn(
          "inline-flex aspect-square size-(--cell-size) w-full max-w-full items-center justify-center rounded-md text-sm font-normal hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[today=true]:bg-accent data-[today=true]:text-accent-foreground data-[outside=true]:text-muted-foreground",
          classNames?.day_button,
        ),
        outside: cn(classNames?.outside),
        selected: cn(classNames?.selected),
        today: cn(classNames?.today),
        disabled: cn(
          "text-muted-foreground opacity-50 pointer-events-none",
          classNames?.disabled,
        ),
        footer: cn("pt-3 text-sm text-muted-foreground", classNames?.footer),
      }}
      components={{
        Root: ({ className: rootClassName, children }) => (
          <div
            data-slot="bs-calendar"
            className={cn("overflow-hidden rounded-md", rootClassName)}
          >
            {children}
          </div>
        ),
        Chevron: ({ orientation, className: chevronClassName }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", chevronClassName)} />
            );
          }
          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", chevronClassName)} />
            );
          }
          return <ChevronDownIcon className={cn("size-4", chevronClassName)} />;
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
  );
}

export { BsCalendar };
export type { BsDate, BsDayPickerClassNames };
