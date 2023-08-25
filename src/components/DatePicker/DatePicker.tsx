import { HTMLAttributes, useRef, useState } from 'react'

import { Calendar, CalendarProps } from '@/components/Calendar/Calendar'
import {
  DateInput,
  DateInputProps,
  DateInputTargetValue,
} from '@/components/DateInput/DateInput'
import { Modal, ModalProps } from '@/components/Modal/Modal'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/plugins/twMerge'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'

interface DatePickerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  lang?: Language
  onDateSelect?: (selectedDate?: NepaliDate) => void
  modal?: ModalProps
  dateInput?: DateInputProps
  calendar?: CalendarProps
}
export const DatePicker = ({
  className = '',
  lang = 'ne',
  modal = {},
  onDateSelect,
  dateInput = {},
  calendar = {},
  ...rest
}: DatePickerProps) => {
  const {
    input: { nativeInput, icon: inputIcon, ...inputRest } = {},
    hint = {},
    ...dateInputRest
  } = dateInput

  const { className: calendarClassName = '', ...calendarRest } = calendar

  const {
    onClose: onCloseModal,
    modalContentClassName = '',
    ...modalRest
  } = modal

  const [showModal, setShowModal] = useState<boolean>(false)

  const [selectedDate, setSelectedDate] = useState<NepaliDate>()
  const selectedDateRef = useRef<NepaliDate>()

  const handleOnInputDateClick = () => {
    setShowModal((prev) => !prev)
  }

  const handleOnSelectDate = (date: NepaliDate) => {
    selectedDateRef.current = date
    onDateSelect?.(date)
    setSelectedDate(() => date)
    setShowModal(() => false)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    const targetValue = JSON.parse(value) as DateInputTargetValue

    selectedDateRef.current = targetValue.value

    onDateSelect?.(targetValue.value)
  }

  const handleOnModalClose = () => {
    setShowModal(() => false)
    onCloseModal?.()
  }

  const dateInputRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('DatePicker', lang)

  return (
    <div
      className={cn('ne-dt-relative ne-dt-flex ne-dt-flex-col', className)}
      {...rest}
    >
      <DateInput
        ref={dateInputRef}
        lang={lang}
        value={selectedDate}
        input={{
          nativeInput: {
            onChange: handleOnChange,
            placeholder: t('inputPlaceholder'),
            ...nativeInput,
          },
          icon: {
            onClick: handleOnInputDateClick,
            ...inputIcon,
          },
          ...inputRest,
        }}
        hint={{
          ...hint,
          error: hint?.error || {
            message: t('inputError'),
          },
        }}
        {...dateInputRest}
      />

      {showModal && (
        <Modal
          inputRef={dateInputRef}
          onClose={handleOnModalClose}
          showModal={showModal}
          modalContentClassName={cn(
            'ne-dt-px-4 md:ne-dt-px-0',
            modalContentClassName,
          )}
          {...modalRest}
        >
          <Calendar
            onDateSelect={handleOnSelectDate}
            lang={lang}
            selectedDate={selectedDateRef.current}
            className={cn(
              'ne-dt-border ne-dt-border-primary ne-dt-rounded-md ne-dt-bg-base-100 ne-dt-text-base-content ne-dt-p-2 md:ne-dt-p-4',
              calendarClassName,
            )}
            {...calendarRest}
          />
        </Modal>
      )}
    </div>
  )
}
