import { useRef, useState } from 'react'

import {
  DesktopTime,
  DesktopTimeProps,
} from '@/components/DesktopTime/DesktopTime'
import { Modal, ModalProps } from '@/components/Modal/Modal'
import {
  TimeInput,
  TimeInputProps,
  TimeInputTargetValue,
} from '@/components/TimeInput/TimeInput'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/plugins/twMerge'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliTime } from '@/types/NepaliTime'

interface DesktopTimePickerProps {
  className?: string
  desktopTime?: DesktopTimeProps
  hourFormat?: HourFormat
  lang?: Language
  modal?: ModalProps
  onTimeSelect?: (time?: NepaliTime) => void
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
    hint = {},
    ...timeInputRest
  } = timeInput

  const { onClose: onCloseModal, ...modalRest } = modal

  const [showModal, setShowModal] = useState<boolean>(false)

  const [selectedTime, setSelectedTime] = useState<NepaliTime>()
  const selectedTimeRef = useRef<NepaliTime>()

  const handleOnTimeSelect = (time: NepaliTime) => {
    const isTimeValid =
      hourFormat === 12 ? time?.day?.value !== undefined : true

    if (!isTimeValid) {
      return
    }

    setSelectedTime(() => time)
    selectedTimeRef.current = time
    onTimeSelect?.(time)

    setShowModal(() => false)
  }

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const targetValue = JSON.parse(value) as TimeInputTargetValue

    if (!targetValue.valid) {
      selectedTimeRef.current = undefined
      return
    }

    selectedTimeRef.current = targetValue.value
    onTimeSelect?.(targetValue.value)
  }

  const handleOnIconClick = () => {
    setShowModal(() => !showModal)
  }

  const { t } = useTranslation('DesktopTimePicker', lang)

  const timeInputRef = useRef<HTMLDivElement>(null)

  const handleOnModalClose = () => {
    setShowModal(() => false)
    onCloseModal?.()
  }

  return (
    <div className={cn('ne-dt-relative ne-dt-flex ne-dt-flex-col', className)}>
      <TimeInput
        selectedTime={selectedTime}
        ref={timeInputRef}
        input={{
          nativeInput: {
            onChange: handleOnInputChange,
            placeholder:
              hourFormat === 12
                ? t('timeInputPlaceholder12HourFormat')
                : t('timeInputPlaceholder24HourFormat'),
            ...nativeInput,
          },
          icon: {
            onClick: handleOnIconClick,
            ...inputIcon,
          },
          ...inputRest,
        }}
        hint={{
          ...hint,
          error: hint?.error || {
            message: t('timeInputError'),
          },
        }}
        lang={lang}
        hourFormat={hourFormat}
        {...timeInputRest}
      />

      {showModal && (
        <Modal
          onClose={handleOnModalClose}
          showModal={showModal}
          inputRef={timeInputRef}
          {...modalRest}
        >
          <DesktopTime
            onTimeSelect={handleOnTimeSelect}
            selectedTime={selectedTimeRef.current}
            lang={lang}
            hourFormat={hourFormat}
            {...desktopTime}
          />
        </Modal>
      )}
    </div>
  )
}
