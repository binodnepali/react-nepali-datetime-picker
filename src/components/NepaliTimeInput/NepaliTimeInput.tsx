import TimeIcon from '@/assets/Time.svg'
import { Input } from '../ui/Input/Input'
import { useState } from 'react'
import { Language } from '@/types/Language'

interface NepaliTimeInputProps {
  className?: string
  lang?: Language
}

export const NepaliTimeInput = ({
  className = '',
  lang = 'ne',
}: NepaliTimeInputProps) => {
  const [val, setVal] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (value === '') {
      setVal(() => value)
      setError(() => '')

      return
    }

    setVal(() => value)

    const { valid } = validateTime(value)

    if (!valid) {
      setError(() => 'Invalid time')
    } else {
      setError(() => '')
    }
  }

  const placeholder = lang === 'en' ? 'hh:mm' : 'घण्टा:मिनेट'

  return (
    <div className={`flex flex-col ${className}`}>
      <Input
        input={{
          placeholder,
          value: val,
          onChange: handleOnInputChange,
        }}
      >
        <TimeIcon width={'36'} height={'36'} />
      </Input>
      <div className="text-red-500">{error}</div>
    </div>
  )
}

function validateTime(time: string) {
  const time12Regex = /^(0[1-9]|1[0-2]):([0-5][0-9])$/

  const time24Regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

  if (time12Regex.test(time) || time24Regex.test(time)) {
    return {
      valid: true,
      value: {
        hour: parseInt(time.split(':')[0]),
        minute: parseInt(time.split(':')[1]),
      },
    }
  }

  return {
    valid: false,
  }
}
