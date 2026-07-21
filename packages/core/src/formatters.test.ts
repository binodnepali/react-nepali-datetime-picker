import { describe, expect, it } from 'vitest'

import { formatBsDateWheelLabel } from './formatters'

describe('formatBsDateWheelLabel', () => {
  const date = { year: 2083, month: 3, day: 26 }

  it('includes weekday, day, and short month in English', () => {
    const label = formatBsDateWheelLabel(date, 'en')
    expect(label).toMatch(/^Fri 26 Ash$/)
  })

  it('includes Nepali digits for day without year', () => {
    const label = formatBsDateWheelLabel(date, 'ne')
    expect(label).toMatch(/^शुक्र २६ असा$/)
    expect(label).not.toMatch(/२०८३/)
  })
})
