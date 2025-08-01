"use client"
import { adminNavigation } from '@/components/ui/admin-navigation'

import { useState } from 'react'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { useAuth } from '../../../hooks/useAuth'
import {
  Users,
  Clock,
  BarChart3,
  Settings,
  Calendar,
  MapPin,
  LifeBuoy,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Définition d'un ticket de support
interface Ticket {
  id: string
  client: string
  subject: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
}

// Navigation de l'admin incluant l'onglet Support
const navigation = adminNavigation

export default function TicketsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Ticket['status']>('all')

  // Tickets simulés
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 't1', client: 'Client Alpha', subject: 'Problème de connexion', status: 'open', created_at: '2025-01-21 09:30' },
    { id: 't2', client: 'Client Beta', subject: 'Erreur export PDF', status: 'in_progress', created_at: '2025-01-20 14:15' },
    { id: 't3', client: 'Client Gamma', subject: 'Mauvaise géolocalisation', status: 'resolved', created_at: '2025-01-19 11:50' },
    { id: 't4', client: 'Client Alpha', subject: 'Bug sur la page Projets', status: 'closed', created_at: '2025-01-18 17:05' },
  ])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Ouvert</span>
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En cours</span>
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Résolu</span>
      case 'closed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Fermé</span>
      default:
        return null
    }
  }

  return (
    <DashboardLayout title="Support & Tickets" navigation={navigation}>
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Tickets de support</h2>
          <div className="mt-3 sm:mt-0 flex space-x-2">
            <button
              onClick={() => router.push('/admin/tickets/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau ticket
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouverts</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolus</option>
              <option value="closed">Fermés</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(ticket.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {ticket.status === 'open' && (
                        <button
                          onClick={() => alert('Prendre en charge le ticket')}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Prendre en charge"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      {(ticket.status === 'in_progress' || ticket.status === 'open') && (
                        <button
                          onClick={() => alert('Marquer comme résolu')}
                          className="text-green-600 hover:text-green-900"
                          title="Résoudre"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {ticket.status !== 'closed' && (
                        <button
                          onClick={() => alert('Fermer le ticket')}
                          className="text-gray-600 hover:text-gray-900"
                          title="Fermer"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun ticket correspondant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}