import { forwardRef, useEffect, useState } from 'react'

import ClockOutlineIcon from '@/assets/ClockOutline.svg'
import { Hint, HintProps } from '@/components/ui/Hint/Hint'
import { Input, InputProps } from '@/components/ui/Input/Input'
import { cn } from '@/plugins/twMerge'
import { NepaliTime } from '@/types'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { formatTime, validateTime } from '@/utils/nepaliTime'

export type TimeInputTargetValue = {
  valid: boolean
  value?: NepaliTime
}

export interface TimeInputProps {
  className?: string
  selectedTime?: NepaliTime
  input?: InputProps
  lang?: Language
  fullWidth?: boolean
  hourFormat?: HourFormat
  hint?: HintProps
}
export const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>(
  function TimeInput(
    {
      className = '',
      lang = 'ne',
      input = {},
      fullWidth = false,
      hourFormat = 12,
      selectedTime,
      hint = {},
    },
    ref,
  ) {
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

      const { valid, value: validatedValue } = validateTime(
        value,
        lang,
        hourFormat,
      )

      setIsValid(() => valid)

      setVal(() => value)

      e.target.value = JSON.stringify({
        valid,
        ...(valid ? { value: validatedValue } : {}),
      })

      onChange?.(e)
    }

    useEffect(() => {
      if (!selectedTime) {
        setVal(() => '')

        return
      }
      const formattedTime = formatTime(selectedTime, lang, hourFormat)

      const { valid } = validateTime(formattedTime, lang, hourFormat)

      setVal(() => formattedTime)

      setIsValid(() => valid)
    }, [hourFormat, lang, selectedTime, value])

    return (
      <div className={cn('ne-dt-flex ne-dt-flex-col', className)} ref={ref}>
        <Input
          className={cn(inputClassName, fullWidth && 'ne-dt-w-full')}
          nativeInput={{
            value: val,
            onChange: handleOnInputChange,
            className: cn(nativeInputClassName, fullWidth && 'ne-dt-w-full'),
            ...nativeInputRest,
          }}
          icon={{
            ...inputIcon,
          }}
          {...inputRest}
        >
          <ClockOutlineIcon
            width={'36'}
            height={'36'}
            className="ne-dt-rounded-full ne-dt-p-1 ne-dt-bg-base-100 hover:ne-dt-bg-base-200 ne-dt-fill-base-content"
          />
        </Input>
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
  },
)
