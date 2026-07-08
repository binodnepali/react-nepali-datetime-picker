#!/usr/bin/env node

/**
 * Builds bs-calendar.json from legacy monthsData grid structure.
 * Canonical BS→AD mapping chains day-by-day; Hamro Patro cache overlays take precedence.
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const MONTHS_PATH = join(ROOT, 'scripts/legacy/months.ts')
const OUTPUT_PATH = join(ROOT, 'packages/core/src/data/bs-calendar.json')
const CACHE_DIR = join(ROOT, '.cache/hamropatro')

const MIN_YEAR = 2000
const MAX_YEAR = 2089
const ANCHOR = { bsYear: 2000, bsMonth: 1, bsDay: 1, adDate: '1943-04-14' }

function parseMonthsData(source) {
  const start = source.indexOf('export const monthsData')
  if (start < 0) throw new Error('monthsData not found in months.ts')
  const eq = source.indexOf('=', start)
  const arrayStart = source.indexOf('[', eq)
  let depth = 0
  let end = arrayStart
  for (; end < source.length; end++) {
    if (source[end] === '[') depth++
    if (source[end] === ']') {
      depth--
      if (depth === 0) {
        end++
        break
      }
    }
  }
  const arraySource = source
    .slice(arrayStart, end)
    .replace(/\/\/[^\n]*/g, '')
  return eval(arraySource)
}

function bsKey(year, month, day) {
  return `${year}-${month}-${day}`
}

function addDays(adDate, days) {
  const date = new Date(`${adDate}T12:00:00`)
  date.setDate(date.getDate() + days)
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function weekdayFromAd(adDate) {
  return new Date(`${adDate}T12:00:00`).getDay()
}

function getDaysInMonthTuple(tuple) {
  if (typeof tuple === 'number') return tuple
  return tuple[1]
}

function buildGridCells(year, monthIndex, monthTuple, monthsData, yearIndex) {
  const prevMonthIndex = monthIndex - 1 < 0 ? 11 : monthIndex - 1
  const prevYear = monthIndex - 1 < 0 ? year - 1 : year
  const prevYearIndex = monthIndex - 1 < 0 ? yearIndex - 1 : yearIndex
  const nextMonthIndex = monthIndex + 1 > 11 ? 0 : monthIndex + 1
  const nextYear = monthIndex + 1 > 11 ? year + 1 : year
  const nextYearIndex = monthIndex + 1 > 11 ? yearIndex + 1 : yearIndex

  if (typeof monthTuple === 'number') {
    return Array.from({ length: monthTuple }, (_, index) => ({
      bsYear: year,
      bsMonth: monthIndex + 1,
      bsDay: index + 1,
      currentMonth: true,
    }))
  }

  const [beginOffset, daysInMonth, endOffset] = monthTuple
  const cells = []

  if (beginOffset > 0) {
    const prevMonths = monthsData[prevYearIndex]?.[0]
    const prevDays = getDaysInMonthTuple(prevMonths?.[prevMonthIndex] ?? 30)
    for (
      let day = prevDays - beginOffset + 1;
      day <= prevDays;
      day++
    ) {
      cells.push({
        bsYear: prevYear,
        bsMonth: prevMonthIndex + 1,
        bsDay: day,
        currentMonth: false,
      })
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      bsYear: year,
      bsMonth: monthIndex + 1,
      bsDay: day,
      currentMonth: true,
    })
  }

  for (let day = 1; day <= endOffset; day++) {
    cells.push({
      bsYear: nextYear,
      bsMonth: nextMonthIndex + 1,
      bsDay: day,
      currentMonth: false,
    })
  }

  return cells
}

async function loadHamropatroMonths() {
  const files = await readdir(CACHE_DIR).catch(() => [])
  const monthMap = new Map()

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const [year, month] = file.replace('.json', '').split('-')
    const raw = await readFile(join(CACHE_DIR, file), 'utf8')
    monthMap.set(`${year}-${month}`, JSON.parse(raw))
  }

  return monthMap
}

function buildCanonicalMap(monthsData, hamropatroDays) {
  const canonical = new Map()
  let cursor = ANCHOR.adDate
  let year = MIN_YEAR

  for (const [months] of monthsData) {
    if (year > MAX_YEAR) break

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const month = monthIndex + 1
      const daysInMonth = getDaysInMonthTuple(months[monthIndex])

      for (let day = 1; day <= daysInMonth; day++) {
        const key = bsKey(year, month, day)
        const scraped = hamropatroDays.get(key)

        canonical.set(key, {
          bsYear: year,
          bsMonth: month,
          bsDay: day,
          adDate: scraped?.adDate ?? cursor,
          weekday: scraped?.weekday ?? weekdayFromAd(scraped?.adDate ?? cursor),
          events: scraped?.events,
          isHoliday: scraped?.isHoliday,
        })

        const adDate = scraped?.adDate ?? cursor
        cursor = addDays(adDate, 1)
      }
    }

    year++
  }

  return canonical
}

async function main() {
  const source = await readFile(MONTHS_PATH, 'utf8')
  const monthsData = parseMonthsData(source)
  const hamropatroMonths = await loadHamropatroMonths()

  const hamropatroDays = new Map()
  for (const monthData of hamropatroMonths.values()) {
    for (const day of monthData.days) {
      hamropatroDays.set(bsKey(day.bsYear, day.bsMonth, day.bsDay), day)
    }
  }

  const canonical = buildCanonicalMap(monthsData, hamropatroDays)
  const data = {}
  let year = MIN_YEAR
  let yearIndex = 0

  for (const [months] of monthsData) {
    if (year > MAX_YEAR) break

    const yearKey = String(year)
    data[yearKey] = {}

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const month = monthIndex + 1
      const cacheKey = `${year}-${month}`
      const scrapedMonth = hamropatroMonths.get(cacheKey)

      if (scrapedMonth) {
        data[yearKey][String(month)] = scrapedMonth
        continue
      }

      const cells = buildGridCells(
        year,
        monthIndex,
        months[monthIndex],
        monthsData,
        yearIndex,
      )

      const days = (() => {
        const firstKnownIndex = cells.findIndex((cell) =>
          canonical.has(bsKey(cell.bsYear, cell.bsMonth, cell.bsDay)),
        )

        if (firstKnownIndex < 0) {
          throw new Error(`No anchor day found for ${year}/${month}`)
        }

        const resolved = new Array(cells.length)
        const firstCell = cells[firstKnownIndex]
        const firstEntry = canonical.get(
          bsKey(firstCell.bsYear, firstCell.bsMonth, firstCell.bsDay),
        )

        resolved[firstKnownIndex] = {
          ...firstEntry,
          weekday: weekdayFromAd(firstEntry.adDate),
        }

        for (let index = firstKnownIndex - 1; index >= 0; index--) {
          const cell = cells[index]
          const nextAd = resolved[index + 1].adDate
          const adDate = addDays(nextAd, -1)
          resolved[index] = {
            bsYear: cell.bsYear,
            bsMonth: cell.bsMonth,
            bsDay: cell.bsDay,
            adDate,
            weekday: weekdayFromAd(adDate),
          }
        }

        for (let index = firstKnownIndex + 1; index < cells.length; index++) {
          const cell = cells[index]
          const prevAd = resolved[index - 1].adDate
          const adDate = addDays(prevAd, 1)
          const scraped = canonical.get(
            bsKey(cell.bsYear, cell.bsMonth, cell.bsDay),
          )
          resolved[index] = {
            bsYear: cell.bsYear,
            bsMonth: cell.bsMonth,
            bsDay: cell.bsDay,
            adDate,
            weekday: weekdayFromAd(adDate),
            events: scraped?.events,
            isHoliday: scraped?.isHoliday,
          }
        }

        return resolved.map((entry) => ({
          bsYear: entry.bsYear,
          bsMonth: entry.bsMonth,
          bsDay: entry.bsDay,
          adDate: entry.adDate,
          weekday: entry.weekday,
          events: entry.events,
          isHoliday: entry.isHoliday,
        }))
      })()

      const currentDays = days.filter(
        (day) => day.bsYear === year && day.bsMonth === month,
      )

      data[yearKey][String(month)] = {
        daysInMonth: currentDays.length,
        weekdayOffset: days.findIndex(
          (day) => day.bsYear === year && day.bsMonth === month,
        ),
        days,
      }
    }

    year++
    yearIndex++
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2))

  console.log(`Generated calendar data at ${OUTPUT_PATH}`)
  console.log(`Years: ${Object.keys(data).length}`)
  console.log(`Hamro Patro day overlays: ${hamropatroDays.size}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
