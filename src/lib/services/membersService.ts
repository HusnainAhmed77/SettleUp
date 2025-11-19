import { databases, APP_DATABASE_ID, APP_COLLECTIONS, Query } from '../appwrite';
import { ID, Permission, Role } from 'appwrite';

// TypeScript Interfaces
export interface MemberNames {
  $id: string;
  userId: string;
  names: string[];
  nameFrequency: Record<string, number>;
  updatedAt: string;
}

/**
 * Gets member names for autocomplete
 * @param userId Current user's ID
 * @returns Promise with array of member names
 */
export async function getMemberNames(userId: string): Promise<string[]> {
  try {
    const response = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.MEMBER_NAMES,
      [Query.equal('userId', userId), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return [];
    }

    const doc = response.documents[0];
    return doc.names || [];
  } catch (error) {
    console.error('Error fetching member names:', error);
    return [];
  }
}

/**
 * Adds new member names and updates frequency
 * @param userId Current user's ID
 * @param names Array of names to add
 */
export async function addMemberNames(userId: string, names: string[]): Promise<void> {
  try {
    // Fetch existing document
    const response = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.MEMBER_NAMES,
      [Query.equal('userId', userId), Query.limit(1)]
    );

    const now = new Date().toISOString();

    if (response.documents.length === 0) {
      // Create new document
      const nameFrequency: Record<string, number> = {};
      names.forEach(name => {
        nameFrequency[name] = 1;
      });

      const uniqueNames = Array.from(new Set(names));

      await databases.createDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.MEMBER_NAMES,
        ID.unique(),
        {
          userId,
          names: uniqueNames,
          nameFrequency: JSON.stringify(nameFrequency),
          updatedAt: now,
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      );
    } else {
      // Update existing document
      const doc = response.documents[0];
      const existingNames: string[] = doc.names || [];
      const existingFrequency: Record<string, number> = 
        typeof doc.nameFrequency === 'string' 
          ? JSON.parse(doc.nameFrequency) 
          : doc.nameFrequency || {};

      // Add new names and update frequency
      names.forEach(name => {
        if (!existingNames.includes(name)) {
          existingNames.push(name);
        }
        existingFrequency[name] = (existingFrequency[name] || 0) + 1;
      });

      await databases.updateDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.MEMBER_NAMES,
        doc.$id,
        {
          names: existingNames,
          nameFrequency: JSON.stringify(existingFrequency),
          updatedAt: now,
        }
      );
    }
  } catch (error) {
    console.error('Error adding member names:', error);
    throw error;
  }
}

/**
 * Gets member name suggestions sorted by frequency
 * @param userId Current user's ID
 * @param query Search query
 * @returns Promise with array of suggested names
 */
export async function getMemberSuggestions(
  userId: string,
  query: string
): Promise<string[]> {
  try {
    const response = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.MEMBER_NAMES,
      [Query.equal('userId', userId), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return [];
    }

    const doc = response.documents[0];
    const names: string[] = doc.names || [];
    const frequency: Record<string, number> = 
      typeof doc.nameFrequency === 'string'
        ? JSON.parse(doc.nameFrequency)
        : doc.nameFrequency || {};

    // Filter names by query
    const filtered = names.filter(name =>
      name.toLowerCase().includes(query.toLowerCase())
    );

    // Sort by frequency (most used first)
    filtered.sort((a, b) => (frequency[b] || 0) - (frequency[a] || 0));

    return filtered;
  } catch (error) {
    console.error('Error getting member suggestions:', error);
    return [];
  }
}
