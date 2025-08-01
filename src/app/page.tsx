import Link from 'next/link'
import { Clock, Users, BarChart3, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">TempsZenith</span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Suivi du temps
            <span className="text-indigo-600"> simplifié</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Gérez efficacement le temps de vos équipes avec TempsZenith. 
            Une solution complète pour le suivi du temps, la gestion de projets et l'analyse de productivité.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Commencer gratuitement
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/auth/signin"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Suivi en temps réel</h3>
              <p className="text-gray-500">
                Enregistrez et suivez le temps passé sur chaque projet avec précision.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion d'équipe</h3>
              <p className="text-gray-500">
                Gérez les rôles et permissions de vos employés et clients.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Rapports détaillés</h3>
              <p className="text-gray-500">
                Analysez la productivité avec des rapports complets et des statistiques.
              </p>
            </div>
          </div>
        </div>

        {/* Roles Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Adapté à tous les rôles
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Administrateur</h3>
              <p className="text-gray-600 mb-6">
                Contrôle total sur l'application, gestion des utilisateurs et accès aux rapports globaux.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Gestion des utilisateurs</li>
                <li>• Rapports globaux</li>
                <li>• Configuration système</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Employé</h3>
              <p className="text-gray-600 mb-6">
                Suivi du temps personnel, gestion des projets assignés et rapports individuels.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Suivi du temps</li>
                <li>• Gestion des projets</li>
                <li>• Rapports personnels</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Client</h3>
              <p className="text-gray-600 mb-6">
                Accès aux rapports des projets, suivi de l'avancement et facturation.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Rapports de projets</li>
                <li>• Suivi d'avancement</li>
                <li>• Facturation</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <Clock className="h-6 w-6 text-indigo-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">TempsZenith</span>
          </div>
          <p className="mt-2 text-center text-gray-500 text-sm">
            © 2025 TempsZenith. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}