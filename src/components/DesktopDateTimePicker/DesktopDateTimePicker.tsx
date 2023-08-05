import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import CalendarMonth from '@/assets/CalendarMonth.svg'
import ClockOutlineIcon from '@/assets/ClockOutline.svg'
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
import { Button } from '@/components/ui/Button/Button'
import { Modal } from '@/components/ui/Modal/Modal'
import { useDevice } from '@/hooks/useDevice'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'

import { useModalPosition } from '../DesktopTimePicker/useModalPosition'

interface DesktopDateTimePickerProps {
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
export const DesktopDateTimePicker = ({
  className = '',
  lang = 'ne',
  modal = {},
  onDateSelect,
  dateInput = {},
  calendar = {},
}: DesktopDateTimePickerProps) => {
  const {
    input: { nativeInput, icon: inputIcon, ...inputRest } = {},
    hint = {},
    ...dateInputRest
  } = dateInput
  const { className: modalClassName = '', onClose: onCloseModal } = modal

  const [showModal, setShowModal] = useState<boolean>(false)
  const handleOnInputDateClick = () => {
    setShowModal(() => true)
  }
  const handleOnModalClose = () => {
    setShowModal(() => false)
    onCloseModal?.()
  }

  const [selectedDate, setSelectedDate] = useState<NepaliDate>()
  const selectedDateRef = useRef<NepaliDate>()
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

  const dateInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useDevice()
  const { x: modalPositionX, y: modalPositionY } = useModalPosition({
    dateInputRef,
    modalRef,
    isMobile,
    showModal,
  })

  const [currentView, setCurrentView] = useState<'calendar' | 'time'>(
    'calendar',
  )

  return (
    <div className={`ne-dt-relative ne-dt-flex ne-dt-flex-col ${className}`}>
      <DateInput
        ref={dateInputRef}
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

      {showModal &&
        createPortal(
          <div data-testid="desktopdatetimepicker">
            <Modal
              onClose={handleOnModalClose}
              className={`ne-dt-transition-transform ne-dt-ease-out ${modalClassName}`}
              style={{
                transform: `${
                  isMobile
                    ? 'none'
                    : `translate3d(${modalPositionX}px, ${modalPositionY}px, 0px)`
                }`,
              }}
            >
              <div
                className="ne-dt-flex ne-dt-flex-col md:ne-dt-flex-row md:ne-dt-gap-0 ne-dt-max-h-screen ne-dt-overflow-y-auto"
                data-testid="modalcontent"
                ref={modalRef}
              >
                <>
                  <div className="ne-dt-bg-neutral-50 ne-dt-p-4 ne-dt-rounded-t-md md:ne-dt-hidden">
                    <p>SELECT DATE & TIME </p>

                    <div className="ne-dt-grid ne-dt-grid-cols-2">
                      <div>
                        <Button>2022</Button>

                        <Button>Apr 12</Button>
                      </div>

                      <div className="ne-dt-flex ne-dt-flex-row ne-dt-justify-end ne-dt-gap-4">
                        <div className="ne-dt-flex ne-dt-flex-row  ne-dt-items-center">
                          <Button>23</Button>
                          <span>:</span>
                          <Button>00</Button>
                        </div>

                        <div>
                          <Button>AM</Button>

                          <Button>PM</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ne-dt-grid ne-dt-grid-cols-2 ne-dt-bg-neutral-50 ne-dt-place-items-center ne-dt-pt-2 md:ne-dt-hidden">
                    <div
                      className={`ne-dt-flex ne-dt-flex-col ne-dt-items-center ne-dt-w-full ${
                        currentView === 'calendar'
                          ? 'ne-dt-border-b-2 ne-dt-border-gray-500'
                          : ''
                      }`}
                    >
                      <CalendarMonth
                        width="36"
                        height="36"
                        onClick={() => setCurrentView(() => 'calendar')}
                      />
                    </div>

                    <div
                      className={`ne-dt-flex ne-dt-flex-col ne-dt-items-center ne-dt-w-full ${
                        currentView === 'time'
                          ? 'ne-dt-border-b-2 ne-dt-border-gray-500'
                          : ''
                      }`}
                    >
                      <ClockOutlineIcon
                        width="36"
                        height="36"
                        onClick={() => setCurrentView(() => 'time')}
                      />
                    </div>
                  </div>

                  {currentView === 'calendar' ? (
                    <NepaliCalendar
                      onDateSelect={handleOnSelectDate}
                      lang={lang}
                      selectedDate={selectedDateRef.current}
                      className="!ne-dt-rounded-none"
                      {...calendar}
                    />
                  ) : (
                    <div className="ne-dt-block md:ne-dt-hidden">
                      <DesktopTime className="!ne-dt-rounded-none !ne-dt-w-full" />
                    </div>
                  )}

                  <div className="ne-dt-bg-neutral-50 ne-dt-flex ne-dt-flex-row ne-dt-justify-end ne-dt-gap-4 ne-dt-p-2 ne-dt-rounded-b-md md:ne-dt-hidden">
                    <Button variant="outline" className="ne-dt-w-16">
                      Cancel
                    </Button>

                    <Button variant="outline" className="ne-dt-w-16">
                      Ok
                    </Button>
                  </div>
                </>

                <div className="ne-dt-hidden md:ne-dt-block">
                  <DesktopTime />
                </div>
              </div>
            </Modal>
          </div>,
          document.body,
        )}
    </div>
  )
}
