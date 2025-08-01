"use client"

import { useEffect, useState } from 'react'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { getSupabaseClient } from '../../../lib/supabase/client'
import { useAuth } from '../../../hooks/useAuth'
import { Crown, Zap, LifeBuoy, MessageSquare, Leaf, BarChart3 } from 'lucide-react'

// --- Types and Constants ---
const PREMIUM_FEATURES = [
  { id: 'chat', name: 'Chat', icon: MessageSquare },
  { id: 'wellness', name: 'Bien-être', icon: LifeBuoy },
  { id: 'analytics_ia', name: 'Analytics IA', icon: Zap },
  { id: 'carbon', name: 'Empreinte Carbone', icon: Leaf },
  // Add other premium features here
];

interface Client {
  id: string;
  name: string;
  features: Record<string, boolean>;
}

export default function SubscriptionsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  // --- Data Fetching ---
  useEffect(() => {
    const fetchClientsAndFeatures = async () => {
      const supabase = getSupabaseClient()
      setLoading(true)

      // 1. Fetch all clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name')
      
      if (clientsError) {
        console.error("Error fetching clients:", clientsError)
        setLoading(false)
        return
      }

      // 2. Fetch all existing feature flags
      const { data: featuresData, error: featuresError } = await supabase
        .from('client_features')
        .select('client_id, feature_name, is_enabled')

      if (featuresError) {
        console.error("Error fetching features:", featuresError)
        // Continue without features if it fails
      }

      // 3. Combine the data
      const clientsWithFeatures = clientsData.map(client => {
        const clientFeatures: Record<string, boolean> = {};
        PREMIUM_FEATURES.forEach(feature => {
          const featureRecord = featuresData?.find(f => f.client_id === client.id && f.feature_name === feature.id);
          clientFeatures[feature.id] = featureRecord ? featureRecord.is_enabled : false;
        });
        return { ...client, features: clientFeatures };
      });

      setClients(clientsWithFeatures)
      setLoading(false)
    }

    if (user?.role === 'super_admin') {
      fetchClientsAndFeatures()
    }
  }, [user])

  // --- Event Handlers ---
  const handleFeatureToggle = async (clientId: string, featureName: string) => {
    const supabase = getSupabaseClient()
    
    // Optimistically update the UI
    const originalClients = clients;
    const updatedClients = clients.map(c => {
      if (c.id === clientId) {
        return { ...c, features: { ...c.features, [featureName]: !c.features[featureName] } };
      }
      return c;
    });
    setClients(updatedClients);

    // Perform the upsert operation in the database
    const { error } = await supabase
      .from('client_features')
      .upsert(
        { client_id: clientId, feature_name: featureName, is_enabled: !originalClients.find(c=>c.id === clientId)!.features[featureName] },
        { onConflict: 'client_id,feature_name' }
      );

    if (error) {
      console.error("Error updating feature flag:", error);
      // Revert UI on error
      setClients(originalClients);
      alert("Erreur lors de la mise à jour de la fonctionnalité.");
    }
  };

  if (user?.role !== 'super_admin') {
      return (
          <DashboardLayout title="Accès non autorisé" navigation={adminNavigation}>
              <div className="p-6 bg-white shadow-sm rounded-lg">
                  <p>Vous n'avez pas les permissions nécessaires pour voir cette page.</p>
              </div>
          </DashboardLayout>
      )
  }

  return (
    <DashboardLayout title="Gestion des Abonnements Clients" navigation={adminNavigation}>
      <div className="mt-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Crown className="h-6 w-6 mr-2 text-indigo-600" />
              Activer les Fonctionnalités Premium
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cochez les cases pour activer les services payants pour chaque client.
            </p>
          </div>
          
          {loading ? (
            <p className="p-6 text-center">Chargement des clients...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    {PREMIUM_FEATURES.map(feature => (
                      <th key={feature.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{feature.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                      {PREMIUM_FEATURES.map(feature => (
                        <td key={feature.id} className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={client.features[feature.id] || false}
                            onChange={() => handleFeatureToggle(client.id, feature.id)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
