import { describe, test, expect, vi } from 'vitest';

import { getCurrentNepaliDate } from './nepaliDate';

describe('nepaliDate', () => {
  describe('getCurrentNepaliDate', () => {
    test('should return nepali date from current gregorian date', () => {
      const mockDate = new Date('2023-07-18');
      const spy = vi
        .spyOn(global, 'Date')
        .mockImplementation(() => mockDate as unknown as string);

      const date = getCurrentNepaliDate();

      const currentNepaliDate = {
        year: 2080,
        month: 3,
        date: 2,
      };

      expect(date).toMatchObject(currentNepaliDate);

      spy.mockRestore();
    });
  });
});
