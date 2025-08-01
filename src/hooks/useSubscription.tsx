'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { SUBSCRIPTION_PLANS, type SubscriptionPlan, type CompanySubscription } from '../types/subscription'

interface SubscriptionContextType {
  subscription: CompanySubscription | null
  loading: boolean
  hasFeature: (feature: keyof typeof SUBSCRIPTION_PLANS.basic.features) => boolean
  upgradePlan: (plan: SubscriptionPlan) => Promise<void>
  isTrialActive: () => boolean
  daysLeftInTrial: () => number
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<CompanySubscription | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulation d'un abonnement pour le développement
  useEffect(() => {
    // Simuler un abonnement Pro pour les tests
    const mockSubscription: CompanySubscription = {
      id: 'sub_123',
      companyId: 'company_123',
      plan: 'pro',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      trialEndDate: '2025-02-01',
      features: SUBSCRIPTION_PLANS.pro.features,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
    
    setSubscription(mockSubscription)
    setLoading(false)
  }, [])

  const hasFeature = (feature: keyof typeof SUBSCRIPTION_PLANS.basic.features): boolean => {
    if (!subscription) return false
    return subscription.features[feature] === true
  }

  const upgradePlan = async (plan: SubscriptionPlan): Promise<void> => {
    // Ici on intégrerait Stripe ou un autre système de paiement
    console.log('Upgrading to plan:', plan)
    
    if (subscription) {
      const updatedSubscription = {
        ...subscription,
        plan,
        features: SUBSCRIPTION_PLANS[plan].features,
        updatedAt: new Date().toISOString()
      }
      setSubscription(updatedSubscription)
    }
  }

  const isTrialActive = (): boolean => {
    if (!subscription?.trialEndDate) return false
    return new Date() < new Date(subscription.trialEndDate)
  }

  const daysLeftInTrial = (): number => {
    if (!subscription?.trialEndDate) return 0
    const trialEnd = new Date(subscription.trialEndDate)
    const now = new Date()
    const diffTime = trialEnd.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      hasFeature,
      upgradePlan,
      isTrialActive,
      daysLeftInTrial
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}