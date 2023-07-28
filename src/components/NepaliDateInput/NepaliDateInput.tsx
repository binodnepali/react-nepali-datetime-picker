import { useEffect, useState } from 'react'

import DateIcon from '@/assets/Date.svg'
import { useNepaliCalendar } from '@/hooks/useNepaliCalendar'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'
import { formatNepaliDate } from '@/utils/nepaliDate'

export interface NepaliDateInputProps {
  className?: string
  lang?: Language
  value?: NepaliDate
  input?: InputProps
  icon?: IconProps
  error?: ErrorProps
}

export type InputProps = React.HTMLAttributes<HTMLInputElement> & {
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export type IconProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export type ErrorProps = {
  className?: string
  message?: string
}

export const NepaliDateInput = ({
  className = '',
  error = {},
  icon = {},
  input = {},
  lang = 'ne',
  value,
}: NepaliDateInputProps): JSX.Element => {
  const {
    className: inputClassName = '',
    onChange: onInputChange,
    ...inputRest
  } = input

  const {
    className: iconClassName = '',
    children: iconChildren,
    onClick: handleOnIconClick,
    ...iconRest
  } = icon

  const {
    className: errorClassName = '',
    message: errorMessage = 'Invalid date',
  } = error

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
    <div className={`relative w-fit ${className}`}>
      <input
        className={`border border-gray-300 rounded-md px-2 py-2 ${inputClassName}`}
        type="text"
        autoComplete="off"
        onChange={handleOnChange}
        value={val}
        {...inputRest}
      />

      <div
        className={`absolute inset-y-0 right-0 mr-1 flex items-center cursor-pointer ${iconClassName}`}
        {...(iconChildren && {
          onClick: handleOnIconClick,
        })}
        {...iconRest}
      >
        {iconChildren ?? (
          <DateIcon
            width="36"
            height="36"
            className="rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 p-1"
            onClick={handleOnIconClick}
          />
        )}
      </div>

      {!isValid && (
        <div className="absolute bottom-0 left-0 translate-y-full">
          <p className={`text-xs text-red-500 ${errorClassName}`}>
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}

export type TargetValue = {
  isValid: boolean
  value: NepaliDate | undefined
}
