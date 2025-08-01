'use client'

import { Crown, Leaf, ExternalLink, Activity, Award, MessageSquare, MapPin } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { useTranslation } from '../../../hooks/useTranslation'
import { useFeatureFlags } from '../../../contexts/FeatureFlagContext'
import { 
  BarChart3, 
  Clock, 
  FileText, 
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  MapPin,
  Users,
  Target,
  Zap,
  Eye,
  Download
} from 'lucide-react'

// Define a base navigation with translation keys. We'll build the translated
// navigation within the component using the translation hook. The `key` property
// corresponds to entries defined in src/lib/i18n.ts.
const baseNavigation = [
  { key: 'dashboard', href: '/client/dashboard', icon: BarChart3 },
  { key: 'projects', href: '/client/projects', icon: Calendar },
  { key: 'map', href: '/client/map', icon: MapPin, badge: 'Live' },
  { key: 'chat', href: '/client/chat', icon: MessageSquare },
  { key: 'team', href: '/client/team', icon: Users },
  { key: 'reports', href: '/client/reports', icon: FileText },
  { key: 'billing', href: '/client/billing', icon: DollarSign },
] as const


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
}

export default function ClientDashboard() {
  const { user } = useAuth()
  // Use translation to translate navigation labels and page title
  const { t } = useTranslation()
  const { hasFeature
  const activePremiumFeatures = Object.entries(PREMIUM_FEATURES_CONFIG)
    .filter(([key]) => hasFeature(key))
    .map(([key, feature]) => ({ key, ...feature }))
, loading: featuresLoading } = useFeatureFlags()

  // Define which features are considered "premium" and should be hidden if not enabled
  const premiumFeatures: Record<string, boolean> = {
      chat: hasFeature('chat'),
      wellness: hasFeature('wellness'),
      analytics_ia: hasFeature('analytics_ia'),
      carbon: hasFeature('carbon'),
      // map is a premium feature too
      map: hasFeature('realTimeMap'),
  };

  // Dynamically filter the navigation based on enabled features
  const dynamicNavigation = baseNavigation.filter(item => {
      // If the item's key is a premium feature, check if it's enabled
      if (item.key in premiumFeatures) {
          return premiumFeatures[item.key];
      }
      // Otherwise, it's a core feature, always show it
      return true;
  });

  const projectStats = [
    {
      name: 'Projets actifs',
      value: '3',
      change: '+1 ce mois',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      name: 'Heures ce mois',
      value: '142h',
      change: '+15h vs mois dernier',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      name: 'Budget utilisé',
      value: '€9,250',
      change: '71% du budget total',
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      name: 'Tâches terminées',
      value: '31',
      change: '+8 cette semaine',
      icon: CheckCircle,
      color: 'text-orange-600',
    },
    {
      name: 'Équipe active',
      value: '8',
      change: '100% présence',
      icon: Users,
      color: 'text-indigo-600',
    },
    {
      name: 'Vélocité',
      value: '94%',
      change: '+12% ce sprint',
      icon: Zap,
      color: 'text-yellow-600',
    },
  ]

  const activeProjects = [
    {
      id: 1,
      name: 'Site Web E-commerce',
      team: 'Équipe Frontend',
      progress: 82,
      hoursThisWeek: 38,
      budget: '€12,000',
      budgetUsed: '€8,850',
      status: 'En cours',
      deadline: '2025-02-15',
      teamMembers: ['Marie D.', 'Jean M.', 'Sophie L.'],
      currentSprint: 'Sprint 4',
      velocity: '95%',
      risksCount: 1,
    },
    {
      id: 2,
      name: 'Application Mobile',
      team: 'Équipe Mobile',
      progress: 58,
      hoursThisWeek: 35,
      budget: '€18,000',
      budgetUsed: '€8,100',
      status: 'En cours',
      deadline: '2025-03-30',
      teamMembers: ['Pierre D.', 'Emma W.', 'Lucas B.'],
      currentSprint: 'Sprint 2',
      velocity: '88%',
      risksCount: 0,
    },
    {
      id: 3,
      name: 'Refonte UI/UX',
      team: 'Équipe Design',
      progress: 35,
      hoursThisWeek: 22,
      budget: '€8,000',
      budgetUsed: '€2,400',
      status: 'En cours',
      deadline: '2025-02-28',
      teamMembers: ['Anna K.', 'Tom R.'],
      currentSprint: 'Sprint 1',
      velocity: '92%',
      risksCount: 2,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      project: 'Site Web E-commerce',
      activity: 'Marie D. a terminé l\'intégration du système de paiement',
      time: 'Il y a 2 heures',
      type: 'completed',
      location: 'Bureau Paris',
      impact: 'Milestone atteint',
    },
    {
      id: 2,
      project: 'Application Mobile',
      activity: 'Pierre D. travaille sur l\'optimisation des performances',
      time: 'Il y a 4 heures',
      type: 'in-progress',
      location: 'Télétravail',
      impact: 'Sprint en cours',
    },
    {
      id: 3,
      project: 'Refonte UI/UX',
      activity: 'Anna K. a publié les nouveaux wireframes',
      time: 'Il y a 1 jour',
      type: 'started',
      location: 'Bureau Lyon',
      impact: 'Validation requise',
    },
    {
      id: 4,
      project: 'Site Web E-commerce',
      activity: 'Tests automatisés passés avec succès',
      time: 'Il y a 1 jour',
      type: 'completed',
      location: 'CI/CD Pipeline',
      impact: 'Qualité assurée',
    },
    {
      id: 5,
      project: 'Application Mobile',
      activity: 'Nouvelle fonctionnalité de chat déployée',
      time: 'Il y a 2 jours',
      type: 'deployed',
      location: 'Production',
      impact: 'Feature live',
    },
  ]

  const teamStatus = [
    {
      name: 'Marie Dubois',
      role: 'Dev Frontend',
      status: 'present',
      currentTask: 'Intégration API',
      location: 'Bureau Paris',
      productivity: 95,
    },
    {
      name: 'Pierre Durand',
      role: 'Dev Mobile',
      status: 'present',
      currentTask: 'Optimisation perf',
      location: 'Télétravail',
      productivity: 88,
    },
    {
      name: 'Sophie Laurent',
      role: 'Designer',
      status: 'on_leave',
      currentTask: 'Congés',
      location: '-',
      productivity: 0,
    },
    {
      name: 'Jean Martin',
      role: 'Chef de projet',
      status: 'present',
      currentTask: 'Planning Sprint 5',
      location: 'Bureau Paris',
      productivity: 92,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800'
      case 'Démarré': 
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'started':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'deployed':
        return <Zap className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTeamStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Présent'
      case 'on_leave':
        return 'En congé'
      case 'absent':
        return 'Absent'
      default:
        return 'Inconnu'
    }
  }

  // Build a translated navigation from the DYNAMIC navigation.
  const translatedNavigation = dynamicNavigation.map((item) => ({
    ...item,
    name: t(item.key),
  }))

  return (
    <DashboardLayout title={t('dashboard')} navigation={translatedNavigation}>
      <div className="mt-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Bienvenue, {user?.full_name} ! 🎯
              </h2>
              <p className="text-gray-600">
                Suivez l'avancement de vos projets en temps réel et consultez les performances de votre équipe.
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Eye className="h-4 w-4 mr-2" />
                Vue temps réel
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          {projectStats.map((stat) => {
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
                        <dd className="text-2xl font-semibold text-gray-900 mb-1">
                          {stat.value}
                        </dd>
                        <dd className="text-xs text-gray-500">
                          {stat.change}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-3 bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Projets actifs</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Mise à jour en temps réel</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {activeProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                        {project.risksCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {project.risksCount} risque{project.risksCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Équipe:</span> {project.teamMembers.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Sprint:</span> {project.currentSprint}
                      </div>
                      <div>
                        <span className="font-medium">Vélocité:</span> {project.velocity}
                      </div>
                      <div>
                        <span className="font-medium">Échéance:</span> {new Date(project.deadline).toLocaleDateString('fr-FR')}
                      </div>
                      <div>
                        <span className="font-medium">Heures/semaine:</span> {project.hoursThisWeek}h
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span> {project.budgetUsed} / {project.budget}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progression du projet</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Budget utilisé</span>
                          <span>{Math.round((parseFloat(project.budgetUsed.replace('€', '').replace(',', '')) / parseFloat(project.budget.replace('€', '').replace(',', ''))) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.round((parseFloat(project.budgetUsed.replace('€', '').replace(',', '')) / parseFloat(project.budget.replace('€', '').replace(',', ''))) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Status */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Équipe en temps réel</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {teamStatus.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTeamStatusColor(member.status)}`}>
                          {getTeamStatusLabel(member.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{member.role}</p>
                      <p className="text-xs text-gray-600 mt-1">{member.currentTask}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{member.location}</span>
                        {member.productivity > 0 && (
                          <span className="text-xs font-medium text-green-600">{member.productivity}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Activité récente de l'équipe</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{activity.project}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.activity}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{activity.location}</span>
                      <span className="text-xs font-medium text-indigo-600">{activity.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}