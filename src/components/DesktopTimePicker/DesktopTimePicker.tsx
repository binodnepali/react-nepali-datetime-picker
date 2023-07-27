import { useState } from 'react'

import {
  TimeInput,
  TimeInputTargetValue,
} from '@/components/TimeInput/TimeInput'
import { Modal } from '@/components/ui/Modal/Modal'
import { NepaliTime } from '@/types/NepaliTime'
import { formatTime } from '@/utils/nepaliTime'

import { DesktopTime } from './DesktopTime/DesktopTime'

interface DesktopTimePickerProps {
  className?: string
}

export const DesktopTimePicker = ({
  className = '',
}: DesktopTimePickerProps) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  const [valid, setValid] = useState<boolean>(true)
  const [time, setTime] = useState<NepaliTime>()

  const handleOnTimeSelect = (time: NepaliTime) => {
    setTime(() => time)
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
      setTime(() => ({
        value: {
          hour: val.hour,
          minute: val.minute,
          day: val.day,
        },
        label: {
          hour: label.hour,
          minute: label.minute,
          day: label.day,
        },
      }))
    } else {
      setValid(() => true)
    }
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      <TimeInput
        icon={{
          onClick: () => {
            if (!valid) {
              return
            }
            setShowModal(true)
          },
        }}
        input={{
          value: time?.value
            ? formatTime(time.value.hour, time.value.minute, time.value.day)
            : '',
          onChange: handleOnInputChange,
        }}
      />

      {showModal && valid && (
        <Modal
          onClose={() => setShowModal(false)}
          className="md:mt-11 md:bg-transparent"
        >
          <DesktopTime onTimeSelect={handleOnTimeSelect} selectedTime={time} />
        </Modal>
      )}
    </div>
  )
}
