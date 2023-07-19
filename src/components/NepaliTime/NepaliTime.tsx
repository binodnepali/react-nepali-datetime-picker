import { timeDays } from '@/constants/timeDays'
import { useNepaliTime } from '@/hooks/useNepaliTime'
import { Language } from '@/types/Language'
import { TimeFormat } from '@/types/TimeFormat'
import { addLeadingZero } from '@/utils/digit'
import { useEffect, useRef } from 'react'

const MINUTE_CONTENT = 'MINUTE_CONTENT'
const MINUTE_CLONED_CONTENT = 'MINUTE_CLONED_CONTENT'
const HOUR_CONTENT = 'HOUR_CONTENT'
const HOUR_CLONED_CONTENT = 'HOUR_CLONED_CONTENT'

interface NepaliTimeProps {
  className?: string
  lang?: Language
  onTimeSelect?: (selectedTime?: string) => void
  format?: TimeFormat
}

export const NepaliTime = ({
  className = '',
  format = 12,
  lang = 'ne',
}: NepaliTimeProps) => {
  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)

  const { value, label } = useNepaliTime()

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
    const hourCurrentRef = hourRef.current
    const minuteCurrentRef = minuteRef.current

    hourCurrentRef?.addEventListener('scroll', handleOnHourScroll)
    minuteCurrentRef?.addEventListener('scroll', handleOnMinuteScroll)

    return () => {
      hourCurrentRef?.removeEventListener('scroll', handleOnHourScroll)
      minuteCurrentRef?.removeEventListener('scroll', handleOnMinuteScroll)
    }
  }, [])

  const hours = format === 12 ? generate12Hours() : generate24Hours()
  const minutes = generateMinutes()

  console.log('hours', value, label)

  return (
    <div
      className={`bg-neutral-50 grid grid-cols-[64px_64px_64px] rounded-md gap-2
       w-fit h-44 overflow-hidden p-1 ${className}`}
    >
      <div className="overflow-y-auto" ref={hourRef}>
        <ul className="flex flex-col gap-1" id={HOUR_CONTENT}>
          {hours.map((hour) => (
            <li
              key={hour.value}
              className={`text-center border border-gray-900 ${
                hour.value === value.hour ? 'bg-black text-white' : ''
              }`}
            >
              {hour.label}
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-1 mt-1" id={HOUR_CLONED_CONTENT}>
          {hours.map((hour) => (
            <li
              key={hour.value}
              className={`text-center border border-gray-900
              ${hour.value === value.hour ? 'bg-black text-white' : ''}
              `}
            >
              {hour.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-y-auto relative" ref={minuteRef}>
        <ul className="flex flex-col gap-1" id={MINUTE_CONTENT}>
          {minutes.map((minute) => (
            <li
              key={minute.value}
              className={`text-center border border-gray-900 ${
                minute.value === value.minute ? 'bg-black text-white' : ''
              }`}
            >
              {minute.label}
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-1 mt-1" id={MINUTE_CLONED_CONTENT}>
          {minutes.map((minute) => (
            <li
              key={minute.value}
              className={`text-center border border-gray-900 ${
                minute.value === value.minute ? 'bg-black text-white' : ''
              }`}
            >
              {minute.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 justify-start">
        {timeDays.map((day) => (
          <div className="text-center border border-gray-900" key={day.value}>
            {day.label[lang]}
          </div>
        ))}
      </div>
    </div>
  )
}

function generate12Hours() {
  const hours = []

  for (let i = 1; i <= 12; i++) {
    hours.push({
      value: i,
      label: addLeadingZero(i),
    })
  }

  return hours
}

function generate24Hours() {
  const hours = []

  for (let i = 0; i <= 23; i++) {
    hours.push({
      value: i,
      label: addLeadingZero(i),
    })
  }

  return hours
}

function generateMinutes() {
  const minutes = []

  for (let i = 0; i <= 59; i++) {
    minutes.push({
      value: i,
      label: addLeadingZero(i),
    })
  }

  return minutes
}
