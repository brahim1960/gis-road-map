"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth' // Assuming useAuth provides the client's user ID

interface FeatureFlags {
  [key: string]: boolean;
}

interface FeatureFlagContextValue {
  features: FeatureFlags;
  hasFeature: (featureName: string) => boolean;
  loading: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFeatureFlags = async () => {
      const supabase = getSupabaseClient();
      setLoading(true);

      // We assume the client's user ID is the same as their client_id
      const { data, error } = await supabase
        .from('client_features')
        .select('feature_name, is_enabled')
        .eq('client_id', user.id);

      if (error) {
        console.error("Error fetching feature flags:", error);
      } else {
        const flags = data.reduce((acc, feature) => {
          acc[feature.feature_name] = feature.is_enabled;
          return acc;
        }, {} as FeatureFlags);
        setFeatures(flags);
      }
      setLoading(false);
    };

    fetchFeatureFlags();
  }, [user]);

  const hasFeature = (featureName: string): boolean => {
    return !!features[featureName];
  };

  return (
    <FeatureFlagContext.Provider value={{ features, hasFeature, loading }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}
