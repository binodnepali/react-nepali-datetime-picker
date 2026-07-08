# Data Source

Calendar grid data is generated from [Hamro Patro](https://english.hamropatro.com/calendar/2083/1) and committed as `lib/bs-day-picker/data/bs-calendar.json`.

## Regenerate data

From the monorepo root:

```bash
# Scrape Hamro Patro (rate-limited; resumes from .cache/hamropatro/)
pnpm data:scrape

# Build full dataset (chains BS days + overlays scraped months)
pnpm data:build

# Validate grid integrity and spot-checks
pnpm data:validate
```

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

## Attribution

Hamro Patro is the authoritative source for BS–AD mapping and festival labels. Re-scrape periodically to pick up calendar corrections.
