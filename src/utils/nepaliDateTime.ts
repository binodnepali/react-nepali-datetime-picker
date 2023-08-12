import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliDateTime } from '@/types/NepaliDateTime'

import { formatNepaliDate } from './nepaliDate'
import { formatTime } from './nepaliTime'

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
