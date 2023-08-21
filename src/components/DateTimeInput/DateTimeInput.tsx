import { forwardRef, useEffect, useState } from 'react'

import CalendarClock from '@/assets/CalendarClock.svg'
import { Hint, HintProps } from '@/components/ui/Hint/Hint'
import { Input, InputProps } from '@/components/ui/Input/Input'
import { cn } from '@/plugins/twMerge'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'
import { NepaliDateTime } from '@/types/NepaliDateTime'
import { NepaliTime } from '@/types/NepaliTime'
import {
  formatNepaliDateTime,
  validateNepaliDateTime,
} from '@/utils/nepaliDateTime'

export interface DateTimeInputProps {
  className?: string
  lang?: Language
  hourFormat?: HourFormat
  value?: NepaliDateTime
  input?: InputProps
  hint?: HintProps
  fullWidth?: boolean
}

export const DateTimeInput = forwardRef<HTMLDivElement, DateTimeInputProps>(
  function DateInput(
    {
      className = '',
      hint = {},
      input = {},
      lang = 'ne',
      fullWidth = false,
      value,
      hourFormat = 12,
    },
    ref,
  ) {
    const {
      nativeInput: {
        onChange: onInputChange,
        className: nativeInputClassName = '',
        ...nativeInputRest
      } = {},
      icon: inputIcon = {},
      className: inputClassName = '',
      ...inputRest
    } = input

    const [val, setVal] = useState<string>('')

    const [isValid, setIsValid] = useState<boolean>(true)

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target

      const validatedDateTime = validateNepaliDateTime(value, lang, hourFormat)

      setIsValid(() => validatedDateTime.valid)

      setVal(() => value)

      e.target.value = JSON.stringify(validatedDateTime)

      onInputChange?.(e)
    }

    useEffect(() => {
      if (!value) {
        setVal(() => '')

        return
      }

      setVal(() => formatNepaliDateTime(value, lang))

      setIsValid(() => true)
    }, [lang, value])

    return (
      <div className={cn('ne-dt-flex ne-dt-flex-col', className)} ref={ref}>
        <Input
          className={cn(inputClassName, fullWidth && 'ne-dt-w-full')}
          nativeInput={{
            onChange: handleOnChange,
            value: val,
            className: cn(fullWidth && 'ne-dt-w-full', nativeInputClassName),
            ...nativeInputRest,
          }}
          icon={{
            children: (
              <CalendarClock
                width="36"
                height="36"
                className="ne-dt-rounded-md hover:ne-dt-bg-gray-100 focus:ne-dt-outline-none focus:ne-dt-bg-gray-100 ne-dt-p-1"
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
  },
)

export type DateTimeInputTargetValue = {
  valid: boolean
  value?: {
    date: NepaliDate
    time: NepaliTime
  }
}
