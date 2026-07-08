#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_PATH = join(
  __dirname,
  '../packages/core/src/data/bs-calendar.json',
)

function validateData(data) {
  const errors = []
  const years = Object.keys(data).map(Number).sort((a, b) => a - b)

  if (years.length === 0) {
    errors.push('No years found in calendar data')
    return errors
  }

  for (const year of years) {
    const months = data[String(year)]
    const monthKeys = Object.keys(months).map(Number).sort((a, b) => a - b)

    if (monthKeys.length !== 12) {
      errors.push(`Year ${year} has ${monthKeys.length} months (expected 12)`)
    }

    for (const month of monthKeys) {
      const monthData = months[String(month)]
      const currentDays = monthData.days.filter(
        (day) => day.bsYear === year && day.bsMonth === month,
      )

      if (currentDays.length !== monthData.daysInMonth) {
        errors.push(
          `${year}/${month}: daysInMonth=${monthData.daysInMonth}, actual=${currentDays.length}`,
        )
      }

      for (let index = 1; index < monthData.days.length; index++) {
        const prev = new Date(`${monthData.days[index - 1].adDate}T12:00:00`)
        const next = new Date(`${monthData.days[index].adDate}T12:00:00`)
        if (next <= prev) {
          errors.push(
            `${year}/${month}: grid AD dates not monotonic at index ${index}`,
          )
        }
      }
    }
  }

  const spotChecks = [
    { year: 2083, month: 1, day: 1, adDate: '2026-04-14' },
    { year: 2083, month: 1, day: 18, adDate: '2026-05-01' },
    { year: 2082, month: 12, day: 29, adDate: '2026-04-12' },
  ]

  const cacheDir = join(__dirname, '../.cache/hamropatro')

  for (const check of spotChecks) {
    const cacheFile = join(cacheDir, `${check.year}-${check.month}.json`)
    let hasScrapedMonth = false
    try {
      readFileSync(cacheFile, 'utf8')
      hasScrapedMonth = true
    } catch {
      // not scraped — skip AD spot-check
    }

    const monthData = data[String(check.year)]?.[String(check.month)]
    const day = monthData?.days.find(
      (entry) =>
        entry.bsYear === check.year &&
        entry.bsMonth === check.month &&
        entry.bsDay === check.day,
    )

    if (!day) {
      errors.push(
        `Missing spot-check day ${check.year}-${check.month}-${check.day}`,
      )
      continue
    }

    if (hasScrapedMonth && day.adDate !== check.adDate) {
      errors.push(
        `Spot-check mismatch ${check.year}-${check.month}-${check.day}: expected ${check.adDate}, got ${day.adDate}`,
      )
    }
  }

  return errors
}

async function main() {
  const raw = await readFile(DATA_PATH, 'utf8')
  const data = JSON.parse(raw)
  const errors = validateData(data)

  if (errors.length > 0) {
    console.error('Calendar data validation failed:')
    for (const error of errors) {
      console.error(`  - ${error}`)
    }
    process.exit(1)
  }

  console.log(
    `Calendar data valid (${Object.keys(data).length} years, spot-checks passed).`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
