import { databases, APP_DATABASE_ID, APP_COLLECTIONS, Query, ID } from '@/lib/appwrite';
import { FriendError, FriendErrorCode } from '@/types/friends';
import { UserProfile } from './userProfileService';

/**
 * FriendService - Manages friend connections between users
 * Uses dedicated 'friends' collection to store friend relationships
 * Implements Requirements: 1.1, 1.2, 1.3, 2.2, 2.3, 14.1
 */

export interface Friend {
  $id: string;
  userId: string; // User who added the friend
  friendUserId: string; // The friend's user ID
  name: string; // Friend's name
  email: string; // Friend's email
  status: string; // 'pending', 'accepted', 'blocked'
  googleProfilePicture?: string;
  $createdAt: string;
  $updatedAt: string;
}

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
 * Add a friend by user ID (creates entry in BOTH friends collection AND userprofiles)
 * @param userId - ID of the user adding the friend
 * @param friendUserId - ID of the user to be added as friend
 * @returns The created friend relationship
 * @throws FriendError if validation fails
 */
export async function addFriend(
  userId: string,
  friendUserId: string
): Promise<Friend> {
  try {
    // Validate: Cannot add yourself as friend
    if (userId === friendUserId) {
      throw new FriendError(
        FriendErrorCode.SELF_ADD_FORBIDDEN,
        'You cannot add yourself as a friend'
      );
    }

    // Check if friendship already exists
    const existingFriendship = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.FRIENDS,
      [
        Query.equal('userId', userId),
        Query.equal('friendUserId', friendUserId)
      ]
    );

    if (existingFriendship.documents.length > 0) {
      throw new FriendError(
        FriendErrorCode.ALREADY_EXISTS,
        'This user is already in your friend list'
      );
    }

    // Get friend's user profile
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

    const friendProfile = friendResult.documents[0] as unknown as UserProfile;

    // 1. Create friend relationship in friends collection
    const friendDoc = await databases.createDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.FRIENDS,
      ID.unique(),
      {
        userId,
        friendUserId,
        name: friendProfile.name,
        email: friendProfile.email,
        status: 'accepted',
        googleProfilePicture: friendProfile.googleProfilePicture || null,
      }
    );

    // 2. Create REVERSE friend relationship in friends collection (bidirectional)
    await databases.createDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.FRIENDS,
      ID.unique(),
      {
        userId: friendUserId,  // Friend is the owner
        friendUserId: userId,  // Current user is the friend
        name: '', // Will be filled from current user's profile
        email: '', // Will be filled from current user's profile
        status: 'accepted',
        googleProfilePicture: null,
      }
    );

    // 3. Get current user's profile for the reverse friendship
    const currentUserResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (currentUserResult.documents.length > 0) {
      const currentUser = currentUserResult.documents[0];
      
      // Update current user's friendId and friendNames arrays
      const currentFriendId = (currentUser.friendId as string[]) || [];
      const currentFriendNames = (currentUser.friendNames as string[]) || [];

      await databases.updateDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.USER_PROFILES,
        currentUser.$id,
        {
          friendId: [...currentFriendId, friendUserId],
          friendNames: [...currentFriendNames, friendProfile.name],
        }
      );

      // Update the reverse friendship with current user's name and email
      const reverseFriendship = await databases.listDocuments(
        APP_DATABASE_ID,
        APP_COLLECTIONS.FRIENDS,
        [
          Query.equal('userId', friendUserId),
          Query.equal('friendUserId', userId)
        ]
      );

      if (reverseFriendship.documents.length > 0) {
        await databases.updateDocument(
          APP_DATABASE_ID,
          APP_COLLECTIONS.FRIENDS,
          reverseFriendship.documents[0].$id,
          {
            name: currentUser.name,
            email: currentUser.email,
            googleProfilePicture: currentUser.googleProfilePicture || null,
          }
        );
      }
    }

    // 4. Update friend's friendId and friendNames arrays
    const friendFriendId = (friendProfile.friendId as string[]) || [];
    const friendFriendNames = (friendProfile.friendNames as string[]) || [];

    await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      friendResult.documents[0].$id,
      {
        friendId: [...friendFriendId, userId],
        friendNames: [...friendFriendNames, currentUserResult.documents[0].name],
      }
    );

    return friendDoc as unknown as Friend;
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
    // Get all friend relationships where this user is the owner
    const friendsResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.FRIENDS,
      [
        Query.equal('userId', userId),
        Query.equal('status', 'accepted')
      ]
    );

    if (friendsResult.documents.length === 0) {
      return [];
    }

    // Extract friend user IDs
    const friendUserIds = friendsResult.documents.map((doc: any) => doc.friendUserId);

    // Get friend profiles from userprofiles collection
    const profilesResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', friendUserIds)]
    );

    return profilesResult.documents as unknown as UserProfile[];
  } catch (error) {
    console.error('Error getting friends:', error);
    return [];
  }
}

/**
 * Remove a friend (removes from BOTH friends collection AND userprofiles)
 * @param userId - ID of the user removing the friend
 * @param friendUserId - ID of the friend to remove
 */
export async function removeFriend(
  userId: string,
  friendUserId: string
): Promise<void> {
  try {
    // 1. Delete from friends collection
    const friendshipResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.FRIENDS,
      [
        Query.equal('userId', userId),
        Query.equal('friendUserId', friendUserId)
      ]
    );

    if (friendshipResult.documents.length > 0) {
      await databases.deleteDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.FRIENDS,
        friendshipResult.documents[0].$id
      );
    }

    // 2. Remove from current user's friendId and friendNames arrays in userprofiles
    const currentUserResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', userId)]
    );

    if (currentUserResult.documents.length > 0) {
      const currentUser = currentUserResult.documents[0];
      const currentFriendId = (currentUser.friendId as string[]) || [];
      const currentFriendNames = (currentUser.friendNames as string[]) || [];
      
      const friendIndex = currentFriendId.indexOf(friendUserId);
      
      if (friendIndex !== -1) {
        const updatedIds = currentFriendId.filter((_, i) => i !== friendIndex);
        const updatedNames = currentFriendNames.filter((_, i) => i !== friendIndex);
        
        await databases.updateDocument(
          APP_DATABASE_ID,
          APP_COLLECTIONS.USER_PROFILES,
          currentUser.$id,
          {
            friendId: updatedIds,
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
    const friendshipResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.FRIENDS,
      [
        Query.equal('userId', userId1),
        Query.equal('friendUserId', userId2),
        Query.equal('status', 'accepted')
      ]
    );

    return friendshipResult.documents.length > 0;
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
    const friendsResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.FRIENDS,
      [
        Query.equal('userId', userId),
        Query.equal('status', 'accepted')
      ]
    );

    return friendsResult.documents.length;
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

    // Get all friends for this user
    const friendsResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.FRIENDS,
      [
        Query.equal('userId', userId),
        Query.equal('status', 'accepted')
      ]
    );

    if (friendsResult.documents.length === 0) {
      return [];
    }

    // Filter friends by name (case-insensitive) - client-side filtering
    const lowerQuery = query.toLowerCase();
    const matchingFriends = friendsResult.documents.filter((doc: any) => 
      doc.name?.toLowerCase().includes(lowerQuery) ||
      doc.email?.toLowerCase().includes(lowerQuery)
    );

    if (matchingFriends.length === 0) {
      return [];
    }

    // Get matching friend user IDs
    const matchingFriendIds = matchingFriends.map((doc: any) => doc.friendUserId);

    // Get friend profiles from userprofiles collection
    const profilesResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.USER_PROFILES,
      [Query.equal('userId', matchingFriendIds)]
    );

    return profilesResult.documents as unknown as UserProfile[];
  } catch (error) {
    console.error('Error searching friends by name:', error);
    return [];
  }
}
