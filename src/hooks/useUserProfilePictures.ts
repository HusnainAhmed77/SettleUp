import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/userProfileService';

/**
 * Hook to fetch profile pictures for multiple users
 * Returns a map of userId -> profilePictureUrl
 */
export function useUserProfilePictures(userIds: string[]): Record<string, string> {
  const [profilePictures, setProfilePictures] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchProfilePictures() {
      if (!userIds || userIds.length === 0) {
        setProfilePictures({});
        return;
      }

      try {
        const pictureMap: Record<string, string> = {};

        // Fetch profile pictures for all users in parallel
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userProfile = await getUserProfile(userId);
              if (userProfile) {
                // Use profilePicture if available, otherwise fall back to googleProfilePicture
                const pictureUrl = userProfile.profilePicture || userProfile.googleProfilePicture || '';
                if (pictureUrl) {
                  pictureMap[userId] = pictureUrl;
                }
              }
            } catch (error) {
              console.error(`Error fetching profile picture for user ${userId}:`, error);
            }
          })
        );

        setProfilePictures(pictureMap);
      } catch (error) {
        console.error('Error fetching profile pictures:', error);
        setProfilePictures({});
      }
    }

    fetchProfilePictures();
  }, [JSON.stringify(userIds)]); // Use JSON.stringify to properly compare array changes

  return profilePictures;
}
