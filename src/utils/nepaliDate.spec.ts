import { describe, expect, test, vi } from 'vitest'

import { getCurrentNepaliDate } from './nepaliDate'

describe('nepaliDate', () => {
  describe('getCurrentNepaliDate', () => {
    test('should return nepali date from current gregorian date', () => {
      const mockDate = new Date('2023-07-18')
      const spy = vi
        .spyOn(global, 'Date')
        .mockImplementation(() => mockDate as unknown as string)

      const date = getCurrentNepaliDate()

      const currentNepaliDate = {
        year: {
          value: 2080,
          label: '२०८०',
        },
        month: {
          value: 3,
          label: 'असार',
        },
        date: {
          value: 2,
          label: '२',
        },
      }

      expect(date).toMatchObject(currentNepaliDate)

      spy.mockRestore()
    })
  })
})
