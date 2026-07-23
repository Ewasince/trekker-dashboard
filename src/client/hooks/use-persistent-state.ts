'use client';

import { useEffect, useState } from 'react';

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

/**
 * useState backed by localStorage. Reads the stored value on mount (falling back
 * to `initial` when missing or corrupt) and writes every change back under `key`.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStored(key, initial));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write failures (quota, private mode)
    }
  }, [key, value]);

  return [value, setValue] as const;
}
