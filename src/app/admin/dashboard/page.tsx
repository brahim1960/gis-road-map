'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../hooks/useAuth'
import { useSubscription } from '../../../hooks/useSubscription'
import { PremiumBadge } from '../../../components/ui/premium-feature'
import { PDFExporter } from '../../../lib/pdf-export'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { useTranslation } from '../../../hooks/useTranslation'
import {
  Users,
  Clock,
  BarChart3,
  Settings,
  TrendingUp,
  UserPlus,
  Activity,
  MessageSquare,
  MapPin,
  Calendar,
  Award,
  Leaf,
  Shield,
  Smartphone,
  Crown,
  Zap,
  FileText,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  LifeBuoy,
} from 'lucide-react'

// Import the shared navigation for a unified sidebar across pages
import { adminNavigation } from '@/components/ui/admin-navigation'

// Keep the old hard‑coded navigation for reference. The dashboard now uses the
// shared adminNavigation to ensure all pages display the same tabs.
const oldNavigation = [
  { name: 'Tableau de bord', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Projets', href: '/admin/projects', icon: Calendar },
  { name: 'Carte temps réel', href: '/admin/map', icon: MapPin, badge: 'Live' },
  { name: 'Chat', href: '/admin/chat', icon: MessageSquare, badge: 3 },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Wellness', href: '/admin/wellness', icon: Award },
  { name: 'Carbone', href: '/admin/carbon', icon: Leaf },
  { name: 'Rapports', href: '/admin/reports', icon: Clock },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
]

// We'll compute a translated navigation inside the component using the translation
// hook. The base adminNavigation already contains a 'key' for each item.


export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { subscription, hasFeature, isTrialActive, daysLeftInTrial } = useSubscription()
  // Use translation hook to translate navigation labels and page title
  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)

  /**
   * Maintient la liste des clients et des options sous forme d'état local.
   * Chaque client peut activer/désactiver ses options. Cet état permet de
   * mettre à jour l'interface sans recharger la page.
   */
  const initialClients = [
    {
      id: 'c1',
      name: 'Client Alpha',
      options: {
        qrCode: true,
        empreinte: true,
        reconnaissance: false,
        nfc: true,
        geoloc: true,
        chat: true,
        wellness: false,
        analytics: true,
      },
    },
    {
      id: 'c2',
      name: 'Client Beta',
      options: {
        qrCode: true,
        empreinte: false,
        reconnaissance: false,
        nfc: true,
        geoloc: false,
        chat: true,
        wellness: true,
        analytics: false,
      },
    },
    {
      id: 'c3',
      name: 'Client Gamma',
      options: {
        qrCode: true,
        empreinte: true,
        reconnaissance: true,
        nfc: false,
        geoloc: true,
        chat: false,
        wellness: true,
        analytics: true,
      },
    },
  ]
  const [clients, setClients] = useState(initialClients)

  /**
   * Permet de basculer l'état d'une option pour un client donné.
   * @param clientId Identifiant du client
   * @param optionKey Nom de l'option à modifier
   */
  const toggleClientOption = (clientId: string, optionKey: keyof (typeof initialClients)[0]['options']) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? {
              ...client,
              options: {
                ...client.options,
                [optionKey]: !client.options[optionKey],
              },
            }
          : client,
      ),
    )
  }

  useEffect(() => {
    console.log('🏠 Admin Dashboard - User:', user?.role || 'No user')
    console.log('🏠 Admin Dashboard - Loading:', loading)
  }, [user, loading])

  // Afficher le chargement seulement pendant le chargement initial
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil admin...</p>
        </div>
      </div>
    )
  }

  // Si pas d'utilisateur après chargement, utiliser un utilisateur par défaut pour le développement
  const currentUser = user || {
    id: 'dev-admin',
    email: 'admin@tempszenith.com',
    full_name: 'Administrateur',
    role: 'admin' as const,
    is_active: true,
  }

  const handleExportPDF = async (type: 'time' | 'project' | 'productivity') => {
    setIsExporting(true)
    try {
      switch (type) {
        case 'time':
          await PDFExporter.exportTimeReport('2025-01-01', '2025-01-31')
          break
        case 'project':
          await PDFExporter.exportProjectReport('project-123')
          break
        case 'productivity':
          await PDFExporter.exportUserProductivity('user-123', 'Janvier 2025')
          break
      }
    } catch (error) {
      console.error('Erreur export PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  /**
   * Exporte rapidement les données des options clients dans le format souhaité.
   * Utilise PDFExporter.exportData pour générer des fichiers PDF, CSV ou Excel.
   */
  const handleQuickExport = async (format: 'pdf' | 'csv' | 'excel') => {
    setIsExporting(true)
    try {
      // Pour le format PDF, déléguer à la fonction existante qui génère un rapport PDF.
      if (format === 'pdf') {
        await handleExportPDF('project')
        return
      }
      // Pour CSV et Excel, générer un tableau des options par client
      const exportData = clientsData.map((client) => ({
        client: client.name,
        qrCode: client.options.qrCode ? 'Oui' : 'Non',
        empreinte: client.options.empreinte ? 'Oui' : 'Non',
        reconnaissance: client.options.reconnaissance ? 'Oui' : 'Non',
        nfc: client.options.nfc ? 'Oui' : 'Non',
        geoloc: client.options.geoloc ? 'Oui' : 'Non',
        chat: client.options.chat ? 'Oui' : 'Non',
        wellness: client.options.wellness ? 'Oui' : 'Non',
        analytics: client.options.analytics ? 'Oui' : 'Non',
      }))
      const columns = ['client', 'qrCode', 'empreinte', 'reconnaissance', 'nfc', 'geoloc', 'chat', 'wellness', 'analytics']
      await PDFExporter.exportData({
        format,
        title: 'Options Clients',
        data: exportData,
        columns,
        filename: `options-clients-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`,
      })
    } catch (error) {
      console.error('Erreur export rapide:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Build a translated navigation from the base adminNavigation. Each item keeps its
  // original properties but the label is translated using its key. This ensures
  // the sidebar reflects the current language without duplicating navigation data.
  const translatedNavigation = adminNavigation.map(item => ({
    ...item,
    name: t(item.key),
  }))

  const stats = [
    {
      name: 'Utilisateurs actifs',
      value: '47',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      name: 'Heures cette semaine',
      value: '1,847',
      change: '+8%',
      changeType: 'increase',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      name: 'Projets actifs',
      value: '23',
      change: '+3%',
      changeType: 'increase',
      icon: Activity,
      color: 'text-purple-600',
    },
    {
      name: 'Productivité',
      value: '94%',
      change: '+2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
    {
      name: 'CO₂ économisé',
      value: '2.4T',
      change: '+15%',
      changeType: 'increase',
      icon: Leaf,
      color: 'text-emerald-600',
    },
    {
      name: 'Score bien-être',
      value: '8.2/10',
      change: '+0.3',
      changeType: 'increase',
      icon: Award,
      color: 'text-pink-600',
    },
  ]

  // Données simulées pour les clients et les options qu'ils ont choisies
  const clientsData = [
    {
      id: 'c1',
      name: 'Client Alpha',
      options: {
        qrCode: true,
        empreinte: true,
        reconnaissance: false,
        nfc: true,
        geoloc: true,
        chat: true,
        wellness: false,
        analytics: true,
      },
    },
    {
      id: 'c2',
      name: 'Client Beta',
      options: {
        qrCode: true,
        empreinte: false,
        reconnaissance: false,
        nfc: true,
        geoloc: false,
        chat: true,
        wellness: true,
        analytics: false,
      },
    },
    {
      id: 'c3',
      name: 'Client Gamma',
      options: {
        qrCode: true,
        empreinte: true,
        reconnaissance: true,
        nfc: false,
        geoloc: true,
        chat: false,
        wellness: true,
        analytics: true,
      },
    },
  ]

  // Note: attendanceMethods array removed as options are defined inline in table
  const recentActivity = [
    {
      id: 1,
      user: 'Marie Dubois (Dev Frontend)',
      action: 'a pointé via reconnaissance faciale sur le projet "App Mobile"',
      time: 'Il y a 2 heures',
      avatar: 'MD',
      type: 'checkin',
      location: 'Bureau Paris',
    },
    {
      id: 2,
      user: 'Jean Martin (Chef de projet)',
      action: 'a créé une nouvelle tâche "Intégration API"',
      time: 'Il y a 4 heures',
      avatar: 'JM',
      type: 'task',
      location: 'Télétravail',
    },
    {
      id: 3,
      user: 'Sophie Laurent (Designer)',
      action: 'a économisé 2.5kg CO₂ en télétravail',
      time: 'Il y a 6 heures',
      avatar: 'SL',
      type: 'carbon',
      location: 'Domicile',
    },
    {
      id: 4,
      user: 'Pierre Durand (Développeur)',
      action: 'a gagné le badge "Ponctualité Excellence"',
      time: 'Il y a 1 jour',
      avatar: 'PD',
      type: 'badge',
      location: 'Bureau Lyon',
    },
    {
      id: 5,
      user: 'Emma Wilson (Client)',
      action: 'a consulté le rapport de progression du projet',
      time: 'Il y a 2 jours',
      avatar: 'EW',
      type: 'report',
      location: 'Client Portal',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return <Clock className="h-4 w-4 text-green-500" />
      case 'task':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'carbon':
        return <Leaf className="h-4 w-4 text-emerald-500" />
      case 'badge':
        return <Award className="h-4 w-4 text-yellow-500" />
      case 'report':
        return <BarChart3 className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }
  return (
    <DashboardLayout title={t('dashboard')} navigation={translatedNavigation}>
      <div className="mt-8">
        {/* Note: The welcome banner was removed per user request */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tableau des options par client */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Options de pointage et services</h3>
              <p className="text-sm text-gray-500 mt-1">
                Gérez les services activés pour chaque client et accédez à la page de facturation
              </p>
            </div>
            <PremiumBadge plan="pro" />
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">QR/Code</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Empreinte</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reconnaissance</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NFC</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Géoloc.</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Chat</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Wellness</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Analytics</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Facturation</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.name}
                    </td>
                    {Object.entries(client.options).map(([key, value]) => (
                      <td key={key} className="px-4 py-4 whitespace-nowrap text-center text-sm">
                        <button
                          onClick={() => toggleClientOption(client.id, key as keyof typeof client.options)}
                          className="focus:outline-none"
                          title={value ? 'Désactiver' : 'Activer'}
                        >
                          {value ? (
                            <ToggleRight className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </button>
                      </td>
                    ))}
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/invoice?client=${client.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Gérer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
            </div>
            <div className="p-6">
              {/* Grid of primary actions */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin/users"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus className="h-5 w-5 mr-2 text-gray-400" />
                  Ajouter utilisateur
                </Link>

                <Link
                  href="/admin/projects"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  Créer projet
                </Link>

                <Link
                  href="/admin/map"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  Carte temps réel
                </Link>

                <Link
                  href="/admin/analytics"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Zap className="h-5 w-5 mr-2 text-gray-400" />
                  Analytics IA
                </Link>

                {/* Support action */}
                <Link
                  href="/admin/tickets"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LifeBuoy className="h-5 w-5 mr-2 text-gray-400" />
                  Support
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Settings className="h-5 w-5 mr-2 text-gray-400" />
                  Paramètres
                </Link>
              </div>

              {/* Export buttons aligned horizontally */}
              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <button
                  onClick={() => handleQuickExport('pdf')}
                  disabled={isExporting}
                  className="flex-1 min-w-[90px] inline-flex items-center justify-center px-3 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  PDF
                </button>
                <button
                  onClick={() => handleQuickExport('csv')}
                  disabled={isExporting}
                  className="flex-1 min-w-[90px] inline-flex items-center justify-center px-3 py-2 border border-green-600 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleQuickExport('excel')}
                  disabled={isExporting}
                  className="flex-1 min-w-[90px] inline-flex items-center justify-center px-3 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Excel
                </button>
              </div>
            </div>
          </div>

          {/* Premium Features Overview */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Fonctionnalités Premium</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  { name: 'Export PDF', feature: 'pdfExport', plan: 'pro', active: hasFeature('pdfExport') },
                  { name: 'Carte temps réel', feature: 'realTimeMap', plan: 'pro', active: hasFeature('realTimeMap') },
                  { name: 'Chat équipe', feature: 'chat', plan: 'pro', active: hasFeature('chat') },
                  { name: 'Wellness tracking', feature: 'wellness', plan: 'pro', active: hasFeature('wellness') },
                  { name: 'Analytics IA', feature: 'aiAnalytics', plan: 'enterprise', active: hasFeature('aiAnalytics') },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      {item.active ? (
                        <span className="text-xs text-green-600 font-medium">Actif</span>
                      ) : (
                        <span className="text-xs text-gray-400">Verrouillé</span>
                      )}
                      <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Activité récente</h3>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                            {activity.avatar}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                              {activity.action}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}