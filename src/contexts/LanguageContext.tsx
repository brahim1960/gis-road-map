"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Locale } from '../lib/i18n'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Langue par défaut : français. Cette valeur pourrait être lue à partir
  // d'un cookie ou du navigateur pour une implémentation plus robuste.
  const [locale, setLocale] = useState<Locale>('fr')
  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}