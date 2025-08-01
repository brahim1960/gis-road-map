'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { useTranslation } from '../../../hooks/useTranslation'
import { PDFExporter } from '../../../lib/pdf-export'
// Import the shared navigation definition.  This ensures the sidebar
// stays consistent across pages and prevents tabs from disappearing.
import { adminNavigation } from '@/components/ui/admin-navigation'
import {
  Users, 
  Clock, 
  BarChart3, 
  Settings,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react'

import { getSupabaseClient } from '@/lib/supabase/client'

// Older hard‑coded navigation kept for reference; the app now uses adminNavigation
const oldNavigation = [
  { name: 'Tableau de bord', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Projets', href: '/admin/projects', icon: Calendar },
  { name: 'Carte temps réel', href: '/admin/map', icon: MapPin, badge: 'Live' },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Rapports', href: '/admin/reports', icon: Clock },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
]
// Use the central navigation for consistency across pages.
// We'll translate the navigation labels using the translation hook in the component.


interface User {
  id: string
  full_name: string
  email: string
  role: 'admin' | 'employee' | 'client'
  status: 'active' | 'inactive' | 'on_leave' | 'late'
  department: string
  job_title: string
  hire_date: string
  last_login: string
  phone?: string
  hourly_rate: number
  avatar_url?: string
}

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  // Use translation for navigation labels and page title
  const { t } = useTranslation()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  // Les modales de création/édition ont été remplacées par des pages dédiées
  const [isExporting, setIsExporting] = useState(false)

  // Liste des utilisateurs (employés, administrateurs et clients) récupérée depuis Supabase
  const [users, setUsers] = useState<User[]>([])

  // Charger les utilisateurs et les clients depuis la base de données au montage du composant
  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = getSupabaseClient()

      try {
        // Récupérer les profils (employés et administrateurs)
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')

        if (profilesError) {
          console.error('Erreur lors du chargement des profils:', profilesError)
        }

        // Récupérer les clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')

        if (clientsError) {
          console.error('Erreur lors du chargement des clients:', clientsError)
        }

        const mappedProfiles: User[] = (profilesData || []).map((p) => ({
          id: p.id,
          full_name: p.full_name || '',
          email: p.email,
          role: p.role,
          status: p.is_active ? 'active' : 'inactive',
          department: p.department_id || 'N/A',
          job_title: p.job_title || '',
          hire_date: p.hire_date || '',
          last_login: p.last_login || '',
          phone: p.phone || undefined,
          hourly_rate: p.hourly_rate || 0,
        }))

        const mappedClients: User[] = (clientsData || []).map((c) => ({
          id: c.id,
          full_name: c.name,
          email: c.email || '',
          role: 'client',
          status: c.is_active ? 'active' : 'inactive',
          department: c.company || 'Client',
          job_title: c.contact_person || '',
          hire_date: c.created_at || '',
          last_login: c.updated_at || '',
          phone: c.phone || undefined,
          hourly_rate: c.hourly_rate || 0,
        }))

        // Combiner les utilisateurs et les clients
        setUsers([...mappedProfiles, ...mappedClients])
      } catch (err) {
        console.error('Erreur inattendue lors du chargement des utilisateurs:', err)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800'
      case 'late':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'inactive':
        return <XCircle className="h-4 w-4" />
      case 'on_leave':
        return <Pause className="h-4 w-4" />
      case 'late':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'inactive':
        return 'Inactif'
      case 'on_leave':
        return 'En congé'
      case 'late':
        return 'En retard'
      default:
        return 'Inconnu'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur'
      case 'employee':
        return 'Employé'
      case 'client':
        return 'Client'
      default:
        return role
    }
  }

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    setIsExporting(true)
    try {
      const exportData = filteredUsers.map(user => ({
        nom: user.full_name,
        email: user.email,
        role: getRoleLabel(user.role),
        statut: getStatusLabel(user.status),
        departement: user.department,
        poste: user.job_title,
        embauche: user.hire_date,
        derniere_connexion: user.last_login,
        telephone: user.phone || '',
        taux_horaire: user.hourly_rate
      }))

      await PDFExporter.exportData({
        format,
        title: 'Liste des Utilisateurs',
        data: exportData,
        columns: ['nom', 'email', 'role', 'statut', 'departement', 'poste', 'embauche', 'derniere_connexion', 'telephone', 'taux_horaire'],
        filename: `utilisateurs-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`
      })
    } catch (error) {
      console.error('Erreur export:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Rediriger vers la page de création d'un nouvel utilisateur
  const handleAddUser = () => {
    router.push('/admin/users/new')
  }

  // Rediriger vers la page d'édition de l'utilisateur sélectionné
  const handleEditUser = (user: User) => {
    router.push(`/admin/users/${user.id}`)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const statusStats = {
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    on_leave: users.filter(u => u.status === 'on_leave').length,
    late: users.filter(u => u.status === 'late').length,
  }

  // Build a translated navigation from the base adminNavigation. Each item keeps its
  // original properties but the label is translated using its key.  This allows
  // the sidebar to reflect the current language without duplicating navigation data.
  const translatedNavigation = adminNavigation.map(item => ({
    ...item,
    name: t(item.key),
  }))

  return (
    <DashboardLayout title={t('users')} navigation={translatedNavigation}>
      <div className="mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Utilisateurs actifs</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{statusStats.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">En retard</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{statusStats.late}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Pause className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">En congé</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{statusStats.on_leave}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{users.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
                Utilisateurs ({filteredUsers.length})
              </h3>
              <div className="flex justify-end">
                <button
                  onClick={handleAddUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter utilisateur
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="on_leave">En congé</option>
                <option value="late">En retard</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="employee">Employés</option>
                <option value="client">Clients</option>
              </select>

              <div className="flex space-x-2">
                {/* PDF export button */}
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  PDF
                </button>
                {/* CSV export button */}
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-600 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  CSV
                </button>
                {/* Excel export button */}
                <button
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Excel
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                            {user.full_name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.job_title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1">{getStatusLabel(user.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getRoleLabel(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}