import { databases, APP_DATABASE_ID, APP_COLLECTIONS, Query } from '@/lib/appwrite';
import { FriendError, FriendErrorCode } from '@/types/friends';
import { UserProfile } from './userProfileService';

/**
 * FriendService - Manages friend connections between users
 * Simplified approach: Store friend IDs and names as array attributes in user_profiles
 * - friendIds: string[] - Array of friend user IDs
 * - friendNames: string[] - Array of friend names (parallel array)
 * Implements Requirements: 1.1, 1.2, 1.3, 2.2, 2.3, 14.1
 */

/**
 * Search for users by email or name
 * @param query - Search query (email or name)
 * @param currentUserId - ID of the user performing the search
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of matching user profiles
 */
export async function searchUsers(
  query: string,
  currentUserId: string,
  limit: number = 10
): Promise<UserProfile[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const trimmedQuery = query.trim();

    // Search by email (exact match)
    const emailResults = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [
        Query.equal('email', trimmedQuery),
        Query.limit(limit)
      ]
    );

    // If no exact email match, try to get all users and filter client-side
    let nameResults = { documents: [] as any[] };
    if (emailResults.documents.length === 0) {
      const allUsers = await databases.listDocuments(
        APP_DATABASE_ID,
        APP_COLLECTIONS.USER_PROFILES,
        [Query.limit(100)]
      );
      
      // Filter by name or email containing the query (case-insensitive)
      nameResults.documents = allUsers.documents.filter(doc => 
        doc.name?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        doc.email?.toLowerCase().includes(trimmedQuery.toLowerCase())
      ).slice(0, limit);
    }

    // Combine and deduplicate results
    const allResults = [...emailResults.documents, ...nameResults.documents];
    const uniqueResults = Array.from(
      new Map(allResults.map(doc => [doc.$id, doc])).values()
    );

    // Filter out current user and limit results
    const filteredResults = uniqueResults
      .filter(doc => doc.userId !== currentUserId)
      .slice(0, limit);

    return filteredResults as unknown as UserProfile[];
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

/**
 * Add a friend by user ID (bidirectional)
 * @param userId - ID of the user adding the friend
 * @param friendUserId - ID of the user to be added as friend
 * @returns The friend's user profile
 * @throws FriendError if validation fails
 */
export async function addFriend(
  userId: string,
  friendUserId: string
): Promise<UserProfile> {
  try {
    // Validate: Cannot add yourself as friend
    if (userId === friendUserId) {
      throw new FriendError(
        FriendErrorCode.SELF_ADD_FORBIDDEN,
        'You cannot add yourself as a friend'
      );
    }

    // Get current user's profile
    const currentUserResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (currentUserResult.documents.length === 0) {
      throw new FriendError(
        FriendErrorCode.USER_NOT_FOUND,
        'Current user profile not found'
      );
    }

    const currentUser = currentUserResult.documents[0] as unknown as UserProfile;
    const currentFriendIds = currentUser.friendIds || [];
    const currentFriendNames = currentUser.friendNames || [];

    // Check if friend user exists
    const friendResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', friendUserId)]
    );

    if (friendResult.documents.length === 0) {
      throw new FriendError(
        FriendErrorCode.USER_NOT_FOUND,
        'No user found with that ID'
      );
    }

    const friend = friendResult.documents[0] as unknown as UserProfile;
    const friendFriendIds = friend.friendIds || [];
    const friendFriendNames = friend.friendNames || [];

    // Check if already friends
    if (currentFriendIds.includes(friendUserId)) {
      throw new FriendError(
        FriendErrorCode.ALREADY_EXISTS,
        'This user is already in your friend list'
      );
    }

    // Add friend to current user's arrays
    await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      currentUser.$id,
      {
        friendIds: [...currentFriendIds, friendUserId],
        friendNames: [...currentFriendNames, friend.name],
      }
    );

    // Add current user to friend's arrays (bidirectional)
    await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      friend.$id,
      {
        friendIds: [...friendFriendIds, userId],
        friendNames: [...friendFriendNames, currentUser.name],
      }
    );

    return friend;
  } catch (error) {
    if (error instanceof FriendError) {
      throw error;
    }
    console.error('Error adding friend:', error);
    throw error;
  }
}

/**
 * Get all friends for a user
 * @param userId - ID of the user
 * @returns Array of friend user profiles
 */
export async function getFriends(userId: string): Promise<UserProfile[]> {
  try {
    // Get user's profile
    const userResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (userResult.documents.length === 0) {
      return [];
    }

    const user = userResult.documents[0] as unknown as UserProfile;
    const friendIds = user.friendIds || [];

    if (friendIds.length === 0) {
      return [];
    }

    // Get friend profiles
    const friendsResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', friendIds)]
    );

    return friendsResult.documents as unknown as UserProfile[];
  } catch (error) {
    console.error('Error getting friends:', error);
    return [];
  }
}

/**
 * Remove a friend (bidirectional)
 * @param userId - ID of the user removing the friend
 * @param friendUserId - ID of the friend to remove
 */
export async function removeFriend(
  userId: string,
  friendUserId: string
): Promise<void> {
  try {
    // Get current user's profile
    const currentUserResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (currentUserResult.documents.length > 0) {
      const currentUser = currentUserResult.documents[0] as unknown as UserProfile;
      const currentFriendIds = currentUser.friendIds || [];
      const currentFriendNames = currentUser.friendNames || [];
      
      // Find index of friend to remove
      const friendIndex = currentFriendIds.indexOf(friendUserId);
      
      if (friendIndex !== -1) {
        // Remove friend from both arrays
        const updatedIds = currentFriendIds.filter((_, i) => i !== friendIndex);
        const updatedNames = currentFriendNames.filter((_, i) => i !== friendIndex);
        
        await databases.updateDocument(
          APP_DATABASE_ID,
          APP_COLLECTIONS.USER_PROFILES,
          currentUser.$id,
          {
            friendIds: updatedIds,
            friendNames: updatedNames,
          }
        );
      }
    }

    // Get friend's profile
    const friendResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', friendUserId)]
    );

    if (friendResult.documents.length > 0) {
      const friend = friendResult.documents[0] as unknown as UserProfile;
      const friendFriendIds = friend.friendIds || [];
      const friendFriendNames = friend.friendNames || [];
      
      // Find index of current user to remove
      const userIndex = friendFriendIds.indexOf(userId);
      
      if (userIndex !== -1) {
        // Remove current user from both arrays
        const updatedIds = friendFriendIds.filter((_, i) => i !== userIndex);
        const updatedNames = friendFriendNames.filter((_, i) => i !== userIndex);
        
        await databases.updateDocument(
          APP_DATABASE_ID,
          APP_COLLECTIONS.USER_PROFILES,
          friend.$id,
          {
            friendIds: updatedIds,
            friendNames: updatedNames,
          }
        );
      }
    }
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
}

/**
 * Check if two users are friends
 * @param userId1 - First user ID
 * @param userId2 - Second user ID
 * @returns True if users are friends, false otherwise
 */
export async function areFriends(
  userId1: string,
  userId2: string
): Promise<boolean> {
  try {
    const userResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId1)]
    );

    if (userResult.documents.length === 0) {
      return false;
    }

    const user = userResult.documents[0] as unknown as UserProfile;
    const friendIds = user.friendIds || [];

    return friendIds.includes(userId2);
  } catch (error) {
    console.error('Error checking friendship:', error);
    return false;
  }
}

/**
 * Get a specific friend's profile
 * @param userId - ID of the user
 * @param friendUserId - ID of the friend
 * @returns Friend's user profile or null if not found
 */
export async function getFriend(
  userId: string,
  friendUserId: string
): Promise<UserProfile | null> {
  try {
    // Check if they are friends
    const isFriend = await areFriends(userId, friendUserId);
    
    if (!isFriend) {
      return null;
    }

    // Get friend's profile
    const friendResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', friendUserId)]
    );

    if (friendResult.documents.length > 0) {
      return friendResult.documents[0] as unknown as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting friend:', error);
    return null;
  }
}

/**
 * Get friend count for a user
 * @param userId - ID of the user
 * @returns Number of friends
 */
export async function getFriendCount(userId: string): Promise<number> {
  try {
    const userResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (userResult.documents.length === 0) {
      return 0;
    }

    const user = userResult.documents[0] as unknown as UserProfile;
    const friendIds = user.friendIds || [];

    return friendIds.length;
  } catch (error) {
    console.error('Error getting friend count:', error);
    return 0;
  }
}

/**
 * Search user's friends by name
 * @param userId - ID of the user
 * @param query - Search query for friend name
 * @returns Array of matching friend profiles
 */
export async function searchFriendsByName(
  userId: string,
  query: string
): Promise<UserProfile[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Get user's profile
    const userResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (userResult.documents.length === 0) {
      return [];
    }

    const user = userResult.documents[0] as unknown as UserProfile;
    const friendIds = user.friendIds || [];
    const friendNames = user.friendNames || [];

    // Find matching friend names (case-insensitive)
    const lowerQuery = query.toLowerCase();
    const matchingIndices = friendNames
      .map((name, i) => name.toLowerCase().includes(lowerQuery) ? i : -1)
      .filter(i => i !== -1);

    if (matchingIndices.length === 0) {
      return [];
    }

    // Get matching friend IDs
    const matchingFriendIds = matchingIndices.map(i => friendIds[i]);

    // Get friend profiles
    const friendsResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', matchingFriendIds)]
    );

    return friendsResult.documents as unknown as UserProfile[];
  } catch (error) {
    console.error('Error searching friends by name:', error);
    return [];
  }
}
