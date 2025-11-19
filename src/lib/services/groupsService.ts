import { databases, APP_DATABASE_ID, APP_COLLECTIONS, Query } from '../appwrite';
import { ID, Permission, Role } from 'appwrite';

// TypeScript Interfaces
export interface Group {
  $id: string;
  userId: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupData {
  name: string;
  description: string;
  members: string[];
}

/**
 * Fetches all groups for the current user
 * @param userId Current user's ID
 * @returns Promise with array of groups
 */
export async function getUserGroups(userId: string): Promise<Group[]> {
  try {
    const response = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      [Query.equal('userId', userId), Query.orderDesc('createdAt')]
    );

    return response.documents.map(doc => ({
      $id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      description: doc.description,
      members: doc.members,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
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
 * @returns Promise with created group
 */
export async function createGroup(
  userId: string,
  data: CreateGroupData
): Promise<Group> {
  try {
    const now = new Date().toISOString();
    
    const groupData = {
      userId,
      name: data.name,
      description: data.description,
      members: data.members,
      createdAt: now,
      updatedAt: now,
    };

    const response = await databases.createDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      ID.unique(),
      groupData,
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );

    return {
      $id: response.$id,
      userId: response.userId,
      name: response.name,
      description: response.description,
      members: response.members,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
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
      updatedAt: new Date().toISOString(),
    };

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
      members: response.members,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
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
      members: response.members,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching group:', error);
    throw error;
  }
}
