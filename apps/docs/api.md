# BsDayPicker API

The headless primitive mirrors the minimal [React DayPicker](https://daypicker.dev/) API.

## `BsDate`

```ts
type BsDate = {
  year: number; // e.g. 2083
  month: number; // 1-12 (Baishakh = 1)
  day: number; // 1-32
};
```

Months are **1-indexed** to match Hamro Patro URLs (`/calendar/2083/1`).

## BS ↔ AD

`onSelect`, `onChange`, and `onValueChange` return **`BsDate` only** (Bikram Sambat year / month / day). They do **not** include the Gregorian (AD) date in the callback.

Each day in `lib/bs-day-picker/data/bs-calendar.json` stores the mapped AD date (`"2026-04-14"`). Look it up from a selected `BsDate`:

```ts
import type { BsDate } from "@/lib/bs-day-picker/types";
import { getDayAdDate } from "@/lib/bs-day-picker/calendar-grid";
import { findDayInData } from "@/lib/bs-day-picker/navigation";
import { formatAdDate } from "@/lib/bs-day-picker/formatters";

function handleSelect(bs: BsDate | undefined) {
  if (!bs) return;

  const adDate = getDayAdDate(bs); // "2026-04-14" or null if missing from data

  const day = findDayInData(bs); // full row: adDate, weekday, events, isHoliday, …
  const label = day?.adDate ? formatAdDate(day.adDate, "en") : null;
}
```

| Helper                         | Returns                                |
| ------------------------------ | -------------------------------------- |
| `getDayAdDate(bs)`             | AD ISO string (`YYYY-MM-DD`) or `null` |
| `findDayInData(bs)`            | Full calendar day entry or `undefined` |
| `formatAdDate(adDate, locale)` | Localized AD label for display         |
| `getCurrentBsDate()`           | Today as `BsDate` (from calendar data) |

## `BsDayPicker` props

| Prop              | Type                                | Default    | Description                                          |
| ----------------- | ----------------------------------- | ---------- | ---------------------------------------------------- |
| `mode`            | `"single" \| "multiple" \| "range"` | `"single"` | v1 implements `single` only                          |
| `selected`        | `BsDate \| undefined`               | —          | Selected date                                        |
| `onSelect`        | `(date?: BsDate) => void`           | —          | Selection callback (BS only — see [BS ↔ AD](#bs-ad)) |
| `locale`          | `"en" \| "ne"`                      | `"ne"`     | Labels and digit formatting                          |
| `month`           | `{ year, month }`                   | today      | Visible month                                        |
| `onMonthChange`   | `(month) => void`                   | —          | Month navigation callback                            |
| `captionLayout`   | `"label" \| "dropdown"`             | `"label"`  | Caption UI                                           |
| `showOutsideDays` | `boolean`                           | `true`     | Show adjacent-month days                             |
| `disabled`        | `boolean \| (date) => boolean`      | —          | Disable days                                         |
| `className`       | `string`                            | —          | Root class                                           |
| `classNames`      | `BsDayPickerClassNames`             | —          | Slot class map                                       |
| `components`      | `BsDayPickerComponents`             | —          | Sub-component overrides                              |
| `footer`          | `ReactNode`                         | —          | Footer below grid                                    |

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
});
```

## `BsDatePicker` (web)

| Prop          | Type                       | Description                                      |
| ------------- | -------------------------- | ------------------------------------------------ |
| `value`       | `BsDate`                   | Selected value                                   |
| `onChange`    | `(value?: BsDate) => void` | Change handler (BS only — see [BS ↔ AD](#bs-ad)) |
| `locale`      | `"en" \| "ne"`             | Display locale                                   |
| `placeholder` | `string`                   | Trigger placeholder                              |
