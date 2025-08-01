'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { getSupabaseClient } from '../lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Database } from '../types/database'

type UserRole = 'admin' | 'employee' | 'client'

export interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url?: string | null
  job_title?: string | null
  department_id?: string | null
  hourly_rate?: number
  is_active?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Charge un utilisateur depuis la base de données. Cette fonction recherche
  // d'abord dans la table `profiles`, puis dans `clients`. Si rien n'est trouvé,
  // elle crée un utilisateur minimal à partir des informations d'authentification.
  const loadUser = async (authUser: any) => {
    try {
      const supabase = getSupabaseClient()
      // Rechercher dans profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()
      if (profile) {
        const currentUser: User = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          avatar_url: profile.avatar_url,
          job_title: profile.job_title,
          department_id: profile.department_id,
          hourly_rate: profile.hourly_rate,
          is_active: profile.is_active,
        }
        setUser(currentUser)
        return
      }
      // Rechercher dans clients
      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()
      if (client) {
        const currentUser: User = {
          id: client.id,
          email: client.email,
          full_name: client.name,
          role: 'client',
          avatar_url: null,
          job_title: client.contact_person || null,
          department_id: null,
          hourly_rate: client.hourly_rate || 0,
          is_active: client.is_active,
        }
        setUser(currentUser)
        return
      }
      // Aucun enregistrement trouvé, créer un utilisateur minimal
      const fallbackUser: User = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: (authUser.user_metadata && (authUser.user_metadata.full_name || authUser.user_metadata.name)) || authUser.email || '',
        role: 'client',
        avatar_url: null,
        job_title: null,
        department_id: null,
        hourly_rate: 0,
        is_active: true,
      }
      setUser(fallbackUser)
    } catch (error) {
      console.error('Error loading user:', error)
      setUser(null)
    }
  }

  // Expose refreshUser pour les appels manuels (ex : après mise à jour du profil)
  const refreshUser = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUser(session.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    // Initialisation de l'authentification : on charge la session au montage
    const init = async () => {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUser(session.user)
      }
      setLoading(false)
    }
    init()

    // Abonnement aux changements d'état d'authentification
    const supabase = getSupabaseClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Charger l'utilisateur dès que la session est disponible
        loadUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
