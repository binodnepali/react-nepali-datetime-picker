import { useState } from 'react'

import { DesktopTimePicker, Language, NepaliDatePicker } from '.'

export default function App() {
  const [selectLang, setSelectLang] = useState<Language>('ne')

  const datePlaceholder =
    selectLang === 'ne' ? 'मिति चयन गर्नुहोस्' : 'YYYY-MM-DD'

  const timePlaceholder = selectLang === 'en' ? 'hh:mm' : 'घण्टा:मिनेट'

  const timeErrorText =
    selectLang === 'en' ? 'Enter valid time' : 'समय दिनुहोस्'

  return (
    <div className="ne-dt-bg-gray-100  ne-dt-p-4 ne-dt-md:p-8 ne-dt-min-h-screen">
      <p className="ne-dt-text-lg ne-dt-text-gray-600">
        This is a playground for rendering components.
      </p>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        <label htmlFor="lang" className="ne-dt-text-lg">
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

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        <div className="ne-dt-mb-8">
          <label htmlFor="datepicker" className="ne-dt-text-lg">
            Date Picker
          </label>

          <NepaliDatePicker
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
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="desktoptimepicker" className="ne-dt-text-lg">
            DesktopTime Picker
          </label>

          <DesktopTimePicker
            lang={selectLang}
            timeInput={{
              fullWidth: true,
              input: {
                nativeInput: {
                  className: 'ne-dt-border-red-500',
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
      </div>
    </div>
  )
}
