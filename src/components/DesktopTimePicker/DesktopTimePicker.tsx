import { HTMLAttributes, useRef, useState } from 'react'

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

interface DesktopTimePickerProps extends HTMLAttributes<HTMLDivElement> {
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
  ...rest
}: DesktopTimePickerProps) => {
  const {
    input: { nativeInput = {}, icon: inputIcon = {}, ...inputRest } = {},
    hint = {},
    ...timeInputRest
  } = timeInput

  const { className: timeClassName = '', ...desktopTimeRest } = desktopTime

  const {
    onClose: onCloseModal,
    modalContentClassName = '',
    ...modalRest
  } = modal

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
    <div
      className={cn('ne-dt-relative ne-dt-flex ne-dt-flex-col', className)}
      {...rest}
    >
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
          modalContentClassName={cn(
            'ne-dt-px-4 md:ne-dt-px-0',
            modalContentClassName,
          )}
          {...modalRest}
        >
          <DesktopTime
            onTimeSelect={handleOnTimeSelect}
            selectedTime={selectedTimeRef.current}
            lang={lang}
            hourFormat={hourFormat}
            className={cn(
              'ne-dt-border ne-dt-border-primary ne-dt-rounded-md ne-dt-bg-base-100 ne-dt-text-base-content ne-dt-p-2 md:ne-dt-p-4',
              timeClassName,
            )}
            {...desktopTimeRest}
          />
        </Modal>
      )}
    </div>
  )
}
