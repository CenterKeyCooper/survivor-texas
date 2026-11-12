import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { SpoilerData, SPOILER_STORAGE_KEY } from './spoilers';

interface SpoilerContextValue {
  data: SpoilerData | null;
  unlocked: boolean;
  checking: boolean;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
}

const SpoilerContext = createContext<SpoilerContextValue>({
  data: null,
  unlocked: false,
  checking: false,
  unlock: async () => false,
  lock: () => {},
});

async function fetchSpoilers(password: string): Promise<SpoilerData | null> {
  try {
    const res = await fetch('/api/spoilers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return res.ok ? ((await res.json()) as SpoilerData) : null;
  } catch {
    return null;
  }
}

export function SpoilerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SpoilerData | null>(null);
  const [checking, setChecking] = useState(true);

  // Re-validate any saved password on load
  useEffect(() => {
    const saved = localStorage.getItem(SPOILER_STORAGE_KEY);
    if (!saved) {
      setChecking(false);
      return;
    }
    fetchSpoilers(saved).then(result => {
      if (result) setData(result);
      else localStorage.removeItem(SPOILER_STORAGE_KEY);
      setChecking(false);
    });
  }, []);

  const unlock = useCallback(async (password: string) => {
    const result = await fetchSpoilers(password);
    if (!result) return false;
    localStorage.setItem(SPOILER_STORAGE_KEY, password);
    setData(result);
    return true;
  }, []);

  const lock = useCallback(() => {
    localStorage.removeItem(SPOILER_STORAGE_KEY);
    setData(null);
  }, []);

  return (
    <SpoilerContext.Provider value={{ data, unlocked: data !== null, checking, unlock, lock }}>
      {children}
    </SpoilerContext.Provider>
  );
}

export const useSpoilers = () => useContext(SpoilerContext);
