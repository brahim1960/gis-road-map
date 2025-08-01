export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise'

export interface PlanFeatures {
  name: string
  price: number
  currency: string
  billing: 'monthly' | 'yearly'
  features: {
    maxUsers: number
    maxProjects: number
    timeTracking: boolean
    reporting: boolean
    pdfExport: boolean
    realTimeMap: boolean
    chat: boolean
    wellness: boolean
    carbonTracking: boolean
    gamification: boolean
    biometricAuth: boolean
    geolocation: boolean
    aiAnalytics: boolean
    customBranding: boolean
    apiAccess: boolean
    prioritySupport: boolean
  }
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, PlanFeatures> = {
  basic: {
    name: 'Basique',
    price: 9.99,
    currency: 'EUR',
    billing: 'monthly',
    features: {
      maxUsers: 10,
      maxProjects: 5,
      timeTracking: true,
      reporting: true,
      pdfExport: false,
      realTimeMap: false,
      chat: false,
      wellness: false,
      carbonTracking: false,
      gamification: false,
      biometricAuth: false,
      geolocation: false,
      aiAnalytics: false,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
    }
  },
  pro: {
    name: 'Professionnel',
    price: 29.99,
    currency: 'EUR',
    billing: 'monthly',
    features: {
      maxUsers: 50,
      maxProjects: 25,
      timeTracking: true,
      reporting: true,
      pdfExport: true,
      realTimeMap: true,
      chat: true,
      wellness: true,
      carbonTracking: true,
      gamification: true,
      biometricAuth: true,
      geolocation: true,
      aiAnalytics: false,
      customBranding: false,
      apiAccess: true,
      prioritySupport: true,
    }
  },
  enterprise: {
    name: 'Entreprise',
    price: 99.99,
    currency: 'EUR',
    billing: 'monthly',
    features: {
      maxUsers: -1, // illimité
      maxProjects: -1, // illimité
      timeTracking: true,
      reporting: true,
      pdfExport: true,
      realTimeMap: true,
      chat: true,
      wellness: true,
      carbonTracking: true,
      gamification: true,
      biometricAuth: true,
      geolocation: true,
      aiAnalytics: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
    }
  }
}

export interface CompanySubscription {
  id: string
  companyId: string
  plan: SubscriptionPlan
  status: 'active' | 'inactive' | 'trial' | 'expired'
  startDate: string
  endDate: string
  trialEndDate?: string
  features: PlanFeatures['features']
  createdAt: string
  updatedAt: string
}