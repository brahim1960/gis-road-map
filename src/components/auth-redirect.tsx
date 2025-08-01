'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

export function AuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && user) {
      console.log('🔍 AuthRedirect: User found, role:', user.role)
      
      // Rediriger vers le dashboard approprié
      const dashboardPath = `/${user.role}/dashboard`
      console.log('🚀 AuthRedirect: Redirecting to:', dashboardPath)
      
      // Utiliser router.push au lieu de window.location
      router.push(dashboardPath)
    }
  }, [user, loading, router])
  
  return null
}