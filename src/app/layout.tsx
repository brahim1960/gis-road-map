import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../hooks/useAuth'
import { SubscriptionProvider } from '../hooks/useSubscription'
import { LanguageProvider } from '../contexts/LanguageContext'
import { FeatureFlagProvider } from '../contexts/FeatureFlagContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TempsZenith - Suivi du Temps',
  description: 'Application professionnelle de suivi du temps et gestion de projets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <FeatureFlagProvider>
                {children}
              </FeatureFlagProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}