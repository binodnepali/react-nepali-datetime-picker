# Pickers

Registry items: **`bs-date-picker`**, **`bs-time-picker`**, **`bs-datetime-picker`**.

Date callbacks return **`BsDate` only** — see [BS ↔ AD](/api#bs-ad) on the overview page.

## `BsDatePicker`

| Prop            | Type                       | Default | Description                                      |
| --------------- | -------------------------- | ------- | ------------------------------------------------ |
| `value`         | `BsDate`                   | —       | Selected value                                   |
| `onChange`      | `(value?: BsDate) => void` | —       | Change handler (web)                             |
| `onValueChange` | `(value?: BsDate) => void` | —       | Change handler (native)                          |
| `locale`        | `"en" \| "ne"`             | `"ne"`  | Display locale                                   |
| `placeholder`   | `string`                   | —       | Trigger placeholder                              |
| `disabled`      | `boolean`                  | —       | Disable trigger                                  |

| Platform | UX                                    |
| -------- | ------------------------------------- |
| iOS      | Bottom sheet with BS date wheels      |
| Android  | Material calendar dialog              |
| Web      | Popover with `BsCalendar`             |

## `BsTime`

```ts
type BsTime = {
  hour: number; // 0–23
  minute: number; // 0–59
};
```

Internal storage is always **24-hour**. Set `is24Hour={false}` on pickers for 12-hour display with AM/PM.

Nepali period labels in the picker UI: **एम** (AM), **पिम** (PM).

## `BsTimePicker`

| Prop            | Type                        | Default | Description              |
| --------------- | --------------------------- | ------- | ------------------------ |
| `value`         | `BsTime`                    | —       | Selected time            |
| `onChange`      | `(value?: BsTime) => void`  | —       | Change handler (web)     |
| `onValueChange` | `(value?: BsTime) => void`  | —       | Change handler (native)  |
| `locale`        | `"en" \| "ne"`              | `"ne"`  | Labels and digits        |
| `is24Hour`      | `boolean`                   | `false` | 24h vs 12h + AM/PM       |
| `placeholder`   | `string`                    | —       | Trigger placeholder      |
| `disabled`      | `boolean`                   | —       | Disable trigger          |

| Platform | UX                                              |
| -------- | ----------------------------------------------- |
| iOS      | Bottom sheet with hour / minute / AM·PM wheels   |
| Android  | Material time dialog (digital + analog clock)   |
| Web      | Popover with hour, minute, and period selects   |

## `BsDateTime`

```ts
type BsDateTime = BsDate & BsTime;
// { year, month, day, hour, minute }
```

### BS ↔ AD datetime {#bs-ad-datetime}

Use `toAdDate()` when submitting to APIs that expect a Gregorian `Date`:

```ts
import type { BsDateTime } from "@/lib/bs-time-picker/time/types";
import { toAdDate } from "@/lib/bs-datetime-picker";

function submitJourney(bsDateTime: BsDateTime) {
  const ad = toAdDate(bsDateTime); // Date in local timezone or null if day missing from data
  if (!ad) return;
  // e.g. OTP journeyDate
}
```

| Helper                        | Returns                                       |
| ----------------------------- | --------------------------------------------- |
| `toAdDate(bsDateTime)`        | `Date` or `null` (uses `getDayAdDate` + time) |
| `formatBsDateTime()`          | Localized BS date + time label (weekday + long date + time) |
| `formatBsDateLongWithWeekday()` | Date only, e.g. `Friday, 26 Ashad 2083`                  |
| `getDefaultBsDateTime()`      | Today + now as `BsDateTime`                   |
| `mergeBsDateTime(date, time)` | Combine `BsDate` + `BsTime`                   |

## `BsDateTimePicker`

Same props as `BsTimePicker`, plus date selection. Web uses `onChange`; native uses `onValueChange`.

| Platform | UX                                              |
| -------- | ----------------------------------------------- |
| iOS      | Bottom sheet: BS date wheel + hour/minute wheels |
| Android  | Material calendar dialog → time dialog          |
| Web      | Popover: calendar + time selects                |

## Related

- [BsDayPicker](/api/day-picker) — headless calendar used inside date pickers
- [API overview](/api) — shared `BsDate` type and date BS ↔ AD helpers
