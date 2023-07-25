import { timeDays } from '@/constants/timeDays'
import { useNepaliTime } from '@/hooks/useNepaliTime'
import { Language } from '@/types/Language'
import { TimeFormat } from '@/types/TimeFormat'
import { addLeadingNepaliZero, addLeadingZero } from '@/utils/digit'
import { useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/Button/Button'

const MINUTE_CONTENT = 'MINUTE_CONTENT'
const MINUTE_CLONED_CONTENT = 'MINUTE_CLONED_CONTENT'
const HOUR_CONTENT = 'HOUR_CONTENT'
const HOUR_CLONED_CONTENT = 'HOUR_CLONED_CONTENT'

interface DesktopTimeProps {
  className?: string
  lang?: Language
  onTimeSelect?: (selectedTime?: string) => void
  format?: TimeFormat
}

export const DesktopTime = ({
  className = '',
  format = 12,
  lang = 'ne',
}: DesktopTimeProps) => {
  const { value } = useNepaliTime(lang)

  const is12HourFormat = format === 12

  return (
    <div
      className={`bg-neutral-50 grid ${
        is12HourFormat ? 'grid-cols-[64px_64px_64px]' : 'grid-cols-[64px_64px]'
      } rounded gap-2
       w-fit h-60 overflow-hidden py-1 px-2 shadow-md  ${className}`}
    >
      <HourList format={format} hour={value.hour} lang={lang} />

      <MinuteList minute={value.minute} lang={lang} />

      {is12HourFormat && (
        <div className="flex flex-col gap-2 justify-start">
          {timeDays.map((day) => (
            <Button
              variant="outline"
              selected={day.value === value.day}
              key={day.value}
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
}: {
  format: TimeFormat
  hour: number

  lang: Language
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

  const hours = useMemo(
    () =>
      format === 12
        ? sortValuesByCurrentValue(hour, generate12Hours(lang))
        : sortValuesByCurrentValue(hour, generate24Hours(lang)),
    [format, hour, lang],
  )

  return (
    <div className="overflow-y-auto" ref={hourRef}>
      <div className="flex flex-col gap-1" id={HOUR_CONTENT} key={HOUR_CONTENT}>
        {hours.map((h) => (
          <Button
            id={`h-${h.value}`}
            key={`h-${h.value}`}
            variant="outline"
            selected={h.value === hour}
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
            selected={h.value === hour}
          >
            {h.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function MinuteList({ minute, lang }: { minute: number; lang: Language }) {
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

  const minutes = useMemo(
    () => sortValuesByCurrentValue(minute, generateMinutes(lang)),
    [lang, minute],
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
            selected={m.value === minute}
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
            selected={m.value === minute}
          >
            {m.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function generate12Hours(lang: Language) {
  const hours = []

  for (let i = 0; i <= 11; i++) {
    hours.push({
      value: i,
      label: lang == 'ne' ? addLeadingNepaliZero(i) : addLeadingZero(i),
    })
  }

  return hours
}

function generate24Hours(lang: Language) {
  const hours = []

  for (let i = 0; i <= 23; i++) {
    hours.push({
      value: i,
      label: lang == 'ne' ? addLeadingNepaliZero(i) : addLeadingZero(i),
    })
  }

  return hours
}

function generateMinutes(lang: Language) {
  const minutes = []

  for (let i = 0; i <= 59; i++) {
    minutes.push({
      value: i,
      label: lang === 'ne' ? addLeadingNepaliZero(i) : addLeadingZero(i),
    })
  }

  return minutes
}

function sortValuesByCurrentValue(
  currentValue: number,
  values: { value: number; label: string }[],
) {
  const foundIndex = values.findIndex((item) => item.value === currentValue)

  if (foundIndex !== -1) {
    return values.slice(foundIndex).concat(values.slice(0, foundIndex))
  }

  return values
}
