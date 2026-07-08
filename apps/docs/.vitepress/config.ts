import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'react-nepali-datetime-picker',
  description:
    'Bikram Sambat calendar and date picker for React and React Native',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Docs', link: '/getting-started' },
      { text: 'Migration', link: '/migration' },
      {
        text: 'GitHub',
        link: 'https://github.com/binodnepali/react-nepali-datetime-picker',
      },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'BsDayPicker API', link: '/api' },
          { text: 'Localization', link: '/localization' },
          { text: 'Styling', link: '/styling' },
          { text: 'Data Source', link: '/data' },
          { text: 'React Native', link: '/react-native' },
          { text: 'Migration from v1', link: '/migration' },
        ],
      },
    ],
  },
})
