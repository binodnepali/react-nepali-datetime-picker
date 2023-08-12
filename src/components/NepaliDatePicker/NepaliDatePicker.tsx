import { useRef, useState } from 'react'

import {
  DateInput,
  DateInputProps,
  DateInputTargetValue,
} from '@/components/DateInput/DateInput'
import { ModalPortal } from '@/components/ModalPortal/ModalPortal'
import {
  NepaliCalendar,
  NepaliCalendarProps,
} from '@/components/NepaliCalendar/NepaliCalendar'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/plugins/twMerge'
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
  dateInput?: DateInputProps
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
    input: { nativeInput, icon: inputIcon, ...inputRest } = {},
    hint = {},
    ...dateInputRest
  } = dateInput

  const { onClose: onCloseModal, ...modalRest } = modal

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
    <div className={cn('ne-dt-relative ne-dt-flex ne-dt-flex-col', className)}>
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
        <ModalPortal
          onClose={handleOnModalClose}
          showModal={showModal}
          ref={dateInputRef}
          {...modalRest}
        >
          <NepaliCalendar
            onDateSelect={handleOnSelectDate}
            lang={lang}
            selectedDate={selectedDateRef.current}
            {...calendar}
          />
        </ModalPortal>
      )}
    </div>
  )
}
