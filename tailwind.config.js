/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // eslint-disable-next-line no-undef
    preflight: process.env.NODE_ENV !== 'production',
  },
  prefix: 'ne-dt-',
}
