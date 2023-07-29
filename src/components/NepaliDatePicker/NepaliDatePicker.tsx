import { useRef, useState } from 'react'

import {
  NepaliCalendar,
  NepaliCalendarProps,
} from '@/components/NepaliCalendar/NepaliCalendar'
import {
  NepaliDateInput,
  NepaliDateInputProps,
  TargetValue,
} from '@/components/NepaliDateInput/NepaliDateInput'
import { Modal } from '@/components/ui/Modal/Modal'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'

interface NepaliDatePickerProps {
  className?: string
  lang?: Language
  onDateSelect?: (selectedDate?: NepaliDate) => void
  modal?: {
    className?: string
    onClose?: () => void
  }
  dateInput?: NepaliDateInputProps
  calendar?: NepaliCalendarProps
}

export const NepaliDatePicker = ({
  className = '',
  lang = 'ne',
  modal = {},
  onDateSelect,
  dateInput = {},
  calendar = {},
}: NepaliDatePickerProps) => {
  const {
    input: dateInputInput = {},
    icon: dateInputIcon = {},
    error: dateInputError = {},
    ...dateInputRest
  } = dateInput

  const { className: modalClassName = '', onClose: onCloseModal } = modal

  const [showModal, setShowModal] = useState<boolean>(false)

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
      value !== 'undefined' ? (JSON.parse(value) as TargetValue) : undefined

    selectedDateRef.current = targetValue?.value

    onDateSelect?.(targetValue?.value)
  }

  const handleOnModalClose = () => {
    setShowModal(() => false)
    onCloseModal?.()
  }

  return (
    <div className={`ne-dt-relative ${className}`}>
      <NepaliDateInput
        lang={lang}
        value={selectedDate}
        input={{
          onChange: handleOnChange,
          placeholder: lang === 'ne' ? 'बर्ष/महिना/दिन' : 'YYYY/MM/DD',
          ...dateInputInput,
        }}
        icon={{
          onClick: handleOnInputDateClick,
          ...dateInputIcon,
        }}
        error={{
          message: 'Please enter a valid date',
          ...dateInputError,
        }}
        {...dateInputRest}
      />

      {showModal && (
        <Modal
          onClose={handleOnModalClose}
          className={`md:ne-dt-mt-11 md:ne-dt-bg-transparent ${modalClassName}`}
        >
          <NepaliCalendar
            onDateSelect={handleOnSelectDate}
            lang={lang}
            selectedDate={selectedDateRef.current}
            className="mx-4 md:mx-0"
            {...calendar}
          />
        </Modal>
      )}
    </div>
  )
}
