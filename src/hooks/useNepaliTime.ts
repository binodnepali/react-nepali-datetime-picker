import { useState } from 'react'

import { Language } from '@/types/Language'
import { Day, NepaliTime, Time } from '@/types/NepaliTime'
import { getCurrentNepaliTime } from '@/utils/nepaliTime'

interface NepaliTimeParams {
  selectedTime?: NepaliTime
  lang?: Language
}

export const useNepaliTime = (params?: NepaliTimeParams) => {
  const { selectedTime, lang = 'ne' } = params ?? {}

  const currentTime = getCurrentNepaliTime(lang)

  const [selectedHour, setSelectedHour] = useState<Time>({
    value: selectedTime?.value.hour ?? currentTime.value.hour,
    label: selectedTime?.label.hour ?? currentTime.label.hour,
  })
  const [selectedMinute, setSelectedMinute] = useState<Time>({
    value: selectedTime?.value.minute ?? currentTime.value.minute,
    label: selectedTime?.label.minute ?? currentTime.label.minute,
  })

  const [selectedDay, setSelectedDay] = useState<Day>({
    value: selectedTime?.value.day ?? currentTime.value.day,
    label: selectedTime?.label.day ?? currentTime.label.day,
  })

  return {
    time: selectedTime ?? currentTime,
    selectedHour,
    selectedMinute,
    setSelectedHour,
    setSelectedMinute,
    selectedDay,
    setSelectedDay,
    currentTime,
  }
}
