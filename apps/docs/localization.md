# Localization

BsDayPicker supports English (`en`) and Nepali (`ne`).

## Locale prop

```tsx
<BsCalendar locale="ne" />
<BsCalendar locale="en" />
```

## What changes with locale

- Month names (बैशाख / Baishakh)
- Weekday headers (आइत / Sun)
- Day digits (Devanagari numerals for `ne`)
- Long formatted dates via `formatBsDateLong`

## Formatting helpers

Copied into `lib/bs-day-picker/formatters.ts`:

```ts
import { formatBsDate, formatBsDateLong, formatAdDate } from "@/lib/bs-day-picker/formatters"

formatBsDate({ year: 2083, month: 1, day: 1 }, "ne")
// "२०८३/०१/०१"

formatBsDateLong({ year: 2083, month: 1, day: 1 }, "en")
// "1 Baishakh 2083"
```

## RTL

Nepali text renders correctly with logical CSS properties (`rounded-s`, `rounded-e`) in the web `bs-calendar` component.
