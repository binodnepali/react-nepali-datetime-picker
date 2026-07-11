import * as React from 'react'
import { Pressable, View } from 'react-native'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native'

import { BsDayPicker } from '@/lib/bs-day-picker/bs-day-picker'
import type { BsDate } from '@/lib/bs-day-picker/types'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

const materialClassNames = {
  root: 'h-full border-0 bg-transparent p-0',
  months: 'h-full',
  month: 'relative h-full',
  nav: '',
  button_previous:
    'size-12 items-center justify-center rounded-full active:bg-accent/40',
  button_next:
    'size-12 items-center justify-center rounded-full active:bg-accent/40',
  month_caption: '',
  dropdowns: '',
  dropdown: '',
  caption_label: 'text-sm font-medium text-foreground',
  month_grid: 'w-full px-1',
  weekdays: 'mb-0.5 flex-row',
  weekday: 'flex-1 items-center py-0.5',
  week: 'flex-row',
  day: 'flex-1 items-center',
  day_button: 'size-9 items-center justify-center rounded-full',
  outside: 'opacity-0',
  selected: '',
  today: '',
  disabled: 'opacity-30',
  footer: '',
}

function BsCalendar({
  className,
  ...props
}: React.ComponentProps<typeof BsDayPicker>) {
  return (
    <BsDayPicker
      className={cn(materialClassNames.root, className)}
      classNames={materialClassNames}
      navVariant="material"
      weekdayVariant="narrow"
      showOutsideDays={false}
      components={{
        Root: ({ className: rootClassName, children }) => (
          <View className={rootClassName}>{children}</View>
        ),
        Chevron: ({ orientation, className: chevronClassName }) => (
          <Icon
            as={
              orientation === 'left'
                ? ChevronLeft
                : orientation === 'right'
                  ? ChevronRight
                  : ChevronDown
            }
            className={cn('size-5 text-foreground', chevronClassName)}
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
              selected && 'bg-primary',
              !selected && today && 'border border-primary',
              outside && 'opacity-0',
              disabled && 'opacity-30',
            )}
            disabled={disabled || outside}
            onPress={onClick}
          >
            <Text
              className={cn(
                'text-sm',
                selected ? 'font-medium text-primary-foreground' : 'text-foreground',
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
