import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to get the user's preferred currency
 * Returns 'USD' as default if user is not authenticated or hasn't set a preference
 */
export function useCurrency(): string {
  const { user } = useAuth();
  
  return useMemo(() => {
    if (user?.prefs) {
      const prefs = user.prefs as any;
      return prefs.currency || 'USD';
    }
    return 'USD';
  }, [user]);
}
