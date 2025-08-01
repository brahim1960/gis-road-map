// pro2/src/app/admin/analytics/page.tsx
'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { 
  Briefcase, Users, Clock, BarChart, BrainCircuit, 
  ShieldCheck, ShieldAlert, Zap, TrendingUp 
} from 'lucide-react'
import { 
  BarChart as RechartsBarChart, 
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts'

// Types de données complets avec gestion des valeurs nulles
type AnalyticsData = {
  basicStats: {
    projects: number
    clients: number
    employees: number
  }
  projects: Array<{
    id: string
    name: string
    budget: number | null
    start_date: string | null
    end_date: string | null
    progress: number | null
  }>
  timeEntries: Array<{
    hours: number | null
    project_id: string
  }>
  wellnessMetrics: Array<{
    stress_level: number | null
    hours_worked: number | null
  }>
}

// Modèle d'analyse prédictive
const calculateProjectHealth = (project: AnalyticsData['projects'][0], totalHours: number) => {
  const defaults = { score: 100, reason: "Excellent" }
  
  if (!project.start_date || !project.end_date || !project.progress) {
    return defaults
  }

  let score = 100
  let reason = "Excellent"
  const today = new Date()
  const endDate = new Date(project.end_date)
  const startDate = new Date(project.start_date)

  // Vérification du budget (taux horaire estimé à 50€)
  if (project.budget && totalHours * 50 > project.budget) {
    score -= 30
    reason = "Dépassement budgétaire"
  }

  // Vérification du délai
  if (today > endDate && project.progress < 100) {
    score -= 40
    reason = "En retard"
  }

  // Vérification de la progression
  const projectDuration = endDate.getTime() - startDate.getTime()
  const elapsedDuration = today.getTime() - startDate.getTime()
  const expectedProgress = (elapsedDuration / projectDuration) * 100
  
  if (project.progress < expectedProgress * 0.8) {
    score -= 20
    reason = "Progression lente"
  }

  return {
    score: Math.max(0, Math.min(score, 100)),
    reason
  }
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  status = 'neutral',
  subtext 
}: { 
  title: string
  value: string
  icon: React.ElementType
  status?: 'good' | 'bad' | 'neutral'
  subtext?: string
}) => {
  const statusColors = {
    good: 'text-green-600 bg-green-50',
    bad: 'text-red-600 bg-red-50',
    neutral: 'text-indigo-600 bg-indigo-50'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex items-start">
      <div className={`flex-shrink-0 rounded-md p-2 ${statusColors[status]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    basicStats: { projects: 0, clients: 0, employees: 0 },
    projects: [],
    timeEntries: [],
    wellnessMetrics: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseClient()
        
        const [
          { count: projects, error: projectsError },
          { count: clients, error: clientsError },
          { count: employees, error: employeesError },
          { data: projectsData, error: projectsDataError },
          { data: timeEntries, error: timeEntriesError },
          { data: wellnessData, error: wellnessError }
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('clients').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('id, name, budget, start_date, end_date, progress'),
          supabase.from('time_entries').select('hours, project_id'),
          supabase.from('wellness_metrics').select('stress_level, hours_worked')
        ])

        // Gestion centralisée des erreurs
        const errors = [
          projectsError, clientsError, employeesError,
          projectsDataError, timeEntriesError, wellnessError
        ].filter(Boolean)

        if (errors.length > 0) {
          throw new Error(errors.map(e => e?.message).join(' | '))
        }

        setData({
          basicStats: {
            projects: projects || 0,
            clients: clients || 0,
            employees: employees || 0
          },
          projects: projectsData || [],
          timeEntries: timeEntries || [],
          wellnessMetrics: wellnessData || []
        })

      } catch (err) {
        console.error("Erreur de chargement:", err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calcul des métriques avancées
  const projectHealthData = data.projects
    .map(project => {
      const totalHours = data.timeEntries
        .filter(entry => entry.project_id === project.id && entry.hours)
        .reduce((sum, entry) => sum + (entry.hours || 0), 0)
      
      return {
        ...calculateProjectHealth(project, totalHours),
        name: project.name || 'Projet sans nom',
        id: project.id
      }
    })
    .sort((a, b) => a.score - b.score)

  const wellnessDataPoints = data.wellnessMetrics
    .filter(m => m.stress_level !== null && m.hours_worked !== null)
    .map((m, i) => ({
      x: m.hours_worked || 0,
      y: m.stress_level || 0,
      id: i
    }))

  // Statistiques synthétiques
  const healthyProjects = projectHealthData.filter(p => p.score >= 70).length
  const riskyProjects = projectHealthData.filter(p => p.score < 50).length
  const avgStress = data.wellnessMetrics.length > 0
    ? (data.wellnessMetrics.reduce((sum, m) => sum + (m.stress_level || 0), 0) / data.wellnessMetrics.length
    : 0

  if (error) {
    return (
      <DashboardLayout title="Analytique" navigation={adminNavigation}>
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800">Erreur de chargement</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Analytique" navigation={adminNavigation}>
      <div className="mt-8 space-y-8">
        {/* Statistiques de base */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu général</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard 
              title="Projets" 
              value={data.basicStats.projects.toString()} 
              icon={Briefcase} 
            />
            <StatCard 
              title="Clients" 
              value={data.basicStats.clients.toString()} 
              icon={Users} 
            />
            <StatCard 
              title="Employés" 
              value={data.basicStats.employees.toString()} 
              icon={Clock} 
            />
          </div>
        </section>

        {/* Analyses avancées */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Analyses IA</h2>
            <div className="flex items-center text-sm text-indigo-600">
              <BrainCircuit className="h-4 w-4 mr-1" />
              <span>Prédictif</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
            <StatCard 
              title="Projets sains" 
              value={healthyProjects.toString()} 
              icon={ShieldCheck} 
              status="good"
              subtext={`sur ${data.projects.length}`}
            />
            <StatCard 
              title="Projets à risque" 
              value={riskyProjects.toString()} 
              icon={ShieldAlert} 
              status="bad"
            />
            <StatCard 
              title="Stress moyen" 
              value={avgStress.toFixed(1)} 
              icon={Zap} 
              subtext="/10"
            />
          </div>

          {/* Graphique de santé des projets */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
              Santé des projets
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={projectHealthData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={120} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Score']}
                    labelFormatter={(name) => `Projet: ${name}`}
                  />
                  <Bar 
                    dataKey="score" 
                    name="Score de santé" 
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graphique bien-être */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Bien-être vs Heures travaillées
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Heures"
                    label={{ value: 'Heures travaillées', position: 'insideBottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Stress"
                    label={{ value: 'Niveau de stress', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'x' ? `${value}h` : `${value}/10`,
                      name === 'x' ? 'Heures' : 'Stress'
                    ]}
                  />
                  <Scatter 
                    name="Employés" 
                    data={wellnessDataPoints} 
                    fill="#6366f1"
                    opacity={0.6}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}