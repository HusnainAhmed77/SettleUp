import { databases, storage, account, APP_DATABASE_ID, APP_COLLECTIONS, STORAGE_BUCKETS, Query } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { ProfileError, ProfileErrorCode } from '@/types/friends';
import { UserProfile, createOrUpdateUserProfile } from './userProfileService';

/**
 * ProfileService - Manages user profile pictures
 * Implements Requirements: 10.3, 10.4, 11.1, 11.2
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Upload profile picture to storage
 * @param userId - ID of the user
 * @param file - Image file to upload
 * @returns URL of the uploaded image
 * @throws ProfileError if validation fails
 */
export async function uploadProfilePicture(
  userId: string,
  file: File
): Promise<string> {
  try {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ProfileError(
        ProfileErrorCode.INVALID_FILE_TYPE,
        'Please upload an image file (JPG, PNG, GIF, or WebP)'
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ProfileError(
        ProfileErrorCode.FILE_TOO_LARGE,
        'Image must be smaller than 5MB'
      );
    }

    // Upload to Appwrite storage
    const fileId = ID.unique();
    const uploadedFile = await storage.createFile(
      STORAGE_BUCKETS.PROFILE_PICTURES,
      fileId,
      file
    );

    // Get file URL
    const fileUrl = storage.getFileView(
      STORAGE_BUCKETS.PROFILE_PICTURES,
      uploadedFile.$id
    );

    return fileUrl.toString();
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error;
    }
    console.error('Error uploading profile picture:', error);
    throw new ProfileError(
      ProfileErrorCode.UPLOAD_FAILED,
      'Failed to upload image. Please try again'
    );
  }
}

/**
 * Update profile picture URL in user profile
 * @param userId - ID of the user
 * @param pictureUrl - URL of the profile picture
 */
export async function updateProfilePicture(
  userId: string,
  pictureUrl: string
): Promise<void> {
  try {
    console.log('[ProfileService] Updating profile picture for userId:', userId);
    console.log('[ProfileService] New picture URL:', pictureUrl);
    
    // Get user profile
    const userResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    console.log('[ProfileService] Found profiles:', userResult.documents.length);

    if (userResult.documents.length === 0) {
      // Profile doesn't exist - create it
      console.log('[ProfileService] Profile not found, creating new profile');
      
      // Get user info from Appwrite account
      const accountInfo = await account.get();
      
      await createOrUpdateUserProfile(
        userId,
        accountInfo.email,
        accountInfo.name,
        'email', // Default provider
        pictureUrl
      );
      
      console.log('[ProfileService] Profile created with picture');
      return;
    }

    const userProfile = userResult.documents[0];
    console.log('[ProfileService] Updating document ID:', userProfile.$id);

    // Update profile picture
    const updated = await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      userProfile.$id,
      {
        profilePicture: pictureUrl,
      }
    );
    
    console.log('[ProfileService] Profile picture updated successfully:', updated);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
}

/**
 * Remove profile picture
 * @param userId - ID of the user
 */
export async function removeProfilePicture(userId: string): Promise<void> {
  try {
    // Get user profile
    const userResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (userResult.documents.length === 0) {
      throw new Error('User profile not found');
    }

    const userProfile = userResult.documents[0] as unknown as UserProfile;

    // If there's a custom profile picture, try to delete it from storage
    if (userProfile.profilePicture && !userProfile.profilePicture.includes('googleusercontent')) {
      try {
        // Extract file ID from URL if it's an Appwrite storage URL
        const fileIdMatch = userProfile.profilePicture.match(/files\/([^\/]+)\//);
        if (fileIdMatch && fileIdMatch[1]) {
          await storage.deleteFile(STORAGE_BUCKETS.PROFILE_PICTURES, fileIdMatch[1]);
        }
      } catch (error) {
        console.warn('Could not delete file from storage:', error);
        // Continue anyway - we'll still remove the reference
      }
    }

    // Update profile to remove picture (revert to Google picture if available)
    await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      userProfile.$id,
      {
        profilePicture: userProfile.googleProfilePicture || null,
      }
    );
  } catch (error) {
    console.error('Error removing profile picture:', error);
    throw error;
  }
}

/**
 * Get profile picture URL for a user
 * @param userId - ID of the user
 * @returns Profile picture URL or null if not set
 */
export async function getProfilePicture(userId: string): Promise<string | null> {
  try {
    console.log('[ProfileService] Getting profile picture for userId:', userId);
    
    const userResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    console.log('[ProfileService] Found profiles:', userResult.documents.length);

    if (userResult.documents.length === 0) {
      console.log('[ProfileService] No profile found for user');
      return null;
    }

    const userProfile = userResult.documents[0] as unknown as UserProfile;
    const pictureUrl = userProfile.profilePicture || userProfile.googleProfilePicture || null;
    
    console.log('[ProfileService] Profile picture URL:', pictureUrl);
    console.log('[ProfileService] Full profile:', userProfile);
    
    return pictureUrl;
  } catch (error) {
    console.error('Error getting profile picture:', error);
    return null;
  }
}

/**
 * Import Google profile picture on signup
 * @param userId - ID of the user
 * @param googlePictureUrl - URL of the Google profile picture
 */
export async function importGoogleProfilePicture(
  userId: string,
  googlePictureUrl: string
): Promise<void> {
  try {
    // Get user profile
    const userResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (userResult.documents.length === 0) {
      throw new Error('User profile not found');
    }

    const userProfile = userResult.documents[0] as unknown as UserProfile;

    // Store Google picture URL and set as current profile picture if none exists
    await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      userProfile.$id,
      {
        googleProfilePicture: googlePictureUrl,
        profilePicture: userProfile.profilePicture || googlePictureUrl,
      }
    );
  } catch (error) {
    console.error('Error importing Google profile picture:', error);
    // Don't throw - this is not critical
    console.warn(new ProfileError(
      ProfileErrorCode.GOOGLE_PICTURE_UNAVAILABLE,
      'Google profile picture not available'
    ));
  }
}

/**
 * Upload and set profile picture (combines upload and update)
 * @param userId - ID of the user
 * @param file - Image file to upload
 * @returns URL of the uploaded image
 */
export async function uploadAndSetProfilePicture(
  userId: string,
  file: File
): Promise<string> {
  try {
    // Upload the file
    const pictureUrl = await uploadProfilePicture(userId, file);

    // Update the profile
    await updateProfilePicture(userId, pictureUrl);

    return pictureUrl;
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error;
    }
    console.error('Error uploading and setting profile picture:', error);
    throw new ProfileError(
      ProfileErrorCode.UPLOAD_FAILED,
      'Failed to upload and set profile picture'
    );
  }
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns True if valid, throws ProfileError if invalid
 */
export function validateImageFile(file: File): boolean {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ProfileError(
      ProfileErrorCode.INVALID_FILE_TYPE,
      'Please upload an image file (JPG, PNG, GIF, or WebP)'
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new ProfileError(
      ProfileErrorCode.FILE_TOO_LARGE,
      'Image must be smaller than 5MB'
    );
  }

  return true;
}
