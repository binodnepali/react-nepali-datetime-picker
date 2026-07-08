#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUTPUT_PATH = join(ROOT, 'packages/core/src/data/bs-calendar.json')
const CACHE_DIR = join(ROOT, '.cache/hamropatro')

async function loadBaseData() {
  try {
    const raw = await readFile(OUTPUT_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function loadHamropatroCache() {
  const files = await readdir(CACHE_DIR).catch(() => [])
  const data = {}

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const [year, month] = file.replace('.json', '').split('-')
    const raw = await readFile(join(CACHE_DIR, file), 'utf8')
    data[year] ??= {}
    data[year][month] = JSON.parse(raw)
  }

  return data
}

async function main() {
  const base = await loadBaseData()
  const scraped = await loadHamropatroCache()
  const merged = structuredClone(base)

  let overlayCount = 0

  for (const [year, months] of Object.entries(scraped)) {
    merged[year] ??= {}
    for (const [month, monthData] of Object.entries(months)) {
      merged[year][month] = monthData
      overlayCount++
    }
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(merged, null, 2))

  console.log(`Merged calendar data → ${OUTPUT_PATH}`)
  console.log(`Years: ${Object.keys(merged).length}`)
  console.log(`Hamro Patro overlays: ${overlayCount}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
