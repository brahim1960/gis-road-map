"use client"
import { adminNavigation } from '@/components/ui/admin-navigation'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { useAuth } from '../../../hooks/useAuth'
import {
  Users,
  Clock,
  BarChart3,
  Settings,
  Calendar,
  MapPin,
  FileText,
  Plus,
  Folder,
  List,
  Briefcase,
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react'

// Navigation for the admin panel including the new Projects page
const navigation = adminNavigation

interface Task {
  id: string
  name: string
  status: 'todo' | 'in_progress' | 'done'
  startDate: string
  endDate: string
}

interface Project {
  id: string
  name: string
  client: string
  status: 'planning' | 'en_cours' | 'termine' | 'en_retard'
  startDate: string
  endDate: string
  progress: number
  tasks: Task[]
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Liste des projets chargés depuis la base de données. Chaque projet
  // inclut le nom du client et le nombre de tâches associées.  Nous
  // initialisons cette liste à vide et la remplissons via useEffect.
  const [projects, setProjects] = useState<Project[]>([])

  // Charger les projets réels depuis la table `projects` au montage.
  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = getSupabaseClient()
      // Sélectionner les champs principaux et joindre le nom du client
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('id, name, status, start_date, end_date, progress, client_id')

      if (error) {
        console.error('Erreur chargement projets:', error)
        return
      }
      // Récupérer les noms des clients en une seule requête
      const clientIds = [...new Set((projectsData || []).map((p) => p.client_id).filter(Boolean))]
      let clientsMap: Record<string, string> = {}
      if (clientIds.length > 0) {
        const { data: clientsData, error: clientError } = await supabase
          .from('clients')
          .select('id, name')
          .in('id', clientIds as string[])
        if (!clientError) {
          clientsMap = Object.fromEntries((clientsData || []).map((c: any) => [c.id, c.name]))
        }
      }
      // Pour chaque projet, calculer le nombre de tâches
      const projectsWithTasks: Project[] = []
      for (const p of projectsData || []) {
        // Compter les tâches associées au projet
        const { count, error: countError } = await supabase
          .from('project_tasks')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', p.id)
        if (countError) {
          console.error('Erreur comptage tâches:', countError)
        }
        projectsWithTasks.push({
          id: p.id,
          name: p.name,
          client: clientsMap[p.client_id as string] || 'Aucun client',
          status: p.status as Project['status'],
          startDate: p.start_date || '',
          endDate: p.end_date || '',
          progress: p.progress || 0,
          tasks: new Array(count || 0).fill(null).map((_, i) => ({ id: `${p.id}-t${i}`, name: '', status: 'todo', startDate: '', endDate: '' }))
        })
      }
      setProjects(projectsWithTasks)
    }
    fetchProjects()
  }, [])

  const [searchTerm, setSearchTerm] = useState('')

  // Filtrer les projets selon le nom ou le client
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Planifié</span>
      case 'en_cours':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En cours</span>
      case 'termine':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Terminé</span>
      case 'en_retard':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">En retard</span>
      default:
        return null
    }
  }

  return (
    <DashboardLayout title="Gestion des Projets" navigation={navigation}>
      <div className="mt-8">
        {/* En-tête et bouton pour créer un nouveau projet */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Projets</h2>
          <div className="mt-3 sm:mt-0 flex space-x-2">
            <button
              // Redirige vers le formulaire de création d'un nouveau projet
              onClick={() => router.push('/admin/projects/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher projet ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Tableau des projets */}
        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tâches</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-xs text-gray-500">ID: {project.id}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{project.client}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">{project.startDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">{project.endDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{project.progress}%</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {project.tasks.length}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      // Affiche la page de détail du projet
                      onClick={() => router.push(`/admin/projects/${project.id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                    Aucun projet trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}