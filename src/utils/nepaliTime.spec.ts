import { describe, expect, it, vi } from 'vitest'

import * as dayjs from '@/plugins/dayjs.ts'

import {
  getCurrentNepaliTime,
  NEPALI_COLON_CHARACTER,
  validateTime,
} from './nepaliTime'

describe('nepaliTime', () => {
  describe('getCurrentNepaliTime', () => {
    it('should return time in 12 hour format', () => {
      const spy = vi.spyOn(dayjs, 'dayjs').mockImplementation(() => {
        return {
          tz: vi.fn(() => {
            return {
              format: vi.fn(() => {
                return '01:30 PM'
              }),
            }
          }),
        } as unknown as dayjs.Dayjs
      })

      const { label, value } = getCurrentNepaliTime('ne')

      expect(label).toMatchObject({
        hour: '०१',
        minute: '३०',
        day: 'बेलुका',
      })
      expect(value).toMatchObject({
        hour: 1,
        minute: 30,
        day: 'PM',
      })

      const { label: enLabel, value: enValue } = getCurrentNepaliTime('en')
      expect(enLabel).toMatchObject({
        hour: '01',
        minute: '30',
        day: 'PM',
      })
      expect(enValue).toMatchObject({
        hour: 1,
        minute: 30,
        day: 'PM',
      })

      spy.mockRestore()
    })

    it('should return time in 24 hour format', () => {
      const spy = vi.spyOn(dayjs, 'dayjs').mockImplementation(() => {
        return {
          tz: vi.fn(() => {
            return {
              format: vi.fn(() => {
                return '13:30 PM'
              }),
            }
          }),
        } as unknown as dayjs.Dayjs
      })

      const { label, value } = getCurrentNepaliTime('ne', 24)
      expect(label).toMatchObject({
        hour: '१३',
        minute: '३०',
        day: 'बेलुका',
      })
      expect(value).toMatchObject({
        hour: 13,
        minute: 30,
        day: 'PM',
      })

      const { label: enLabel, value: enValue } = getCurrentNepaliTime('en', 24)
      expect(enLabel).toMatchObject({
        hour: '13',
        minute: '30',
        day: 'PM',
      })
      expect(enValue).toMatchObject({
        hour: 13,
        minute: 30,
        day: 'PM',
      })

      spy.mockRestore()
    })
  })

  describe('validateTime', () => {
    describe('when time is in 12 hour format', () => {
      it('should return valid true, label and value should be defined when lang is ne', () => {
        const { valid, label, value } = validateTime(
          `१२${NEPALI_COLON_CHARACTER}३० विहानी`,
          'ne',
          12,
        )

        expect(valid).toBe(true)
        expect(label).toBeDefined()
        expect(label?.day).toBeDefined()
        expect(value).toBeDefined()
        expect(value?.day).toBeDefined()
      })

      it('should return valid true, label and value should be defined when lang is en', () => {
        const { valid, label, value } = validateTime(`12:30 AM`, 'en', 12)

        expect(valid).toBe(true)
        expect(label).toBeDefined()
        expect(label?.day).toBeDefined()
        expect(value).toBeDefined()
        expect(value?.day).toBeDefined()
      })
    })

    describe('when time is in 24 hour format', () => {
      it('should return valid true, label and value should be defined when lang is ne', () => {
        const { valid, label, value } = validateTime(
          `१२${NEPALI_COLON_CHARACTER}३०`,
          'ne',
          24,
        )

        expect(valid).toBe(true)
        expect(label).toBeDefined()
        expect(label?.day).toBeUndefined()
        expect(value).toBeDefined()
        expect(value?.day).toBeUndefined()
      })

      it('should return valid true, label and value should be defined when lang is en', () => {
        const { valid, label, value } = validateTime(`12:30`, 'en', 24)

        expect(valid).toBe(true)
        expect(label).toBeDefined()
        expect(label?.day).toBeUndefined()
        expect(value).toBeDefined()
        expect(value?.day).toBeUndefined()
      })
    })
  })
})
