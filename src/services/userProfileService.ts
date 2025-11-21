import { databases, APP_DATABASE_ID, APP_COLLECTIONS, Query } from '@/lib/appwrite';
import { ID } from 'appwrite';

/**
 * UserProfile interface matching Appwrite collection schema
 */
export interface UserProfile {
  $id: string;
  userId: string; // Appwrite user ID
  name: string; // User name
  email: string; // User email
  profilePicture?: string; // Profile picture URL (optional)
  provider: string; // Auth provider
  currency?: string; // User's preferred currency (optional)
  googleProfilePicture?: string; // Google profile picture URL (optional)
  $createdAt: string; // Appwrite created timestamp (automatic)
  $updatedAt: string; // Appwrite updated timestamp (automatic)
  lastLoginAt: string; // Last login timestamp
  friendId?: string[]; // Array of friend user IDs
  friendNames?: string[]; // Array of friend names
}

/**
 * Create or update user profile in database
 * This is called during signup, login, and OAuth callbacks
 */
export async function createOrUpdateUserProfile(
  userId: string,
  email: string,
  name: string,
  provider: string,
  profilePictureUrl?: string
): Promise<UserProfile> {
  try {
    console.log('[UserProfileService] Creating/updating profile');
    console.log('[UserProfileService] userId:', userId);
    console.log('[UserProfileService] email:', email);
    console.log('[UserProfileService] name:', name);
    console.log('[UserProfileService] provider:', provider);
    console.log('[UserProfileService] profilePictureUrl:', profilePictureUrl);

    // Check if profile already exists
    const existing = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    console.log('[UserProfileService] Found existing profiles:', existing.documents.length);

    const now = new Date().toISOString();

    if (existing.documents.length > 0) {
      // Update existing profile
      console.log('[UserProfileService] Updating existing profile:', existing.documents[0].$id);

      const existingProfile = existing.documents[0] as unknown as UserProfile;

      // Prepare update data - only update fields that are provided
      const updateData: Record<string, any> = {
        email,
        name,
        provider,
      };

      // Handle profile picture based on provider
      if (provider === 'google' && profilePictureUrl) {
        // For Google OAuth, store as googleProfilePicture
        console.log('[UserProfileService] Storing Google profile picture');
        updateData.googleProfilePicture = profilePictureUrl;

        // Check if user has a custom picture
        const hasCustomPicture = existingProfile.profilePicture &&
          existingProfile.profilePicture !== existingProfile.googleProfilePicture;

        if (hasCustomPicture) {
          console.log('[UserProfileService] User has custom picture, preserving it');
          console.log('[UserProfileService] Custom picture:', existingProfile.profilePicture);
          console.log('[UserProfileService] Google picture will be stored as backup');
        } else {
          console.log('[UserProfileService] No custom picture, setting Google picture as active');
          updateData.profilePicture = profilePictureUrl;
        }
      } else if (profilePictureUrl) {
        // For custom uploads, set as profilePicture
        console.log('[UserProfileService] Storing custom profile picture');
        updateData.profilePicture = profilePictureUrl;
      }

      console.log('[UserProfileService] Update data:', updateData);

      const updated = await databases.updateDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.USER_PROFILES,
        existing.documents[0].$id,
        updateData
      );

      console.log('[UserProfileService] Profile updated successfully');
      return updated as unknown as UserProfile;
    } else {
      // Create new profile
      console.log('[UserProfileService] Creating new profile');

      // Prepare create data with all required fields
      const createData: Record<string, any> = {
        userId,
        email,
        name,
        provider,
      };

      // Handle profile picture based on provider
      if (provider === 'google' && profilePictureUrl) {
        console.log('[UserProfileService] New user with Google profile picture');
        createData.googleProfilePicture = profilePictureUrl;
        createData.profilePicture = profilePictureUrl;
        console.log('[UserProfileService] Both googleProfilePicture and profilePicture set to:', profilePictureUrl);
      } else if (profilePictureUrl) {
        console.log('[UserProfileService] New user with custom profile picture');
        createData.profilePicture = profilePictureUrl;
      }

      console.log('[UserProfileService] Create data:', createData);
      console.log('[UserProfileService] Database ID:', APP_DATABASE_ID);
      console.log('[UserProfileService] Collection ID:', APP_COLLECTIONS.USER_PROFILES);

      const created = await databases.createDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.USER_PROFILES,
        ID.unique(),
        createData
      );

      console.log('[UserProfileService] Profile created successfully:', created.$id);
      console.log('[UserProfileService] Created document:', created);
      return created as unknown as UserProfile;
    }
  } catch (error) {
    console.error('[UserProfileService] Error creating/updating user profile:', error);
    throw error;
  }
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log('[UserProfileService] Getting profile for userId:', userId);

    const result = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    console.log('[UserProfileService] Found profiles:', result.documents.length);

    if (result.documents.length > 0) {
      return result.documents[0] as unknown as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('[UserProfileService] Error getting user profile:', error);
    return null;
  }
}

/**
 * Get all user profiles (for admin purposes or friend search)
 */
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  try {
    const result = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES
    );
    return result.documents as unknown as UserProfile[];
  } catch (error) {
    console.error('[UserProfileService] Error getting all user profiles:', error);
    return [];
  }
}

/**
 * Update user profile picture
 */
export async function updateUserProfilePicture(
  userId: string,
  profilePictureUrl: string
): Promise<void> {
  try {
    console.log('[UserProfileService] Updating profile picture for userId:', userId);
    console.log('[UserProfileService] New picture URL:', profilePictureUrl);

    const existing = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (existing.documents.length > 0) {
      await databases.updateDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.USER_PROFILES,
        existing.documents[0].$id,
        {
          profilePicture: profilePictureUrl,
        }
      );
      console.log('[UserProfileService] Profile picture updated successfully');
    } else {
      console.error('[UserProfileService] No profile found for userId:', userId);
      throw new Error('User profile not found');
    }
  } catch (error) {
    console.error('[UserProfileService] Error updating profile picture:', error);
    throw error;
  }
}

/**
 * Update last login time
 */
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    const existing = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (existing.documents.length > 0) {
      await databases.updateDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.USER_PROFILES,
        existing.documents[0].$id,
        {
          lastLoginAt: new Date().toISOString(),
        }
      );
    }
  } catch (error) {
    console.error('[UserProfileService] Error updating last login:', error);
  }
}
