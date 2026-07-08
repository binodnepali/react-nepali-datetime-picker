import { describe, expect, it } from 'vitest'

import { buildMonthGrid } from './calendar-grid'
import { getMonthData } from './navigation'
import { bsDatesEqual } from './types'

describe('calendar grid', () => {
  it('builds 2083 Baishakh with expected days in month', () => {
    const monthData = getMonthData(2083, 1)
    expect(monthData).not.toBeNull()
    expect(monthData?.daysInMonth).toBe(31)
  })

  it('includes outside days when showOutsideDays is true', () => {
    const weeks = buildMonthGrid({
      month: { year: 2083, month: 1 },
      locale: 'en',
      showOutsideDays: true,
    })

    const flat = weeks.flat()
    expect(flat.length).toBeGreaterThan(31)
    expect(flat.some((cell) => !cell.currentMonth)).toBe(true)
  })

  it('keeps padding cells when showOutsideDays is false', () => {
    const weeks = buildMonthGrid({
      month: { year: 2083, month: 1 },
      locale: 'en',
      showOutsideDays: false,
    })

    const flat = weeks.flat()
    expect(flat.some((cell) => !cell.currentMonth)).toBe(true)
    expect(flat.filter((cell) => cell.currentMonth)).toHaveLength(31)
    expect(weeks.every((week) => week.length === 7)).toBe(true)
  })

  it('aligns first day of month under the correct weekday column', () => {
    const weeks = buildMonthGrid({
      month: { year: 2083, month: 1 },
      locale: 'en',
      showOutsideDays: false,
    })

    const flat = weeks.flat()
    const firstDay = flat.find(
      (cell) => cell.currentMonth && cell.date.day === 1,
    )

    expect(firstDay).toBeDefined()
    expect(flat.indexOf(firstDay!) % 7).toBe(firstDay!.weekday)
  })

  it('aligns months that omit leading outside days in source data', () => {
    const weeks = buildMonthGrid({
      month: { year: 2000, month: 1 },
      locale: 'en',
      showOutsideDays: false,
    })

    const flat = weeks.flat()
    const firstDay = flat.find(
      (cell) => cell.currentMonth && cell.date.day === 1,
    )

    expect(firstDay).toBeDefined()
    expect(firstDay!.weekday).toBe(4)
    expect(flat.indexOf(firstDay!) % 7).toBe(4)
    expect(flat.some((cell) => cell.isPlaceholder)).toBe(true)
  })

  it('marks selected date in grid', () => {
    const selected = { year: 2083, month: 1, day: 1 }
    const weeks = buildMonthGrid({
      month: { year: 2083, month: 1 },
      locale: 'en',
      selected,
    })

    const selectedCells = weeks.flat().filter((cell) => cell.isSelected)
    expect(selectedCells).toHaveLength(1)
    expect(bsDatesEqual(selectedCells[0]?.date, selected)).toBe(true)
  })
})

describe('edge years 2080-2083', () => {
  for (const year of [2080, 2081, 2082, 2083]) {
    it(`has 12 months for ${year}`, () => {
      for (let month = 1; month <= 12; month++) {
        const monthData = getMonthData(year, month)
        expect(monthData, `${year}/${month}`).not.toBeNull()
        expect(monthData?.daysInMonth).toBeGreaterThan(0)
      }
    })
  }
})
