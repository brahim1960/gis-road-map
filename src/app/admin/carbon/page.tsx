// pro2/src/app/admin/carbon/page.tsx
'use client'

import { adminNavigation } from '@/components/ui/admin-navigation'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { useAuth } from '../../../hooks/useAuth'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Leaf, BarChart, Car, Bicycle, TramFront } from 'lucide-react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CarbonMetric {
  id: string
  date: string
  transport_mode: string
  commute_distance_km: number
  business_travel_km: number
  co2_emitted_kg: number
  co2_saved_kg: number
  profile: {
    full_name: string
  } | null
}

const StatCard = ({ 
  title, 
  value, 
  subtext, 
  icon: Icon 
}: { 
  title: string, 
  value: string, 
  subtext?: string, 
  icon: React.ElementType 
}) => (
  <div className="bg-white shadow-sm rounded-lg p-5">
    <div className="flex items-center">
      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
        <Icon className="h-6 w-6 text-green-600" />
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
          </dd>
        </dl>
      </div>
    </div>
  </div>
)

export default function CarbonPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<CarbonMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    const fetchCarbonData = async () => {
      setLoading(true)
      try {
        const { data, error } = await getSupabaseClient()
          .from('carbon_footprint_tracking')
          .select(`
            *,
            profile:profiles(full_name)
          `)
          .order('date', { ascending: false })
          .limit(100)

        if (error) throw error
        
        setMetrics(data || [])
        setHasData(data && data.length > 0)
      } catch (err: any) {
        setError(err.message)
        console.error("Erreur de chargement:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCarbonData()
  }, [])

  // Calcul des statistiques
  const stats = {
    emitted: metrics.reduce((acc, m) => acc + m.co2_emitted_kg, 0),
    saved: metrics.reduce((acc, m) => acc + m.co2_saved_kg, 0),
    distance: metrics.reduce((acc, m) => acc + m.commute_distance_km + m.business_travel_km, 0)
  }

  // Préparation des données pour le graphique
  const chartData = Object.entries(
    metrics.reduce((acc, m) => {
      const mode = m.transport_mode || 'Inconnu'
      acc[mode] = (acc[mode] || 0) + m.co2_emitted_kg
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name,
    "CO₂ Émis (kg)": parseFloat(value.toFixed(2))
  }))

  return (
    <DashboardLayout title="Empreinte Carbone" navigation={adminNavigation}>
      <div className="mt-8 space-y-8">
        {!hasData && !loading && (
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              <Leaf className="inline mr-2" />
              Empreinte Carbone
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Aucune donnée d'empreinte carbone disponible. Configurez le suivi carbone pour commencer.
            </p>
          </div>
        )}

        {hasData && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard 
                title="CO₂ Émis Total" 
                value={`${stats.emitted.toFixed(2)} kg`} 
                icon={Car} 
              />
              <StatCard 
                title="CO₂ Économisé" 
                value={`${stats.saved.toFixed(2)} kg`}
                subtext="Grâce au télétravail"
                icon={Leaf} 
              />
              <StatCard 
                title="Distance Totale" 
                value={`${stats.distance.toFixed(2)} km`} 
                icon={TramFront} 
              />
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                <BarChart className="mr-2 text-indigo-600" />
                Répartition par Mode de Transport
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} kg`, "Émissions"]} />
                    <Legend />
                    <Bar dataKey="CO₂ Émis (kg)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails des Enregistrements
                </h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transport</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance (km)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CO₂ Émis (kg)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Économisé (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {metrics.map((metric) => (
                        <tr key={metric.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {metric.profile?.full_name || 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(metric.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {metric.transport_mode}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {(metric.commute_distance_km + metric.business_travel_km).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {metric.co2_emitted_kg.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">
                            {metric.co2_saved_kg.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}