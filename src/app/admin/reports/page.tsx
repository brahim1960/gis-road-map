"use client"

// Page de tableau de bord des rapports. Affiche une grille de vignettes
// correspondant aux différents types de rapports que l’administrateur peut
// consulter. Chaque vignette redirige vers une page dédiée qui calculera
// l’agrégation requise à partir des tables Supabase. Pour l’instant ces
// pages sont des squelettes qui afficheront un message "Rapport en
// construction".

import Link from 'next/link'
import DashboardLayout from '@/components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { FileText, BarChart3, Users, Clock, ClipboardList, Layers, Calendar, DollarSign } from 'lucide-react'

const navigation = adminNavigation

// Liste des rapports disponibles. Chaque entrée définit un slug (utilisé dans l’URL),
// un titre, une description et une icône.
const reportCards = [
  {
    slug: 'projects',
    title: 'Projets',
    description: 'Liste de tous les projets avec leur statut et progression',
    icon: BarChart3,
  },
  {
    slug: 'projects-by-client',
    title: 'Projets par client',
    description: 'Analyse des projets regroupés par client',
    icon: Users,
  },
  {
    slug: 'hours-by-project',
    title: 'Heures travaillées par projet',
    description: 'Somme des heures enregistrées pour chaque projet',
    icon: Clock,
  },
  {
    slug: 'timesheets',
    title: 'Feuilles de temps',
    description: 'Synthèse des feuilles de temps par employé et période',
    icon: ClipboardList,
  },
  {
    slug: 'timesheets-by-task',
    title: 'Feuilles de temps par tâche',
    description: 'Temps passé sur chaque tâche de projet',
    icon: Layers,
  },
  {
    slug: 'timesheets-by-function',
    title: 'Feuilles de temps par fonctions',
    description: 'Analyse des heures par fonction ou poste',
    icon: Users,
  },
  {
    slug: 'daily',
    title: 'Journalier',
    description: 'Rapport quotidien des entrées de temps',
    icon: Calendar,
  },
  {
    slug: 'payroll',
    title: 'Paies',
    description: 'Calculs de paie basés sur les heures approuvées',
    icon: DollarSign,
  },
]

export default function ReportsDashboard() {
  return (
    <DashboardLayout title="Rapports" navigation={navigation}>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map(({ slug, title, description, icon: Icon }) => (
          <Link
            key={slug}
            href={`/admin/reports/${slug}`}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
          >
            <div className="flex items-center mb-4">
              <Icon className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-sm text-gray-600 flex-grow">{description}</p>
            <div className="mt-4 text-indigo-600 text-sm font-medium">Voir le rapport →</div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}