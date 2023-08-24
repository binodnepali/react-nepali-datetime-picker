import Plugin from 'tailwindcss/plugin'

import {
  getDarkTheme,
  getDefaultDarkTheme,
  getDefaultLightTheme,
  getLightTheme,
  ThemeColor,
} from '../theme/themes'

export const nedtTwPlugin = () =>
  Plugin(function ({ config, addBase }) {
    const userConfig = config(
      'nepaliDateTimePicker',
      {},
    ) as NepaliDateTimePickerConfig

    const { theme } = userConfig

    if (theme?.light) {
      addBase(getLightTheme(theme.light))
    } else {
      addBase(getDefaultLightTheme())
    }

    if (theme?.dark) {
      addBase(getDarkTheme(theme.dark))
    } else {
      addBase(getDefaultDarkTheme())
    }
  })

type NepaliDateTimePickerConfig = {
  theme?: {
    light?: ThemeColor
    dark?: ThemeColor
  }
}
