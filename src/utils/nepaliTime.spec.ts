import { describe, expect, it } from 'vitest'

import { NEPALI_COLON_CHARACTER, validateTime } from './nepaliTime'

describe('nepaliTime', () => {
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
