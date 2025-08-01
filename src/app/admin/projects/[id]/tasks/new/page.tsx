"use client"

// Page de création d'une tâche pour un projet donné. Ce formulaire permet
// d'ajouter une tâche dans la table `project_tasks` de Supabase en précisant
// un nom, une description, des dates et un statut. Après enregistrement,
// l'utilisateur est redirigé vers la page de détails du projet où la liste
// des tâches est affichée.

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

interface Params {
  params: { id: string }
}

export default function CreateTaskPage({ params }: Params) {
  const router = useRouter()
  const projectId = params.id

  // Champs de formulaire pour la tâche
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo')
  const [priority, setPriority] = useState(3)
  const [estimatedHours, setEstimatedHours] = useState('')
  const [actualHours, setActualHours] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Liste des employés disponibles pour l'assignation
  const [employees, setEmployees] = useState<Array<{ id: string; full_name: string }>>([])
  // Identifiants des employés sélectionnés pour cette tâche
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState<string[]>([])

  const navigation = adminNavigation

  // Charger les employés au chargement initial
  useEffect(() => {
    async function fetchEmployees() {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'employee')
        .order('full_name', { ascending: true })
      if (!error && data) {
        setEmployees(data as any)
      }
    }
    fetchEmployees()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    const supabase = getSupabaseClient()
    try {
      const { data: taskData, error } = await supabase.from('project_tasks').insert({
        project_id: projectId,
        name,
        description: description || null,
        status,
        priority,
        estimated_hours: estimatedHours === '' ? null : parseFloat(estimatedHours),
        actual_hours: actualHours === '' ? null : parseFloat(actualHours),
        start_date: startDate || null,
        due_date: endDate || null,
        created_by: null,
      }).select('id').single()
      if (error) {
        console.error('Erreur lors de la création de la tâche:', error)
        alert('Erreur lors de la création de la tâche')
        return
      }
      const taskId = taskData?.id
      // Assigner les employés sélectionnés à la tâche via la table task_assignments
      if (taskId && assignedEmployeeIds.length > 0) {
        const assignments = assignedEmployeeIds.map((empId) => ({
          task_id: taskId,
          user_id: empId,
          role: 'member',
          assigned_by: null,
        }))
        const { error: assignError } = await supabase.from('task_assignments').insert(assignments)
        if (assignError) {
          console.error('Erreur lors de l’assignation des employés :', assignError)
          alert('Tâche créée, mais erreur lors de l’assignation des employés')
        }
      }
      alert('Tâche créée avec succès')
      router.push(`/admin/projects/${projectId}`)
    } catch (err) {
      console.error('Erreur inattendue lors de la création de la tâche:', err)
      alert('Une erreur inattendue est survenue')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout title="Ajouter une tâche" navigation={navigation}>
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Créer une nouvelle tâche</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la tâche
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optionnelle)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="todo">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="done">Terminé</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priorité (1=Haute, 5=Basse)
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {[1, 2, 3, 4, 5].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Heures estimées
                </label>
                <input
                  id="estimatedHours"
                  type="number"
                  step="0.1"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="actualHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Heures réelles
                </label>
                <input
                  id="actualHours"
                  type="number"
                  step="0.1"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Assignation des employés */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigner des employés</label>
              {employees.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun employé disponible.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {employees.map((emp) => (
                    <label key={emp.id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        value={emp.id}
                        checked={assignedEmployeeIds.includes(emp.id)}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setAssignedEmployeeIds((prev) => {
                            if (checked) {
                              return [...prev, emp.id]
                            } else {
                              return prev.filter((id) => id !== emp.id)
                            }
                          })
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span>{emp.full_name || emp.id}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Enregistrement...' : 'Créer la tâche'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}