import {
  BarChart3,
  Users,
  Calendar,
  MapPin,
  MessageSquare,
  Award,
  Leaf,
  Clock,
  LifeBuoy,
  Settings,
} from 'lucide-react'

export const adminNavigation = [
  { key: 'dashboard', name: 'Tableau de bord', href: '/admin/dashboard', icon: BarChart3 },
  { key: 'users', name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { key: 'projects', name: 'Projets', href: '/admin/projects', icon: Calendar },
  { key: 'pointages', name: 'Pointages', href: '/admin/pointages', icon: Clock },
  { key: 'map', name: 'Carte temps réel', href: '/admin/map', icon: MapPin, badge: 'Live' },
  { key: 'chat', name: 'Chat', href: '/admin/chat', icon: MessageSquare },
  { key: 'analytics', name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { key: 'wellness', name: 'Wellness', href: '/admin/wellness', icon: Award },
  { key: 'carbon', name: 'Carbone', href: '/admin/carbon', icon: Leaf },
  { key: 'reports', name: 'Rapports', href: '/admin/reports', icon: Clock },
  { key: 'support', name: 'Support', href: '/admin/tickets', icon: LifeBuoy },
  { key: 'settings', name: 'Paramètres', href: '/admin/settings', icon: Settings },
]
