"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  ApparenceSettings,
  defaultApparenceSettings,
  parseSettingsFromAPI,
} from "@/types/apparence";

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface ApparenceContextType {
  settings: ApparenceSettings;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// =============================================================================
// CONTEXT
// =============================================================================

const ApparenceContext = createContext<ApparenceContextType>({
  settings: defaultApparenceSettings,
  isLoaded: false,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

// =============================================================================
// PROVIDER
// =============================================================================

export function ApparenceProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ApparenceSettings>(
    defaultApparenceSettings,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      const parsed = parseSettingsFromAPI(data);
      setSettings(parsed);
      setIsLoaded(true);
    } catch (err) {
      console.error("Failed to load apparence settings:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      // Keep defaults on error
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <ApparenceContext.Provider
      value={{ settings, isLoaded, isLoading, error, refetch: fetchSettings }}
    >
      {children}
    </ApparenceContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useApparence() {
  const context = useContext(ApparenceContext);
  if (!context) {
    throw new Error("useApparence must be used within an ApparenceProvider");
  }
  return context;
}
