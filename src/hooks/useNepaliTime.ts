import { useState } from 'react'

import { timeDays } from '@/constants/timeDays'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { Day, Time } from '@/types/NepaliTime'
import { getCurrentNepaliTime } from '@/utils/nepaliTime'

interface NepaliTimeParams {
  lang?: Language
  hourFormat?: HourFormat
}

export const useNepaliTime = (params?: NepaliTimeParams) => {
  const { lang = 'ne', hourFormat = 12 } = params ?? {}

  const currentTime = getCurrentNepaliTime(lang, hourFormat)

  const [selectedHour, setSelectedHour] = useState<Time>()
  const [selectedMinute, setSelectedMinute] = useState<Time>()
  const [selectedDay, setSelectedDay] = useState<Day>()

  return {
    currentTime,
    selectedHour,
    setSelectedHour,
    selectedMinute,
    setSelectedMinute,
    selectedDay,
    setSelectedDay,
    timeDays:
      hourFormat === 12
        ? timeDays.map((timeDay) => ({
            label: timeDay.label[lang],
            value: timeDay.value,
          }))
        : [],
  }
}
