"use client"

// Page de création d'un utilisateur (employé, administrateur ou client). Cette page permet
// d'enregistrer un nouvel utilisateur dans la base de données et de rediriger
// vers la liste des utilisateurs après insertion. Les employés et administrateurs
// sont insérés dans la table `profiles`, tandis que les clients sont insérés
// dans la table `clients`.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function CreateUserPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'employee' | 'client'>('employee')
  const [department, setDepartment] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [hireDate, setHireDate] = useState('')
  // Stocker le taux horaire sous forme de chaîne pour éviter les valeurs NaN dans
  // les champs d’entrée. Le taux est converti en nombre lors de l’insertion.
  const [hourlyRate, setHourlyRate] = useState('')
  const [phone, setPhone] = useState('')
  // Type d'employé (permanent, temporaire, occasionnel) – s'applique uniquement lorsque role === 'employee'
  const [employeeType, setEmployeeType] = useState<'permanent' | 'temporary' | 'occasional'>('permanent')
  // Mot de passe temporaire pour l'employé. Dans une implémentation réelle, ce mot de passe
  // devrait être envoyé par email ou via un autre canal sécurisé.
  const [tempPassword, setTempPassword] = useState('')

  // Adresse complète de l'utilisateur/client (rue, ville, etc.)
  const [address, setAddress] = useState('')
  // Informations d'emplacement détaillées. Nous utilisons désormais la ville,
  // le code postal et le pays plutôt que la latitude/longitude dans le
  // formulaire. Les coordonnées géographiques pourront être dérivées via une
  // recherche ultérieure si nécessaire.
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const navigation = adminNavigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const supabase = getSupabaseClient()
    try {
      // 1. Créer le compte dans l'auth Supabase pour les employés/administrateurs/clients.
      //    Un mot de passe temporaire est requis pour la création du compte. Si
      //    aucun mot de passe n'est fourni, nous générons une chaîne aléatoire. Ce
      //    mot de passe devra être changé par l'utilisateur à la première connexion.
      const passwordForAuth = tempPassword || crypto.randomUUID().slice(0, 12)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: passwordForAuth,
        options: { data: { full_name: fullName, role } },
      })
      if (authError || !authData || !authData.user) {
        console.error('Erreur lors de la création du compte auth :', authError)
        alert("Impossible de créer l'utilisateur. Veuillez réessayer.")
        return
      }
      const authUserId = authData.user.id
      if (role === 'client') {
        // Insérer un nouveau client dans la table `clients`. Nous stockons
        // l'adresse, la ville, le code postal et le pays plutôt que les coordonnées.
        const { error } = await supabase.from('clients').insert({
          id: authUserId,
          name: fullName,
          email: email,
          phone: phone || null,
          contact_person: jobTitle || null,
          hourly_rate: hourlyRate === '' ? null : parseFloat(hourlyRate),
          company: department || null,
          address: address || null,
          city: city || null,
          postal_code: postalCode || null,
          country: country || null,
        })
        if (error) {
          console.error('Erreur lors de la création du client:', error)
          alert('Erreur lors de la création du client')
          return
        }
      } else {
        // Insérer un nouvel employé ou administrateur dans la table `profiles`
        const { error } = await supabase.from('profiles').insert({
          id: authUserId,
          email: email,
          full_name: fullName,
          role: role,
          department_id: null,
          job_title: jobTitle || null,
          hire_date: hireDate || null,
          hourly_rate: hourlyRate === '' ? null : parseFloat(hourlyRate),
          phone: phone || null,
          contract_type: role === 'employee' ? employeeType : null,
          address: address || null,
          city: city || null,
          postal_code: postalCode || null,
          country: country || null,
        })
        if (error) {
          console.error('Erreur lors de la création du profil:', error)
          alert('Erreur lors de la création du profil')
          return
        }
      }
      // Après création, afficher un message et rediriger vers la liste des utilisateurs
      alert('Utilisateur créé avec succès ! Un email de confirmation a été envoyé.')
      router.push('/admin/users')
    } catch (err) {
      console.error('Erreur inattendue lors de la création de l’utilisateur:', err)
      alert('Une erreur inattendue est survenue')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout title="Créer un utilisateur" navigation={navigation}>
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Créer un utilisateur</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                id="fullName"
                name="fullName"
                autoComplete="name"
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
                name="email"
                autoComplete="email"
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
                name="role"
                autoComplete="off"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="admin">Administrateur</option>
                <option value="employee">Employé</option>
                <option value="client">Client</option>
              </select>
            </div>
            {/* Sélection du type d'employé visible uniquement si role = employé */}
            {role === 'employee' && (
              <div>
                <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'employé
                </label>
              <select
                  id="employeeType"
                  name="employeeType"
                  autoComplete="off"
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="permanent">Permanent</option>
                  <option value="temporary">Temporaire</option>
                  <option value="occasional">Occasionnel</option>
                </select>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Département / Société
                </label>
                <input
                  id="department"
                  name="department"
                  autoComplete="organization"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Poste / Contact
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  autoComplete="off"
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
                  Date d'embauche (employé/admin)
                </label>
                <input
                  id="hireDate"
                  name="hireDate"
                  autoComplete="off"
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
                  name="hourlyRate"
                  autoComplete="off"
                  type="number"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => {
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
                name="phone"
                autoComplete="tel"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Adresse détaillée */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rue et numéro"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="ex: Montréal"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  autoComplete="postal-code"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="ex: H3A 0G4"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                <input
                  id="country"
                  name="country"
                  autoComplete="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="ex: Canada"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            {/* Mot de passe temporaire visible uniquement pour les employés */}
            {role === 'employee' && (
              <div>
                <label htmlFor="tempPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe temporaire
                </label>
                <div className="flex space-x-2">
                  <input
                    id="tempPassword"
                    type="text"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Mot de passe temporaire"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Générer un mot de passe aléatoire de 8 caractères composé de lettres et chiffres
                      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                      let pwd = ''
                      for (let i = 0; i < 8; i++) {
                        pwd += chars.charAt(Math.floor(Math.random() * chars.length))
                      }
                      setTempPassword(pwd)
                    }}
                    className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                  >
                    Générer
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Ce mot de passe sera envoyé à l'employé et devra être changé lors de la première connexion.</p>
              </div>
            )}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Enregistrement...' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}