"use client"
import { adminNavigation } from '@/components/ui/admin-navigation'

import { useState } from 'react'
import DashboardLayout from '../../../../components/ui/dashboard-layout'
import { useAuth } from '../../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import {
  Users,
  Clock,
  BarChart3,
  Settings,
  Calendar,
  MapPin,
  LifeBuoy,
  ArrowLeft
} from 'lucide-react'

// Navigation for the ticket creation page
const navigation = adminNavigation

export default function NewTicketPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [client, setClient] = useState('Client Alpha')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, nous enverrions le ticket vers une API ou la BDD
    alert('Ticket créé !')
    router.push('/admin/tickets')
  }

  return (
    <DashboardLayout title="Nouveau ticket" navigation={navigation}>
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-800 flex items-center mr-3 text-sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Ouvrir un ticket de support</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Client Alpha">Client Alpha</option>
                <option value="Client Beta">Client Beta</option>
                <option value="Client Gamma">Client Gamma</option>
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Envoyer le ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}