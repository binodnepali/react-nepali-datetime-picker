import daisyui from 'daisyui'

import { nedtTwPlugin } from 'react-nepali-datetime-picker'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [daisyui, nedtTwPlugin()],
}
