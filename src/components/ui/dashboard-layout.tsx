'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { 
  Crown,
  Leaf,
  ExternalLink,
  Award,
  Activity,
  MapPin,
  Clock, 
  Menu, 
  X, 
  LogOut, 
  User
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'


const PREMIUM_FEATURES_CONFIG = {
  chat: {
    name: 'Chat Équipe',
    icon: MessageSquare,
    description: 'Communication en temps réel avec historique'
  },
  wellness: {
    name: 'Suivi Bien-être',
    icon: Award,
    description: 'Analytiques de santé des équipes'
  },
  analytics_ia: {
    name: 'Analytics IA',
    icon: Activity,
    description: 'Tableaux de bord intelligents'
  },
  carbon: {
    name: 'Empreinte Carbone',
    icon: Leaf,
    description: 'Dashboard RSE complet'
  },
  realTimeMap: {
    name: 'Carte Temps Réel',
    icon: MapPin,
    description: 'Visualisation géolocalisée en direct'
  }
};


interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  navigation: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    current?: boolean
    badge?: string | number
  }>
}

export default function DashboardLayout({ children, title, navigation }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { locale, setLocale } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      // Force redirect even if signOut fails
      router.push('/')
    }
  }

  // Update navigation current state based on pathname
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: pathname === item.href
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Clock className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TempsZenith Pro</span>
            </div>
            {/*
              Ensure the navigation is always scrollable on mobile by adding
              overflow‑y styles. Without this, pages with many menu items can
              cause the last entries (Chat, Wellness, Carbone, Support) to
              disappear off screen with no way to scroll. The max height
              calculation leaves room for the header and footer.
            */}
            <nav className="mt-5 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
              {updatedNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      item.current
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-4 h-6 w-6 ${
                      item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user?.avatar_url ? (
                  <img className="h-8 w-8 rounded-full" src={user.avatar_url} alt={user.full_name || 'User'} />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                {user?.job_title && (
                  <p className="text-xs text-gray-400">{user.job_title}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Clock className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TempsZenith Pro</span>
            </div>
            {/*
              For desktop, allow the navigation list to scroll if there are more
              items than vertical space. Without overflow, items at the bottom
              can vanish on smaller screens or when the page content pushes the
              sidebar. We wrap the list with overflow‑y‑auto so that Chat,
              Wellness, Carbone and Support remain accessible.
            */}
            <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
              {updatedNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      item.current
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full space-x-3">
              <div className="flex-shrink-0">
                {user?.avatar_url ? (
                  <img className="h-8 w-8 rounded-full" src={user.avatar_url} alt={user.full_name || 'User'} />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                {user?.job_title && (
                  <p className="text-xs text-gray-400">{user.job_title}</p>
                )}
              </div>
              {/* Language selector */}
              <div>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as any)}
                  className="text-xs border border-gray-300 rounded-md p-1 focus:outline-none"
                  aria-label="Changer la langue"
                >
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                </select>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

      {activePremiumFeatures.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Crown className="text-yellow-500 mr-2" />
            {t('premium_features')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activePremiumFeatures.map(feature => (
              <div key={feature.key} className="border-l-4 border-indigo-500 pl-4 py-3">
                <div className="flex items-center">
                  <feature.icon className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium">{feature.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                <a 
                  href={`/client/${feature.key}`} 
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center mt-2"
                >
                  {t('access_feature')} <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                <div className="lg:hidden">
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    title="Se déconnecter"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}