"use client"

import { useState, useMemo, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import DashboardLayout from '../../../components/ui/dashboard-layout'
// Import the centralized navigation so all admin pages share the same menu
import { adminNavigation } from '@/components/ui/admin-navigation'

// Keep the old navigation for reference. We now use the shared adminNavigation.
import {
  Users,
  Clock,
  BarChart3,
  Settings,
  Calendar,
  MapPin,
  MessageSquare,
  Award,
  Leaf,
  LifeBuoy,
} from 'lucide-react'

const oldNavigation = [
  { name: 'Tableau de bord', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Projets', href: '/admin/projects', icon: Calendar },
  { name: 'Carte temps réel', href: '/admin/map', icon: MapPin, badge: 'Live' },
  { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Wellness', href: '/admin/wellness', icon: Award },
  { name: 'Carbone', href: '/admin/carbon', icon: Leaf },
  { name: 'Rapports', href: '/admin/reports', icon: Clock },
  { name: 'Pointages', href: '/admin/pointages', icon: Clock },
  { name: 'Support', href: '/admin/tickets', icon: LifeBuoy },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
]

// Use the central navigation definition for consistency
const navigation = adminNavigation

// Type représentant une entrée de pointage. Dans une application réelle,
// ces données seraient récupérées depuis la base de données (table
// `time_entries`) et pourraient être mises à jour via une API.
interface TimeEntry {
  id: string
  employee: string
  project: string
  task: string
  start: string // ISO date string
  end: string // ISO date string
  /**
   * Heure de début du déplacement vers un autre chantier. Lorsqu'un
   * employé termine une tâche et se rend sur un autre site, ce champ
   * indique l'heure de départ du trajet. Laisser vide si aucun
   * déplacement n'est nécessaire.
   */
  travelStart?: string
  /**
   * Heure de fin du déplacement vers un autre chantier. Ce champ
   * correspond à l'arrivée sur le nouveau chantier. Laisser vide
   * s'il n'y a pas de déplacement.
   */
  travelEnd?: string
  status: 'completed' | 'pending' | 'in_progress'
}

export default function PointagesPage() {
  // Exemple de données de pointage. Remplacez ces entrées par les données
  // provenant de votre base de données Supabase ou autre back‑end.
  // Initialise les entrées de pointage à une liste vide.
  // Les pointages seront chargés depuis la base de données ou ajoutés
  // dynamiquement par l'administrateur via le pointage en direct.
  const initialEntries: TimeEntry[] = []

  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries)

  // Liste des employés chargés depuis la base de données. Chaque entrée
  // contient un identifiant et un nom. Cette liste est utilisée pour
  // alimenter les filtres et le pointage en direct.
  const [employeesList, setEmployeesList] = useState<{ id: string; name: string }[]>([])
  // Employé actuellement sélectionné pour le pointage en direct
  const [selectedClockEmployee, setSelectedClockEmployee] = useState('')

  // Charger les employés depuis Supabase lors du montage du composant.
  useEffect(() => {
    const supabase = getSupabaseClient()
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('profiles').select('id, full_name')
      if (!error) {
        setEmployeesList((data || []).map((p: any) => ({ id: p.id, name: p.full_name || '' })))
      } else {
        console.error('Erreur chargement employés:', error)
      }
    }
    fetchEmployees()
  }, [])

  // Liste des employés disponibles pour le filtre. On dérive cette liste à
  // partir des entrées initiales. Dans une application connectée à la
  // base, il vaudrait mieux récupérer la liste des employés depuis votre
  // base de données.
  // Noms des employés dérivés de la liste chargée depuis la base.  Si
  // employeesList est vide, on retourne une liste vide par défaut.
  const employees = useMemo(() => {
    return employeesList.map((e) => e.name)
  }, [employeesList])

  // Sélection de l'employé et de la période (jour, semaine, mois). Le
  // filtre permet d'afficher uniquement les entrées correspondant aux
  // critères choisis. Par défaut, on affiche tout (employé « Tous » et
  // période « mois »).
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [selectedRange, setSelectedRange] = useState<'day' | 'week' | 'month'>('month')

  // Filtre les entrées selon l'employé sélectionné et la période
  const filteredEntries = useMemo(() => {
    const now = new Date()
    return entries.filter((entry) => {
      // Filtre par employé si un employé est sélectionné
      if (selectedEmployee && entry.employee !== selectedEmployee) {
        return false
      }
      // Filtre par période
      const start = new Date(entry.start)
      const diffMs = now.getTime() - start.getTime()
      const diffDays = diffMs / (1000 * 60 * 60 * 24)
      switch (selectedRange) {
        case 'day':
          return diffDays <= 1
        case 'week':
          return diffDays <= 7
        case 'month':
        default:
          return diffDays <= 31
      }
    })
  }, [entries, selectedEmployee, selectedRange])

  // Calcul de la durée en heures et du temps de déplacement pour chaque
  // entrée filtrée. La durée de déplacement est calculée si les champs
  // travelStart et travelEnd sont remplis.
  const entriesWithDuration = useMemo(() => {
    return filteredEntries.map((entry) => {
      const startDate = new Date(entry.start)
      const endDate = new Date(entry.end)
      const durationMs = endDate.getTime() - startDate.getTime()
      const durationHours = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100
      let travelDuration = 0
      if (entry.travelStart && entry.travelEnd) {
        const travelStart = new Date(entry.travelStart)
        const travelEnd = new Date(entry.travelEnd)
        const travelMs = travelEnd.getTime() - travelStart.getTime()
        travelDuration = Math.round((travelMs / (1000 * 60 * 60)) * 100) / 100
      }
      return { ...entry, duration: durationHours, travelDuration }
    })
  }, [filteredEntries])

  // Gestion des modifications. Lorsqu’un champ est modifié (date de début, de
  // fin, projet, tâche ou statut), mettre à jour l’état local. Les valeurs
  // sont stockées en chaîne ISO pour simplifier l’exemple.
  const handleEntryChange = (id: string, field: keyof TimeEntry, value: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              [field]: value,
            }
          : entry,
      ),
    )
  }

  // Fonction appelée lorsqu’on souhaite sauvegarder les modifications. Ici,
  // nous n’avons pas d’API pour persister les données, donc nous nous
  // contentons d’afficher un message. Dans une vraie application, vous
  // appelleriez un service qui enregistre les nouvelles valeurs.
  const saveChanges = () => {
    console.log('Entrées sauvegardées :', entries)
    alert('Les modifications ont été enregistrées (simulation).')
  }

  // --- Gestion du chronomètre pour clock in/out ---
  const [isTiming, setIsTiming] = useState(false)
  const [startTimeClock, setStartTimeClock] = useState<Date | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)
  const [travelStartTime, setTravelStartTime] = useState<Date | null>(null)
  const [travelEndTime, setTravelEndTime] = useState<Date | null>(null)

  const handleClockIn = () => {
    if (isTiming) return
    const now = new Date()
    setStartTimeClock(now)
    setIsTiming(true)
    // Lancer un intervalle pour mettre à jour les secondes écoulées
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - now.getTime()) / 1000))
    }, 1000)
    setTimerId(interval)
  }

  const handleClockOut = () => {
    if (!isTiming) return
    if (timerId) clearInterval(timerId)
    setIsTiming(false)
    const end = new Date()
    // Calculer la durée totale et afficher ou enregistrer le pointage ici
    const durationSec = Math.floor((end.getTime() - (startTimeClock?.getTime() || end.getTime())) / 1000)
    alert(`Durée totale: ${Math.floor(durationSec / 3600)}h ${Math.floor((durationSec % 3600) / 60)}m`) 
    // Réinitialiser le chrono
    setElapsedSeconds(0)
    setStartTimeClock(null)
  }

  const handleTravelStart = () => {
    const now = new Date()
    setTravelStartTime(now)
    alert(`Début de déplacement à ${now.toLocaleTimeString()}`)
  }
  const handleTravelEnd = () => {
    const now = new Date()
    setTravelEndTime(now)
    if (travelStartTime) {
      const durationSec = Math.floor((now.getTime() - travelStartTime.getTime()) / 1000)
      alert(`Temps de déplacement: ${Math.floor(durationSec / 60)} min ${durationSec % 60} sec`)
    }
  }

  return (
    <DashboardLayout title="Pointages des employés" navigation={navigation}>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gestion des pointages</h2>
        <p className="text-sm text-gray-600 mb-6">
          Consultez, filtrez et corrigez les pointages des employés. Sélectionnez un employé et
          une période pour afficher les enregistrements pertinents.
        </p>
        {/*
          Section de pointage en direct
          Cette section permet de déclencher un chronomètre lors d'un "clock in" (démarrage)
          et de l'arrêter au "clock out". Les boutons "Début déplacement" et
          "Fin déplacement" permettent d'enregistrer les temps de déplacement. Le
          chronomètre affiche le temps écoulé en heures, minutes et secondes.
        */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Pointage en direct</h3>
          <div className="flex flex-wrap items-center space-x-4 space-y-2 md:space-y-0">
            {/* Sélection de l'employé pour le pointage en direct */}
            <div className="flex flex-col">
              <label htmlFor="clockEmployee" className="text-sm mb-1 text-gray-700">Employé</label>
              <select
                id="clockEmployee"
                value={selectedClockEmployee}
                onChange={(e) => setSelectedClockEmployee(e.target.value)}
                className="min-w-[160px] px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionner</option>
                {employeesList.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleClockIn}
              disabled={isTiming}
              className="px-3 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              Démarrer
            </button>
            <div className="text-sm font-mono">
              {isTiming
                ? `${String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0')}h ${String(
                    Math.floor((elapsedSeconds % 3600) / 60),
                  ).padStart(2, '0')}m ${String(elapsedSeconds % 60).padStart(2, '0')}s`
                : '00h 00m 00s'}
            </div>
            <button
              type="button"
              onClick={handleClockOut}
              disabled={!isTiming}
              className="px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
            >
              Arrêter
            </button>
            <button
              type="button"
              onClick={handleTravelStart}
              className="px-3 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
            >
              Début déplacement
            </button>
            <button
              type="button"
              onClick={handleTravelEnd}
              className="px-3 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
            >
              Fin déplacement
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-6">
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Tous</option>
              {employees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value as any)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="day">Jour</option>
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
          </div>
        </div>
        {/* Tableau des pointages */}
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tâche
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Début
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Début déplacement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin déplacement
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée tâche (h)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée déplacement (h)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entriesWithDuration.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {entry.employee}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="text"
                      value={entry.project}
                      onChange={(e) => handleEntryChange(entry.id, 'project', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="text"
                      value={entry.task}
                      onChange={(e) => handleEntryChange(entry.id, 'task', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="datetime-local"
                      value={entry.start.slice(0, 16)}
                      onChange={(e) => handleEntryChange(entry.id, 'start', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="datetime-local"
                      value={entry.end.slice(0, 16)}
                      onChange={(e) => handleEntryChange(entry.id, 'end', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="datetime-local"
                      value={entry.travelStart?.slice(0, 16) || ''}
                      onChange={(e) => handleEntryChange(entry.id, 'travelStart' as any, e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="datetime-local"
                      value={entry.travelEnd?.slice(0, 16) || ''}
                      onChange={(e) => handleEntryChange(entry.id, 'travelEnd' as any, e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                    {entry.duration.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                    {entry.travelDuration?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <select
                      value={entry.status}
                      onChange={(e) => handleEntryChange(entry.id, 'status', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="completed">Terminé</option>
                      <option value="in_progress">En cours</option>
                      <option value="pending">En attente</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}