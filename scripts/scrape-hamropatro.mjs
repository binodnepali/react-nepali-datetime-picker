#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUTPUT_PATH = join(ROOT, 'packages/core/src/data/bs-calendar.json')
const CACHE_DIR = join(ROOT, '.cache/hamropatro')

const MIN_YEAR = 2000
const MAX_YEAR = 2089
const CONCURRENCY = 1
const DELAY_MS = 2000
const MAX_RETRIES = 5

const MONTH_NAMES = [
  'Baishakh',
  'Jestha',
  'Ashad',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Paush',
  'Magh',
  'Falgun',
  'Chaitra',
]

function parseArgs() {
  const args = process.argv.slice(2)
  let minYear = MIN_YEAR
  let maxYear = MAX_YEAR

  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--years' && args[index + 1]) {
      const [start, end] = args[index + 1].split('-').map(Number)
      minYear = start
      maxYear = end ?? start
      index++
    }
  }

  return { minYear, maxYear }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function parseAdDate(value) {
  const match = value.match(/([A-Za-z]+)\s+(\d+),\s+(\d{4})/)
  if (!match) return null

  const monthNames = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  }

  const month = monthNames[match[1]]
  if (!month) return null

  const day = match[2].padStart(2, '0')
  return `${match[3]}-${month}-${day}`
}

function parseMonthHtml(html, year, month) {
  const start = html.indexOf('<ul class="dates clearfix">')
  if (start < 0) {
    throw new Error(`Calendar grid not found for ${year}/${month}`)
  }

  const section =
    '<ul class="dates clearfix">' + html.slice(start).split('</ul>')[0]
  const chunks = section.split(/<li\s/).slice(1)

  const days = chunks.map((chunk) => {
    const nep = Number(chunk.match(/class="nep">(\d+)/)?.[1])
    const dateId = chunk.match(/date\/(\d+-\d+-\d+)/)?.[1]
    const adRaw = chunk.match(/>([A-Z][a-z]+ \d+, \d{4})</)?.[1]
    const event = chunk.match(/class="event">([^<]+)</)?.[1]?.trim()
    const isHoliday = chunk.includes('class="holiday')
    const isDisabled = chunk.includes('class="disable')

    if (!dateId || !adRaw || Number.isNaN(nep)) {
      throw new Error(`Unable to parse day cell in ${year}/${month}`)
    }

    const [parsedYear, parsedMonth, parsedDay] = dateId.split('-').map(Number)
    const adDate = parseAdDate(adRaw)
    if (!adDate) {
      throw new Error(`Unable to parse AD date "${adRaw}" in ${year}/${month}`)
    }

    const weekdayMatch = chunk.match(
      /\d+ [A-Za-z]+ \d+, (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)/,
    )
    const weekdayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const weekday = weekdayNames.indexOf(weekdayMatch?.[1] ?? 'Sunday')

    return {
      bsYear: parsedYear,
      bsMonth: parsedMonth,
      bsDay: parsedDay,
      adDate,
      weekday: weekday >= 0 ? weekday : 0,
      events: event && event !== '--' ? [event.replace(/\.\.\.$/, '')] : undefined,
      isHoliday,
      currentMonth:
        parsedYear === year && parsedMonth === month && !isDisabled,
    }
  })

  const currentMonthDays = days.filter((day) => day.currentMonth)
  const daysInMonth = currentMonthDays.length
  const firstCurrentDay = days.find((day) => day.currentMonth)
  const weekdayOffset = firstCurrentDay
    ? days.indexOf(firstCurrentDay)
    : 0

  return {
    daysInMonth,
    weekdayOffset,
    days: days.map(({ currentMonth: _currentMonth, ...day }) => day),
  }
}

async function fetchMonth(year, month) {
  const cachePath = join(CACHE_DIR, `${year}-${month}.json`)
  try {
    const cached = await readFile(cachePath, 'utf8')
    return JSON.parse(cached)
  } catch {
    // cache miss
  }

  const url = `https://english.hamropatro.com/calendar/${year}/${month}`

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'bs-day-picker-scraper/1.0 (+https://github.com/binodnepali)',
      },
    })

    if (response.status === 429) {
      const backoff = DELAY_MS * Math.pow(2, attempt + 1)
      await sleep(backoff)
      continue
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`)
    }

    const html = await response.text()
    const parsed = parseMonthHtml(html, year, month)
    await mkdir(CACHE_DIR, { recursive: true })
    await writeFile(cachePath, JSON.stringify(parsed, null, 2))
    await sleep(DELAY_MS)
    return parsed
  }

  throw new Error(`Rate limited after ${MAX_RETRIES} retries: ${url}`)
}

async function runPool(tasks, workerCount) {
  const results = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const current = index
      index += 1
      results[current] = await tasks[current]()
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}

function validateData(data) {
  const errors = []

  for (const [year, months] of Object.entries(data)) {
    for (const [month, monthData] of Object.entries(months)) {
      const currentDays = monthData.days.filter(
        (day) => day.bsYear === Number(year) && day.bsMonth === Number(month),
      )

      if (currentDays.length !== monthData.daysInMonth) {
        errors.push(
          `${year}/${month}: daysInMonth mismatch (${monthData.daysInMonth} vs ${currentDays.length})`,
        )
      }

      for (let dayIndex = 1; dayIndex < currentDays.length; dayIndex++) {
        const prev = new Date(currentDays[dayIndex - 1].adDate)
        const next = new Date(currentDays[dayIndex].adDate)
        if (next <= prev) {
          errors.push(
            `${year}/${month}: non-monotonic AD dates at day ${dayIndex + 1}`,
          )
        }
      }
    }
  }

  return errors
}

async function main() {
  const { minYear, maxYear } = parseArgs()
  const tasks = []

  for (let year = minYear; year <= maxYear; year++) {
    for (let month = 1; month <= 12; month++) {
      tasks.push({ year, month })
    }
  }

  console.log(
    `Scraping Hamro Patro calendar data for ${minYear}-${maxYear} (${tasks.length} months)...`,
  )

  const results = await runPool(
    tasks.map(
      ({ year, month }) =>
        async () => {
          try {
            const monthData = await fetchMonth(year, month)
            process.stdout.write(`✓ ${year}/${month} (${MONTH_NAMES[month - 1]})\n`)
            return { year, month, monthData }
          } catch (error) {
            process.stdout.write(`✗ ${year}/${month}: ${error.message}\n`)
            return { year, month, error }
          }
        },
    ),
    CONCURRENCY,
  )

  const failures = results.filter((result) => result.error)
  if (failures.length > 0) {
    console.warn(`\nWarning: ${failures.length} month(s) failed to scrape.`)
    console.warn('Run again later to fill cache, or use pnpm data:legacy for fallback.')
  }

  const data = {}
  for (const { year, month, monthData, error } of results) {
    if (error) continue
    const yearKey = String(year)
    const monthKey = String(month)
    data[yearKey] ??= {}
    data[yearKey][monthKey] = monthData
  }

  const errors = validateData(data)
  if (errors.length > 0) {
    console.warn('Validation warnings:')
    for (const error of errors.slice(0, 20)) {
      console.warn(`  - ${error}`)
    }
  }

  const isFullRange = minYear === MIN_YEAR && maxYear === MAX_YEAR

  if (isFullRange) {
    await mkdir(dirname(OUTPUT_PATH), { recursive: true })
    await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2))
    console.log(`\nWrote ${OUTPUT_PATH}`)
    console.log(`Years: ${Object.keys(data).length}`)
  } else {
    console.log(
      `\nCache updated for ${minYear}-${maxYear}. Run \`pnpm data:build\` to merge into bs-calendar.json.`,
    )
  }

  if (failures.length > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
