# Data Source

Calendar grid data is generated from [Hamro Patro](https://english.hamropatro.com/calendar/2083/1) and committed as `lib/bs-day-picker/data/bs-calendar.json`.

## Regenerate data

From the monorepo root:

```bash
# Scrape Hamro Patro (rate-limited; resumes from .cache/hamropatro/)
pnpm data:scrape -- --years 2080-2089

# Build full dataset (legacy grid + scraped month overlays)
pnpm data:build

# Validate grid integrity and spot-checks
pnpm data:validate
```

Maintainers can also run **Actions → Refresh calendar data** to open a PR automatically. See [Contributing — Data release](https://github.com/binodnepali/react-nepali-datetime-picker/blob/main/CONTRIBUTING.md#data-release-maintainers).

## Schema

```ts
type BsCalendarData = Record<string, Record<string, {
  daysInMonth: number
  weekdayOffset: number
  days: Array<{
    bsYear: number
    bsMonth: number
    bsDay: number
    adDate: string      // "2026-04-14"
    weekday: number     // 0 = Sunday
    events?: string[]
    isHoliday?: boolean
  }>
}>>
```

## Year range

`2000` – `2089` BS (matching Hamro Patro navigation).

## Date + time pickers

`BsDateTimePicker` and `toAdDate()` resolve the Gregorian date from the same `bs-calendar.json` entries (`adDate` per BS day). If a day is missing from the dataset, `getDayAdDate` / `toAdDate` return `null` — handle that in submit handlers.

## Attribution

Hamro Patro is the authoritative source for BS–AD mapping and festival labels. Re-scrape periodically to pick up calendar corrections.
