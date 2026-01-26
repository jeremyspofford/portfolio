"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Feature flag types
export interface FeatureFlags {
  showAIShowcase: boolean;
  showContributions: boolean;
  showResumeDownload: boolean;
  enableJobFitAnalyzer: boolean;
  enableJobFitUrl: boolean;
}

// Default flags (used when API unavailable or for SSR)
export const defaultFlags: FeatureFlags = {
  showAIShowcase: true,
  showContributions: true,
  showResumeDownload: false,
  enableJobFitAnalyzer: true,
  enableJobFitUrl: true,
};

interface FeatureFlagsResponse {
  environment: string;
  flags: Partial<FeatureFlags>;
  fetchedAt: string;
  fallback?: boolean;
}

interface FeatureFlagsContextValue {
  flags: FeatureFlags;
  isLoading: boolean;
  error: string | null;
  environment: string | null;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue>({
  flags: defaultFlags,
  isLoading: true,
  error: null,
  environment: null,
});

// Determine environment based on hostname
function getEnvironment(): string {
  if (typeof window === "undefined") return "production";

  const hostname = window.location.hostname;

  // Staging detection - adjust these patterns based on your setup
  if (
    hostname.includes("staging") ||
    hostname.includes("dev") ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return "staging";
  }

  return "production";
}

// Fetch feature flags from API
async function fetchFeatureFlags(environment: string): Promise<FeatureFlagsResponse> {
  if (!API_URL) {
    return {
      environment,
      flags: defaultFlags,
      fetchedAt: new Date().toISOString(),
      fallback: true,
    };
  }

  try {
    const res = await fetch(`${API_URL}/feature-flags?environment=${environment}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch feature flags: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.warn("Failed to fetch feature flags, using defaults:", error);
    return {
      environment,
      flags: defaultFlags,
      fetchedAt: new Date().toISOString(),
      fallback: true,
    };
  }
}

// Hook for consuming feature flags
export function useFeatureFlags(): FeatureFlagsContextValue {
  return useContext(FeatureFlagsContext);
}

// Hook for checking a specific feature flag
export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  const { flags } = useFeatureFlags();
  return flags[flagName] ?? defaultFlags[flagName];
}

// Provider component props
interface FeatureFlagsProviderProps {
  children: ReactNode;
}

// Provider component
export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<string | null>(null);

  useEffect(() => {
    const env = getEnvironment();
    setEnvironment(env);

    fetchFeatureFlags(env)
      .then((response) => {
        setFlags({
          ...defaultFlags,
          ...response.flags,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <FeatureFlagsContext.Provider value={{ flags, isLoading, error, environment }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Standalone function for server-side or one-off fetches
export async function getFeatureFlags(environment?: string): Promise<FeatureFlags> {
  const env = environment || "production";
  const response = await fetchFeatureFlags(env);
  return {
    ...defaultFlags,
    ...response.flags,
  };
}
