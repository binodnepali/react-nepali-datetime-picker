# API overview

Shared types and BS ↔ AD helpers used across registry items. Component-specific props live on dedicated pages:

- [BsDayPicker](/api/day-picker) — headless calendar primitive and `useBsCalendar`
- [Pickers](/api/pickers) — `BsDatePicker`, `BsTimePicker`, `BsDateTimePicker`

## `BsDate`

```ts
type BsDate = {
  year: number; // e.g. 2083
  month: number; // 1-12 (Baishakh = 1)
  day: number; // 1-32
};
```

Months are **1-indexed** to match Hamro Patro URLs (`/calendar/2083/1`).

## BS ↔ AD {#bs-ad}

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

For datetime values, see [BS ↔ AD datetime](/api/pickers#bs-ad-datetime) on the pickers page.
