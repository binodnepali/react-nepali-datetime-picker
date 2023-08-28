import { forwardRef, useEffect, useState } from 'react'

import CalendarMonth from '@/assets/CalendarMonth.svg'
import { Hint, HintProps } from '@/components/ui/Hint/Hint'
import { Input, InputProps } from '@/components/ui/Input/Input'
import { cn } from '@/plugins/twMerge'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'
import { formatNepaliDate, validateDate } from '@/utils/nepaliDate'

export interface DateInputProps {
  className?: string
  lang?: Language
  value?: NepaliDate
  input?: InputProps
  hint?: HintProps
  fullWidth?: boolean
}

export const DateInput = forwardRef<HTMLDivElement, DateInputProps>(
  function DateInput(
    {
      className = '',
      hint = {},
      input = {},
      lang = 'ne',
      fullWidth = false,
      value,
    }: DateInputProps,
    ref,
  ): JSX.Element {
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

      const { valid, value: val } = validateDate(value, lang)

      setIsValid(() => valid)

      setVal(() => value)

      e.target.value = JSON.stringify({
        isValid: valid,
        ...(valid
          ? {
              value: val,
            }
          : {}),
      })

      onInputChange?.(e)
    }

    useEffect(() => {
      if (!value) {
        setVal(() => '')

        return
      }

      setVal(() => formatNepaliDate(value, lang))
      setIsValid(() => true)
    }, [lang, value])

    return (
      <div className={cn('ne-dt-flex ne-dt-flex-col', className)} ref={ref}>
        <Input
          className={cn(inputClassName, fullWidth && 'ne-dt-w-full')}
          nativeInput={{
            onChange: handleOnChange,
            value: val,
            className: cn(nativeInputClassName, fullWidth && 'ne-dt-w-full'),
            ...nativeInputRest,
          }}
          icon={{
            ...inputIcon,
          }}
          {...inputRest}
        >
          <CalendarMonth
            width="36"
            height="36"
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

export type DateInputTargetValue = {
  valid: boolean
  value: NepaliDate | undefined
}
