"use client"
import { adminNavigation } from '@/components/ui/admin-navigation'
import DashboardLayout from '@/components/ui/dashboard-layout'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

// Interface pour les tâches récupérées depuis Supabase
interface Task {
  id: string
  name: string
  status: 'todo' | 'in_progress' | 'done'
  start_date: string | null
  due_date: string | null
}

// Fonction utilitaire pour convertir le statut en badge coloré
function StatusBadge({ status }: { status: Task['status'] }) {
  switch (status) {
    case 'done':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Terminé</span>
    case 'in_progress':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En cours</span>
    case 'todo':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">À faire</span>
    default:
      return null
  }
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projectId = params.id
  const navigation = adminNavigation
  const [projectName, setProjectName] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseClient()
      // Récupérer le projet pour obtenir son nom
      const { data: projectData } = await supabase.from('projects').select('name').eq('id', projectId).maybeSingle()
      setProjectName(projectData?.name || `Projet ${projectId}`)
      // Récupérer les tâches associées à ce projet
      const { data: taskData } = await supabase
        .from('project_tasks')
        .select('id, name, status, start_date, due_date')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })
      setTasks(taskData || [])
      setLoading(false)
    }
    fetchData()
  }, [projectId])

  return (
    <DashboardLayout title={`Détails du projet - ${projectName}`} navigation={navigation}>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">{projectName}</h2>
          {/* Lien pour ajouter une nouvelle tâche */}
          <a
            href={`/admin/projects/${projectId}/tasks/new`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Ajouter une tâche
          </a>
        </div>
        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tâche</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                    Chargement des tâches…
                  </td>
                </tr>
              )}
              {!loading && tasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                    Aucune tâche trouvée pour ce projet.
                  </td>
                </tr>
              )}
              {!loading &&
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {task.start_date ? new Date(task.start_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}