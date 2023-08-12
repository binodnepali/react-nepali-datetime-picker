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

      const {
        hour: { label: hourLabel, value: hourValue },
        minute: { label: minuteLabel, value: minuteValue },
        day: { label: dayLabel, value: dayValue } = {},
      } = getCurrentNepaliTime('ne')

      expect({
        hour: hourLabel,
        minute: minuteLabel,
        day: dayLabel,
      }).toMatchObject({
        hour: '०१',
        minute: '३०',
        day: 'बेलुका',
      })

      expect({
        hour: hourValue,
        minute: minuteValue,
        day: dayValue,
      }).toMatchObject({
        hour: 1,
        minute: 30,
        day: 'PM',
      })

      const {
        hour: { label: enHourLabel, value: enHourValue },
        minute: { label: enMinuteLabel, value: enMinuteValue },
        day: { label: enDayLabel, value: enDayValue } = {},
      } = getCurrentNepaliTime('en')
      expect({
        hour: enHourLabel,
        minute: enMinuteLabel,
        day: enDayLabel,
      }).toMatchObject({
        hour: '01',
        minute: '30',
        day: 'PM',
      })
      expect({
        hour: enHourValue,
        minute: enMinuteValue,
        day: enDayValue,
      }).toMatchObject({
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

      const {
        hour: { label: hourLabel, value: hourValue },
        minute: { label: minuteLabel, value: minuteValue },
        day: { label: dayLabel, value: dayValue } = {},
      } = getCurrentNepaliTime('ne', 24)
      expect({
        hour: hourLabel,
        minute: minuteLabel,
        day: dayLabel,
      }).toMatchObject({
        hour: '१३',
        minute: '३०',
        day: 'बेलुका',
      })
      expect({
        hour: hourValue,
        minute: minuteValue,
        day: dayValue,
      }).toMatchObject({
        hour: 13,
        minute: 30,
        day: 'PM',
      })

      const {
        hour: { label: enLabel, value: enValue },
        minute: { label: enMinuteLabel, value: enMinuteValue },
        day: { label: enDayLabel, value: enDayValue } = {},
      } = getCurrentNepaliTime('en', 24)
      expect({
        hour: enLabel,
        minute: enMinuteLabel,
        day: enDayLabel,
      }).toMatchObject({
        hour: '13',
        minute: '30',
        day: 'PM',
      })
      expect({
        hour: enValue,
        minute: enMinuteValue,
        day: enDayValue,
      }).toMatchObject({
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
        const {
          valid,
          value: {
            hour: { label: hourLabel, value: hourValue } = {
              label: undefined,
              value: undefined,
            },
            minute: { label: minuteLabel, value: minuteValue } = {
              label: undefined,
              value: undefined,
            },
            day: { label: dayLabel, value: dayValue } = {
              label: undefined,
              value: undefined,
            },
          } = {},
        } = validateTime(`१२${NEPALI_COLON_CHARACTER}३० विहानी`, 'ne', 12)

        expect(valid).toBe(true)
        expect({
          hour: hourLabel,
          minute: minuteLabel,
          day: dayLabel,
        }).toMatchObject({
          hour: '१२',
          minute: '३०',
          day: 'विहानी',
        })

        expect({
          hour: hourValue,
          minute: minuteValue,
          day: dayValue,
        }).toMatchObject({
          hour: 12,
          minute: 30,
          day: 'AM',
        })
      })

      it('should return valid true, label and value should be defined when lang is en', () => {
        const {
          valid,
          value: {
            hour: { label: hourLabel, value: hourValue } = {
              label: undefined,
              value: undefined,
            },
            minute: { label: minuteLabel, value: minuteValue } = {
              label: undefined,
              value: undefined,
            },
            day: { label: dayLabel, value: dayValue } = {
              label: undefined,
              value: undefined,
            },
          } = {},
        } = validateTime(`12:30 AM`, 'en', 12)

        expect(valid).toBe(true)
        expect({
          hour: hourLabel,
          minute: minuteLabel,
          day: dayLabel,
        }).toMatchObject({
          hour: '12',
          minute: '30',
          day: 'AM',
        })
        expect({
          hour: hourValue,

          minute: minuteValue,
          day: dayValue,
        }).toMatchObject({
          hour: 12,
          minute: 30,
          day: 'AM',
        })
      })
    })

    describe('when time is in 24 hour format', () => {
      it('should return valid true, label and value should be defined when lang is ne', () => {
        const {
          valid,
          value: {
            hour: { label: hourLabel, value: hourValue } = {
              label: undefined,
              value: undefined,
            },
            minute: { label: minuteLabel, value: minuteValue } = {
              label: undefined,
              value: undefined,
            },
            day: { label: dayLabel, value: dayValue } = {
              label: undefined,
              value: undefined,
            },
          } = {},
        } = validateTime(`१२${NEPALI_COLON_CHARACTER}३०`, 'ne', 24)

        expect(valid).toBe(true)
        expect({
          hour: hourLabel,
          minute: minuteLabel,
          day: dayLabel,
        }).toMatchObject({
          hour: '१२',
          minute: '३०',
          day: undefined,
        })

        expect({
          hour: hourValue,
          minute: minuteValue,
          day: dayValue,
        }).toMatchObject({
          hour: 12,
          minute: 30,
          day: undefined,
        })
      })

      it('should return valid true, label and value should be defined when lang is en', () => {
        const {
          valid,
          value: {
            hour: { label: hourLabel, value: hourValue } = {
              label: undefined,
              value: undefined,
            },
            minute: { label: minuteLabel, value: minuteValue } = {
              label: undefined,
              value: undefined,
            },
            day: { label: dayLabel, value: dayValue } = {
              label: undefined,
              value: undefined,
            },
          } = {},
        } = validateTime(`12:30`, 'en', 24)

        expect(valid).toBe(true)
        expect({
          hour: hourLabel,
          minute: minuteLabel,
          day: dayLabel,
        }).toMatchObject({
          hour: '12',
          minute: '30',
          day: undefined,
        })

        expect({
          hour: hourValue,
          minute: minuteValue,
          day: dayValue,
        }).toMatchObject({
          hour: 12,
          minute: 30,
          day: undefined,
        })
      })
    })
  })
})
