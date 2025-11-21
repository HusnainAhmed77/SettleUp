import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/userProfileService';

/**
 * Hook to get the user's profile picture URL from the database
 * Returns empty string if no profile picture is set
 * Automatically falls back to Google profile picture if custom picture is not set
 */
export function useProfilePicture(): string {
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string>('');

  useEffect(() => {
    async function fetchProfilePicture() {
      if (!user?.$id) {
        setProfilePicture('');
        return;
      }

      try {
        const userProfile = await getUserProfile(user.$id);
        if (userProfile) {
          // Use profilePicture if available, otherwise fall back to googleProfilePicture
          const pictureUrl = userProfile.profilePicture || userProfile.googleProfilePicture || '';
          setProfilePicture(pictureUrl);
        } else {
          setProfilePicture('');
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        setProfilePicture('');
      }
    }

    fetchProfilePicture();
  }, [user?.$id]);

  return profilePicture;
}
