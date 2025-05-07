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
   
  plugins: process.env.NODE_ENV === 'development' ? [nedtTwPlugin()] : [],
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: {
     
    preflight: process.env.NODE_ENV === 'development',
  },
  prefix: 'ne-dt-',
  nepaliDateTimePicker: {},
}
