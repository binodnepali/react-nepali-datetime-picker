import { useEffect, useState } from 'react'

import {
  //DatePicker,
  DesktopDateTimePicker,
  // DesktopTimePicker,
  Language,
} from '.'
import { NepaliDateTime } from './types/NepaliDateTime'

export default function App() {
  const { toggleTheme } = useThemeToggle()
  const [selectLang, setSelectLang] = useState<Language>('ne')

  // const datePlaceholder =
  //   selectLang === 'ne' ? 'मिति चयन गर्नुहोस्' : 'YYYY-MM-DD'

  // const timePlaceholder = selectLang === 'en' ? 'hh:mm' : 'घण्टा:मिनेट'

  // const timeErrorText =
  //   selectLang === 'en' ? 'Enter valid time' : 'समय दिनुहोस्'

  const [dateTime, setDateTime] = useState<NepaliDateTime>()
  const handleOnDateTimeSelect = (date: NepaliDateTime) => {
    // console.log(date)

    if (!date.valid) {
      setDateTime(undefined)
      return
    }

    setDateTime(date)
  }

  return (
    <div className="ne-dt-p-4 ne-dt-min-h-screen">
      <p className="ne-dt-text-lg ne-dt-text-gray-600">
        This is a playground for rendering components.
      </p>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
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

        <div className="ne-dt-mt-4">
          <label htmlFor="theme" className="ne-dt-text-lg ne-dt-mr-2">
            Choose Theme
          </label>
          <select
            className="ne-dt-py-2 ne-dt-px-4 ne-dt-text-lg ne-dt-bg-white ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-shadow-sm focus:ne-dt-outline-none focus:ne-dt-ring-1 focus:ne-dt-ring-blue-500 ne-dt-appearance-none ne-dt-w-fit"
            onChange={(e) => toggleTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        {/* <div className="ne-dt-mb-8">
          <label htmlFor="datepicker" className="ne-dt-text-lg">
            Date Picker
          </label>

          <DatePicker
            lang={selectLang}
            dateInput={{
              fullWidth: true,
              input: {
                nativeInput: {
                  placeholder: datePlaceholder,
                },
              },
            }}
          />
        </div> */}
        {/* 
        <div className="ne-dt-mb-8">
          <label htmlFor="DesktopDateTimePicker" className="ne-dt-text-lg">
            DesktopTime Picker
          </label>

          <DesktopDateTimePicker
            lang={selectLang}
            dateInput={{
              // fullWidth: true,
              input: {
                nativeInput: {
                  placeholder: timePlaceholder,
                },
              },
              hint: {
                error: {
                  message: timeErrorText,
                },
              },
            }}
          />
        </div> */}
        {/* 
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <div className="ne-dt-mb-8" key={key}>
            <label htmlFor="desktoptimepicker" className="ne-dt-text-lg">
              DesktopTime Picker
            </label>

            <DesktopTimePicker
              lang={selectLang}
              timeInput={{
                fullWidth: true,
                input: {
                  nativeInput: {
                    placeholder: timePlaceholder,
                  },
                },
                hint: {
                  error: {
                    message: timeErrorText,
                  },
                },
              }}
            />
          </div>
        ))} */}

        <div className="ne-dt-mb1-8">
          <label htmlFor="DesktopDateTimePicker" className="ne-dt-text-lg">
            Desktop Datetime Picker
          </label>

          <DesktopDateTimePicker
            lang={selectLang}
            // hourFormat={24}
            dateInput={{
              fullWidth: true,
            }}
            onDateTimeSelect={handleOnDateTimeSelect}
          />

          {dateTime && <p>{JSON.stringify(dateTime)}</p>}
        </div>

        {/* {[1, 2, 3, 4, 5, 6].map((key) => (
          <div className="ne-dt-mb-8" key={key}>
            <label htmlFor="desktoptimepicker" className="ne-dt-text-lg">
              DesktopTime Picker
            </label>

            <DesktopTimePicker
              lang={selectLang}
              timeInput={{
                fullWidth: true,
                input: {
                  nativeInput: {
                    placeholder: timePlaceholder,
                  },
                },
                hint: {
                  error: {
                    message: timeErrorText,
                  },
                },
              }}
            />
          </div>
        ))} */}
      </div>
    </div>
  )
}

function useThemeToggle() {
  const handleOnToggleTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.theme = theme
  }

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return {
    toggleTheme: handleOnToggleTheme,
  }
}
