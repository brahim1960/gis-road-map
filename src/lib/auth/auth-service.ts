import type { Database } from '../../types/database'
import { getSupabaseClient } from '../supabase/client'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  role: 'admin' | 'employee' | 'client'
  departmentId?: string
  jobTitle?: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'employee' | 'client'
  avatar_url?: string | null
  job_title?: string | null
  department_id?: string | null
  hourly_rate?: number
  is_active?: boolean
}

class AuthService {

  async signUp(data: SignUpData) {
    try {
      console.log('Starting signUp process...')
      const supabase = getSupabaseClient()
      console.log('Supabase client obtained, attempting auth signup...')

      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
          }
        }
      })

      if (authError) throw authError
      console.log('Auth signup successful, creating profile...')

      // 2. Create profile or client record in the database
      if (authData.user) {
        console.log('Creating profile/client for user:', authData.user.id)

        if (data.role === 'client') {
          // Les clients sont stockés dans la table `clients`. Utiliser l'ID de l'utilisateur
          // auth comme identifiant afin de lier le compte Supabase au client.
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .insert({
              id: authData.user.id,
              name: data.fullName,
              email: data.email,
              phone: data.phone,
              contact_person: data.fullName,
              // D'autres champs peuvent être ajoutés ici si nécessaire
            })
            .select()
            .single()

          if (clientError) {
            console.error('Client creation error:', clientError)
            throw new Error(`Erreur lors de la création du client: ${clientError.message}`)
          }
          console.log('Client created successfully:', clientData)
        } else {
          // Créer un profil dans la table `profiles` (administrateur ou employé)
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: data.email,
              full_name: data.fullName,
              role: data.role,
              job_title: data.jobTitle,
              phone: data.phone,
              department_id: data.departmentId || null,
            })
            .select()
            .single()

          if (profileError) {
            console.error('Profile creation error:', profileError)
            throw new Error(`Erreur lors de la création du profil: ${profileError.message}`)
          }
          console.log('Profile created successfully:', profileData)
        }
      }

      return { data: authData, error: null }
    } catch (error) {
      console.error('SignUp error:', error)
      
      // Handle specific error types
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { 
          data: null, 
          error: new Error('Impossible de se connecter à Supabase. Vérifiez votre fichier .env.local et votre connexion internet.') 
        }
      }
      
      if (error instanceof Error && error.message.includes('Configuration Supabase')) {
        return { data: null, error }
      }
      
      return { data: null, error: error as Error }
    }
  }

  async signIn(data: SignInData) {
    try {
      const supabase = getSupabaseClient()

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      return { data: authData, error: null }
    } catch (error) {
      console.error('SignIn error:', error)
      
      // Handle specific error types
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { 
          data: null, 
          error: new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet et la configuration Supabase.') 
        }
      }
      
      return { data: null, error: error as Error }
    }
  }

  async signOut() {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const supabase = getSupabaseClient()
      console.log('🔍 Getting profile for user ID:', userId)

      // Rechercher d'abord dans la table profiles (employés et administrateurs)
      // Utiliser maybeSingle() pour éviter une erreur 406 Not Acceptable lorsqu’aucune ligne n’est trouvée.
      // La méthode single() lève une erreur si le résultat contient 0 lignes, ce qui provoque un
      // code HTTP 406 côté navigateur. maybeSingle() renvoie `null` sans erreur dans ce cas,
      // permettant de poursuivre la recherche dans la table clients.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      console.log('🔍 Profile query result:', { profile, profileError })

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 est renvoyé lorsque aucune ligne n'est trouvée dans PostgREST
        console.error('❌ Profile query error:', profileError)
      }

      if (profile) {
        console.log('✅ Profile found with role:', profile.role)
        return {
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
      }

      // Si aucun profil n'est trouvé, rechercher dans la table clients
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      console.log('🔍 Client query result:', { client, clientError })

      if (clientError && clientError.code !== 'PGRST116') {
        console.error('❌ Client query error:', clientError)
      }

      if (client) {
        console.log('✅ Client found')
        return {
          id: client.id,
          email: client.email,
          full_name: client.name,
          role: 'client',
          // Les clients n'ont pas nécessairement ces champs
          avatar_url: null,
          job_title: client.contact_person || null,
          department_id: null,
          hourly_rate: client.hourly_rate || 0,
          is_active: client.is_active,
        }
      }

      console.error('❌ No profile or client found for user:', userId)
      return null
    } catch (error) {
      console.error('💥 Error getting user profile:', error)
      return null
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = getSupabaseClient()
      console.log('🔍 Getting current user...')
      
      // Essayer d'abord getSession puis getUser
      const { data: { session } } = await supabase.auth.getSession()
      console.log('📋 Session check:', !!session)
      
      let user = session?.user
      
      if (!user) {
        console.log('🔄 No session user, trying getUser...')
        const { data: { user: authUser } } = await supabase.auth.getUser()
        user = authUser
      }
      
      if (!user) {
        console.log('❌ No authenticated user found')
        return null
      }
     
      console.log('✅ Authenticated user found:', user.id)
      console.log('📧 User email:', user.email)
      console.log('📋 User metadata:', user.user_metadata)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('🔍 Profile query result:', { profile, profileError })

      if (profileError) {
        console.error('❌ Profile query error:', profileError)
        
        // Si le profil n'existe pas, essayer de le créer automatiquement
        if (profileError.code === 'PGRST116') {
          console.log('🔧 Profile not found, attempting to create...')
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || null,
              role: user.user_metadata?.role || 'employee',
            })
            .select()
            .single()
          
          if (createError) {
            console.error('❌ Failed to create profile:', createError)
            return null
          }
          
          console.log('✅ Profile created automatically:', newProfile)
          return {
            id: newProfile.id,
            email: newProfile.email,
            full_name: newProfile.full_name,
            role: newProfile.role,
            avatar_url: newProfile.avatar_url,
            job_title: newProfile.job_title,
            department_id: newProfile.department_id,
            hourly_rate: newProfile.hourly_rate,
            is_active: newProfile.is_active,
          }
        }
        
        return null
      }

      if (!profile) {
        console.error('❌ No profile found for user:', user.id)
        return null
      }
     
      console.log('✅ Profile found with role:', profile.role)
      console.log('📊 Full profile data:', profile)

      return {
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
    } catch (error) {
      console.error('💥 Error getting current user:', error)
      return null
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const supabase = getSupabaseClient()
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()