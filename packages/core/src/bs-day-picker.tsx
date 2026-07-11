import type { CSSProperties, ReactNode } from 'react'

import { formatYearLabel } from './formatters'
import { useBsCalendar } from './use-bs-calendar'
import type {
  BsCaptionLayout,
  BsDate,
  BsDisabledMatcher,
  BsLocale,
  BsMonth,
  BsSelectionMode,
} from './types'

export type BsDayPickerClassNames = {
  root?: string
  months?: string
  month?: string
  nav?: string
  button_previous?: string
  button_next?: string
  month_caption?: string
  dropdowns?: string
  dropdown_root?: string
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
    style?: CSSProperties
    children: ReactNode
  }) => ReactNode
  Chevron?: (props: {
    orientation: 'left' | 'right' | 'down'
    className?: string
  }) => ReactNode
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
  }) => ReactNode
}

export type BsDayPickerProps = {
  mode?: BsSelectionMode
  selected?: BsDate
  onSelect?: (date: BsDate | undefined) => void
  locale?: BsLocale
  month?: BsMonth
  onMonthChange?: (month: BsMonth) => void
  captionLayout?: BsCaptionLayout
  showOutsideDays?: boolean
  disabled?: BsDisabledMatcher | boolean
  className?: string
  classNames?: BsDayPickerClassNames
  style?: CSSProperties
  components?: BsDayPickerComponents
  footer?: ReactNode
}

function cn(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

function DefaultRoot({
  className,
  style,
  children,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

function DefaultChevron({
  orientation,
  className,
}: {
  orientation: 'left' | 'right' | 'down'
  className?: string
}) {
  const symbol =
    orientation === 'left' ? '‹' : orientation === 'right' ? '›' : '▾'
  return (
    <span className={className} aria-hidden>
      {symbol}
    </span>
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
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-selected={selected || undefined}
      data-today={today || undefined}
      data-outside={outside || undefined}
    >
      {label}
    </button>
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
  showOutsideDays = true,
  disabled,
  className,
  classNames,
  style,
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

  return (
    <Root className={cn(className, classNames?.root)} style={style}>
      <div className={classNames?.months}>
        <div className={classNames?.month}>
          <div className={classNames?.nav}>
            <button
              type="button"
              className={classNames?.button_previous}
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              <Chevron orientation="left" />
            </button>

            <div className={classNames?.month_caption}>
              {captionLayout === 'dropdown' ? (
                <div className={classNames?.dropdowns}>
                  <div className={classNames?.dropdown_root}>
                    <select
                      className={classNames?.dropdown}
                      value={visibleMonth.year}
                      aria-label="Select year"
                      onChange={(event) =>
                        setMonth({
                          year: Number(event.target.value),
                          month: visibleMonth.month,
                        })
                      }
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {formatYearLabel(year, locale)}
                        </option>
                      ))}
                    </select>
                    <span className={classNames?.caption_label}>
                      <span>{formatYearLabel(visibleMonth.year, locale)}</span>
                      <Chevron orientation="down" />
                    </span>
                  </div>
                  <div className={classNames?.dropdown_root}>
                    <select
                      className={classNames?.dropdown}
                      value={visibleMonth.month}
                      aria-label="Select month"
                      onChange={(event) =>
                        setMonth({
                          year: visibleMonth.year,
                          month: Number(event.target.value),
                        })
                      }
                    >
                      {months.map((entry) => (
                        <option key={entry.value} value={entry.value}>
                          {entry.label}
                        </option>
                      ))}
                    </select>
                    <span className={classNames?.caption_label}>
                      <span>
                        {
                          months.find(
                            (entry) => entry.value === visibleMonth.month,
                          )?.label
                        }
                      </span>
                      <Chevron orientation="down" />
                    </span>
                  </div>
                </div>
              ) : (
                <span className={classNames?.caption_label}>
                  {months.find((entry) => entry.value === visibleMonth.month)
                    ?.label}{' '}
                  {formatYearLabel(visibleMonth.year, locale)}
                </span>
              )}
            </div>

            <button
              type="button"
              className={classNames?.button_next}
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <Chevron orientation="right" />
            </button>
          </div>

          <table className={classNames?.month_grid}>
            <thead>
              <tr className={classNames?.weekdays}>
                {weekdayLabels.map((label) => (
                  <th key={label} className={classNames?.weekday}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex} className={classNames?.week}>
                  {week.map((cell, cellIndex) => {
                    if (cell.isPlaceholder) {
                      return (
                        <td
                          key={`placeholder-${weekIndex}-${cellIndex}`}
                          className={classNames?.day}
                        />
                      )
                    }

                    const label =
                      locale === 'ne'
                        ? String(cell.date.day)
                            .split('')
                            .map((digit) => {
                              const map = '०१२३४५६७८९'
                              const index = Number(digit)
                              return Number.isNaN(index) ? digit : map[index]
                            })
                            .join('')
                        : String(cell.date.day)

                    return (
                      <td
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
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {footer ? <div className={classNames?.footer}>{footer}</div> : null}
        </div>
      </div>
    </Root>
  )
}
