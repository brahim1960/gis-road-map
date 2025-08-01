"use client"

import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../lib/i18n'

/**
 * Hook de traduction simple. Retourne la clé telle quelle si aucune traduction
 * n'est trouvée. Pour l'étendre, ajoutez davantage de clés dans
 * `src/lib/i18n.ts`.
 */
export function useTranslation() {
  const { locale } = useLanguage()
  const t = (key: string) => {
    const dict = translations[locale as keyof typeof translations] || {}
    return dict[key] || key
  }
  return { t, locale }
}