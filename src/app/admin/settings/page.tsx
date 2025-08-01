'use client'
import { adminNavigation } from '@/components/ui/admin-navigation'

import { useState } from 'react'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { 
  Users, Clock, BarChart3, Settings, MapPin, Calendar,
  Save, Bell, Shield, Globe, Palette, Database
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Locale } from '@/lib/i18n'

const navigation = adminNavigation

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'TempsZenith Pro',
    workingHours: 35,
    // Heures de début et de fin de la journée de travail par défaut
    workStartTime: '08:00',
    workEndTime: '17:00',
    overtimeRate: 1.5,
    currency: 'EUR',
    timezone: 'Europe/Paris',
    emailNotifications: true,
    pushNotifications: true,
    locationTracking: true,
    biometricAuth: false,
  })

  // Liste des devises disponibles. Cette liste pourrait être chargée via l'API
  // Supabase (table settings) ou depuis un fichier JSON. Pour simplifier,
  // elle est définie ici statiquement.
  // Liste élargie des devises pour couvrir davantage de régions. Vous pouvez
  // étendre cette liste à tout moment ou la charger depuis la base de données.
  const currencyOptions = [
    'EUR', // Euro
    'USD', // Dollar américain
    'CAD', // Dollar canadien
    'GBP', // Livre sterling
    'MAD', // Dirham marocain
    'AED', // Dirham émirati
    'SAR', // Riyal saoudien
    'DZD', // Dinar algérien
    'TND', // Dinar tunisien
    'EGP', // Livre égyptienne
    'QAR', // Riyal qatarien
    'TRY', // Livre turque
    'CHF', // Franc suisse
    'JPY', // Yen japonais
    'CNY', // Yuan renminbi
    'INR', // Roupie indienne
    'BRL', // Real brésilien
    'ZAR', // Rand sud-africain
    'AUD', // Dollar australien
    'NZD', // Dollar néo-zélandais
    'SEK', // Couronne suédoise
    'NOK', // Couronne norvégienne
  ]

  // Langue courante et setter depuis le contexte
  const { locale, setLocale } = useLanguage()

  const handleSave = () => {
    // Logique de sauvegarde
    alert('Paramètres sauvegardés !')
  }

  return (
    <DashboardLayout title="Paramètres" navigation={navigation}>
      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* General Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Paramètres Généraux</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heures hebdomadaires
                    </label>
                    <input
                      type="number"
                      value={settings.workingHours}
                      onChange={(e) => setSettings({...settings, workingHours: parseInt(e.target.value)})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taux heures sup.
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.overtimeRate}
                      onChange={(e) => setSettings({...settings, overtimeRate: parseFloat(e.target.value)})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

            {/* Tranches horaires de travail configurables */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de début (journée de travail)
                </label>
                <input
                  type="time"
                  value={settings.workStartTime}
                  onChange={(e) => setSettings({...settings, workStartTime: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fin (journée de travail)
                </label>
                <input
                  type="time"
                  value={settings.workEndTime}
                  onChange={(e) => setSettings({...settings, workEndTime: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Devise
                    </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {currencyOptions.map((cur) => (
                          <option key={cur} value={cur}>{cur}</option>
                        ))}
                      </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Europe/Paris">Paris (GMT+1)</option>
                      <option value="Europe/London">Londres (GMT)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                    </select>
                  </div>
                    {/* Sélecteur de langue */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Langue de l’interface
                      </label>
                      <select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as Locale)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                        <option value="ar">العربية</option>
                        <option value="tr">Türkçe</option>
                        <option value="it">Italiano</option>
                        <option value="pt">Português</option>
                        <option value="nl">Nederlands</option>
                        <option value="zh">中文</option>
                      </select>
                    </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notifications Email</h4>
                    <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notifications Push</h4>
                    <p className="text-sm text-gray-500">Notifications sur mobile</p>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, pushNotifications: !settings.pushNotifications})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.pushNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Suivi de localisation</h4>
                    <p className="text-sm text-gray-500">Activer la géolocalisation</p>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, locationTracking: !settings.locationTracking})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.locationTracking ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.locationTracking ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Authentification biométrique</h4>
                    <p className="text-sm text-gray-500">Empreinte et reconnaissance faciale</p>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, biometricAuth: !settings.biometricAuth})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.biometricAuth ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.biometricAuth ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  <Database className="h-4 w-4 mr-2" />
                  Backup DB
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  <Palette className="h-4 w-4 mr-2" />
                  Thème
                </button>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Système</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span>2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Base de données:</span>
                  <span>PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilisateurs:</span>
                  <span>47 actifs</span>
                </div>
                <div className="flex justify-between">
                  <span>Stockage:</span>
                  <span>2.4 GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}