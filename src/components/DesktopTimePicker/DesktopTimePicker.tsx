import { useState } from 'react'

import {
  TimeInput,
  TimeInputProps,
  TimeInputTargetValue,
} from '@/components/TimeInput/TimeInput'
import { Modal, ModalProps } from '@/components/ui/Modal/Modal'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliTime } from '@/types/NepaliTime'
import { formatTime } from '@/utils/nepaliTime'

import { DesktopTime, DesktopTimeProps } from './DesktopTime/DesktopTime'

interface DesktopTimePickerProps {
  className?: string
  desktopTime?: DesktopTimeProps
  hourFormat?: HourFormat
  lang?: Language
  modal?: ModalProps
  onTimeSelect?: (time: NepaliTime) => void
  timeInput?: TimeInputProps
}

export const DesktopTimePicker = ({
  className = '',
  onTimeSelect,
  modal = {},
  timeInput = {},
  desktopTime = {},
  lang = 'ne',
  hourFormat = 12,
}: DesktopTimePickerProps) => {
  const {
    input: { nativeInput = {}, icon: inputIcon = {}, ...inputRest } = {},
    ...timeInputRest
  } = timeInput

  const [showModal, setShowModal] = useState<boolean>(false)

  const [valid, setValid] = useState<boolean>(true)
  const [time, setTime] = useState<NepaliTime>()

  const handleOnTimeSelect = (time: NepaliTime) => {
    setTime(() => time)
    onTimeSelect?.(time)
  }

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const data =
      value !== '' ? (JSON.parse(value) as TimeInputTargetValue) : undefined

    if (data) {
      const { valid, value: val, label } = data

      if (!valid || !val || !label) {
        setValid(() => valid)
        setTime(() => undefined)

        return
      }

      setValid(() => valid)
      const time = {
        value: {
          hour: val.hour,
          minute: val.minute,
          ...(val.day ? { day: val.day } : {}),
        },
        label: {
          hour: label.hour,
          minute: label.minute,
          ...(label.day ? { day: label.day } : {}),
        },
      }
      setTime(() => time)

      onTimeSelect?.(time)
    } else {
      setValid(() => true)
    }
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      <TimeInput
        input={{
          nativeInput: {
            value: time?.value
              ? formatTime(
                  time.value.hour,
                  time.value.minute,
                  time.value.day,
                  lang,
                  hourFormat,
                )
              : '',
            onChange: handleOnInputChange,
            ...nativeInput,
          },
          icon: {
            onClick: () => {
              if (!valid) {
                return
              }
              setShowModal(true)
            },
            ...inputIcon,
          },
          ...inputRest,
        }}
        lang={lang}
        hourFormat={hourFormat}
        {...timeInputRest}
      />

      {showModal && valid && (
        <Modal
          onClose={() => setShowModal(false)}
          className="md:mt-11 md:bg-transparent"
          variant="desktop"
          {...modal}
        >
          <DesktopTime
            onTimeSelect={handleOnTimeSelect}
            selectedTime={time}
            lang={lang}
            hourFormat={hourFormat}
            {...desktopTime}
          />
        </Modal>
      )}
    </div>
  )
}
