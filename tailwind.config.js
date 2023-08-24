import { nedtTwPlugin } from './src/lib/nedtTwPlugin'
import { getColorVariables } from './src/theme/themes'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...getColorVariables(),
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: process.env.NODE_ENV === 'development' ? [nedtTwPlugin()] : [],
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: {
    // eslint-disable-next-line no-undef
    preflight: process.env.NODE_ENV === 'development',
  },
  prefix: 'ne-dt-',
  nepaliDateTimePicker: {},
}
