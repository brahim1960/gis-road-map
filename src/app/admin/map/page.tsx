'use client'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { getSupabaseClient } from '../../../lib/supabase/client'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { 
  Users, 
  Clock, 
  BarChart3, 
  Settings,
  MapPin,
  Calendar,
  Navigation,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Eye,
  Activity,
  MessageSquare,
  Award,
  Leaf,
  LifeBuoy,
} from 'lucide-react'

// Import Leaflet components and styles
import dynamic from 'next/dynamic'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false }) as any
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false }) as any
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false }) as any
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false }) as any
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'

const navigation = adminNavigation

interface Employee {
  id: string
  name: string
  position: { lat: number; lng: number }
  status: 'working' | 'break' | 'offline'
  project: string
  lastUpdate: string
  accuracy: number
  location: string
}

interface Project {
  id: string
  name: string
  position: { lat: number; lng: number }
  status: 'active' | 'completed' | 'on_hold'
  employeeCount: number
  address: string
  end_date: string
  progress: number
}

interface Client {
  id: string
  name: string
  position: { lat: number; lng: number }
  address: string
  city: string
  sector: string
}

export default function MapPage() {
  const { user } = useAuth()
  const supabase = getSupabaseClient()
  
  // View mode and filters
  const [viewMode, setViewMode] = useState<'employees' | 'projects' | 'clients'>('employees')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [employeeFilter, setEmployeeFilter] = useState('present')
  const [projectFilter, setProjectFilter] = useState('inprogress')
  const [clientCityFilter, setClientCityFilter] = useState('')
  const [clientSectorFilter, setClientSectorFilter] = useState('')
  
  // Data stores
  const [allEmployees, setAllEmployees] = useState<Employee[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [allClients, setAllClients] = useState<Client[]>([])
  const [clientCities, setClientCities] = useState<string[]>([])
  const [clientSectors, setClientSectors] = useState<string[]>([])

  // Selected items
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Data fetching
  const fetchData = async () => {
    setIsRefreshing(true)
    try {
      // Fetch employees with their locations
      const { data: employeesData, error: employeesError } = await supabase
        .from('profiles')
        .select(`
          id, 
          full_name, 
          status, 
          employee_locations!inner(
            position,
            location,
            last_update,
            accuracy
          )
        `)
        .eq('role', 'employee')
      
      if (employeesError) throw employeesError
      
      const processedEmployees = employeesData
        .filter((p: any) => p.employee_locations !== null)
        .map((p: any) => ({
          id: p.id,
          name: p.full_name,
          status: p.status,
          position: p.employee_locations.position,
          location: p.employee_locations.location || 'N/A',
          lastUpdate: new Date(p.employee_locations.last_update).toLocaleString(),
          accuracy: p.employee_locations.accuracy || 0,
          project: 'Projet non spécifié' // Default value
        }))
      
      setAllEmployees(processedEmployees)

      // Fetch projects with their locations
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          address,
          city,
          postal_code,
          country,
          latitude,
          longitude,
          end_date,
          progress,
          project_employees(count)
        `)
      
      if (projectsError) throw projectsError
      
      const processedProjects = projectsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        position: { 
          lat: p.latitude || 0, 
          lng: p.longitude || 0 
        },
        address: [p.address, p.city, p.postal_code, p.country].filter(Boolean).join(', '),
        employeeCount: p.project_employees[0]?.count || 0,
        end_date: p.end_date,
        progress: p.progress
      }))
      
      setAllProjects(processedProjects)

      // Fetch clients with their locations
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          id,
          name,
          address,
          city,
          sector,
          latitude,
          longitude
        `)
      
      if (clientsError) throw clientsError
      
      const processedClients = clientsData.map((c: any) => ({
        id: c.id,
        name: c.name,
        position: { 
          lat: c.latitude || 0, 
          lng: c.longitude || 0 
        },
        address: c.address,
        city: c.city,
        sector: c.sector
      }))
      
      setAllClients(processedClients)
      
      // Set filter options
      const uniqueCities = [...new Set(clientsData.map((c: any) => c.city).filter(Boolean)] as string[]
      const uniqueSectors = [...new Set(clientsData.map((c: any) => c.sector).filter(Boolean)] as string[]
      
      setClientCities(uniqueCities)
      setClientSectors(uniqueSectors)

    } catch (error) {
      console.error('Error fetching map data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if(user) fetchData()
  }, [user])

  // Filtering logic
  const filteredEmployees = allEmployees.filter(e => {
    if (employeeFilter === 'present') return e.status === 'working'
    if (employeeFilter === 'late') {
      // Implement late employee logic if needed
      return e.status === 'working'
    }
    if (employeeFilter === 'absent') return e.status === 'offline'
    if (employeeFilter === 'leave') return e.status === 'break'
    return true
  })
  
  const filteredProjects = allProjects.filter(p => {
    const isLate = new Date() > new Date(p.end_date) && p.progress < 100
    return projectFilter === 'late' ? isLate : !isLate
  })

  const filteredClients = allClients.filter(c => {
    const cityMatch = clientCityFilter ? c.city === clientCityFilter : true
    const sectorMatch = clientSectorFilter ? c.sector === clientSectorFilter : true
    return cityMatch && sectorMatch
  })

  const getDisplayData = () => {
    switch(viewMode) {
      case 'employees': return filteredEmployees
      case 'projects': return filteredProjects
      case 'clients': return filteredClients
      default: return []
    }
  }
  const displayData = getDisplayData()

  const getMapCenter = (): [number, number] => {
    if (displayData.length === 0) return [48.8566, 2.3522] // Default to Paris
    
    const validItems = displayData.filter(item => 
      item.position && 
      typeof item.position.lat === 'number' && 
      typeof item.position.lng === 'number'
    )
    
    if (validItems.length === 0) return [48.8566, 2.3522]
    
    const avgLat = validItems.reduce((sum, item) => sum + item.position.lat, 0) / validItems.length
    const avgLng = validItems.reduce((sum, item) => sum + item.position.lng, 0) / validItems.length
    return [avgLat, avgLng]
  }

  // Helper functions
  const getEmployeeStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-500'
      case 'break': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'on_hold': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'working': return 'En travail'
      case 'break': return 'En pause'
      case 'offline': return 'Hors ligne'
      case 'active': return 'Actif'
      case 'completed': return 'Terminé'
      case 'on_hold': return 'En attente'
      default: return status
    }
  }

  const getClientColor = () => 'bg-purple-500'

  return (
    <DashboardLayout title="Carte Temps Réel" navigation={navigation}>
      <div className="mt-8">
        {/* Controls */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-medium text-gray-900">Localisation en temps réel</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Live</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('employees')}
                    className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'employees'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Employés
                  </button>
                  <button
                    onClick={() => setViewMode('projects')}
                    className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'projects'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Projets
                  </button>
                  <button
                    onClick={() => setViewMode('clients')}
                    className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'clients'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Clients
                  </button>
                </div>

                {viewMode === 'employees' && (
                  <select 
                    value={employeeFilter} 
                    onChange={(e) => setEmployeeFilter(e.target.value)} 
                    className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none"
                  >
                    <option value="present">Présents</option>
                    <option value="late">En retard</option>
                    <option value="absent">Absents</option>
                    <option value="leave">En congé</option>
                  </select>
                )}
                {viewMode === 'projects' && (
                  <select 
                    value={projectFilter} 
                    onChange={(e) => setProjectFilter(e.target.value)} 
                    className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none"
                  >
                    <option value="inprogress">En cours</option>
                    <option value="late">En retard</option>
                  </select>
                )}
                {viewMode === 'clients' && (
                  <>
                    <select 
                      value={clientCityFilter} 
                      onChange={(e) => setClientCityFilter(e.target.value)} 
                      className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none"
                    >
                      <option value="">Toutes les villes</option>
                      {clientCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <select 
                      value={clientSectorFilter} 
                      onChange={(e) => setClientSectorFilter(e.target.value)} 
                      className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none"
                    >
                      <option value="">Tous les secteurs</option>
                      {clientSectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
                    </select>
                  </>
                )}
                <button 
                  onClick={fetchData} 
                  disabled={isRefreshing} 
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {viewMode === 'employees' && (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      En travail: {filteredEmployees.filter(e => e.status === 'working').length}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      En pause: {filteredEmployees.filter(e => e.status === 'break').length}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Hors ligne: {filteredEmployees.filter(e => e.status === 'offline').length}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Total: {filteredEmployees.length} employés
                    </span>
                  </div>
                </>
              )}
              {viewMode === 'projects' && (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Actifs: {filteredProjects.filter(p => p.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Terminés: {filteredProjects.filter(p => p.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      En attente: {filteredProjects.filter(p => p.status === 'on_hold').length}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Total: {filteredProjects.length} projets
                    </span>
                  </div>
                </>
              )}
              {viewMode === 'clients' && (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Total clients: {filteredClients.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Map and List View */}
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 h-[600px] w-full relative z-0 px-6 pb-6">
              <MapContainer 
                center={getMapCenter()} 
                zoom={13} 
                scrollWheelZoom={true} 
                className="h-full w-full rounded-lg overflow-hidden shadow-sm"
              >
                <TileLayer 
                  attribution="&copy; OpenStreetMap contributors" 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />
                {viewMode === 'employees' && filteredEmployees.map(employee => (
                  <Marker key={employee.id} position={[employee.position.lat, employee.position.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <strong>{employee.name}</strong><br />
                        Statut: {getStatusLabel(employee.status)}<br />
                        {employee.location}<br />
                        Dernière MAJ: {employee.lastUpdate}
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {viewMode === 'projects' && filteredProjects.map(project => (
                  <Marker key={project.id} position={[project.position.lat, project.position.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <strong>{project.name}</strong><br />
                        {project.address}<br />
                        {project.employeeCount} employés<br />
                        Statut: {getStatusLabel(project.status)}
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {viewMode === 'clients' && filteredClients.map(client => (
                  <Marker key={client.id} position={[client.position.lat, client.position.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <strong>{client.name}</strong><br />
                        {client.address}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Side Panel for Lists */}
            <div className="lg:col-span-1 border-l border-gray-200 overflow-y-auto h-[600px]">
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-4">
                  {viewMode === 'employees' && 'Employés en temps réel'}
                  {viewMode === 'projects' && 'Projets en temps réel'}
                  {viewMode === 'clients' && 'Clients'}
                </h4>
                <div className="divide-y divide-gray-200 max-h-[540px] overflow-y-auto">
                  {viewMode === 'employees' && filteredEmployees.map(employee => (
                    <div
                      key={employee.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedEmployee?.id === employee.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setSelectedProject(null)
                        setSelectedClient(null)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getEmployeeStatusColor(employee.status)}`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.project}</p>
                            <p className="text-xs text-gray-400">{employee.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{employee.lastUpdate}</p>
                          <p className="text-xs text-gray-400">±{employee.accuracy}m</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {viewMode === 'projects' && filteredProjects.map(project => (
                    <div
                      key={project.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedProject?.id === project.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => {
                        setSelectedProject(project)
                        setSelectedEmployee(null)
                        setSelectedClient(null)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getProjectStatusColor(project.status)}`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{project.name}</p>
                            <p className="text-xs text-gray-500">{project.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{project.employeeCount} employés</p>
                          <p className="text-xs text-gray-400">{getStatusLabel(project.status)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {viewMode === 'clients' && filteredClients.map(client => (
                    <div
                      key={client.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedClient?.id === client.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => {
                        setSelectedClient(client)
                        setSelectedEmployee(null)
                        setSelectedProject(null)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getClientColor()}`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{client.name}</p>
                            <p className="text-xs text-gray-500">{client.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {displayData.length === 0 && (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">
                      Aucun résultat pour ces filtres
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Item Details */}
        {(selectedEmployee || selectedProject || selectedClient) && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Détails</h4>
            {selectedEmployee && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getEmployeeStatusColor(selectedEmployee.status)}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
                    <p className="text-sm text-gray-500">{getStatusLabel(selectedEmployee.status)}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Projet:</strong> {selectedEmployee.project}</p>
                  <p><strong>Localisation:</strong> {selectedEmployee.location}</p>
                  <p><strong>Dernière MAJ:</strong> {selectedEmployee.lastUpdate}</p>
                  <p><strong>Précision:</strong> ±{selectedEmployee.accuracy}m</p>
                </div>
              </div>
            )}
            {selectedProject && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getProjectStatusColor(selectedProject.status)}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedProject.name}</p>
                    <p className="text-sm text-gray-500">{getStatusLabel(selectedProject.status)}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Employés:</strong> {selectedProject.employeeCount}</p>
                  <p><strong>Adresse:</strong> {selectedProject.address}</p>
                  <p><strong>Date de fin:</strong> {new Date(selectedProject.end_date).toLocaleDateString()}</p>
                  <p><strong>Progression:</strong> {selectedProject.progress}%</p>
                </div>
              </div>
            )}
            {selectedClient && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getClientColor()}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedClient.name}</p>
                    <p className="text-sm text-gray-500">Client</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Adresse:</strong> {selectedClient.address}</p>
                  {selectedClient.city && <p><strong>Ville:</strong> {selectedClient.city}</p>}
                  {selectedClient.sector && <p><strong>Secteur:</strong> {selectedClient.sector}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}