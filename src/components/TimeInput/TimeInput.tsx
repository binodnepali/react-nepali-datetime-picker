import { useEffect, useState } from 'react'

import TimeIcon from '@/assets/Time.svg'
import { IconProps, Input, NativeInputProps } from '@/components/ui/Input/Input'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { validateTime } from '@/utils/nepaliTime'

export type TimeInputTargetValue = {
  valid: boolean
  label?: {
    hour: string
    minute: string
    day: string
  }
  value?: {
    hour: number
    minute: number
    day: string
  }
}

export interface TimeInputProps {
  className?: string
  icon?: IconProps
  input?: NativeInputProps
  lang?: Language
  hourFormat?: HourFormat
}
export const TimeInput = ({
  className = '',
  lang = 'ne',
  input = {},
  icon = {},
  hourFormat = 12,
}: TimeInputProps) => {
  const { value, onChange, ...inputRest } = input

  const [val, setVal] = useState<string>(value || '')
  const [error, setError] = useState<string>('')

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (value === '') {
      setVal(() => value)
      setError(() => '')
      onChange?.(e)
      return
    }

    setVal(() => value)

    const { valid, label, value: validatedValue } = validateTime(value, lang)

    if (!valid) {
      setError(() => 'Invalid time')
    } else {
      setError(() => '')
    }

    e.target.value = JSON.stringify({
      valid,
      ...({ label } ?? {}),
      ...({ value: validatedValue } ?? {}),
    })

    onChange?.(e)
  }

  useEffect(() => {
    if (value) {
      const { valid } = validateTime(value, lang, hourFormat)

      if (valid) {
        setVal(() => value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, value])

  const placeholder = lang === 'en' ? 'hh:mm' : 'घण्टा:मिनेट'

  return (
    <div className={`flex flex-col ${className}`}>
      <Input
        input={{
          placeholder,
          value: val,
          onChange: handleOnInputChange,
          ...inputRest,
        }}
        icon={icon}
      >
        <TimeIcon width={'36'} height={'36'} />
      </Input>
      <div className="text-red-500">{error}</div>
    </div>
  )
}
