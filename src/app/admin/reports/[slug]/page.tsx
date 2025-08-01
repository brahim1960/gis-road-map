"use client"

// Page générique pour afficher un rapport spécifique. Les données ne sont pas
// encore implémentées ; cette page affiche un message indiquant que le
// rapport est en construction. Elle peut être étendue pour interroger
// Supabase et afficher des agrégats selon le type de rapport (slug).

"use client"

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'

export default function ReportDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const titles: Record<string, string> = {
    'projects': 'Rapport des projets',
    'projects-by-client': 'Rapport projets par client',
    'hours-by-project': 'Rapport heures par projet',
    'timesheets': 'Rapport feuilles de temps',
    'timesheets-by-task': 'Rapport feuilles de temps par tâche',
    'timesheets-by-function': 'Rapport feuilles de temps par fonction',
    'daily': 'Rapport journalier',
    'payroll': 'Rapport de paie',
  }
  const title = titles[slug] || 'Rapport'

  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    async function fetchReport() {
      const supabase = getSupabaseClient()
      setLoading(true)
      let data: any[] = []
      switch (slug) {
        case 'projects': {
          const { data: d, error } = await supabase.from('projects').select('name, status, start_date, end_date, progress')
          if (!error && d) data = d
          break
        }
        case 'projects-by-client': {
          // Supabase JS ne supporte pas group() directement; on regroupe côté client
          const { data: d, error } = await supabase
            .from('projects')
            .select('client_id')
          if (!error && d) {
            const map: Record<string, number> = {}
            d.forEach((row: any) => {
              const id = row.client_id || 'none'
              map[id] = (map[id] || 0) + 1
            })
            data = Object.entries(map).map(([client_id, total_projects]) => ({ client_id, total_projects }))
          }
          break
        }
        case 'hours-by-project': {
          const { data: d, error } = await supabase
            .from('time_entries')
            .select('project_id, duration')
          if (!error && d) {
            const map: Record<string, number> = {}
            d.forEach((row: any) => {
              if (row.project_id) {
                map[row.project_id] = (map[row.project_id] || 0) + (row.duration || 0)
              }
            })
            data = Object.entries(map).map(([project_id, total_hours]) => ({ project_id, total_hours }))
          }
          break
        }
        case 'timesheets-by-task': {
          const { data: d, error } = await supabase
            .from('time_entries')
            .select('task_id, duration')
          if (!error && d) {
            const map: Record<string, number> = {}
            d.forEach((row: any) => {
              if (row.task_id) {
                map[row.task_id] = (map[row.task_id] || 0) + (row.duration || 0)
              }
            })
            data = Object.entries(map).map(([task_id, total_hours]) => ({ task_id, total_hours }))
          }
          break
        }
        case 'daily': {
          const { data: d, error } = await supabase
            .from('time_entries')
            .select('*')
            .gte('start_time', new Date().toISOString().split('T')[0])
            .lte('start_time', new Date().toISOString().split('T')[0] + 'T23:59:59')
          if (!error && d) data = d
          break
        }
        case 'payroll': {
          // Obtenir toutes les entrées approuvées avec le taux horaire du profil
          const { data: d, error } = await supabase
            .from('time_entries')
            .select('user_id, duration, profiles:profiles!inner(id,hourly_rate)')
            .eq('status', 'approved')
          if (!error && d) {
            const map: Record<string, number> = {}
            d.forEach((row: any) => {
              const rate = row.profiles?.hourly_rate || 0
              const pay = (row.duration / 60.0) * rate
              map[row.user_id] = (map[row.user_id] || 0) + pay
            })
            data = Object.entries(map).map(([user_id, total_pay]) => ({ user_id, total_pay }))
          }
          break
        }
        default:
          data = []
      }
      setRows(data || [])
      setLoading(false)
    }
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return (
    <DashboardLayout title={title} navigation={adminNavigation}>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
        {loading ? (
          <p className="text-gray-500">Chargement en cours…</p>
        ) : rows.length === 0 ? (
          <p className="text-gray-500">Aucune donnée trouvée.</p>
        ) : (
          <pre className="text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(rows, null, 2)}</pre>
        )}
      </div>
    </DashboardLayout>
  )
}