import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database'

// Ce module fournit une instance unique de Supabase pour l'ensemble de
// l'application. Le message d'avertissement « Multiple GoTrueClient instances
// detected » se produit lorsque plusieurs clients sont créés avec le même
// storage key. Pour éviter cela, nous stockons le client dans globalThis
// (qui correspond à `global` en Node.js et à `window` dans le navigateur).

export const getSupabaseClient = (): SupabaseClient<Database> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing')
  }

  // Utiliser globalThis pour persister l'instance entre les appels.
  const globalObj: any = globalThis as any
  if (!globalObj._supabaseClient) {
    globalObj._supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return globalObj._supabaseClient as SupabaseClient<Database>
}
