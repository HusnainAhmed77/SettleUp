import { databases, APP_DATABASE_ID, APP_COLLECTIONS, Query } from '../appwrite';
import { ID, Permission, Role } from 'appwrite';

// TypeScript Interfaces
export interface Group {
  $id: string;
  userId: string; // Creator/owner of the group
  name: string;
  description: string;
  members: string[];
  sharedWith?: string[]; // Array of user IDs who have access to this group
}

export interface CreateGroupData {
  name: string;
  description: string;
  members: Array<{ id: string; name: string; email: string }>;
}

/**
 * Fetches all groups for the current user (created + shared)
 * @param userId Current user's ID
 * @returns Promise with array of groups
 */
export async function getUserGroups(userId: string): Promise<Group[]> {
  try {
    // Get groups created by user
    const createdResponse = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
    );

    // Get groups shared with user
    const sharedResponse = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      [Query.equal('sharedWith', userId), Query.orderDesc('$createdAt')]
    );

    // Combine and deduplicate
    const allGroups = [...createdResponse.documents, ...sharedResponse.documents];
    const uniqueGroups = Array.from(
      new Map(allGroups.map(doc => [doc.$id, doc])).values()
    );

    return uniqueGroups.map(doc => ({
      $id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      description: doc.description,
      members: JSON.parse(doc.members || '[]'),
      sharedWith: doc.sharedWith || [], // Already an array from Appwrite
    }));
  } catch (error) {
    console.error('Error fetching user groups:', error);
    throw error;
  }
}

/**
 * Creates a new group
 * @param userId Current user's ID
 * @param data Group data
 * @param sharedWithUserIds Optional array of user IDs to share the group with
 * @returns Promise with created group
 */
export async function createGroup(
  userId: string,
  data: CreateGroupData,
  sharedWithUserIds: string[] = []
): Promise<Group> {
  try {
    const groupData = {
      userId, // userId serves as the admin/creator
      name: data.name,
      description: data.description,
      members: JSON.stringify(data.members), // Stringify members array
      sharedWith: sharedWithUserIds, // Initialize with provided user IDs (Appwrite array type)
    };

    // Set permissions: all authenticated users can read, only creator can update/delete
    const permissions = [
      Permission.read(Role.users()), // Any authenticated user can read
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId))
    ];

    const response = await databases.createDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      ID.unique(),
      groupData,
      permissions
    );

    return {
      $id: response.$id,
      userId: response.userId,
      name: response.name,
      description: response.description,
      members: JSON.parse(response.members || '[]'),
      sharedWith: response.sharedWith || [], // Already an array from Appwrite
    };
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

/**
 * Updates a group
 * @param groupId Group ID to update
 * @param data Partial group data to update
 * @returns Promise with updated group
 */
export async function updateGroup(
  groupId: string,
  data: Partial<CreateGroupData>
): Promise<Group> {
  try {
    const updateData: any = {
      ...data,
    };
    
    // Stringify members if provided
    if (data.members) {
      updateData.members = JSON.stringify(data.members);
    }
    
    const response = await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      groupId,
      updateData
    );

    return {
      $id: response.$id,
      userId: response.userId,
      name: response.name,
      description: response.description,
      members: JSON.parse(response.members || '[]'),
      sharedWith: response.sharedWith || [], // Already an array from Appwrite
    };
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
}

/**
 * Deletes a group
 * @param groupId Group ID to delete
 */
export async function deleteGroup(groupId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      groupId
    );
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
}

/**
 * Gets a single group by ID
 * @param groupId Group ID
 * @returns Promise with group
 */
export async function getGroup(groupId: string): Promise<Group> {
  try {
    const response = await databases.getDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      groupId
    );

    return {
      $id: response.$id,
      userId: response.userId,
      name: response.name,
      description: response.description,
      members: JSON.parse(response.members || '[]'),
      sharedWith: response.sharedWith || [], // Already an array from Appwrite
    };
  } catch (error) {
    console.error('Error fetching group:', error);
    throw error;
  }
}

/**
 * Add friend to group (updates sharedWith array)
 * @param groupId Group ID
 * @param friendUserId Friend's user ID to add
 * @returns Promise with updated group
 */
export async function addFriendToGroup(
  groupId: string,
  friendUserId: string
): Promise<Group> {
  try {
    // Get current group
    const group = await getGroup(groupId);
    
    // Add friend to sharedWith array if not already there
    const sharedWith = group.sharedWith || [];
    if (!sharedWith.includes(friendUserId)) {
      sharedWith.push(friendUserId);
    }

    // Update group
    const response = await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      groupId,
      {
        sharedWith: sharedWith, // Pass array directly (Appwrite array type)
      }
    );

    return {
      $id: response.$id,
      userId: response.userId,
      name: response.name,
      description: response.description,
      members: JSON.parse(response.members || '[]'),
      sharedWith: response.sharedWith || [], // Already an array from Appwrite
    };
  } catch (error) {
    console.error('Error adding friend to group:', error);
    throw error;
  }
}

/**
 * Remove friend from group (updates sharedWith array)
 * @param groupId Group ID
 * @param friendUserId Friend's user ID to remove
 * @returns Promise with updated group
 */
export async function removeFriendFromGroup(
  groupId: string,
  friendUserId: string
): Promise<Group> {
  try {
    // Get current group
    const group = await getGroup(groupId);
    
    // Remove friend from sharedWith array
    const sharedWith = (group.sharedWith || []).filter(id => id !== friendUserId);

    // Update group
    const response = await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      groupId,
      {
        sharedWith: sharedWith, // Pass array directly (Appwrite array type)
      }
    );

    return {
      $id: response.$id,
      userId: response.userId,
      name: response.name,
      description: response.description,
      members: JSON.parse(response.members || '[]'),
      sharedWith: response.sharedWith || [], // Already an array from Appwrite
    };
  } catch (error) {
    console.error('Error removing friend from group:', error);
    throw error;
  }
}

/**
 * Get groups created by user
 * @param userId User ID
 * @returns Promise with array of groups created by user
 */
export async function getCreatedGroups(userId: string): Promise<Group[]> {
  try {
    const response = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
    );

    return response.documents.map(doc => ({
      $id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      description: doc.description,
      members: JSON.parse(doc.members || '[]'),
      sharedWith: doc.sharedWith || [], // Already an array from Appwrite
    }));
  } catch (error) {
    console.error('Error fetching created groups:', error);
    throw error;
  }
}

/**
 * Get groups shared with user
 * @param userId User ID
 * @returns Promise with array of groups shared with user
 */
export async function getSharedGroups(userId: string): Promise<Group[]> {
  try {
    const response = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      [Query.equal('sharedWith', userId), Query.orderDesc('$createdAt')]
    );

    return response.documents.map(doc => ({
      $id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      description: doc.description,
      members: JSON.parse(doc.members || '[]'),
      sharedWith: doc.sharedWith || [], // Already an array from Appwrite
    }));
  } catch (error) {
    console.error('Error fetching shared groups:', error);
    throw error;
  }
}

/**
 * Check if user has access to group
 * @param groupId Group ID
 * @param userId User ID
 * @returns Promise with boolean indicating access
 */
export async function hasGroupAccess(
  groupId: string,
  userId: string
): Promise<boolean> {
  try {
    const group = await getGroup(groupId);
    
    // User has access if they created the group or it's shared with them
    return group.userId === userId || (group.sharedWith || []).includes(userId);
  } catch (error) {
    console.error('Error checking group access:', error);
    return false;
  }
}
