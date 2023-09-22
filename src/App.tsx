import { useEffect, useState } from 'react'

import type {
  HourFormat,
  Language,
  NepaliDate,
  NepaliDateTime,
  NepaliTime,
} from '.'
import {
  DatePicker,
  DateTimePicker,
  formatNepaliDateTime,
  getCurrentNepaliDate,
  getCurrentNepaliTime,
  StaticCalendar,
  StaticDesktopTime,
  TimePicker,
} from '.'

export default function App() {
  const { toggleTheme, theme } = useThemeToggle()
  const [selectedLang, setSelectLang] = useState<Language>('ne')
  const [selectedHourFormat, setSelectedHourFormat] = useState<HourFormat>('12')

  const handleOnDateSelect = (date?: NepaliDate) => {
    // eslint-disable-next-line no-console
    console.log('handleOnDateSelect', date)
  }

  const handleOnTimeSelect = (time?: NepaliTime) => {
    // eslint-disable-next-line no-console
    console.log('handleOnTimeSelect', time)
  }

  const handleOnDateTimeSelect = (dateTime?: NepaliDateTime) => {
    // eslint-disable-next-line no-console
    console.log('handleOnDateTimeSelect', dateTime)
  }

  return (
    <div className="ne-dt-p-4 ne-dt-min-h-screen">
      <div className="ne-dt-flex ne-dt-flex-col md:ne-dt-flex-row ne-dt-gap-8 ne-dt-mt-4 ne-dt-md:mt-6">
        <div>
          <label htmlFor="lang" className="ne-dt-text-lg ne-dt-mr-2">
            Choose Language
          </label>
          <select
            className="ne-dt-py-2 ne-dt-px-4 ne-dt-text-lg ne-dt-bg-white ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-shadow-sm focus:ne-dt-outline-none focus:ne-dt-ring-1 focus:ne-dt-ring-blue-500 ne-dt-appearance-none ne-dt-w-fit"
            onChange={(e) => setSelectLang(e.target.value as Language)}
          >
            <option value="ne">Nepali</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label htmlFor="hour-format" className="ne-dt-text-lg ne-dt-mr-2">
            Choose Hour Format
          </label>
          <select
            className="ne-dt-py-2 ne-dt-px-4 ne-dt-text-lg ne-dt-bg-white ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-shadow-sm focus:ne-dt-outline-none focus:ne-dt-ring-1 focus:ne-dt-ring-blue-500 ne-dt-appearance-none ne-dt-w-fit"
            onChange={(e) =>
              setSelectedHourFormat(e.target.value as unknown as HourFormat)
            }
          >
            <option value={'12'}>12</option>
            <option value={'24'}>24</option>
          </select>
        </div>

        <div>
          <label htmlFor="theme" className="ne-dt-text-lg ne-dt-mr-2">
            Choose Theme
          </label>
          <select
            className="ne-dt-py-2 ne-dt-px-4 ne-dt-text-lg ne-dt-bg-white ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-shadow-sm focus:ne-dt-outline-none focus:ne-dt-ring-1 focus:ne-dt-ring-blue-500 ne-dt-appearance-none ne-dt-w-fit"
            onChange={(e) => toggleTheme(e.target.value)}
            value={theme}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        <div className="ne-dt-mb-8">
          <label htmlFor="datepicker" className="ne-dt-text-lg">
            Date Picker
          </label>

          <DatePicker
            lang={selectedLang}
            dateInput={{
              fullWidth: true,
            }}
            onDateSelect={handleOnDateSelect}
          />
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="timepicker" className="ne-dt-text-lg">
            Time Picker
          </label>

          <TimePicker
            lang={selectedLang}
            hourFormat={selectedHourFormat}
            timeInput={{
              fullWidth: true,
            }}
            onTimeSelect={handleOnTimeSelect}
          />
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="datetimepicker" className="ne-dt-text-lg">
            Datetime Picker
          </label>

          <DateTimePicker
            lang={selectedLang}
            defaultValue={getCurrentDateTime(selectedLang)}
            hourFormat={selectedHourFormat}
            datetimeInput={{
              fullWidth: true,
              error: {
                show: true,
              },
            }}
            onDateTimeSelect={handleOnDateTimeSelect}
          />
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="static-calendar" className="ne-dt-text-lg">
            Static Calendar
          </label>

          <StaticCalendar lang={selectedLang} />
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="static-time" className="ne-dt-text-lg">
            Static Time
          </label>

          <StaticDesktopTime
            lang={selectedLang}
            hourFormat={selectedHourFormat}
          />
        </div>
      </div>
    </div>
  )
}

function useThemeToggle() {
  const [theme, setTheme] = useState<string>('light')

  const handleOnToggleTheme = (theme: string) => {
    if (theme === 'dark') {
      //document.documentElement.classList.add('ne-dt-dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      setTheme('dark')
    } else {
      //document.documentElement.classList.remove('ne-dt-dark')
      document.documentElement.setAttribute('data-theme', 'light')

      setTheme('light')
    }
    localStorage.theme = theme
  }

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      //document.documentElement.classList.add('ne-dt-dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.theme = 'dark'
      setTheme('dark')
    } else {
      //document.documentElement.classList.remove('ne-dt-dark')
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.theme = 'light'
      setTheme('light')
    }
  }, [])

  return {
    toggleTheme: handleOnToggleTheme,
    theme,
  }
}

function getCurrentDateTime(lang: Language) {
  const nepaliDate = getCurrentNepaliDate(lang)
  const nepaliTime = getCurrentNepaliTime(lang)
  const nepaliDateTime = formatNepaliDateTime(
    {
      date: {
        ...nepaliDate,
        month: {
          ...nepaliDate.month,
          value: nepaliDate.month.value + 1,
        },
      },
      time: nepaliTime,
    },
    lang,
  )

  return nepaliDateTime
}
