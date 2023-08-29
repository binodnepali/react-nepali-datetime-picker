import { useEffect, useState } from 'react'

import { Language } from '@/types/Language'

const BASE_PATH = '../translations'

const translations = import.meta.glob(`../translations/**/*.json`, {
  import: 'default',
})

export const useTranslation = (fileName: string, lang: Language = 'ne') => {
  const [t, setT] = useState({} as Record<string, string>)

  useEffect(() => {
    const loadTranslation = async () => {
      const modulePath = `${BASE_PATH}/${lang}/${fileName}.json`

      const data = await translations[modulePath]()

      setT(data as Record<string, string>)
    }

    loadTranslation()
  }, [fileName, lang])

  return {
    t: (key: string) => t[key] || '',
  }
}
