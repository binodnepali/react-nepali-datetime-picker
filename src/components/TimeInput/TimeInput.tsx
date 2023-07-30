import { useEffect, useState } from 'react'

import TimeIcon from '@/assets/Time.svg'
import { Hint, HintProps } from '@/components/ui/Hint/Hint'
import { Input, InputProps } from '@/components/ui/Input/Input'
import { clsx } from '@/plugins/clsx'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { validateTime } from '@/utils/nepaliTime'

export type TimeInputTargetValue = {
  valid: boolean
  label?: {
    hour: string
    minute: string
    day?: string
  }
  value?: {
    hour: number
    minute: number
    day?: string
  }
}

export interface TimeInputProps {
  className?: string
  input?: InputProps
  lang?: Language
  fullWidth?: boolean
  hourFormat?: HourFormat
  hint?: HintProps
}
export const TimeInput = ({
  className = '',
  lang = 'ne',
  input = {},
  fullWidth = false,
  hourFormat = 12,
  hint = {},
}: TimeInputProps) => {
  const {
    nativeInput: {
      value,
      onChange,
      className: nativeInputClassName = '',
      ...nativeInputRest
    } = {},
    icon: inputIcon = {},
    className: inputClassName = '',
    ...inputRest
  } = input

  const [val, setVal] = useState<string>(value || '')
  const [isValid, setIsValid] = useState<boolean>(true)

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (value === '') {
      setVal(() => value)
      setIsValid(() => true)
      onChange?.(e)
      return
    }

    setVal(() => value)

    const {
      valid,
      label,
      value: validatedValue,
    } = validateTime(value, lang, hourFormat)

    if (!valid) {
      setIsValid(() => false)
    } else {
      setIsValid(() => true)
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

  return (
    <div className={`ne-dt-flex ne-dt-flex-col ${className}`}>
      <Input
        className={clsx(inputClassName, fullWidth && 'ne-dt-w-full')}
        nativeInput={{
          value: val,
          onChange: handleOnInputChange,
          className: clsx(nativeInputClassName, fullWidth && 'ne-dt-w-full'),
          ...nativeInputRest,
        }}
        icon={{
          children: (
            <TimeIcon
              width={'36'}
              height={'36'}
              className="ne-dt-rounded-full hover:ne-dt-bg-gray-100 focus:ne-dt-outline-none focus:ne-dt-bg-gray-100 ne-dt-p-1"
            />
          ),
          ...inputIcon,
        }}
        {...inputRest}
      />
      {(hint.error || hint.success) && (
        <div className="ne-dt-absolute ne-dt-bottom-0 ne-dt-left-0 ne-dt-translate-y-full">
          <Hint
            error={isValid ? undefined : hint.error}
            success={isValid && val.length > 0 ? hint.success : undefined}
          />
        </div>
      )}
    </div>
  )
}
