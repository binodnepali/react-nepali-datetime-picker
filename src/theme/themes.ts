const PREFIX = 'ne-dt-'

const DATA_THEME_LIGHT = '[data-theme=light]'
const DATA_THEME_DARK = '[data-theme=dark]'

export const defaultThemes: {
  [key in ThemeMode]: ThemeColor
} = {
  dark: {
    primary: '#661AE6',
    'primary-content': '#ffffff',
    secondary: '#D926AA',
    'secondary-content': '#ffffff',
    accent: '#1FB2A5',
    'accent-content': '#ffffff',
    neutral: '#2a323c',
    'neutral-focus': '#242b33',
    'neutral-content': '#A6ADBB',
    'base-100': '#1d232a',
    'base-200': '#191e24',
    'base-300': '#15191e',
    'base-content': '#A6ADBB',
    error: '#EE565B',
    'error-content': '#ffffff',
    success: '#42BA96',
    'success-content': '#ffffff',
  },
  light: {
    primary: '#570df8',
    'primary-content': '#E0D2FE',
    secondary: '#f000b8',
    'secondary-content': '#FFD1F4',
    accent: '#1ECEBC',
    'accent-content': '#07312D',
    neutral: '#2B3440',
    'neutral-focus': '#1D2330',
    'neutral-content': '#D7DDE4',
    'base-100': '#ffffff',
    'base-200': '#F2F2F2',
    'base-300': '#E5E6E6',
    'base-content': '#1f2937',
    error: '#EF4444',
    'error-content': '#ffffff',
    success: '#10B981',
    'success-content': '#ffffff',
  },
}

export const getColorVariables = () => {
  const lightColors = Object.keys(defaultThemes.light)
  const darkColors = Object.keys(defaultThemes.dark)

  const keys = new Set([...lightColors, ...darkColors])

  return Array.from(keys).reduce(
    (acc, key) => {
      acc[`${key}`] = `var(--${PREFIX}${key})`
      return acc
    },
    {} as Record<string, string>,
  )
}

export type ThemeMode = 'light' | 'dark'

export type ThemeColor = {
  primary?: string
  'primary-content'?: string
  secondary?: string
  'secondary-content'?: string
  accent?: string
  'accent-content'?: string
  neutral?: string
  'neutral-focus'?: string
  'neutral-content'?: string
  'base-100'?: string
  'base-200'?: string
  'base-300'?: string
  'base-content'?: string
  error?: string
  'error-content'?: string
  success?: string
  'success-content'?: string
}

export const getLightTheme = (light: ThemeColor) => {
  const userLightColors = Object.keys(light) as Array<keyof ThemeColor>

  const lightDefaultColors = Object.keys(defaultThemes.light).filter(
    (key) => !userLightColors.includes(key as keyof ThemeColor),
  ) as Array<keyof ThemeColor>

  const userLightTheme = userLightColors.reduce(
    (acc, key) => {
      const color = light[key]

      if (color) {
        acc[`--${PREFIX}${key}`] = color
        return acc
      }

      return acc
    },
    {} as Record<string, string>,
  )

  const lightDefaultTheme = lightDefaultColors.reduce(
    (acc, key) => {
      const color = defaultThemes.light[key]

      if (color) {
        acc[`--${PREFIX}${key}`] = color
        return acc
      }

      return acc
    },
    {} as Record<string, string>,
  )

  return {
    [DATA_THEME_LIGHT]: {
      ...lightDefaultTheme,
      ...userLightTheme,
    },
  }
}

export const getDefaultLightTheme = () => {
  const lightDefaultColors = Object.keys(defaultThemes.light) as Array<
    keyof ThemeColor
  >

  const lightDefaultTheme = lightDefaultColors.reduce(
    (acc, key) => {
      const color = defaultThemes.light[key]

      if (color) {
        acc[`--${PREFIX}${key}`] = color
        return acc
      }

      return acc
    },
    {} as Record<string, string>,
  )

  return {
    [DATA_THEME_LIGHT]: lightDefaultTheme,
  }
}

export const getDarkTheme = (dark: ThemeColor) => {
  const userDarkColors = Object.keys(dark) as Array<keyof ThemeColor>

  const darkDefaultColors = Object.keys(defaultThemes.dark).filter(
    (key) => !userDarkColors.includes(key as keyof ThemeColor),
  ) as Array<keyof ThemeColor>

  const userDarkTheme = userDarkColors.reduce(
    (acc, key) => {
      const color = dark[key]

      if (color) {
        acc[`--${PREFIX}${key}`] = color
        return acc
      }

      return acc
    },
    {} as Record<string, string>,
  )

  const darkDefaultTheme = darkDefaultColors.reduce(
    (acc, key) => {
      const color = defaultThemes.dark[key]

      if (color) {
        acc[`--${PREFIX}${key}`] = color
        return acc
      }

      return acc
    },
    {} as Record<string, string>,
  )

  return {
    [DATA_THEME_DARK]: {
      ...darkDefaultTheme,
      ...userDarkTheme,
    },
  }
}

export const getDefaultDarkTheme = () => {
  const darkDefaultColors = Object.keys(defaultThemes.dark) as Array<
    keyof ThemeColor
  >

  const darkDefaultTheme = darkDefaultColors.reduce(
    (acc, key) => {
      const color = defaultThemes.dark[key]

      if (color) {
        acc[`--${PREFIX}${key}`] = color
        return acc
      }

      return acc
    },
    {} as Record<string, string>,
  )

  return {
    [DATA_THEME_DARK]: darkDefaultTheme,
  }
}
