import { useEffect, useRef, useState } from 'react'

import CalendarMonth from '@/assets/CalendarMonth.svg'
import ClockOutlineIcon from '@/assets/ClockOutline.svg'
import {
  DateTimeInput,
  DateTimeInputProps,
  DateTimeInputTargetValue,
} from '@/components/DateTimeInput/DateTimeInput'
import {
  DesktopTime,
  DesktopTimeProps,
} from '@/components/DesktopTime/DesktopTime'
import {
  ModalPortal,
  ModalPortalProps,
} from '@/components/ModalPortal/ModalPortal'
import {
  NepaliCalendar,
  NepaliCalendarProps,
} from '@/components/NepaliCalendar/NepaliCalendar'
import { Button } from '@/components/ui/Button/Button'
import { useNepaliCalendar } from '@/hooks/useNepaliCalendar'
import { useNepaliTime } from '@/hooks/useNepaliTime'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/plugins/twMerge'
import { NepaliTime } from '@/types'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'
import { NepaliDateTime } from '@/types/NepaliDateTime'
import { getMonthLabel } from '@/utils/nepaliDate'

interface DesktopDateTimePickerProps {
  className?: string
  lang?: Language
  onDateTimeSelect?: (selectedDateTime: NepaliDateTime) => void
  modal?: ModalPortalProps
  hourFormat?: HourFormat
  dateInput?: DateTimeInputProps
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
  onDateTimeSelect,
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
  const { onClose: onCloseModal, ...modalRest } = modal

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

  const [selectedDateTime, setSelectedDateTime] = useState<NepaliDateTime>()
  const selectedDateTimeRef = useRef<NepaliDateTime>()

  const handleOnSelectDate = (date: NepaliDate) => {
    const isTimeValid =
      hourFormat === 12
        ? selectedDateTime?.time?.day?.value !== undefined
        : true

    const dateTime = {
      valid: isTimeValid,
      date,
      ...(selectedDateTime?.time ? { time: selectedDateTime.time } : {}),
    }
    onDateTimeSelect?.(dateTime)
    setSelectedDateTime(() => dateTime)
    selectedDateTimeRef.current = dateTime
  }
  const handleOnTimeSelect = (time: NepaliTime) => {
    const isTimeValid = hourFormat === 12 ? time.day?.value !== undefined : true

    const dateTime = {
      valid: selectedDateTime?.date && isTimeValid ? true : false,
      ...(isTimeValid ? { time } : {}),
      ...(selectedDateTime?.date ? { date: selectedDateTime.date } : {}),
    }
    onDateTimeSelect?.(dateTime)
    setSelectedDateTime(() => dateTime)
    selectedDateTimeRef.current = dateTime
  }

  const handleOnDateTimeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target

    const targetValue = JSON.parse(value) as DateTimeInputTargetValue

    onDateTimeSelect?.({
      valid: targetValue.valid,
      ...(targetValue.valid
        ? {
            date: targetValue.value?.date,
            time: targetValue.value?.time,
          }
        : {}),
    })

    selectedDateTimeRef.current = {
      valid: targetValue.valid,
      ...(targetValue.valid
        ? {
            date: targetValue.value?.date,
            time: targetValue.value?.time,
          }
        : {}),
    }
  }
  const handleOnConfirm = () => {
    if (!selectedDateTime) {
      return
    }
    onDateTimeSelect?.({
      valid: true,
      date: selectedDateTime.date,
      time: selectedDateTime.time,
    })
    setShowModal(() => false)
  }

  const dateInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (!selectedDateTime?.time?.day?.value) {
      return
    }
    setTimeDay(() => selectedDateTime.time?.day?.value as 'AM' | 'PM')
  }, [selectedDateTime])

  const {
    currentTime: { hour: currentHour, minute: currentMinute },
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
    <div className={cn('relative flex flex-col', className)}>
      <DateTimeInput
        ref={dateInputRef}
        lang={lang}
        value={selectedDateTime}
        hourFormat={hourFormat}
        input={{
          nativeInput: {
            onChange: handleOnDateTimeInputChange,
            placeholder:
              hourFormat === 12
                ? t('dateTimeInputPlaceholder12HourFormat')
                : t('dateTimeInputPlaceholder24HourFormat'),
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
            message: t('dateTimeInputError'),
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
          <div className="grid grid-cols-1 md:grid-cols-2 content-center p-4 md:p-0 h-full-svh overflow-y-auto">
            <div className="bg-neutral-50 p-4 rounded-t-md md:hidden">
              <p className="text-neutral-500 text-sm font-normal">{title}</p>

              <div className="grid grid-cols-2">
                <div>
                  <Button
                    variant="text"
                    onClick={() => handleOnUserClickedOn('year')}
                  >
                    <span
                      className={cn(
                        'text-neutral-500 text-base font-normal',
                        userClickedOn === 'year' && 'text-neutral-900',
                      )}
                    >
                      {selectedDateTime?.date?.year.label ??
                        selectedLocalisedYear.label}
                    </span>
                  </Button>

                  <Button
                    variant="text"
                    onClick={() => handleOnUserClickedOn('monthdate')}
                  >
                    <span
                      className={cn(
                        'text-neutral-500 text-4xl font-normal',
                        userClickedOn === 'monthdate' && 'text-neutral-900',
                      )}
                    >
                      {`${
                        getMonthLabel(
                          lang,
                          selectedDateTime?.date?.month.value,
                          true,
                        ) ?? selectedLocalisedMonth.label
                      } ${
                        selectedDateTime?.date?.date?.label ??
                        currentLocalisedDate?.label
                      }`}
                    </span>
                  </Button>
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <div className="flex flex-row  items-center">
                    <Button
                      variant="text"
                      onClick={() => handleOnUserClickedOn('hour')}
                    >
                      <span
                        className={cn(
                          'text-neutral-500 text-5xl font-normal',
                          userClickedOn === 'hour' && 'text-neutral-900',
                        )}
                      >
                        {selectedDateTime?.time?.hour.label ??
                          currentHour.label}
                      </span>
                    </Button>
                    <span className="text-neutral-500 text-5xl font-normal">
                      :
                    </span>
                    <Button
                      variant="text"
                      onClick={() => handleOnUserClickedOn('minute')}
                    >
                      <span
                        className={cn(
                          'text-neutral-500 text-5xl font-normal',
                          userClickedOn === 'minute' && 'text-neutral-900',
                        )}
                      >
                        {selectedDateTime?.time?.minute?.label ??
                          currentMinute.label}
                      </span>
                    </Button>
                  </div>

                  {timeDays.length > 0 && (
                    <div className={cn('flex flex-col gap-1 justify-center')}>
                      {timeDays.map((td, index) => (
                        <Button
                          variant="text"
                          onClick={() => handleOnTimeDaySelect(td.value)}
                          selected={timeDay === td.value}
                          key={index}
                        >
                          <span
                            key={userClickedOn}
                            className={cn(
                              'text-neutral-500 text-base font-medium',
                              timeDay === td.value && 'text-neutral-900',
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

            <div className="grid grid-cols-2 bg-neutral-50 place-items-center pt-2 md:hidden">
              <div
                className={cn(
                  'flex flex-col items-center w-full',
                  currentView === 'calendar' && 'border-b-2 border-gray-500',
                )}
              >
                <CalendarMonth
                  width="36"
                  height="36"
                  onClick={() => setCurrentView(() => 'calendar')}
                />
              </div>

              <div
                className={cn(
                  'flex flex-col items-center w-full',
                  currentView === 'time' && 'border-b-2 border-gray-500',
                )}
              >
                <ClockOutlineIcon
                  width="36"
                  height="36"
                  onClick={() => setCurrentView(() => 'time')}
                />
              </div>
            </div>

            {currentView === 'calendar' && (
              <NepaliCalendar
                onDateSelect={handleOnSelectDate}
                lang={lang}
                selectedDate={selectedDateTimeRef?.current?.date}
                openYearSelector={userClickedOn === 'year'}
                className={cn('rounded-none')}
                {...calendar}
              />
            )}

            {currentView === 'time' && (
              <div className="block w-full md:hidden">
                <DesktopTime
                  className="rounded-none w-full"
                  onTimeSelect={handleOnTimeSelect}
                  selectedTime={selectedDateTimeRef?.current?.time}
                  lang={lang}
                  hourFormat={hourFormat}
                  {...time}
                />
              </div>
            )}

            <div className="bg-neutral-50 flex flex-row justify-end gap-4 p-2 rounded-b-md md:hidden">
              <Button variant="outline" onClick={handleOnCancel}>
                {cancel}
              </Button>

              <Button variant="outline" onClick={handleOnConfirm}>
                {confirm}
              </Button>
            </div>

            <div className="hidden md:block">
              <DesktopTime
                onTimeSelect={handleOnTimeSelect}
                selectedTime={selectedDateTimeRef?.current?.time}
                lang={lang}
                hourFormat={hourFormat}
                {...time}
              />
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
