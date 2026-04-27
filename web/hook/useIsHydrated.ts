'use client';

import { useSyncExternalStore } from 'react';

// Hook to detect whether the component has hydrated on the client
export function useIsHydrated() {
  return useSyncExternalStore(
    () => () => {}, // No subscription needed
    () => true, // Client snapshot (after hydration)
    () => false // Server snapshot and initial client render
  );
}
