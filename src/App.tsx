import { DesktopTimePicker } from '.'

export default function App() {
  return (
    <div className="ne-dt-bg-gray-100  ne-dt-p-4 ne-dt-md:p-8 ne-dt-min-h-screen">
      <p className="ne-dt-text-lg ne-dt-text-gray-600">
        This is a playground for rendering components.
      </p>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        <div className="ne-dt-mb-8">
          <label htmlFor="desktoptimepicker" className="ne-dt-text-lg">
            DesktopTime Picker
          </label>

          <DesktopTimePicker
            lang="en"
            hourFormat={24}
            className="ne-dt-m-2"
            timeInput={{
              fullWidth: true,
            }}
          />
        </div>
      </div>
    </div>
  )
}
