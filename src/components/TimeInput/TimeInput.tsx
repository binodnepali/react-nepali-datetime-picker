import { useEffect, useState } from 'react'

import TimeIcon from '@/assets/Time.svg'
import { Language } from '@/types/Language'
import { validateTime } from '@/utils/nepaliTime'

import { IconProps, Input, InputProps } from '../ui/Input/Input'

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

interface TimeInputProps {
  className?: string
  lang?: Language
  input?: InputProps
  icon?: IconProps
}
export const TimeInput = ({
  className = '',
  lang = 'ne',
  input = {},
  icon = {},
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
      const { valid } = validateTime(value, lang)

      console.log(valid, value)

      if (valid) {
        setVal(() => value)
      }
    }
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
