import { dayjs } from '@/plugins/dayjs'
import { Language } from '@/types/Language'

import { addLeadingNepaliZero, addLeadingZero } from '@/utils/digit'
import { timeDays } from '@/constants/timeDays'

export type NepaliTime = {
  value: {
    hour: number
    minute: number
    day: string
  }
  label: {
    hour: string
    minute: string
    day: string
  }
}

export const useNepaliTime = (lang: Language) => {
  const date = dayjs().tz('Asia/Kathmandu')

  const hour = date.hour()
  const minute = date.minute()
  const day = date.format('A')
  const dayLabel =
    timeDays.find((timeDay) => timeDay.value === day)?.label[lang] ?? ''

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
      day: dayLabel,
    },
  } as NepaliTime
}
