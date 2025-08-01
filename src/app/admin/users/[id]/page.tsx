"use client"
import { adminNavigation } from '@/components/ui/admin-navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../../../components/ui/dashboard-layout'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAuth } from '../../../../hooks/useAuth'
import {
  Users,
  Clock,
  BarChart3,
  Settings,
  Calendar,
  MapPin,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react'


const navigation = adminNavigation
interface UserPermissions {
  manageSubscription: boolean
  manageOptions: boolean
  manageEmployees: boolean
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { user } = useAuth()
  const router = useRouter()

  // Simulate loading user data from an API based on id
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'employee' | 'client'>('employee')
  const [department, setDepartment] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [hireDate, setHireDate] = useState('')
  // Stocker le taux horaire sous forme de chaîne afin d'éviter les avertissements "NaN" dans les
  // champs d'entrée. La conversion en nombre se fera au moment de la soumission.
  const [hourlyRate, setHourlyRate] = useState('')
  const [phone, setPhone] = useState('')
  const [permissions, setPermissions] = useState<UserPermissions>({
    manageSubscription: false,
    manageOptions: false,
    manageEmployees: false,
  })

  // Adresse et coordonnées du profil ou du client
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    // Fetch existing user details from Supabase based on the ID in the URL.
    const fetchUser = async () => {
      const supabase = getSupabaseClient()
      // Try to fetch from profiles (employees/admins)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      if (profileError) {
        console.warn('Profil non trouvé dans profiles, vérification dans clients...')
      }
      if (profile) {
        setFullName(profile.full_name || '')
        setEmail(profile.email)
        setRole(profile.role)
        setDepartment(profile.department_id || '')
        setJobTitle(profile.job_title || '')
        setHireDate(profile.hire_date || '')
        setHourlyRate(profile.hourly_rate ? String(profile.hourly_rate) : '')
        setPhone(profile.phone || '')
        setAddress(profile.address || '')
        setLatitude(profile.latitude ? String(profile.latitude) : '')
        setLongitude(profile.longitude ? String(profile.longitude) : '')
        // Permissions par défaut pour les employés/administrateurs
        setPermissions({
          manageSubscription: profile.role === 'admin',
          manageOptions: profile.role === 'admin',
          manageEmployees: profile.role === 'admin',
        })
        return
      }
      // If not found in profiles, look in clients
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()
      if (clientError) {
        console.error('Erreur lors du chargement du client:', clientError)
        return
      }
      if (client) {
        setFullName(client.name || '')
        setEmail(client.email || '')
        setRole('client')
        setDepartment(client.company || '')
        setJobTitle(client.contact_person || '')
        setHireDate(client.created_at || '')
        setHourlyRate(client.hourly_rate ? String(client.hourly_rate) : '')
        setPhone(client.phone || '')
        setAddress(client.address || '')
        setLatitude(client.latitude ? String(client.latitude) : '')
        setLongitude(client.longitude ? String(client.longitude) : '')
        // Les clients n'ont pas de permissions de gestion interne
        setPermissions({
          manageSubscription: false,
          manageOptions: false,
          manageEmployees: false,
        })
      }
    }
    fetchUser()
  }, [id])

  const handlePermissionToggle = (key: keyof UserPermissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would update the user in the database
    alert('Utilisateur mis à jour !')
    router.push('/admin/users')
  }

  return (
    <DashboardLayout title={`Modifier l'utilisateur`} navigation={navigation}>
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="text-indigo-600 hover:text-indigo-800 flex items-center mr-3 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Modifier utilisateur</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="admin">Administrateur</option>
                <option value="employee">Employé</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Poste
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'embauche
                </label>
                <input
                  id="hireDate"
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Taux horaire (€)
                </label>
              <input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => {
                    // Conserver la saisie en tant que chaîne pour éviter les valeurs NaN.
                    setHourlyRate(e.target.value)
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Adresse et coordonnées */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rue, ville..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  id="latitude"
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="ex: 48.8566"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  id="longitude"
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="ex: 2.3522"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            {/* Permissions Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Permissions</h3>
              <p className="text-sm text-gray-500 mb-4">Définissez les actions que cet utilisateur peut effectuer sur la plateforme.</p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.manageSubscription}
                    onChange={() => handlePermissionToggle('manageSubscription')}
                    className="mr-2"
                  />
                  Gérer les abonnements et la facturation des clients
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.manageOptions}
                    onChange={() => handlePermissionToggle('manageOptions')}
                    className="mr-2"
                  />
                  Gérer les options (QR Code, empreinte, etc.)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.manageEmployees}
                    onChange={() => handlePermissionToggle('manageEmployees')}
                    className="mr-2"
                  />
                  Ajouter ou supprimer des employés
                </label>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}