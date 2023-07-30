import { useEffect, useState } from 'react'

import DateIcon from '@/assets/Date.svg'
import { Hint, HintProps } from '@/components/ui/Hint/Hint'
import { Input, InputProps } from '@/components/ui/Input/Input'
import { useNepaliCalendar } from '@/hooks/useNepaliCalendar'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'
import { formatNepaliDate } from '@/utils/nepaliDate'

export interface DateInputProps {
  className?: string
  lang?: Language
  value?: NepaliDate
  input?: InputProps
  hint?: HintProps
}

export const DateInput = ({
  className = '',
  hint = {},
  input = {},
  lang = 'ne',
  value,
}: DateInputProps): JSX.Element => {
  const {
    nativeInput: { onChange: onInputChange, ...nativeInputRest } = {},
    icon: inputIcon = {},
    ...inputRest
  } = input

  const { validateDate } = useNepaliCalendar({
    lang,
  })

  const [val, setVal] = useState<string>('')

  const [isValid, setIsValid] = useState<boolean>(true)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    const { valid, value: val } = validateDate(value)

    setIsValid(() => valid)

    setVal(() => value)

    e.target.value = JSON.stringify({
      isValid: valid,
      value: val,
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
    <div className={`ne-dt-relative ne-dt-w-fit ${className}`}>
      <Input
        nativeInput={{
          onChange: handleOnChange,
          value: val,
          ...nativeInputRest,
        }}
        icon={{
          children: (
            <DateIcon
              width="36"
              height="36"
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

export type DateInputTargetValue = {
  isValid: boolean
  value: NepaliDate | undefined
}
