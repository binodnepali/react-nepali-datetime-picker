# Localization

All registry components support English (`en`) and Nepali (`ne`) via the `locale` prop.

## Locale prop

```tsx
<BsCalendar locale="ne" />
<BsDatePicker locale="en" onChange={…} />
<BsTimePicker locale="ne" onChange={…} />
<BsDateTimePicker locale="ne" onChange={…} />
```

## Date labels

What changes with `locale` on calendar and date pickers:

- Month names (बैशाख / Baishakh)
- Weekday headers (आइत / Sun)
- Day digits (Devanagari numerals for `ne`)
- Long formatted dates via `formatBsDateLong`

### Date formatting helpers

Copied into `lib/bs-day-picker/formatters.ts`:

```ts
import { formatBsDate, formatBsDateLong, formatAdDate } from "@/lib/bs-day-picker/formatters"

formatBsDate({ year: 2083, month: 1, day: 1 }, "ne")
// "२०८३/०१/०१"

formatBsDateLong({ year: 2083, month: 1, day: 1 }, "en")
// "1 Baishakh 2083"
```

## Time labels

Time pickers use helpers from `lib/bs-time-picker/` (and `lib/bs-time-picker/time/formatters.ts`):

| Helper | `ne` example | Notes |
| ------ | ------------ | ----- |
| `formatTimeDigit(n, locale)` | `०९` | Hour/minute digits |
| `formatPeriodOption('am', 'ne')` | `एम` | AM/PM toggle (picker UI) |
| `formatPeriodOption('pm', 'ne')` | `पिम` | AM/PM toggle (picker UI) |
| `formatBsTime(time, 'ne')` | `०३:३० पूर्वाह्न` | Full trigger label (long period) |
| `formatBsTimeWheelLabel(…)` | same as `formatBsTime` | Wheel / dialog display |

Internal storage is always **24-hour** (`hour: 0–23`). Set `is24Hour={true}` to hide AM/PM.

```ts
import { formatBsTime, formatPeriodOption } from "@/lib/bs-time-picker"
import type { BsTime } from "@/lib/bs-time-picker/time/types"

const time: BsTime = { hour: 15, minute: 30 }

formatBsTime(time, "ne", false)
// "०३:३० अपराह्न"

formatPeriodOption("pm", "ne")
// "पिम"
```

## Date + time labels

```ts
import { formatBsDateTime } from "@/lib/bs-datetime-picker"

formatBsDateTime(
  { year: 2083, month: 1, day: 15, hour: 9, minute: 0 },
  "ne",
)
// BS date + time string for triggers and display
```

## Native dialog copy

On React Native, pass translated strings for sheet/dialog actions:

```tsx
<BsDatePicker
  locale="ne"
  cancelLabel="रद्द"
  confirmLabel="ठीक"
  placeholder="मिति छान्नुहोस्"
/>

<BsTimePicker
  locale="ne"
  cancelLabel="रद्द"
  confirmLabel="ठीक"
  placeholder="समय छान्नुहोस्"
/>
```

Defaults are English (`Cancel` / `OK` or `Select time`). Wire these to your app i18n catalog in production apps.

## RTL

Nepali text renders correctly with logical CSS properties (`rounded-s`, `rounded-e`) in web components and NativeWind on native.
