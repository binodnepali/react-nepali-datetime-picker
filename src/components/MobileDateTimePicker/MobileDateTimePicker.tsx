import { useRef, useState } from 'react'

import {
  DateInput,
  DateInputProps,
  DateInputTargetValue,
} from '@/components/DateTimeInput/DateTimeInput'
import { DesktopTime } from '@/components/DesktopTime/DesktopTime'
import {
  NepaliCalendar,
  NepaliCalendarProps,
} from '@/components/NepaliCalendar/NepaliCalendar'
import { Modal } from '@/components/ui/Modal/Modal'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'

interface MobileDateTimePickerProps {
  className?: string
  lang?: Language
  onDateSelect?: (selectedDate?: NepaliDate) => void
  modal?: {
    className?: string
    onClose?: () => void
  }
  dateInput?: DateInputProps
  calendar?: NepaliCalendarProps
}
export const MobileDateTimePicker = ({
  className = '',
  lang = 'ne',
  modal = {},
  onDateSelect,
  dateInput = {},
  calendar = {},
}: MobileDateTimePickerProps) => {
  const {
    input: { nativeInput, icon: inputIcon, ...inputRest } = {},
    hint = {},
    ...dateInputRest
  } = dateInput

  const { className: modalClassName = '', onClose: onCloseModal } = modal

  const [showModal, setShowModal] = useState<boolean>(true)

  const [selectedDate, setSelectedDate] = useState<NepaliDate>()
  const selectedDateRef = useRef<NepaliDate>()

  const handleOnInputDateClick = () => {
    setShowModal(() => true)
  }

  const handleOnSelectDate = (date: NepaliDate) => {
    selectedDateRef.current = date
    onDateSelect?.(date)
    setSelectedDate(() => date)
    setShowModal(() => false)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    const targetValue =
      value !== 'undefined'
        ? (JSON.parse(value) as DateInputTargetValue)
        : undefined

    selectedDateRef.current = targetValue?.value

    onDateSelect?.(targetValue?.value)
  }

  const handleOnModalClose = () => {
    setShowModal(() => false)
    onCloseModal?.()
  }

  return (
    <div className={`ne-dt-relative ne-dt-flex ne-dt-flex-col ${className}`}>
      <DateInput
        lang={lang}
        value={selectedDate}
        input={{
          nativeInput: {
            onChange: handleOnChange,
            ...nativeInput,
          },
          icon: {
            onClick: handleOnInputDateClick,
            ...inputIcon,
          },
          ...inputRest,
        }}
        hint={hint}
        {...dateInputRest}
      />

      {showModal && (
        <Modal
          onClose={handleOnModalClose}
          className={`md:ne-dt-mt-11 md:ne-dt-bg-transparent ${modalClassName}`}
        >
          <div
            className="ne-dt-flex ne-dt-flex-col 
            md:ne-dt-flex-row md:ne-dt-justify-between
          "
          >
            <div>
              <NepaliCalendar
                onDateSelect={handleOnSelectDate}
                lang={lang}
                selectedDate={selectedDateRef.current}
                {...calendar}
              />
            </div>

            <div>
              <DesktopTime />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
