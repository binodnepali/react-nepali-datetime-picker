import { describe, expect, it } from 'vitest'

import { formatBsDatePattern, BS_DATE_DISPLAY_PATTERN } from './pattern'
import {
  BS_DATETIME_DISPLAY_PATTERN,
  formatBsDateTimePattern,
  formatBsTimePattern,
} from './time/pattern'

describe('formatBsDatePattern', () => {
  const date = { year: 2083, month: 3, day: 26 }

  it('formats weekday long date', () => {
    const label = formatBsDatePattern(date, BS_DATE_DISPLAY_PATTERN, 'en')
    expect(label).toMatch(/^Friday, 26 Ashad 2083$/)
  })

  it('supports quoted literals', () => {
    expect(formatBsDatePattern(date, "'Selected:' d MMM", 'en')).toBe(
      'Selected: 26 Ash',
    )
  })
})

describe('formatBsTimePattern', () => {
  it('formats 12-hour time with period', () => {
    expect(formatBsTimePattern({ hour: 22, minute: 51 }, 'h:mm a', 'en')).toBe(
      '10:51 PM',
    )
  })

  it('formats nepali period label', () => {
    expect(formatBsTimePattern({ hour: 10, minute: 5 }, 'h:mm a', 'ne')).toBe(
      '१०:०५ एम',
    )
  })
})

describe('formatBsDateTimePattern', () => {
  it('formats combined datetime label', () => {
    const value = { year: 2083, month: 3, day: 26, hour: 22, minute: 51 }
    expect(
      formatBsDateTimePattern(value, BS_DATETIME_DISPLAY_PATTERN, 'en'),
    ).toBe('Friday, 26 Ashad 2083, 10:51 PM')
  })
})
