'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAuth } from '../../../../hooks/useAuth'
import DashboardLayout from '../../../../components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import {
  Users,
  Clock,
  BarChart3,
  Settings,
  Calendar,
  MapPin,
  Plus,
  ArrowLeft
} from 'lucide-react'

// Dynamic imports for Leaflet (client-side only)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false })

export default function NewProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Form states
  const [name, setName] = useState('')
  const [clientId, setClientId] = useState('')
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([])
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [workStart, setWorkStart] = useState('08:00')
  const [workEnd, setWorkEnd] = useState('17:00')
  const [category, setCategory] = useState('')
  
  // Location states
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [radius, setRadius] = useState(100)
  const [mapPosition, setMapPosition] = useState({ lat: 48.8566, lng: 2.3522 })

  // Financial states
  const [currency, setCurrency] = useState('EUR')
  const [contracts, setContracts] = useState<Array<{ id: string; description: string; amount: number | '' }>>([
    { id: crypto.randomUUID(), description: '', amount: '' },
  ])
  const [materials, setMaterials] = useState<Array<{ id: string; description: string; cost: number | '' }>>([
    { id: crypto.randomUUID(), description: '', cost: '' },
  ])

  // Management states
  const [internalManager, setInternalManager] = useState('')
  const [externalManager, setExternalManager] = useState('')
  const [roundToQuarterHour, setRoundToQuarterHour] = useState(false)
  const [enableLimitHours, setEnableLimitHours] = useState(false)
  const [limitStart, setLimitStart] = useState('08:00')
  const [limitEnd, setLimitEnd] = useState('17:00')

  // Calculated totals
  const contractTotal = contracts.reduce((sum, item) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0)
  const materialsTotal = materials.reduce((sum, item) => sum + (typeof item.cost === 'number' ? item.cost : 0), 0)

  // Load Leaflet CSS
  useEffect(() => {
    import('leaflet/dist/leaflet.css')
    import('leaflet-defaulticon-compatibility')
    import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css')
  }, [])

  // Refactored project creation function
  const createProject = async () => {
    const supabase = getSupabaseClient()
    const details = {
      workStart,
      workEnd,
      contracts,
      materials,
      roundToQuarterHour,
      enableLimitHours,
      limitStart,
      limitEnd,
      internalManager,
      externalManager,
    }

    const projectData = {
      name,
      client_id: clientId || null,
      description: description || null,
      category: category || null,
      start_date: startDate || null,
      end_date: endDate || null,
      budget: contractTotal !== 0 ? contractTotal : null,
      hourly_rate: null,
      is_billable: true,
      color: '#3B82F6',
      progress: 0,
      location: address || null,
      address: address || null,
      city: city || null,
      postal_code: postalCode || null,
      country: country || null,
      latitude: latitude !== '' ? parseFloat(latitude) : null,
      longitude: longitude !== '' ? parseFloat(longitude) : null,
      geofence_radius: radius,
      created_by: user?.id || null,
      notes: details,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()

    if (error) {
      console.error('Error creating project:', error)
      alert(`Erreur lors de la création du projet: ${error.message}`)
      return null
    }
    return data ? data[0] : null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newProject = await createProject()
    if (newProject) {
      alert('Projet créé !')
      router.push('/admin/projects')
    }
  }

  const handleSubmitAndGoToTask = async () => {
    const newProject = await createProject()
    if (newProject?.id) {
      alert('Projet créé. Vous allez être redirigé vers la création de tâches.')
      router.push(`/admin/projects/${newProject.id}/tasks/new`)
    } else {
      console.error("Failed to get new project ID, cannot redirect to task creation.")
    }
  }

  // Load clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name', { ascending: true })
      
      if (error) {
        console.error('Erreur lors du chargement des clients:', error)
        return
      }
      
      setClients(data || [])
      if (data?.length) setClientId(data[0].id)
    }
    fetchClients()
  }, [])

  // Contract rows management
  const addContractRow = () => {
    setContracts(prev => [...prev, { id: crypto.randomUUID(), description: '', amount: '' }])
  }

  const updateContractRow = (id: string, field: 'description' | 'amount', value: string) => {
    setContracts(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              [field]: field === 'amount' ? (value === '' ? '' : parseFloat(value)) : value,
            }
          : row
      )
    )
  }

  const removeContractRow = (id: string) => {
    setContracts(prev => prev.filter(row => row.id !== id))
  }

  // Material rows management
  const addMaterialRow = () => {
    setMaterials(prev => [...prev, { id: crypto.randomUUID(), description: '', cost: '' }])
  }

  const updateMaterialRow = (id: string, field: 'description' | 'cost', value: string) => {
    setMaterials(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              [field]: field === 'cost' ? (value === '' ? '' : parseFloat(value)) : value,
            }
          : row
      )
    )
  }

  const removeMaterialRow = (id: string) => {
    setMaterials(prev => prev.filter(row => row.id !== id))
  }

  // Geocoding function
  const geocodeAddress = async () => {
    const queryParts = [
      address?.trim(),
      city?.trim(),
      postalCode?.trim(),
      country?.trim()
    ].filter(Boolean)
    
    if (!queryParts.length) return
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryParts.join(', '))}`
      )
      const results = await response.json()
      
      if (Array.isArray(results) && results.length) {
        const { lat, lon } = results[0]
        const latNum = parseFloat(lat)
        const lonNum = parseFloat(lon)
        setLatitude(latNum.toString())
        setLongitude(lonNum.toString())
        setMapPosition({ lat: latNum, lng: lonNum })
      } else {
        alert('Aucune adresse trouvée. Essayez d'être plus précis.')
      }
    } catch (error) {
      console.error('Erreur lors du géocodage:', error)
      alert('Erreur lors de la recherche d'adresse')
    }
  }

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng
    setLatitude(lat.toFixed(6))
    setLongitude(lng.toFixed(6))
    setMapPosition({ lat, lng })
  }

  return (
    <DashboardLayout title="Nouveau projet" navigation={adminNavigation}>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project form */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => router.back()} 
              className="text-indigo-600 hover:text-indigo-800 flex items-center mr-3 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Créer un nouveau projet</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic project info */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du projet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Client selection */}
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                id="client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {clients.length === 0 && <option>Aucun client</option>}
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Category and description */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Construction, Maintenance"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Address section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="proj_address" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  id="proj_address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Rue de Paris"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="proj_city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  id="proj_city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Paris"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="proj_postal" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  id="proj_postal"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="75000"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="proj_country" className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  id="proj_country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="France"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Dates and working hours */}
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
                  required
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
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="workStart" className="block text-sm font-medium text-gray-700 mb-1">
                  Heure début de travail (par défaut)
                </label>
                <input
                  id="workStart"
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="workEnd" className="block text-sm font-medium text-gray-700 mb-1">
                  Heure fin de travail (par défaut)
                </label>
                <input
                  id="workEnd"
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Contracts section */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-900 mb-2">Contrats du projet</h3>
              {contracts.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-7">
                    <input
                      type="text"
                      placeholder={`Description ${index + 1}`}
                      value={item.description}
                      onChange={(e) => updateContractRow(item.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Montant"
                      value={item.amount as any}
                      onChange={(e) => updateContractRow(item.id, 'amount', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => removeContractRow(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                    {index === contracts.length - 1 && (
                      <button
                        type="button"
                        onClick={addContractRow}
                        className="text-green-600 hover:text-green-800 text-sm"
                        title="Ajouter un contrat"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-600">Total contrats: {contractTotal.toFixed(2)} {currency}</p>
            </div>

            {/* Materials section */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-900 mb-2">Matériaux</h3>
              {materials.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-7">
                    <input
                      type="text"
                      placeholder={`Description ${index + 1}`}
                      value={item.description}
                      onChange={(e) => updateMaterialRow(item.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Coût"
                      value={item.cost as any}
                      onChange={(e) => updateMaterialRow(item.id, 'cost', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => removeMaterialRow(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                    {index === materials.length - 1 && (
                      <button
                        type="button"
                        onClick={addMaterialRow}
                        className="text-green-600 hover:text-green-800 text-sm"
                        title="Ajouter un matériau"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-600">Total matériaux: {materialsTotal.toFixed(2)} {currency}</p>
            </div>

            {/* Managers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label htmlFor="internalManager" className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable interne
                </label>
                <input
                  id="internalManager"
                  type="text"
                  value={internalManager}
                  onChange={(e) => setInternalManager(e.target.value)}
                  placeholder="Nom du responsable interne"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="externalManager" className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable externe
                </label>
                <input
                  id="externalManager"
                  type="text"
                  value={externalManager}
                  onChange={(e) => setExternalManager(e.target.value)}
                  placeholder="Nom du responsable externe"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Time options */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <input
                  id="roundToQuarterHour"
                  type="checkbox"
                  checked={roundToQuarterHour}
                  onChange={(e) => setRoundToQuarterHour(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="roundToQuarterHour" className="ml-2 block text-sm text-gray-700">
                  Arrondir les pointages au quart d'heure
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="enableLimitHours"
                  type="checkbox"
                  checked={enableLimitHours}
                  onChange={(e) => setEnableLimitHours(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="enableLimitHours" className="ml-2 block text-sm text-gray-700">
                  Limiter les heures de travail quotidiennes
                </label>
              </div>
              
              {enableLimitHours && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="limitStart" className="block text-sm font-medium text-gray-700 mb-1">
                      Heure de début autorisée
                    </label>
                    <input
                      id="limitStart"
                      type="time"
                      value={limitStart}
                      onChange={(e) => setLimitStart(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="limitEnd" className="block text-sm font-medium text-gray-700 mb-1">
                      Heure de fin autorisée
                    </label>
                    <input
                      id="limitEnd"
                      type="time"
                      value={limitEnd}
                      onChange={(e) => setLimitEnd(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Currency selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar américain (USD)</option>
                <option value="CAD">Dollar canadien (CAD)</option>
                <option value="GBP">Livre sterling (GBP)</option>
                <option value="MAD">Dirham marocain (MAD)</option>
                <option value="AED">Dirham des Émirats (AED)</option>
                <option value="TRY">Livre turque (TRY)</option>
              </select>
            </div>

            {/* Form actions */}
            <div className="mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(new Event('submit') as any)}
                className="inline-flex justify-center items-center px-4 py-2 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Enregistrer et nouveau
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSubmit(new Event('submit') as any)
                  router.push('/admin/users')
                }}
                className="inline-flex justify-center items-center px-4 py-2 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Enregistrer et assigner
              </button>
              <button
                type="button"
                onClick={handleSubmitAndGoToTask}
                className="inline-flex justify-center items-center px-4 py-2 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Enregistrer et créer tâche
              </button>
            </div>
          </form>
        </div>

        {/* Map section */}
        <div className="bg-white shadow-sm rounded-lg p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation du projet</h3>
          <div className="space-y-4">
            {/* Address search */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse du projet
              </label>
              <div className="flex space-x-2">
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Rue de Paris, Ville..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={geocodeAddress}
                  className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                >
                  Rechercher
                </button>
              </div>
            </div>

            {/* City, postal code, country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Paris"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="75000"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="France"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="text"
                  value={latitude}
                  onChange={(e) => {
                    setLatitude(e.target.value)
                    const latNum = parseFloat(e.target.value)
                    if (!isNaN(latNum)) setMapPosition(pos => ({ ...pos, lat: latNum }))
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="text"
                  value={longitude}
                  onChange={(e) => {
                    setLongitude(e.target.value)
                    const lonNum = parseFloat(e.target.value)
                    if (!isNaN(lonNum)) setMapPosition(pos => ({ ...pos, lng: lonNum }))
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                  Rayon (m)
                </label>
                <input
                  id="radius"
                  type="number"
                  min="0"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value || '0'))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Interactive map */}
            <div className="h-64 w-full">
              {MapContainer && (
                <MapContainer
                  center={mapPosition}
                  zoom={13}
                  scrollWheelZoom
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={(map: any) => map.setView(mapPosition)}
                  onClick={handleMapClick}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker position={mapPosition} />
                  <Circle 
                    center={mapPosition} 
                    radius={radius} 
                    pathOptions={{ color: 'indigo', fillOpacity: 0.1 }} 
                  />
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}