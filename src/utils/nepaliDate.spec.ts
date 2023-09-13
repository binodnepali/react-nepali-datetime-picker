import { describe, expect, test, vi } from 'vitest'

import { getCurrentNepaliDate } from './nepaliDate'

describe('nepaliDate', () => {
  describe('getCurrentNepaliDate', () => {
    test('should return nepali date from current gregorian date', () => {
      const mockDate = new Date('2023-09-13')
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
          value: 4,
          label: '०५',
        },
        date: {
          value: 27,
          label: '२७',
        },
      }

      expect(date).toMatchObject(currentNepaliDate)

      spy.mockRestore()
    })
  })
})
