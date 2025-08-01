// pro2/src/app/admin/analytics/page.tsx
'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { 
  BarChart, BrainCircuit, TrendingUp, ShieldCheck, ShieldAlert, Zap,
  Briefcase, Users, Clock
} from 'lucide-react'
import { 
  BarChart as RechartsBarChart, 
  ScatterChart, 
  Scatter, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

// Interfaces for all data types
interface Project {
  id: string
  name: string
  budget: number
  start_date: string
  end_date: string
  progress: number
}

interface TimeEntry {
  hours: number
  project_id: string
}

interface WellnessMetric {
  stress_level: number
  hours_worked: number
}

interface BasicStats {
  projects: number
  clients: number
  employees: number
}

// AI Analytics Helper Functions
const calculateProjectHealth = (project: Project, totalHours: number): { score: number; reason: string } => {
  let score = 100
  let reason = "Excellent"
  
  // Budget check (assuming hourly rate of 50)
  const cost = totalHours * 50;
  if (project.budget > 0 && cost > project.budget) {
    score -= 30
    reason = "Budget dépassé"
  }

  // Schedule check
  const today = new Date()
  const endDate = new Date(project.end_date)
  if (today > endDate && project.progress < 100) {
    score -= 40
    reason = "En retard"
  }

  // Progress check
  const startDate = new Date(project.start_date)
  const projectDuration = endDate.getTime() - startDate.getTime()
  const elapsedDuration = today.getTime() - startDate.getTime()
  if (projectDuration > 0) {
      const expectedProgress = Math.min((elapsedDuration / projectDuration) * 100, 100)
      if (project.progress < expectedProgress * 0.8) {
          score -= 20
          reason = "Progression lente"
      }
  }

  return { score: Math.max(0, score), reason }
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  status,
  subtext 
}: { 
  title: string, 
  value: string, 
  icon: React.ElementType, 
  status?: 'good' | 'bad' | 'neutral',
  subtext?: string
}) => {
  const statusColor = status === 'good' ? 'text-green-600' : 
                     status === 'bad' ? 'text-red-600' : 
                     'text-indigo-600'
  return (
    <div className="bg-white shadow-sm rounded-lg p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
          <Icon className={`h-6 w-6 ${statusColor}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className={`text-2xl font-semibold ${statusColor}`}>{value}</dd>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [basicStats, setBasicStats] = useState<BasicStats>({ projects: 0, clients: 0, employees: 0 })
  const [projects, setProjects] = useState<Project[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetric[]>([])

  useEffect(() => {
    const fetchAllData = async () => {
      const supabase = getSupabaseClient()
      setLoading(true)
      
      try {
        const [
          { count: projectCount }, 
          { count: clientCount }, 
          { count: employeeCount },
          projectsRes, 
          timeEntriesRes, 
          wellnessRes
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('clients').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('id, name, budget, start_date, end_date, progress'),
          supabase.from('time_entries').select('hours, project_id'),
          supabase.from('wellness_metrics').select('stress_level, hours_worked')
        ])

        setBasicStats({
          projects: projectCount || 0,
          clients: clientCount || 0,
          employees: employeeCount || 0
        })

        if (projectsRes.data) setProjects(projectsRes.data)
        if (timeEntriesRes.data) setTimeEntries(timeEntriesRes.data)
        if (wellnessRes.data) setWellnessMetrics(wellnessRes.data)

      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Process data for charts and stats
  const projectHealthData = projects.map(p => {
    const projectHours = timeEntries.filter(t => t.project_id === p.id).reduce((sum, t) => sum + t.hours, 0)
    const { score, reason } = calculateProjectHealth(p, projectHours)
    return { name: p.name, score, reason }
  }).sort((a,b) => a.score - b.score)

  const wellnessProductivityData = wellnessMetrics.map((m, i) => ({
    x: m.hours_worked,
    y: m.stress_level,
    z: i,
  }))

  const healthyProjectsCount = projectHealthData.filter(p => p.score >= 80).length
  const atRiskProjectsCount = projectHealthData.filter(p => p.score < 50).length
  const avgStressLevel = wellnessMetrics.length > 0 
    ? (wellnessMetrics.reduce((a, b) => a + b.stress_level, 0) / wellnessMetrics.length).toFixed(1)
    : "0.0"

  return (
    <DashboardLayout title="Analytique" navigation={adminNavigation}>
      <div className="mt-8 space-y-8">
        {/* Basic Stats Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Aperçu Général</h2>
          <p className="text-sm text-gray-500 mt-1">
            Statistiques de base sur votre organisation
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Projets Actifs" 
            value={basicStats.projects.toString()} 
            icon={Briefcase} 
          />
          <StatCard 
            title="Clients" 
            value={basicStats.clients.toString()} 
            icon={Users} 
          />
          <StatCard 
            title="Employés" 
            value={basicStats.employees.toString()} 
            icon={Clock} 
          />
        </div>

        {/* AI Analytics Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <BrainCircuit className="h-6 w-6 mr-2 text-indigo-600"/>
            Intelligence Artificielle
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Analyses prédictives et indicateurs avancés
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Projets en Bonne Santé" 
            value={healthyProjectsCount.toString()} 
            icon={ShieldCheck} 
            status="good" 
            subtext={`sur ${projects.length} projets`}
          />
          <StatCard 
            title="Projets à Risque" 
            value={atRiskProjectsCount.toString()} 
            icon={ShieldAlert} 
            status="bad" 
            subtext="Nécessitent une attention"
          />
          <StatCard 
            title="Stress Moyen" 
            value={`${avgStressLevel}/10`} 
            icon={Zap} 
            status="neutral" 
            subtext={`basé sur ${wellnessMetrics.length} échantillons`}
          />
        </div>

        {/* Project Health Chart */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg flex items-center font-medium text-gray-900 mb-4">
            <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
            Santé des Projets
          </h3>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <RechartsBarChart data={projectHealthData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} label={{ value: 'Score (%)', position: 'insideBottom' }} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}%`, 
                    `Raison: ${props.payload.reason}`
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="score" 
                  name="Score de santé" 
                  fill="#818cf8" 
                  radius={[0, 4, 4, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Wellness vs Productivity Chart */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg flex items-center font-medium text-gray-900 mb-4">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
            Bien-être vs Productivité
          </h3>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Heures travaillées" 
                  unit="h" 
                  label={{ value: 'Heures travaillées (h)', position: 'insideBottom' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Niveau de stress" 
                  unit="/10" 
                  label={{ value: 'Niveau de stress (/10)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="Employés" 
                  data={wellnessProductivityData} 
                  fill="#4f46e5" 
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}