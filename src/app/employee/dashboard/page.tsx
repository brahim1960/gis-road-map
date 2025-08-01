'use client'

import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { StatsCard } from '../../../components/shared/stats-card'
import { ProjectCard } from '../../../components/shared/project-card'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { 
  Clock, 
  Play, 
  Pause, 
  Square,
  BarChart3, 
  Calendar,
  Timer,
  CheckCircle,
  MessageSquare,
  MapPin,
  Award,
  Leaf,
  Users,
  Target,
  TrendingUp,
  Smartphone,
  Wifi,
  Battery
} from 'lucide-react'

const navigation = [
  { name: 'Tableau de bord', href: '/employee/dashboard', icon: BarChart3 },
  { name: 'Suivi du temps', href: '/employee/time-tracking', icon: Clock },
  { name: 'Mes projets', href: '/employee/projects', icon: Calendar },
  { name: 'Mes tâches', href: '/employee/tasks', icon: Target },
  { name: 'Chat équipe', href: '/employee/chat', icon: MessageSquare, badge: 2 },
  { name: 'Ma localisation', href: '/employee/location', icon: MapPin },
  { name: 'Mes badges', href: '/employee/badges', icon: Award },
  { name: 'Mon impact', href: '/employee/carbon', icon: Leaf },
  { name: 'Rapports', href: '/employee/reports', icon: BarChart3 },
]

const mockTodayStats = [
  {
    name: 'Temps aujourd\'hui',
    value: '7h 15m',
    icon: Clock,
    color: 'text-blue-600',
    change: '+45m vs hier',
  },
  {
    name: 'Projets actifs',
    value: '3',
    icon: Calendar,
    color: 'text-green-600',
    change: 'Stable',
  },
  {
    name: 'Tâches terminées',
    value: '12',
    icon: CheckCircle,
    color: 'text-purple-600',
    change: '+4 cette semaine',
  },
  {
    name: 'Score productivité',
    value: '92%',
    icon: TrendingUp,
    color: 'text-indigo-600',
    change: '+5% ce mois',
  },
]

const mockProjects = [
  {
    id: 1,
    name: 'Site Web E-commerce',
    client: 'TechCorp',
    timeToday: '3h 15m',
    status: 'En cours',
    progress: 82,
    tasksCompleted: 8,
    totalTasks: 12,
    priority: 'high',
  },
  {
    id: 2,
    name: 'Application Mobile',
    client: 'StartupXYZ',
    timeToday: '2h 45m',
    status: 'En cours',
    progress: 58,
    tasksCompleted: 6,
    totalTasks: 15,
    priority: 'medium',
  },
]

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [isTracking, setIsTracking] = useState(false)
  const [currentProject, setCurrentProject] = useState('')
  const [currentTask, setCurrentTask] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [attendanceMethod, setAttendanceMethod] = useState('mobile_app')
  const [isOnline, setIsOnline] = useState(true)

  const handleStartTracking = () => {
    if (currentProject && currentTask) {
      setIsTracking(true)
      // Start timer logic here
    }
  }

  const handlePauseTracking = () => {
    setIsTracking(false)
    // Pause timer logic here
  }

  const handleStopTracking = () => {
    setIsTracking(false)
    setElapsedTime(0)
    setCurrentProject('')
    setCurrentTask('')
    // Stop and save timer logic here
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const availableTasks = [
    { id: 'task1', name: 'Développement API REST', project: 'Site Web E-commerce' },
    { id: 'task2', name: 'Tests unitaires', project: 'Site Web E-commerce' },
    { id: 'task3', name: 'Interface utilisateur', project: 'Application Mobile' },
    { id: 'task4', name: 'Optimisation performance', project: 'Application Mobile' },
    { id: 'task5', name: 'Recherche UX', project: 'Refonte UI/UX' },
  ]

  const recentBadges = [
    {
      name: 'Ponctualité Excellence',
      description: '30 jours consécutifs à l\'heure',
      icon: '🎯',
      earnedDate: '2025-01-20',
      points: 100,
    },
    {
      name: 'Eco-Warrior',
      description: '50kg CO₂ économisés',
      icon: '🌱',
      earnedDate: '2025-01-18',
      points: 75,
    },
    {
      name: 'Team Player',
      description: '100 messages d\'équipe',
      icon: '🤝',
      earnedDate: '2025-01-15',
      points: 50,
    },
  ]

  return (
    <DashboardLayout title="Tableau de bord employé" navigation={navigation}>
      <div className="mt-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Bonjour, {user?.full_name} ! 👋
              </h2>
              <p className="text-gray-600">
                Prêt à commencer votre journée de travail ? Suivez votre temps et gérez vos projets.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">{isOnline ? 'En ligne' : 'Hors ligne'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Smartphone className="h-4 w-4" />
                <Wifi className="h-4 w-4" />
                <Battery className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Time Tracker */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Suivi du temps intelligent</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Méthode:</span>
              <select
                value={attendanceMethod}
                onChange={(e) => setAttendanceMethod(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="mobile_app">App Mobile</option>
                <option value="qr_code">QR Code</option>
                <option value="nfc_badge">Badge NFC</option>
                <option value="geolocation">Géolocalisation</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Projet</label>
              <select
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isTracking}
              >
                <option value="">Sélectionner un projet</option>
                <option value="ecommerce">Site Web E-commerce</option>
                <option value="mobile">Application Mobile</option>
                <option value="uiux">Refonte UI/UX</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tâche</label>
              <select
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isTracking || !currentProject}
              >
                <option value="">Sélectionner une tâche</option>
                {availableTasks
                  .filter(task => {
                    if (currentProject === 'ecommerce') return task.project === 'Site Web E-commerce'
                    if (currentProject === 'mobile') return task.project === 'Application Mobile'
                    if (currentProject === 'uiux') return task.project === 'Refonte UI/UX'
                    return false
                  })
                  .map(task => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="text-2xl font-mono font-bold text-gray-900 min-w-[120px]">
              {formatTime(elapsedTime)}
            </div>
          </div>

          <div className="flex space-x-3">
            {!isTracking ? (
              <button
                onClick={handleStartTracking}
                disabled={!currentProject || !currentTask}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 mr-2" />
                Démarrer
              </button>
            ) : (
              <>
                <button
                  onClick={handlePauseTracking}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </button>
                <button
                  onClick={handleStopTracking}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {mockTodayStats.map((stat) => (
            <StatsCard key={stat.name} {...stat} />
          ))}
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Mes projets actifs</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>

          {/* Badges and Achievements */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Mes badges récents</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBadges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{badge.name}</h4>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{badge.earnedDate}</span>
                        <span className="text-xs font-medium text-indigo-600">+{badge.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Score total</span>
                  <span className="text-lg font-bold text-indigo-600">1,247 pts</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Niveau 8</span>
                    <span>Niveau 9</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">253 pts pour le niveau suivant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}