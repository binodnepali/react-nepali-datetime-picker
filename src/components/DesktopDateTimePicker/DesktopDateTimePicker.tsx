import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import CalendarMonth from '@/assets/CalendarMonth.svg'
import ClockOutlineIcon from '@/assets/ClockOutline.svg'
import {
  DateInput,
  DateInputProps,
  DateInputTargetValue,
} from '@/components/DateTimeInput/DateTimeInput'
import {
  DesktopTime,
  DesktopTimeProps,
} from '@/components/DesktopTime/DesktopTime'
import {
  NepaliCalendar,
  NepaliCalendarProps,
} from '@/components/NepaliCalendar/NepaliCalendar'
import { Button } from '@/components/ui/Button/Button'
import { Modal } from '@/components/ui/Modal/Modal'
import { useDevice } from '@/hooks/useDevice'
import { useNepaliCalendar } from '@/hooks/useNepaliCalendar'
import { useNepaliTime } from '@/hooks/useNepaliTime'
import { useTranslation } from '@/hooks/useTranslation'
import { clsx } from '@/plugins/clsx'
import { NepaliTime } from '@/types'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'
import { getMonthLabel } from '@/utils/nepaliDate'

import { useModalPosition } from '../DesktopTimePicker/useModalPosition'

interface DesktopDateTimePickerProps {
  className?: string
  lang?: Language
  onDateSelect?: (selectedDate?: NepaliDate) => void
  modal?: {
    className?: string
    onClose?: () => void
  }
  hourFormat?: HourFormat
  dateInput?: DateInputProps
  calendar?: NepaliCalendarProps
  time?: DesktopTimeProps
  trans?: {
    title?: string
    cancel?: string
    confirm?: string
  }
}
export const DesktopDateTimePicker = ({
  className = '',
  lang = 'ne',
  modal = {},
  onDateSelect,
  dateInput = {},
  hourFormat = 12,
  calendar = {},
  time = {},
  trans = {},
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
  const handleOnCancel = () => {
    setShowModal(() => false)
    onCloseModal?.()
  }

  const [selectedDate, setSelectedDate] = useState<NepaliDate>()
  const selectedDateRef = useRef<NepaliDate>()
  const handleOnSelectDate = (date: NepaliDate) => {
    selectedDateRef.current = date
    onDateSelect?.(date)
    setSelectedDate(() => date)
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
  const handleOnConfirm = () => {
    onDateSelect?.(selectedDateRef.current)
    setShowModal(() => false)
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
  const [userClickedOn, setUserClickedOn] = useState<
    'year' | 'monthdate' | 'hour' | 'minute' | 'AM' | 'PM'
  >()
  const [timeDay, setTimeDay] = useState<'AM' | 'PM'>()
  const handleOnUserClickedOn = (
    userClickedOn: 'year' | 'monthdate' | 'hour' | 'minute' | 'AM' | 'PM',
  ) => {
    switch (userClickedOn) {
      case 'year':
      case 'monthdate':
        setCurrentView(() => 'calendar')
        break
      case 'hour':
      case 'minute':
        setCurrentView(() => 'time')
        break
      default:
        break
    }
    setUserClickedOn(() => userClickedOn)
  }

  const handleOnTimeDaySelect = (timeDay: 'AM' | 'PM') => {
    setCurrentView(() => 'time')

    setTimeDay(() => timeDay)
  }

  const [selectedTime, setSelectedTime] = useState<NepaliTime>()
  useEffect(() => {
    if (!selectedTime?.value.day) {
      return
    }
    setTimeDay(() => selectedTime?.value.day as 'AM' | 'PM')
  }, [selectedTime?.value.day])
  const handleOnTimeSelect = (time: NepaliTime) => {
    setSelectedTime(() => time)
    //onTimeSelect?.(time)
  }
  const {
    currentTime: { label: currentTimeLabel },
    timeDays,
  } = useNepaliTime({
    hourFormat,
    lang,
  })

  const {
    selectedLocalisedYear,
    selectedLocalisedMonth,
    currentLocalisedDate,
  } = useNepaliCalendar({
    lang,
    shortMonth: true,
  })

  const { t } = useTranslation('DesktopDateTimePicker', lang)
  const {
    title = t('title'),
    cancel = t('cancel'),
    confirm = t('confirm'),
  } = trans

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
              className={clsx(
                'ne-dt-transition-transform ne-dt-ease-out',
                modalClassName,
              )}
              style={{
                transform: clsx(
                  isMobile && 'none',
                  !isMobile &&
                    `translate3d(${modalPositionX}px, ${modalPositionY}px, 0px)`,
                ),
              }}
            >
              <div
                className={clsx(
                  'ne-dt-flex ne-dt-flex-col ne-dt-justify-center md:ne-dt-flex-row md:ne-dt-gap-0 ne-dt-px-4 md:ne-dt-px-0 ne-dt-h-full-svh ne-dt-overflow-y-auto',
                )}
                data-testid="modalcontent"
                ref={modalRef}
              >
                <>
                  <div
                    className={clsx(
                      'ne-dt-bg-neutral-50 ne-dt-p-4 ne-dt-rounded-t-md md:ne-dt-hidden',
                    )}
                  >
                    <p
                      className={clsx(
                        'ne-dt-text-neutral-500 ne-dt-text-sm ne-dt-font-normal',
                      )}
                    >
                      {title}
                    </p>

                    <div className={clsx('ne-dt-grid ne-dt-grid-cols-2')}>
                      <div>
                        <Button
                          variant="text"
                          onClick={() => handleOnUserClickedOn('year')}
                        >
                          <span
                            className={clsx(
                              'ne-dt-text-neutral-500 ne-dt-text-base ne-dt-font-normal',
                              userClickedOn === 'year' &&
                                'ne-dt-text-neutral-900',
                            )}
                          >
                            {selectedDate?.year.label ??
                              selectedLocalisedYear.label}
                          </span>
                        </Button>

                        <Button
                          variant="text"
                          onClick={() => handleOnUserClickedOn('monthdate')}
                        >
                          <span
                            className={clsx(
                              'ne-dt-text-neutral-500 ne-dt-text-4xl ne-dt-font-normal',
                              userClickedOn === 'monthdate' &&
                                'ne-dt-text-neutral-900',
                            )}
                          >
                            {`${
                              getMonthLabel(
                                lang,
                                selectedDate?.month.value,
                                true,
                              ) ?? selectedLocalisedMonth.label
                            } ${
                              selectedDate?.date?.label ??
                              currentLocalisedDate?.label
                            }`}
                          </span>
                        </Button>
                      </div>

                      <div
                        className={clsx(
                          'ne-dt-flex ne-dt-flex-row ne-dt-justify-end ne-dt-gap-4',
                        )}
                      >
                        <div
                          className={clsx(
                            'ne-dt-flex ne-dt-flex-row  ne-dt-items-center',
                          )}
                        >
                          <Button
                            variant="text"
                            onClick={() => handleOnUserClickedOn('hour')}
                          >
                            <span
                              className={clsx(
                                'ne-dt-text-neutral-500 ne-dt-text-5xl ne-dt-font-normal',
                                userClickedOn === 'hour' &&
                                  'ne-dt-text-neutral-900',
                              )}
                            >
                              {selectedTime?.label.hour ??
                                currentTimeLabel.hour}
                            </span>
                          </Button>
                          <span
                            className={clsx(
                              'ne-dt-text-neutral-500 ne-dt-text-5xl ne-dt-font-normal',
                            )}
                          >
                            :
                          </span>
                          <Button
                            variant="text"
                            onClick={() => handleOnUserClickedOn('minute')}
                          >
                            <span
                              className={clsx(
                                'ne-dt-text-neutral-500 ne-dt-text-5xl ne-dt-font-normal',
                                userClickedOn === 'minute' &&
                                  'ne-dt-text-neutral-900',
                              )}
                            >
                              {selectedTime?.label?.minute ??
                                currentTimeLabel.minute}
                            </span>
                          </Button>
                        </div>

                        {timeDays.length > 0 && (
                          <div
                            className={clsx(
                              'ne-dt-flex ne-dt-flex-col ne-dt-gap-1 ne-dt-justify-center',
                            )}
                          >
                            {timeDays.map((td, index) => (
                              <Button
                                variant="text"
                                onClick={() => handleOnTimeDaySelect(td.value)}
                                selected={timeDay === td.value}
                                key={index}
                              >
                                <span
                                  key={userClickedOn}
                                  className={clsx(
                                    'ne-dt-text-neutral-500 ne-dt-text-base ne-dt-font-medium',
                                    timeDay === td.value &&
                                      'ne-dt-text-neutral-900',
                                  )}
                                >
                                  {td.label}
                                </span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={clsx(
                      'ne-dt-grid ne-dt-grid-cols-2 ne-dt-bg-neutral-50 ne-dt-place-items-center ne-dt-pt-2 md:ne-dt-hidden',
                    )}
                  >
                    <div
                      className={clsx(
                        'ne-dt-flex ne-dt-flex-col ne-dt-items-center ne-dt-w-full',
                        currentView === 'calendar' &&
                          'ne-dt-border-b-2 ne-dt-border-gray-500',
                      )}
                    >
                      <CalendarMonth
                        width="36"
                        height="36"
                        onClick={() => setCurrentView(() => 'calendar')}
                      />
                    </div>

                    <div
                      className={clsx(
                        'ne-dt-flex ne-dt-flex-col ne-dt-items-center ne-dt-w-full',
                        currentView === 'time' &&
                          'ne-dt-border-b-2 ne-dt-border-gray-500',
                      )}
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
                      openYearSelector={userClickedOn === 'year'}
                      className={clsx('!ne-dt-rounded-none')}
                      {...calendar}
                    />
                  ) : (
                    <div className={clsx('ne-dt-block md:ne-dt-hidden')}>
                      <DesktopTime
                        className={clsx('!ne-dt-rounded-none !ne-dt-w-full')}
                        onTimeSelect={handleOnTimeSelect}
                        selectedTime={selectedTime}
                        lang={lang}
                        hourFormat={hourFormat}
                        {...time}
                      />
                    </div>
                  )}

                  <div
                    className={clsx(
                      'ne-dt-bg-neutral-50 ne-dt-flex ne-dt-flex-row ne-dt-justify-end ne-dt-gap-4 ne-dt-p-2 ne-dt-rounded-b-md md:ne-dt-hidden',
                    )}
                  >
                    <Button variant="outline" onClick={handleOnCancel}>
                      {cancel}
                    </Button>

                    <Button variant="outline" onClick={handleOnConfirm}>
                      {confirm}
                    </Button>
                  </div>
                </>

                <div className={clsx('ne-dt-hidden md:ne-dt-block')}>
                  <DesktopTime
                    onTimeSelect={handleOnTimeSelect}
                    selectedTime={selectedTime}
                    lang={lang}
                    hourFormat={hourFormat}
                    {...time}
                  />
                </div>
              </div>
            </Modal>
          </div>,
          document.body,
        )}
    </div>
  )
}
