import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button/Button'
import { useNepaliTime } from '@/hooks/useNepaliTime'
import { cn } from '@/plugins/twMerge'
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

export interface DesktopTimeProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  contentClassName?: string
  hourFormat?: HourFormat
  lang?: Language
  onTimeSelect?: (time: NepaliTime) => void
  selectedTime?: NepaliTime
}

export const DesktopTime = ({
  className = '',
  contentClassName = '',
  hourFormat = 12,
  lang = 'ne',
  selectedTime,
  onTimeSelect,
  ...rest
}: DesktopTimeProps) => {
  const {
    currentTime: { hour, minute, day },
    selectedHour,
    setSelectedHour,
    selectedMinute,
    setSelectedMinute,
    selectedDay,
    setSelectedDay,
    timeDays,
  } = useNepaliTime({
    lang,
    hourFormat,
  })

  const is12HourFormat = hourFormat === 12

  const handleOnHourClick = (time: Time) => {
    setSelectedHour(() => time)
    if (!selectedMinute) {
      return
    }

    onTimeSelect?.({
      hour: {
        value: time.value,
        label: time.label,
      },
      minute: {
        value: selectedMinute.value,
        label: selectedMinute.label,
      },
      ...(is12HourFormat && selectedDay?.value && selectedDay?.label
        ? {
            day: {
              value: selectedDay.value,
              label: selectedDay.label,
            },
          }
        : {}),
    })
  }

  const handleOnMinuteClick = (time: Time) => {
    setSelectedMinute(() => time)
    if (!selectedHour) {
      return
    }

    onTimeSelect?.({
      hour: {
        value: selectedHour.value,
        label: selectedHour.label,
      },
      minute: {
        value: time.value,
        label: time.label,
      },
      ...(is12HourFormat && selectedDay?.value && selectedDay?.label
        ? {
            day: {
              value: selectedDay.value,
              label: selectedDay.label,
            },
          }
        : {}),
    })
  }

  const handleOnDayClick = (day: { value: string; label: string }) => {
    setSelectedDay(() => day)
    if (!selectedHour || !selectedMinute) {
      return
    }

    onTimeSelect?.({
      hour: {
        value: selectedHour.value,
        label: selectedHour.label,
      },
      minute: {
        value: selectedMinute.value,
        label: selectedMinute.label,
      },
      ...(is12HourFormat && day.value && day.label ? { day } : {}),
    })
  }

  useEffect(() => {
    setSelectedHour(() => selectedTime?.hour)
    setSelectedMinute(() => selectedTime?.minute)
    setSelectedDay(() => selectedTime?.day)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime])

  return (
    <div
      className={cn('ne-dt-flex ne-dt-flex-col ne-dt-w-fit', className)}
      {...rest}
    >
      <div
        className={cn(
          'ne-dt-grid ne-dt-gap-2 ne-dt-h-60 ne-dt-overflow-hidden',
          is12HourFormat && 'ne-dt-grid-cols-[64px_64px_64px]',
          !is12HourFormat && 'ne-dt-grid-cols-[64px_64px]',
          contentClassName,
        )}
      >
        <HourList
          format={hourFormat}
          hour={hour.value}
          selectedHour={selectedHour?.value}
          lang={lang}
          onTimeSelect={handleOnHourClick}
        />

        <MinuteList
          minute={minute.value}
          selectedMinute={selectedMinute?.value}
          lang={lang}
          onTimeSelect={handleOnMinuteClick}
        />

        {is12HourFormat && (
          <div className="ne-dt-flex ne-dt-flex-col ne-dt-gap-2 ne-dt-justify-start">
            {timeDays.map((d) => (
              <Button
                variant="outline"
                active={d.value === day?.value}
                selected={d.value === selectedDay?.value}
                key={d.value}
                onClick={() =>
                  handleOnDayClick({
                    value: d.value,
                    label: d.label,
                  })
                }
              >
                {d.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HourList({
  format,
  hour,
  lang,
  selectedHour: initialSelectedHour,
  onTimeSelect,
}: {
  format: HourFormat
  hour: number
  selectedHour?: number
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

  const [selectedHour, setSelectedHour] = useState<number | undefined>(
    initialSelectedHour,
  )
  const handleOnHourClick = (time: Time) => {
    setSelectedHour(() => time.value)
    onTimeSelect?.(time)
  }

  const hours = useMemo(
    () =>
      format === 12
        ? sortValuesByCurrentValue(selectedHour ?? hour, generate12Hours(lang))
        : sortValuesByCurrentValue(selectedHour ?? hour, generate24Hours(lang)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [format, lang, selectedHour],
  )

  useEffect(() => {
    setSelectedHour(() => initialSelectedHour)
  }, [initialSelectedHour])

  return (
    <div
      className="ne-dt-overflow-y-auto ne-dt-will-change-scroll"
      ref={hourRef}
    >
      <div
        className="ne-dt-flex ne-dt-flex-col ne-dt-gap-1"
        id={HOUR_CONTENT}
        key={HOUR_CONTENT}
      >
        {hours.map((h) => (
          <Button
            id={`h-${h.value === hour}`}
            key={`h-${h.value}`}
            variant="outline"
            active={h.value === hour}
            selected={h.value === selectedHour}
            onClick={() => handleOnHourClick(h)}
          >
            {h.label}
          </Button>
        ))}
      </div>

      <div
        className="ne-dt-flex ne-dt-flex-col ne-dt-gap-1 ne-dt-mt-1"
        id={HOUR_CLONED_CONTENT}
        key={HOUR_CLONED_CONTENT}
      >
        {hours.map((h) => (
          <Button
            id={`h-cloned-${h.value}`}
            key={`h-cloned-${h.value}`}
            variant="outline"
            active={h.value === hour}
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
  selectedMinute: initialSelectedMinute,
  onTimeSelect,
}: {
  minute: number
  lang: Language
  selectedMinute?: number
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

  const [selectedMinute, setSelectedMinute] = useState<number | undefined>(
    initialSelectedMinute,
  )

  const handleOnMinuteClick = (time: Time) => {
    setSelectedMinute(() => time.value)
    onTimeSelect?.(time)
  }

  const minutes = useMemo(
    () =>
      sortValuesByCurrentValue(selectedMinute ?? minute, generateMinutes(lang)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, selectedMinute],
  )

  useEffect(() => {
    setSelectedMinute(() => initialSelectedMinute)
  }, [initialSelectedMinute])

  return (
    <div
      className="ne-dt-overflow-y-auto ne-dt-will-change-scroll"
      ref={minuteRef}
    >
      <div
        className="ne-dt-flex ne-dt-flex-col ne-dt-gap-1"
        id={MINUTE_CONTENT}
        key={MINUTE_CONTENT}
      >
        {minutes.map((m) => (
          <Button
            id={`m-${m.value}`}
            key={`m-${m.value}`}
            variant="outline"
            active={m.value === minute}
            selected={m.value === selectedMinute}
            onClick={() => handleOnMinuteClick(m)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div
        className="ne-dt-flex ne-dt-flex-col ne-dt-gap-1 ne-dt-mt-1"
        id={MINUTE_CLONED_CONTENT}
        key={MINUTE_CLONED_CONTENT}
      >
        {minutes.map((m) => (
          <Button
            id={`m-cloned-${m.value}`}
            key={`m-cloned-${m.value}`}
            variant="outline"
            active={m.value === minute}
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
