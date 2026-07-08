"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { BsCalendar, type BsDate } from "@/components/bs-calendar"
import { formatBsDateLong } from "@/lib/bs-day-picker/formatters"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type BsDatePickerProps = {
  value?: BsDate
  onChange?: (value: BsDate | undefined) => void
  locale?: "en" | "ne"
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function BsDatePicker({
  value,
  onChange,
  locale = "ne",
  placeholder = "Select date",
  className,
  disabled = false,
}: BsDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? formatBsDateLong(value, locale) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <BsCalendar
          mode="single"
          locale={locale}
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
