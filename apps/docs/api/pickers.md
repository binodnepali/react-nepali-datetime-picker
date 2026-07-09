# Pickers

Registry items: **`bs-date-picker`**, **`bs-time-picker`**, **`bs-datetime-picker`**.

Date callbacks return **`BsDate` only** — see [BS ↔ AD](/api#bs-ad) on the overview page.

## Display formatting

All three pickers format the trigger label with **date-fns-style tokens** mapped to Bikram Sambat data (weekday/month names from Hamro Patro). No `date-fns` dependency.

**Precedence:** `formatValue` → `formatPattern` → built-in default.

| Picker            | Default pattern              | Example (`en`)                         |
| ----------------- | ---------------------------- | -------------------------------------- |
| `BsDatePicker`    | `EEEE, d MMMM yyyy`          | `Friday, 26 Ashad 2083`                |
| `BsTimePicker`    | `h:mm a`                     | `10:51 PM`                             |
| `BsDateTimePicker`| `EEEE, d MMMM yyyy, h:mm a`  | `Friday, 26 Ashad 2083, 10:51 PM`     |

### Props (all pickers)

| Prop            | Type | Description |
| --------------- | ---- | ----------- |
| `formatPattern` | `string` | date-fns-style BS tokens (see table below) |
| `formatValue`   | `(value, locale, …) => string` | Full override; takes precedence over `formatPattern` |

Use single quotes for literals, e.g. `'at' h:mm a` → `at 10:51 PM`.

### Date tokens

| Token | Output |
| ----- | ------ |
| `EEEE` | Full weekday (`Friday` / `शुक्रबार`) |
| `EEE` | Short weekday |
| `MMMM` | Full BS month (`Ashad` / `असार`) |
| `MMM` | Short BS month |
| `yyyy` | 4-digit BS year |
| `yy` | 2-digit BS year |
| `MM` / `M` | Month number (padded / unpadded) |
| `dd` / `d` | Day of month (padded / unpadded) |

Nepali locale uses Nepali digits where applicable.

### Time tokens

| Token | Output |
| ----- | ------ |
| `HH` / `H` | 24-hour hour (padded / unpadded) |
| `hh` / `h` | 12-hour hour when `is24Hour={false}`; maps to 24h when `is24Hour={true}` |
| `mm` / `m` | Minute (padded / unpadded) |
| `a` | AM/PM (`AM`/`PM` or `एम`/`पिम`); omitted in 24-hour mode |

### Helpers

```ts
import { formatBsDatePattern, BS_DATE_DISPLAY_PATTERN } from "@/lib/bs-day-picker/pattern"
import {
  formatBsTimePattern,
  formatBsDateTimePattern,
  BS_TIME_DISPLAY_PATTERN,
  BS_DATETIME_DISPLAY_PATTERN,
} from "@/lib/bs-time-picker/time/pattern"
```

For Gregorian labels, use `formatValue` with `toAdDate()` and your own formatter (e.g. `date-fns`).

```tsx
<BsDateTimePicker
  value={bsValue}
  onChange={setBsValue}
  locale="en"
  formatPattern="EEE d MMM yyyy, HH:mm"
  is24Hour
/>
```

## `BsDatePicker`

| Prop            | Type                       | Default | Description                                      |
| --------------- | -------------------------- | ------- | ------------------------------------------------ |
| `value`         | `BsDate`                   | —       | Selected value                                   |
| `onChange`      | `(value?: BsDate) => void` | —       | Change handler (web)                             |
| `onValueChange` | `(value?: BsDate) => void` | —       | Change handler (native)                          |
| `locale`        | `"en" \| "ne"`             | `"ne"`  | Display locale                                   |
| `placeholder`   | `string`                   | —       | Trigger placeholder                              |
| `formatPattern` | `string`                   | `EEEE, d MMMM yyyy` | Trigger label pattern              |
| `formatValue`   | `(value, locale) => string`| —       | Custom trigger label                             |
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
| `formatPattern` | `string`                    | `h:mm a`| Trigger label pattern    |
| `formatValue`   | `(value, locale, is24Hour) => string` | — | Custom trigger label |
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
| `formatBsDateTime()`          | Default pattern: `Friday, 26 Ashad 2083, 10:51 PM` |
| `formatBsDateTimePattern()`   | Custom pattern formatting                     |
| `formatBsDateLongWithWeekday()` | Date only, e.g. `Friday, 26 Ashad 2083`    |
| `getDefaultBsDateTime()`      | Today + now as `BsDateTime`                   |
| `mergeBsDateTime(date, time)` | Combine `BsDate` + `BsTime`                   |

## `BsDateTimePicker`

Same props as `BsTimePicker`, plus date selection. Web uses `onChange`; native uses `onValueChange`.

| Prop            | Type                        | Default | Description              |
| --------------- | --------------------------- | ------- | ------------------------ |
| `formatPattern` | `string`                    | `EEEE, d MMMM yyyy, h:mm a` | Trigger label pattern |
| `formatValue`   | `(value, locale, is24Hour) => string` | — | Custom trigger label |

| Platform | UX                                              |
| -------- | ----------------------------------------------- |
| iOS      | Bottom sheet: BS date wheel + hour/minute wheels |
| Android  | Material calendar dialog → time dialog          |
| Web      | Popover: calendar + time selects                |

## Related

- [BsDayPicker](/api/day-picker) — headless calendar used inside date pickers
- [API overview](/api) — shared `BsDate` type and date BS ↔ AD helpers
