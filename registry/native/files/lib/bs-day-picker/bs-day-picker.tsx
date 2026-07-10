import * as React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated'

import { formatDayLabel, formatYearLabel } from './formatters'
import { useBsCalendar } from './use-bs-calendar'
import type {
  BsCaptionLayout,
  BsDate,
  BsDisabledMatcher,
  BsLocale,
  BsMonth,
  BsSelectionMode,
} from './types'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

export type BsDayPickerClassNames = {
  root?: string
  months?: string
  month?: string
  nav?: string
  button_previous?: string
  button_next?: string
  month_caption?: string
  dropdowns?: string
  dropdown?: string
  caption_label?: string
  month_grid?: string
  weekdays?: string
  weekday?: string
  week?: string
  day?: string
  day_button?: string
  outside?: string
  selected?: string
  today?: string
  disabled?: string
  footer?: string
}

export type BsDayPickerComponents = {
  Root?: (props: {
    className?: string
    children: React.ReactNode
  }) => React.ReactNode
  Chevron?: (props: {
    orientation: 'left' | 'right' | 'down'
    className?: string
  }) => React.ReactNode
  DayButton?: (props: {
    date: BsDate
    adDate: string
    label: string
    selected: boolean
    today: boolean
    outside: boolean
    disabled: boolean
    onClick: () => void
    className?: string
  }) => React.ReactNode
}

export type BsDayPickerProps = {
  mode?: BsSelectionMode
  selected?: BsDate
  onSelect?: (date: BsDate | undefined) => void
  locale?: BsLocale
  month?: BsMonth
  onMonthChange?: (month: BsMonth) => void
  captionLayout?: BsCaptionLayout
  navVariant?: 'default' | 'material'
  weekdayVariant?: 'short' | 'narrow'
  showOutsideDays?: boolean
  disabled?: BsDisabledMatcher | boolean
  className?: string
  classNames?: BsDayPickerClassNames
  components?: BsDayPickerComponents
  footer?: React.ReactNode
}

function DefaultRoot({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <View className={className}>{children}</View>
}

function DefaultChevron({
  orientation,
  className,
}: {
  orientation: 'left' | 'right' | 'down'
  className?: string
}) {
  const IconComponent =
    orientation === 'left'
      ? ChevronLeft
      : orientation === 'right'
        ? ChevronRight
        : ChevronDown

  return (
    <Icon
      as={IconComponent}
      className={cn('size-4 text-foreground', className)}
    />
  )
}

function DefaultDayButton({
  label,
  selected,
  today,
  outside,
  disabled,
  onClick,
  className,
}: {
  date: BsDate
  adDate: string
  label: string
  selected: boolean
  today: boolean
  outside: boolean
  disabled: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <Pressable
      className={cn(
        className,
        selected && 'bg-primary',
        today && 'border-border',
        outside && 'opacity-50',
        disabled && 'opacity-30',
      )}
      disabled={disabled}
      onPress={onClick}
    >
      <Text
        className={cn(
          'text-sm',
          selected ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        {label}
      </Text>
    </Pressable>
  )
}


type OptionPickerState = {
  label: string
  options: Array<{ value: number; label: string }>
  value: number
  onChange: (value: number) => void
}

function DropdownTrigger({
  label,
  displayValue,
  className,
  onPress,
}: {
  label: string
  displayValue: string
  className?: string
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      className={cn(
        'flex-row items-center gap-1 rounded-md border border-input px-2 py-1',
        className,
      )}
      onPress={onPress}
    >
      <Text className="text-sm text-foreground">{displayValue}</Text>
      <Icon as={ChevronDown} className="size-3 text-muted-foreground" />
    </Pressable>
  )
}

function InlineOptionPicker({
  label,
  options,
  value,
  onChange,
  onClose,
  locale,
}: OptionPickerState & {
  onClose: () => void
  locale: BsLocale
}) {
  const scrollRef = React.useRef<ScrollView>(null)
  const dismissLabel = locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'

  React.useEffect(() => {
    const selectedIndex = options.findIndex((entry) => entry.value === value)
    if (selectedIndex < 0) return

    const frame = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, selectedIndex * 44 - 88),
        animated: false,
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [options, value])

  return (
    <View className="absolute inset-0 z-10 rounded-lg bg-background">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Pressable
          accessibilityRole="button"
          className="min-w-16 rounded-md px-2 py-1 active:bg-accent"
          onPress={onClose}
        >
          <Text className="text-sm font-medium text-primary">{dismissLabel}</Text>
        </Pressable>
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        <View className="min-w-16" />
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-2 py-2"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        {options.map((entry) => (
          <Pressable
            key={entry.value}
            className={cn(
              'rounded-md px-3 py-2.5',
              entry.value === value && 'bg-accent',
            )}
            onPress={() => {
              onChange(entry.value)
              onClose()
            }}
          >
            <Text className="text-sm text-foreground">{entry.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

const YEAR_GRID_COLUMNS = 3
const YEAR_GRID_ROW_HEIGHT = 40
/** ~4 visible rows; Material year picker shows a compact scrollable band */
const YEAR_GRID_HEIGHT = 168

function MaterialYearGrid({
  years,
  value,
  locale,
  active = true,
  onSelect,
}: {
  years: number[]
  value: number
  locale: BsLocale
  active?: boolean
  onSelect: (year: number) => void
}) {
  const scrollRef = React.useRef<ScrollView>(null)

  const rows = React.useMemo(() => {
    const chunks: number[][] = []
    for (let index = 0; index < years.length; index += YEAR_GRID_COLUMNS) {
      chunks.push(years.slice(index, index + YEAR_GRID_COLUMNS))
    }
    return chunks
  }, [years])

  const scrollToSelected = React.useCallback(
    (animated = false) => {
      const selectedIndex = years.indexOf(value)
      if (selectedIndex < 0) return

      const rowIndex = Math.floor(selectedIndex / YEAR_GRID_COLUMNS)
      const centeredOffset =
        rowIndex * YEAR_GRID_ROW_HEIGHT -
        (YEAR_GRID_HEIGHT - YEAR_GRID_ROW_HEIGHT) / 2
      const maxOffset = Math.max(
        0,
        rows.length * YEAR_GRID_ROW_HEIGHT - YEAR_GRID_HEIGHT,
      )

      scrollRef.current?.scrollTo({
        y: Math.min(maxOffset, Math.max(0, centeredOffset)),
        animated,
      })
    },
    [rows.length, value, years],
  )

  React.useEffect(() => {
    if (!active) return

    scrollToSelected(false)

    const retry = setTimeout(() => {
      scrollToSelected(false)
    }, 50)

    return () => clearTimeout(retry)
  }, [active, scrollToSelected])

  return (
    <ScrollView
      ref={scrollRef}
      style={{ height: YEAR_GRID_HEIGHT }}
      className="px-1"
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      showsVerticalScrollIndicator
      onContentSizeChange={() => {
        if (active) scrollToSelected(false)
      }}
    >
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{ height: YEAR_GRID_ROW_HEIGHT }}
          className="flex-row items-center"
        >
          {row.map((year) => {
            const selected = year === value
            return (
              <Pressable
                key={year}
                className="flex-1 items-center justify-center"
                onPress={() => onSelect(year)}
              >
                <View
                  className={cn(
                    'min-w-[72px] items-center rounded-full px-3 py-2',
                    selected && 'bg-primary',
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm',
                      selected
                        ? 'font-medium text-primary-foreground'
                        : 'text-foreground',
                    )}
                  >
                    {formatYearLabel(year, locale)}
                  </Text>
                </View>
              </Pressable>
            )
          })}
          {row.length < YEAR_GRID_COLUMNS
            ? Array.from({ length: YEAR_GRID_COLUMNS - row.length }).map(
                (_, fillerIndex) => (
                  <View key={`filler-${fillerIndex}`} className="flex-1" />
                ),
              )
            : null}
        </View>
      ))}
    </ScrollView>
  )
}

function MaterialYearToggleIcon({ open }: { open: boolean }) {
  const progress = useDerivedValue(
    () => (open ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 })),
    [open],
  )
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }))

  return (
    <Animated.View style={chevronStyle}>
      <Icon as={ChevronDown} className="size-5 text-foreground" />
    </Animated.View>
  )
}

export function BsDayPicker({
  mode = 'single',
  selected,
  onSelect,
  locale = 'ne',
  month,
  onMonthChange,
  captionLayout = 'label',
  navVariant = 'default',
  weekdayVariant = 'short',
  showOutsideDays = true,
  disabled,
  className,
  classNames,
  components,
  footer,
}: BsDayPickerProps) {
  const {
    month: visibleMonth,
    weeks,
    weekdayLabels,
    years,
    months,
    goToPreviousMonth,
    goToNextMonth,
    setMonth,
    selectDate,
  } = useBsCalendar({
    locale,
    month,
    selected,
    mode,
    showOutsideDays,
    disabled,
    onMonthChange,
    onSelect,
  })

  const Root = components?.Root ?? DefaultRoot
  const Chevron = components?.Chevron ?? DefaultChevron
  const DayButton = components?.DayButton ?? DefaultDayButton

  const yearOptions = React.useMemo(
    () =>
      years.map((year) => ({
        value: year,
        label: formatYearLabel(year, locale),
      })),
    [years, locale],
  )

  const monthOptions = months
  const [activePicker, setActivePicker] =
    React.useState<OptionPickerState | null>(null)
  const [materialOverlay, setMaterialOverlay] = React.useState<
    'year-grid' | null
  >(null)

  const yearLabel = locale === 'ne' ? 'वर्ष' : 'Year'
  const monthLabel = locale === 'ne' ? 'महिना' : 'Month'
  const materialCaption =
    `${months.find((entry) => entry.value === visibleMonth.month)?.label ?? ''} ` +
    `${formatYearLabel(visibleMonth.year, locale)}`

  const weekdayDisplayLabels = React.useMemo(() => {
    if (weekdayVariant === 'narrow' && locale === 'en') {
      return weekdayLabels.map((label) => label.charAt(0))
    }
    return weekdayLabels
  }, [locale, weekdayLabels, weekdayVariant])

  return (
    <Root className={cn(className, classNames?.root)}>
      <View className={cn(classNames?.months, navVariant === 'material' && 'h-full')}>
        <View
          className={cn(
            classNames?.month,
            'relative',
            navVariant === 'material'
              ? 'h-full'
              : 'min-h-72',
          )}
        >
          {navVariant === 'material' ? (
            <View
              className={cn(
                classNames?.nav,
                'mb-1 flex-row items-center justify-between px-1',
              )}
            >
              <View className="min-h-10 flex-row items-center">
                <Text
                  className={
                    classNames?.caption_label ??
                    'text-sm font-medium text-foreground'
                  }
                >
                  {materialCaption}
                </Text>
                <Pressable
                  accessibilityLabel={
                    materialOverlay === 'year-grid'
                      ? locale === 'ne'
                        ? 'वर्ष चयन बन्द गर्नुहोस्'
                        : 'Close year selection'
                      : locale === 'ne'
                        ? 'वर्ष छान्नुहोस्'
                        : 'Select year'
                  }
                  className="size-12 items-center justify-center rounded-full active:bg-accent/40"
                  onPress={() =>
                    setMaterialOverlay((current) =>
                      current === 'year-grid' ? null : 'year-grid',
                    )
                  }
                >
                  <MaterialYearToggleIcon open={materialOverlay === 'year-grid'} />
                </Pressable>
              </View>

              {materialOverlay !== 'year-grid' ? (
              <View className="shrink-0 flex-row items-center gap-1">
                <Pressable
                  accessibilityLabel="Previous month"
                  className={cn(
                    classNames?.button_previous,
                    'size-12 items-center justify-center rounded-full active:bg-accent/40',
                  )}
                  onPress={goToPreviousMonth}
                >
                  <Chevron orientation="left" />
                </Pressable>
                <Pressable
                  accessibilityLabel="Next month"
                  className={cn(
                    classNames?.button_next,
                    'size-12 items-center justify-center rounded-full active:bg-accent/40',
                  )}
                  onPress={goToNextMonth}
                >
                  <Chevron orientation="right" />
                </Pressable>
              </View>
              ) : null}
            </View>
          ) : (
          <View className={classNames?.nav}>
            <Pressable
              accessibilityLabel="Previous month"
              className={classNames?.button_previous}
              onPress={goToPreviousMonth}
            >
              <Chevron orientation="left" />
            </Pressable>

            <View className={classNames?.month_caption}>
              {captionLayout === 'dropdown' ? (
                <View className={classNames?.dropdowns}>
                  <DropdownTrigger
                    label={yearLabel}
                    displayValue={formatYearLabel(visibleMonth.year, locale)}
                    className={classNames?.dropdown}
                    onPress={() =>
                      setActivePicker({
                        label: yearLabel,
                        options: yearOptions,
                        value: visibleMonth.year,
                        onChange: (year) =>
                          setMonth({
                            year,
                            month: visibleMonth.month,
                          }),
                      })
                    }
                  />
                  <DropdownTrigger
                    label={monthLabel}
                    displayValue={
                      months.find((entry) => entry.value === visibleMonth.month)
                        ?.label ?? String(visibleMonth.month)
                    }
                    className={classNames?.dropdown}
                    onPress={() =>
                      setActivePicker({
                        label: monthLabel,
                        options: monthOptions,
                        value: visibleMonth.month,
                        onChange: (monthValue) =>
                          setMonth({
                            year: visibleMonth.year,
                            month: monthValue,
                          }),
                      })
                    }
                  />
                </View>
              ) : (
                <Text className={classNames?.caption_label}>
                  {months.find((entry) => entry.value === visibleMonth.month)
                    ?.label}{' '}
                  {formatYearLabel(visibleMonth.year, locale)}
                </Text>
              )}
            </View>

            <Pressable
              accessibilityLabel="Next month"
              className={classNames?.button_next}
              onPress={goToNextMonth}
            >
              <Chevron orientation="right" />
            </Pressable>
          </View>
          )}

          <View className={classNames?.month_grid}>
            {navVariant === 'material' && materialOverlay === 'year-grid' ? (
              <MaterialYearGrid
                active
                years={years}
                value={visibleMonth.year}
                locale={locale}
                onSelect={(year) => {
                  setMonth({ year, month: visibleMonth.month })
                  setMaterialOverlay(null)
                }}
              />
            ) : (
              <>
            <View className={classNames?.weekdays}>
              {weekdayDisplayLabels.map((label, index) => (
                <View key={`${label}-${index}`} className={classNames?.weekday}>
                  <Text className="text-xs text-muted-foreground">{label}</Text>
                </View>
              ))}
            </View>

            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} className={classNames?.week}>
                {week.map((cell, cellIndex) => {
                  if (cell.isPlaceholder) {
                    return (
                      <View
                        key={`placeholder-${weekIndex}-${cellIndex}`}
                        className={classNames?.day}
                      />
                    )
                  }

                  const label = formatDayLabel(cell.date.day, locale)

                  return (
                    <View
                      key={`${cell.date.year}-${cell.date.month}-${cell.date.day}`}
                      className={cn(
                        classNames?.day,
                        !cell.currentMonth && classNames?.outside,
                        cell.isSelected && classNames?.selected,
                        cell.isToday && classNames?.today,
                        cell.isDisabled && classNames?.disabled,
                      )}
                    >
                      <DayButton
                        date={cell.date}
                        adDate={cell.adDate}
                        label={label}
                        selected={Boolean(cell.isSelected)}
                        today={Boolean(cell.isToday)}
                        outside={!cell.currentMonth}
                        disabled={Boolean(cell.isDisabled)}
                        onClick={() => selectDate(cell.date)}
                        className={classNames?.day_button}
                      />
                    </View>
                  )
                })}
              </View>
            ))}
              </>
            )}
          </View>

          {footer ? <View className={classNames?.footer}>{footer}</View> : null}

          {activePicker ? (
            <InlineOptionPicker
              {...activePicker}
              locale={locale}
              onClose={() => setActivePicker(null)}
            />
          ) : null}
        </View>
      </View>
    </Root>
  )
}
