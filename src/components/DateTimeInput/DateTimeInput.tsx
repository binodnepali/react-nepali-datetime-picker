import { forwardRef, useEffect, useState } from 'react'

import CalendarClock from '@/assets/CalendarClock.svg'
import { Button } from '@/components/ui/Button/Button'
import { Hint } from '@/components/ui/Hint/Hint'
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
  error?: {
    message?: string
    show?: boolean
    rootClassName?: string
    className?: string
  }
  success?: {
    message?: string
    show?: boolean
    rootClassName?: string
    className?: string
  }
  fullWidth?: boolean
}

export const DateTimeInput = forwardRef<HTMLDivElement, DateTimeInputProps>(
  function DateTimeInput(
    {
      className = '',
      input = {},
      lang = 'ne',
      fullWidth = false,
      value,
      hourFormat = 12,
      error: {
        message: errorMessage = '',
        show: showError = false,
        rootClassName: errorRootClassName = '',
        className: errorClassName = '',
      } = {},
      success: {
        message: successMessage = '',
        show: showSuccess = false,
        rootClassName: successRootClassName = '',
        className: successClassName = '',
      } = {},
    },
    ref,
  ) {
    const {
      nativeInput: {
        onChange: onInputChange,
        className: nativeInputClassName = '',
        ...nativeInputRest
      } = {},
      icon: {
        children = (
          <Button variant="icon">
            <CalendarClock width="36" height="36" />
          </Button>
        ),
        ...inputIconRest
      } = {},
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
      <div
        className={cn('ne-dt-flex ne-dt-flex-col', className)}
        ref={ref}
        data-auto-id="dateTimeInput"
      >
        <Input
          className={cn(fullWidth && 'ne-dt-w-full', inputClassName)}
          nativeInput={{
            onChange: handleOnChange,
            value: val,
            className: cn(
              fullWidth && 'ne-dt-w-full',
              showError &&
                !isValid &&
                'ne-dt-border-error focus:ne-dt-outline-error',
              showSuccess &&
                isValid &&
                val.length > 0 &&
                'ne-dt-border-success focus:ne-dt-outline-success',
              nativeInputClassName,
            ),
            ...nativeInputRest,
          }}
          icon={{
            children,
            ...inputIconRest,
          }}
          {...inputRest}
        />

        {showError && errorMessage && !isValid && (
          <div
            className={cn(
              'ne-dt-absolute ne-dt-bottom-0 ne-dt-left-0 ne-dt-translate-y-full',
              errorRootClassName,
            )}
          >
            <Hint errorMessage={errorMessage} errorClassName={errorClassName} />
          </div>
        )}

        {showSuccess && successMessage && isValid && val.length > 0 && (
          <div
            className={cn(
              'ne-dt-absolute ne-dt-bottom-0 ne-dt-left-0 ne-dt-translate-y-full',
              successRootClassName,
            )}
          >
            <Hint
              successMessage={successMessage}
              successClassName={successClassName}
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
