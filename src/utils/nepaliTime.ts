import { timeDays } from '@/constants/timeDays'
import { dayjs } from '@/plugins/dayjs'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import {
  EnglishAMOrPM,
  NepaliAMOrPM,
  NepaliTime,
  Time,
} from '@/types/NepaliTime'
import {
  addLeadingNepaliZero,
  addLeadingZero,
  convertNepaliDigitToEnglishDigit,
} from '@/utils/digit'

export const getCurrentNepaliTime = (
  lang: Language = 'ne',
  hourFormat: HourFormat = 12,
): NepaliTime => {
  const date = dayjs().tz('Asia/Kathmandu')

  const formatDate =
    hourFormat === 12 ? date.format('hh:mm A') : date.format('HH:mm A')

  const hour = parseInt(formatDate.split(':')[0])
  const minute = parseInt(formatDate.split(':')[1])
  const day = formatDate.split(' ')[1]

  return {
    value: {
      hour,
      minute,
      day,
    },
    label: {
      hour: lang === 'ne' ? addLeadingNepaliZero(hour) : addLeadingZero(hour),
      minute:
        lang === 'ne' ? addLeadingNepaliZero(minute) : addLeadingZero(minute),
      day: timeDays.find((timeDay) => timeDay.value === day)?.label[
        lang
      ] as string,
    },
  }
}

const TIME_12_REGEX = /^(0[1-9]|1[0-2]):([0-5][0-9])$/
const TIME_24_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
export const NEPALI_COLON_CHARACTER = 'ः'
export const validateTime = (
  time: string,
  lang: Language = 'ne',
  hourFormat: HourFormat = 12,
) => {
  const is12HourFormat = hourFormat === 12

  const [hourAndMinute, dayPart] = time.split(' ').map((t) => t)

  if (!hourAndMinute || (!dayPart && is12HourFormat)) {
    return {
      valid: false,
    }
  }

  if (
    lang === 'en' &&
    (TIME_12_REGEX.test(hourAndMinute) || TIME_24_REGEX.test(hourAndMinute)) &&
    is12HourFormat &&
    (dayPart === EnglishAMOrPM.AM || dayPart === EnglishAMOrPM.PM)
  ) {
    const [hour, minute] = hourAndMinute.split(':').map((t) => t)

    const day = dayPart === EnglishAMOrPM.AM ? 'AM' : 'PM'
    return {
      valid: true,
      value: {
        hour: parseInt(hour),
        minute: parseInt(minute),
        day,
      },
      label: {
        hour,
        minute,
        day,
      },
    }
  }

  if (
    lang === 'en' &&
    (TIME_12_REGEX.test(hourAndMinute) || TIME_24_REGEX.test(hourAndMinute)) &&
    !is12HourFormat
  ) {
    if (dayPart?.length >= 0) {
      return {
        valid: false,
      }
    }

    const [hour, minute] = hourAndMinute.split(':').map((t) => t)

    return {
      valid: true,
      value: {
        hour: parseInt(hour),
        minute: parseInt(minute),
      },
      label: {
        hour,
        minute,
      },
    }
  }

  const [hour, minute] = hourAndMinute
    .split(NEPALI_COLON_CHARACTER)
    .map((t) => t)

  if (!hour || !minute) {
    return {
      valid: false,
    }
  }

  const hourPart = addLeadingZero(convertNepaliDigitToEnglishDigit(hour))
  const minutePart = addLeadingZero(convertNepaliDigitToEnglishDigit(minute))

  if (
    (TIME_12_REGEX.test(`${hourPart}:${minutePart}`) ||
      TIME_24_REGEX.test(`${hourPart}:${minutePart}`)) &&
    is12HourFormat &&
    (dayPart === NepaliAMOrPM.AM || dayPart === NepaliAMOrPM.PM)
  ) {
    return {
      valid: true,
      value: {
        hour: parseInt(hourPart),
        minute: parseInt(minutePart),
        day: dayPart === NepaliAMOrPM.AM ? 'AM' : 'PM',
      },
      label: {
        hour,
        minute,
        day: dayPart,
      },
    }
  }

  if (
    (TIME_12_REGEX.test(`${hourPart}:${minutePart}`) ||
      TIME_24_REGEX.test(`${hourPart}:${minutePart}`)) &&
    !is12HourFormat
  ) {
    return {
      valid: true,
      value: {
        hour: parseInt(hourPart),
        minute: parseInt(minutePart),
      },
      label: {
        hour,
        minute,
      },
    }
  }

  return {
    valid: false,
  }
}

export const generate12Hours = (lang: Language): Time[] => {
  const hours = []

  for (let i = 0; i <= 11; i++) {
    hours.push({
      value: i,
      label: lang == 'ne' ? addLeadingNepaliZero(i) : addLeadingZero(i),
    })
  }

  return hours
}

export const generate24Hours = (lang: Language): Time[] => {
  const hours = []

  for (let i = 0; i <= 23; i++) {
    hours.push({
      value: i,
      label: lang == 'ne' ? addLeadingNepaliZero(i) : addLeadingZero(i),
    })
  }

  return hours
}

export const generateMinutes = (lang: Language): Time[] => {
  const minutes = []

  for (let i = 0; i <= 59; i++) {
    minutes.push({
      value: i,
      label: lang === 'ne' ? addLeadingNepaliZero(i) : addLeadingZero(i),
    })
  }

  return minutes
}

export const sortValuesByCurrentValue = (
  currentValue: number,
  values: Time[],
) => {
  const foundIndex = values.findIndex((item) => item.value === currentValue)

  if (foundIndex !== -1) {
    return values.slice(foundIndex).concat(values.slice(0, foundIndex))
  }

  return values
}

export const formatTime = (
  hour: number,
  minute: number,
  day?: string,
  lang: Language = 'ne',
  hourFormat: HourFormat = 12,
) => {
  const hourString =
    lang === 'ne' ? addLeadingNepaliZero(hour) : addLeadingZero(hour)
  const minuteString =
    lang === 'ne' ? addLeadingNepaliZero(minute) : addLeadingZero(minute)
  const dayString =
    timeDays.find((timeDay) => timeDay.value === day)?.label[lang] ?? ''

  const separator = lang === 'ne' ? NEPALI_COLON_CHARACTER : ':'

  const format = `${hourString}${separator}${minuteString}${
    hourFormat === 12 ? ` ${dayString}` : ''
  }`

  return format
}
