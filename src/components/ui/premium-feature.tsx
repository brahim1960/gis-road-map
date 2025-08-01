'use client'

import { ReactNode } from 'react'
import { useSubscription } from '../../hooks/useSubscription'
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '../../types/subscription'
import {
  Crown,
  Lock,
  Leaf,
  ExternalLink,
  MessageSquare,
  Award,
  Activity,
  MapPin
} from 'lucide-react'

interface PremiumFeatureProps {
  feature: keyof typeof SUBSCRIPTION_PLANS.basic.features
  children: ReactNode
  fallback?: ReactNode
  requiredPlan?: SubscriptionPlan
}

export function PremiumFeature({ 
  feature, 
  children, 
  fallback,
  requiredPlan = 'pro' 
}: PremiumFeatureProps) {
  const { hasFeature, subscription, upgradePlan } = useSubscription()

  if (hasFeature(feature)) {
    return <>{children}</>
  }

  const handleUpgrade = () => {
    upgradePlan(requiredPlan)
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-lg flex items-center justify-center z-10">
        <div className="text-center p-4">
          <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900 mb-2">
            Fonctionnalité Premium
          </p>
          <p className="text-xs text-gray-600 mb-3">
            Disponible avec le plan {SUBSCRIPTION_PLANS[requiredPlan].name}
          </p>
          <button
            onClick={handleUpgrade}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Crown className="h-3 w-3 mr-1" />
            Mettre à niveau
          </button>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  )
}

export function PremiumBadge({ plan = 'pro' }: { plan?: SubscriptionPlan }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <Crown className="h-3 w-3 mr-1" />
      {SUBSCRIPTION_PLANS[plan].name}
    </span>
  )
}

export function FeatureLockedCard({ 
  title, 
  description, 
  feature,
  requiredPlan = 'pro',
  icon: Icon 
}: {
  title: string
  description: string
  feature: keyof typeof SUBSCRIPTION_PLANS.basic.features
  requiredPlan?: SubscriptionPlan
  icon: React.ComponentType<{ className?: string }>
}) {
  const { upgradePlan } = useSubscription()

  const handleUpgrade = () => {
    upgradePlan(requiredPlan)
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 mb-4">
          <Lock className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-center mb-4">
          <PremiumBadge plan={requiredPlan} />
        </div>
        <button
          onClick={handleUpgrade}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Crown className="h-4 w-4 mr-2" />
          Débloquer cette fonctionnalité
        </button>
      </div>
    </div>
  )
}