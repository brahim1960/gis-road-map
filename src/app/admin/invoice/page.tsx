"use client"

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { useAuth } from '../../../hooks/useAuth'
import {
  Users,
  Clock,
  BarChart3,
  Settings,
  Calendar,
  MapPin,
  ChevronLeft,
  Check,
  X,
  MessageSquare,
  Award,
  Leaf,
  LifeBuoy,
} from 'lucide-react'

// Import the shared navigation so the invoice page uses the same menu as the
// rest of the admin portal. Without this import, the Chat, Wellness, Carbone
// and Support items may disappear when navigating to this page.
import { adminNavigation } from '@/components/ui/admin-navigation'

// Use the unified navigation constant
const navigation = adminNavigation

// Define all available options and their monthly price. Clients can toggle
// each option on or off to build their subscription. You can extend this
// array if new services are added later.
const ALL_OPTIONS = [
  { key: 'qrCode', label: 'QR / Code', price: 5 },
  { key: 'empreinte', label: 'Empreinte Digitale', price: 8 },
  { key: 'reconnaissance', label: 'Reconnaissance Faciale', price: 10 },
  { key: 'nfc', label: 'NFC', price: 4 },
  { key: 'geoloc', label: 'Géolocalisation', price: 6 },
  { key: 'chat', label: 'Chat', price: 3 },
  { key: 'wellness', label: 'Wellness', price: 7 },
  { key: 'analytics', label: 'Analytics', price: 9 },
] as const

// Define a type representing the keys of all options
type OptionKey = typeof ALL_OPTIONS[number]['key']

// Structure representing client data. In a real application, this would
// come from your database. For now, we simulate a few clients with
// pre‑selected options.
interface ClientData {
  id: string
  name: string
  options: Record<OptionKey, boolean>
}

export default function InvoicePage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client') || ''

  // Simulated client list. Replace this with a query to your database.
  const initialClients: ClientData[] = [
    {
      id: 'c1',
      name: 'Client Alpha',
      options: {
        qrCode: true,
        empreinte: true,
        reconnaissance: false,
        nfc: true,
        geoloc: true,
        chat: true,
        wellness: false,
        analytics: true,
      },
    },
    {
      id: 'c2',
      name: 'Client Beta',
      options: {
        qrCode: true,
        empreinte: false,
        reconnaissance: false,
        nfc: true,
        geoloc: false,
        chat: true,
        wellness: true,
        analytics: false,
      },
    },
    {
      id: 'c3',
      name: 'Client Gamma',
      options: {
        qrCode: true,
        empreinte: true,
        reconnaissance: true,
        nfc: false,
        geoloc: true,
        chat: false,
        wellness: true,
        analytics: true,
      },
    },
  ]

  const [clients, setClients] = useState(initialClients)

  // Find the currently selected client based on the query parameter
  const selectedClient = clients.find((c) => c.id === clientId)

  /**
   * Fields for client‑specific settings. These values allow each client to
   * customize their VAT (TVA) rate, weekly working hours, overtime multiplier
   * and any additional tax deductions. When integrating with Supabase or
   * another back‑end, these values should be loaded and saved per client.
   */
  const [taxRate, setTaxRate] = useState(0.2) // TVA (20 % par défaut)
  const [weeklyHours, setWeeklyHours] = useState(35) // heures/semaine
  const [overtimeRate, setOvertimeRate] = useState(1.5) // majoration heures sup.
  const [deductions, setDeductions] = useState<{ name: string; amount: number }[]>([])

  // Toggle a service option for the current client
  const toggleOption = (optionKey: OptionKey) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              options: { ...c.options, [optionKey]: !c.options[optionKey] },
            }
          : c,
      ),
    )
  }

  // Compute invoice items based on selected options for the current client
  const invoiceItems = useMemo(() => {
    if (!selectedClient) return []
    return ALL_OPTIONS.filter((opt) => selectedClient.options[opt.key]).map((opt) => ({
      description: opt.label,
      quantity: 1,
      unitPrice: opt.price,
      totalPrice: opt.price,
    }))
  }, [selectedClient])

  // Compute the subtotal of selected services
  const subtotal = invoiceItems.reduce((acc, item) => acc + item.totalPrice, 0)
  // Compute tax amount based on the VAT rate configured by the client
  const taxAmount = subtotal * taxRate
  // Compute total deductions entered by the client
  const totalDeductions = deductions.reduce((acc, d) => acc + d.amount, 0)
  // Compute the grand total: subtotal + tax – deductions
  const total = subtotal + taxAmount - totalDeductions

  // Handler to update a deduction’s name or amount
  const handleDeductionChange = (index: number, field: 'name' | 'amount', value: string) => {
    setDeductions((prev) =>
      prev.map((d, i) =>
        i === index
          ? { ...d, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
          : d,
      ),
    )
  }

  // Add a new empty deduction line
  const addDeduction = () => {
    setDeductions((prev) => [...prev, { name: '', amount: 0 }])
  }

  // Remove a deduction line
  const removeDeduction = (index: number) => {
    setDeductions((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <DashboardLayout title={`Facturation client`} navigation={navigation}>
      <div className="mt-8">
        {selectedClient ? (
          <>
            <div className="flex items-center mb-6">
              <button
                onClick={() => history.back()}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mr-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Retour
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">{selectedClient.name}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Section Options */}
              <div className="bg-white shadow-sm rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Options et services</h3>
                  <p className="text-sm text-gray-500">
                    Activez ou désactivez les services pour mettre à jour la facturation
                  </p>
                </div>
                <div className="p-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Option
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarif (€)
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Active
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ALL_OPTIONS.map((opt) => (
                        <tr key={opt.key} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {opt.label}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                            {opt.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                            <button
                              onClick={() => toggleOption(opt.key)}
                              className="focus:outline-none"
                            >
                              {selectedClient.options[opt.key] ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mx-auto" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section Paramètres personnalisés et facture */}
              <div className="bg-white shadow-sm rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Paramètres et facture</h3>
                  <p className="text-sm text-gray-500">
                    Configurez votre TVA, vos heures hebdomadaires, les majorations et
                    les retenues fiscales pour calculer une facture détaillée.
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Formulaire de paramètres client */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        TVA (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={taxRate * 100}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Heures par semaine
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Majoration heures sup. (×)
                      </label>
                        <input
                        type="number"
                        min={1}
                        step={0.1}
                        value={overtimeRate}
                        onChange={(e) => setOvertimeRate(parseFloat(e.target.value) || 1)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                  </div>

                  {/* Deductions (retenues fiscales) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prélèvements ou déductions (facultatif)
                    </label>
                    {deductions.map((ded, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={ded.name}
                          onChange={(e) => handleDeductionChange(idx, 'name', e.target.value)}
                          placeholder="Nom"
                          className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={ded.amount}
                          onChange={(e) => handleDeductionChange(idx, 'amount', e.target.value)}
                          placeholder="Montant (€)"
                          className="w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                          onClick={() => removeDeduction(idx)}
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addDeduction}
                      className="mt-1 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ajouter une déduction
                    </button>
                  </div>

                  {/* Facture détaillée */}
                  <div>
                    {invoiceItems.length === 0 ? (
                      <p className="text-sm text-gray-500">Aucune option sélectionnée.</p>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantité
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prix unitaire (€)
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total (€)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {invoiceItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                              <td className="px-4 py-3 text-center text-sm">{item.quantity}</td>
                              <td className="px-4 py-3 text-center text-sm">{item.unitPrice.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right text-sm">{item.totalPrice.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                              Sous-total
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                              {subtotal.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                              TVA ({(taxRate * 100).toFixed(2)}%)
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                              {taxAmount.toFixed(2)}
                            </td>
                          </tr>
                          {deductions.map((ded, idx) => (
                            <tr key={idx}>
                              <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                - {ded.name || 'Déduction'}
                              </td>
                              <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                -{ded.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-right text-base font-semibold text-gray-900">
                              Total
                            </td>
                            <td className="px-4 py-3 text-right text-base font-semibold text-gray-900">
                              {total.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    <div className="mt-6">
                      <button
                        onClick={() => alert('Paramètres et facture mis à jour !')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white shadow-sm rounded-lg p-8">
            <p className="text-gray-700">Aucun client correspondant trouvé.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}