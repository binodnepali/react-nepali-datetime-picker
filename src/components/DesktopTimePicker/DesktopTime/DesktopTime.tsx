import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button/Button'
import { timeDays } from '@/constants/timeDays'
import { useNepaliTime } from '@/hooks/useNepaliTime'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliTime, Time } from '@/types/NepaliTime'
import {
  generate12Hours,
  generate24Hours,
  generateMinutes,
  sortValuesByCurrentValue,
} from '@/utils/nepaliTime'

const MINUTE_CONTENT = 'MINUTE_CONTENT'
const MINUTE_CLONED_CONTENT = 'MINUTE_CLONED_CONTENT'
const HOUR_CONTENT = 'HOUR_CONTENT'
const HOUR_CLONED_CONTENT = 'HOUR_CLONED_CONTENT'

export interface DesktopTimeProps {
  className?: string
  hourFormat?: HourFormat
  lang?: Language
  onTimeSelect?: (time: NepaliTime) => void
  selectedTime?: NepaliTime
}

export const DesktopTime = ({
  className = '',
  hourFormat = 12,
  lang = 'ne',
  selectedTime,
  onTimeSelect,
}: DesktopTimeProps) => {
  const {
    time: { value },
    selectedHour,
    setSelectedHour,
    selectedMinute,
    setSelectedMinute,
    selectedDay,
    setSelectedDay,
  } = useNepaliTime({
    lang,
    selectedTime,
    hourFormat,
  })

  const is12HourFormat = hourFormat === 12

  const handleOnHourClick = (time: Time) => {
    setSelectedHour(() => time)
    onTimeSelect?.({
      value: {
        hour: time.value,
        minute: selectedMinute.value,
        day: selectedDay.value,
      },
      label: {
        hour: time.label,
        minute: selectedMinute.label,
        day: selectedDay.label,
      },
    })
  }

  const handleOnMinuteClick = (time: Time) => {
    setSelectedMinute(() => time)
    onTimeSelect?.({
      value: {
        hour: selectedHour.value,
        minute: time.value,
        day: selectedDay.value,
      },
      label: {
        hour: selectedHour.label,
        minute: time.label,
        day: selectedDay.label,
      },
    })
  }

  const handleOnDayClick = (day: { value: string; label: string }) => {
    setSelectedDay(() => day)
    onTimeSelect?.({
      value: {
        hour: selectedHour.value,
        minute: selectedMinute.value,
        day: day.value,
      },
      label: {
        hour: selectedHour.label,
        minute: selectedMinute.label,
        day: day.label,
      },
    })
  }

  return (
    <div
      className={`bg-neutral-50 grid ${
        is12HourFormat ? 'grid-cols-[64px_64px_64px]' : 'grid-cols-[64px_64px]'
      } rounded gap-2
       w-fit h-60 overflow-hidden py-1 px-2 shadow-md  ${className}`}
    >
      <HourList
        format={hourFormat}
        hour={value.hour}
        lang={lang}
        onTimeSelect={handleOnHourClick}
      />

      <MinuteList
        minute={value.minute}
        lang={lang}
        onTimeSelect={handleOnMinuteClick}
      />

      {is12HourFormat && (
        <div className="flex flex-col gap-2 justify-start">
          {timeDays.map((day) => (
            <Button
              variant="outline"
              selected={day.value === selectedDay.value}
              key={day.value}
              onClick={() =>
                handleOnDayClick({
                  value: day.value,
                  label: day.label[lang],
                })
              }
            >
              {day.label[lang]}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

function HourList({
  format,
  hour,
  lang,
  onTimeSelect,
}: {
  format: HourFormat
  hour: number
  lang: Language
  onTimeSelect?: (time: Time) => void
}) {
  const hourRef = useRef<HTMLDivElement>(null)

  const handleOnHourScroll = () => {
    const hourCurrentRef = hourRef.current
    const content = document.getElementById(HOUR_CONTENT)
    const clonedContent = document.getElementById(HOUR_CLONED_CONTENT)

    if (!hourCurrentRef || !content || !clonedContent) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = hourCurrentRef

    if (scrollTop + clientHeight >= scrollHeight) {
      // User has reached the end, reset the scroll position to show the original content
      hourCurrentRef.scrollTop -= content.offsetHeight
    }

    if (scrollTop === 0) {
      // User has reached the top, reset the scroll position to show the cloned content
      hourCurrentRef.scrollTop += clonedContent.offsetHeight
    }
  }
  useEffect(() => {
    const hourCurrentRef = hourRef.current
    hourCurrentRef?.addEventListener('scroll', handleOnHourScroll)

    return () => {
      hourCurrentRef?.removeEventListener('scroll', handleOnHourScroll)
    }
  }, [])

  const [selectedHour, setSelectedHour] = useState<number>(hour)
  const handleOnHourClick = (time: Time) => {
    setSelectedHour(() => time.value)
    onTimeSelect?.(time)
  }

  const hours = useMemo(
    () =>
      format === 12
        ? sortValuesByCurrentValue(hour, generate12Hours(lang))
        : sortValuesByCurrentValue(hour, generate24Hours(lang)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [format, lang],
  )

  return (
    <div className="overflow-y-auto" ref={hourRef}>
      <div className="flex flex-col gap-1" id={HOUR_CONTENT} key={HOUR_CONTENT}>
        {hours.map((h) => (
          <Button
            id={`h-${h.value}`}
            key={`h-${h.value}`}
            variant="outline"
            selected={h.value === selectedHour}
            onClick={() => handleOnHourClick(h)}
          >
            {h.label}
          </Button>
        ))}
      </div>

      <div
        className="flex flex-col gap-1 mt-1"
        id={HOUR_CLONED_CONTENT}
        key={HOUR_CLONED_CONTENT}
      >
        {hours.map((h) => (
          <Button
            id={`h-cloned-${h.value}`}
            key={`h-cloned-${h.value}`}
            variant="outline"
            selected={h.value === selectedHour}
            onClick={() => handleOnHourClick(h)}
          >
            {h.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function MinuteList({
  minute,
  lang,
  onTimeSelect,
}: {
  minute: number
  lang: Language
  onTimeSelect?: (time: Time) => void
}) {
  const minuteRef = useRef<HTMLDivElement>(null)

  const handleOnMinuteScroll = () => {
    const minuteCurrentRef = minuteRef.current
    const content = document.getElementById(MINUTE_CONTENT)
    const clonedContent = document.getElementById(MINUTE_CLONED_CONTENT)

    if (!minuteCurrentRef || !content || !clonedContent) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = minuteCurrentRef

    if (scrollTop + clientHeight >= scrollHeight) {
      // User has reached the end, reset the scroll position to show the original content
      minuteCurrentRef.scrollTop -= content.offsetHeight
    }

    if (scrollTop === 0) {
      // User has reached the top, reset the scroll position to show the cloned content
      minuteCurrentRef.scrollTop += clonedContent.offsetHeight
    }
  }
  useEffect(() => {
    const minuteCurrentRef = minuteRef.current

    minuteCurrentRef?.addEventListener('scroll', handleOnMinuteScroll)

    return () => {
      minuteCurrentRef?.removeEventListener('scroll', handleOnMinuteScroll)
    }
  }, [])

  const [selectedMinute, setSelectedMinute] = useState<number>(minute)

  const handleOnMinuteClick = (time: Time) => {
    setSelectedMinute(() => time.value)
    onTimeSelect?.(time)
  }

  const minutes = useMemo(
    () => sortValuesByCurrentValue(minute, generateMinutes(lang)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  )

  return (
    <div className="overflow-y-auto" ref={minuteRef}>
      <div
        className="flex flex-col gap-1"
        id={MINUTE_CONTENT}
        key={MINUTE_CONTENT}
      >
        {minutes.map((m) => (
          <Button
            id={`m-${m.value}`}
            key={`m-${m.value}`}
            variant="outline"
            selected={m.value === selectedMinute}
            onClick={() => handleOnMinuteClick(m)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div
        className="flex flex-col gap-1 mt-1"
        id={MINUTE_CLONED_CONTENT}
        key={MINUTE_CLONED_CONTENT}
      >
        {minutes.map((m) => (
          <Button
            id={`m-cloned-${m.value}`}
            key={`m-cloned-${m.value}`}
            variant="outline"
            selected={m.value === selectedMinute}
            onClick={() => handleOnMinuteClick(m)}
          >
            {m.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
