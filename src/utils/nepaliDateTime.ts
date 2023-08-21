import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'
import { NepaliDateTime } from '@/types/NepaliDateTime'
import { NepaliTime } from '@/types/NepaliTime'

import { formatNepaliDate, validateDate } from './nepaliDate'
import { formatTime, validateTime } from './nepaliTime'

export const validateNepaliDateTime = (
  value: string,
  lang: Language = 'ne',
  hourFormat: HourFormat = 12,
) => {
  const [date, time, timeDay] = value.split(' ')

  const fullTime = timeDay ? `${time} ${timeDay}` : time

  const validatedDate: {
    valid: boolean
    value?: NepaliDate
  } = {
    valid: false,
  }

  if (date !== undefined) {
    const { valid, value } = validateDate(date, lang)

    validatedDate.valid = valid
    validatedDate.value = value
  }

  const validatedTime: {
    valid: boolean
    value?: NepaliTime
  } = {
    valid: false,
  }

  if (fullTime !== undefined) {
    const { valid, value } = validateTime(fullTime, lang, hourFormat)

    validatedTime.valid = valid
    validatedTime.value = value
  }

  const valid = validatedDate.valid && validatedTime.valid

  return {
    valid,
    ...(valid
      ? {
          value: {
            date: validatedDate.value,
            time: validatedTime.value,
          },
        }
      : {}),
  }
}

export const formatNepaliDateTime = (
  nepaliDateTime: NepaliDateTime,
  lang: Language = 'ne',
  hourFormat: HourFormat = 12,
) => {
  if (!nepaliDateTime.date || !nepaliDateTime.time) {
    return ''
  }

  const formattedNepaliDate = formatNepaliDate(nepaliDateTime.date, lang)

  const formattedNepaliTime = formatTime(nepaliDateTime.time, lang, hourFormat)

  return `${formattedNepaliDate} ${formattedNepaliTime}`
}
