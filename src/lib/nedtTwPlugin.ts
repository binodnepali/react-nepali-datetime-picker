import Plugin from 'tailwindcss/plugin'

const nedtConfig = {}

export const nedtTwPlugin = Plugin(function ({ config }) {
  const usernedtConfig = config('nedt', nedtConfig)

  // eslint-disable-next-line no-console
  console.log('usernedtConfig', usernedtConfig)
})
