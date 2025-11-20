import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to get the user's profile picture URL from account preferences
 * Returns empty string if no profile picture is set
 */
export function useProfilePicture(): string {
  const { user } = useAuth();
  
  return useMemo(() => {
    if (user?.prefs) {
      const prefs = user.prefs as any;
      return prefs.profilePicture || '';
    }
    return '';
  }, [user]);
}
