/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // eslint-disable-next-line no-undef
  darkMode: process.env.NODE_ENV === 'development' ? 'class' : 'media',
  corePlugins: {
    // eslint-disable-next-line no-undef
    preflight: process.env.NODE_ENV === 'development',
  },
  prefix: 'ne-dt-',
}
