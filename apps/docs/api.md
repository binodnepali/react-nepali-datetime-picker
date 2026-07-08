# BsDayPicker API

The headless primitive mirrors the minimal [React DayPicker](https://daypicker.dev/) API.

## `BsDate`

```ts
type BsDate = {
  year: number   // e.g. 2083
  month: number  // 1-12 (Baishakh = 1)
  day: number    // 1-32
}
```

Months are **1-indexed** to match Hamro Patro URLs (`/calendar/2083/1`).

## `BsDayPicker` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"single" \| "multiple" \| "range"` | `"single"` | v1 implements `single` only |
| `selected` | `BsDate \| undefined` | — | Selected date |
| `onSelect` | `(date?: BsDate) => void` | — | Selection callback |
| `locale` | `"en" \| "ne"` | `"ne"` | Labels and digit formatting |
| `month` | `{ year, month }` | today | Visible month |
| `onMonthChange` | `(month) => void` | — | Month navigation callback |
| `captionLayout` | `"label" \| "dropdown"` | `"label"` | Caption UI |
| `showOutsideDays` | `boolean` | `true` | Show adjacent-month days |
| `disabled` | `boolean \| (date) => boolean` | — | Disable days |
| `className` | `string` | — | Root class |
| `classNames` | `BsDayPickerClassNames` | — | Slot class map |
| `components` | `BsDayPickerComponents` | — | Sub-component overrides |
| `footer` | `ReactNode` | — | Footer below grid |

## `useBsCalendar`

```ts
const {
  month,
  weeks,
  weekdayLabels,
  years,
  months,
  goToPreviousMonth,
  goToNextMonth,
  setMonth,
  selectDate,
} = useBsCalendar({
  locale: "ne",
  month: { year: 2083, month: 1 },
  selected,
  onSelect,
})
```

## `BsDatePicker` (web)

| Prop | Type | Description |
|------|------|-------------|
| `value` | `BsDate` | Selected value |
| `onChange` | `(value?: BsDate) => void` | Change handler |
| `locale` | `"en" \| "ne"` | Display locale |
| `placeholder` | `string` | Trigger placeholder |
