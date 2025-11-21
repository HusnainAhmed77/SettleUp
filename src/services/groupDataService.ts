// Service for interacting with expenses_data collection

import { databases, APP_DATABASE_ID, APP_COLLECTIONS, ID, Query } from '@/lib/appwrite';
import { GroupData, ExpensesDataDocument } from '@/types/groupData';
import { validateGroupData, parseAndValidateGroupData } from '@/lib/validation/groupDataSchema';

/**
 * Service for managing group data in JSON format
 */
export class GroupDataService {
  /**
   * Load group data from expenses_data collection
   * @param groupId - The group ID to load
   * @returns Promise with GroupData or null if not found
   */
  async loadGroupData(groupId: string): Promise<GroupData | null> {
    try {
      console.log(`📥 Loading group data for: ${groupId}`);
      
      // Query by groupId (unique index)
      const response = await databases.listDocuments(
        APP_DATABASE_ID,
        APP_COLLECTIONS.EXPENSES_DATA,
        [Query.equal('groupId', groupId), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        console.warn(`⚠️ No JSON document found for group: ${groupId}`);
        return null;
      }

      const doc = response.documents[0] as unknown as ExpensesDataDocument;
      console.log(`📄 Document found: ${doc.$id}`);
      console.log(`JSON data length: ${doc.jsonData.length} bytes`);
      
      // Parse and validate JSON
      const groupData = parseAndValidateGroupData(doc.jsonData);
      
      if (!groupData) {
        console.error(`❌ Invalid JSON data for group: ${groupId}`);
        return null;
      }

      console.log(`✅ Successfully loaded group data for: ${groupId}`);
      console.log(`Expenses loaded: ${groupData.expenses.length}`);
      console.log(`Settlements loaded: ${groupData.settlements.length}`);
      return groupData;
      
    } catch (error) {
      console.error(`❌ Error loading group data for ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Save group data to expenses_data collection
   * @param groupData - The group data to save
   * @returns Promise that resolves when save is complete
   */
  async saveGroupData(groupData: GroupData): Promise<void> {
    try {
      console.log(`💾 Saving group data for: ${groupData.groupId}`);
      console.log(`Expenses count: ${groupData.expenses.length}`);
      console.log(`Settlements count: ${groupData.settlements.length}`);
      
      // Validate before saving
      if (!validateGroupData(groupData)) {
        console.error('❌ Validation failed for group data');
        throw new Error('Invalid GroupData structure');
      }

      console.log('✅ Validation passed');

      // Update lastUpdated timestamp
      groupData.lastUpdated = new Date().toISOString();
      
      // Convert Date objects to ISO strings for JSON serialization
      const serializedGroupData = {
        ...groupData,
        expenses: groupData.expenses.map(e => ({
          ...e,
          date: e.date instanceof Date ? e.date.toISOString() : e.date,
        })),
        settlements: groupData.settlements.map(s => ({
          ...s,
          date: typeof s.date === 'string' ? s.date : new Date(s.date).toISOString(),
        })),
      };
      
      // Stringify JSON
      const jsonData = JSON.stringify(serializedGroupData);
      console.log(`JSON data length: ${jsonData.length} bytes`);
      
      // Check if document exists by querying directly (don't load the full data)
      const response = await databases.listDocuments(
        APP_DATABASE_ID,
        APP_COLLECTIONS.EXPENSES_DATA,
        [Query.equal('groupId', groupData.groupId), Query.limit(1)]
      );
      
      if (response.documents.length > 0) {
        // Update existing document
        console.log(`📝 Updating existing document: ${response.documents[0].$id}`);
        await databases.updateDocument(
          APP_DATABASE_ID,
          APP_COLLECTIONS.EXPENSES_DATA,
          response.documents[0].$id,
          {
            jsonData,
            version: groupData.version,
            lastUpdated: groupData.lastUpdated,
          }
        );
        console.log(`✅ Updated group data for: ${groupData.groupId} with ${groupData.expenses.length} expenses`);
      } else {
        // Create new document
        console.log(`➕ Creating new document for group: ${groupData.groupId}`);
        await this.createGroupData(groupData);
      }
      
    } catch (error) {
      console.error(`❌ Error saving group data for ${groupData.groupId}:`, error);
      throw error;
    }
  }

  /**
   * Create new group data document
   * @param groupData - The group data to create
   * @returns Promise with created GroupData
   */
  async createGroupData(groupData: GroupData): Promise<GroupData> {
    try {
      console.log(`➕ Creating group data for: ${groupData.groupId}`);
      
      // Validate before creating
      if (!validateGroupData(groupData)) {
        throw new Error('Invalid GroupData structure');
      }

      // Set timestamps
      groupData.lastUpdated = new Date().toISOString();
      
      // Stringify JSON
      const jsonData = JSON.stringify(groupData);
      
      // Create document without document-level permissions
      // Rely on collection-level permissions instead
      const doc = await databases.createDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.EXPENSES_DATA,
        ID.unique(),
        {
          groupId: groupData.groupId,
          jsonData,
          version: groupData.version,
          lastUpdated: groupData.lastUpdated,
        }
      );

      console.log(`✅ Created group data document: ${doc.$id} with permissions for ${groupData.members.length} members`);
      return groupData;
      
    } catch (error) {
      console.error(`❌ Error creating group data for ${groupData.groupId}:`, error);
      throw error;
    }
  }

  /**
   * Delete group data document
   * @param groupId - The group ID to delete
   * @returns Promise that resolves when deletion is complete
   */
  async deleteGroupData(groupId: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting group data for: ${groupId}`);
      
      // Find document by groupId
      const response = await databases.listDocuments(
        APP_DATABASE_ID,
        APP_COLLECTIONS.EXPENSES_DATA,
        [Query.equal('groupId', groupId), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        console.warn(`⚠️ No document found to delete for group: ${groupId}`);
        return;
      }

      // Delete document
      await databases.deleteDocument(
        APP_DATABASE_ID,
        APP_COLLECTIONS.EXPENSES_DATA,
        response.documents[0].$id
      );

      console.log(`✅ Deleted group data for: ${groupId}`);
      
    } catch (error) {
      console.error(`❌ Error deleting group data for ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Check if group data exists
   * @param groupId - The group ID to check
   * @returns Promise with boolean indicating existence
   */
  async groupDataExists(groupId: string): Promise<boolean> {
    try {
      const response = await databases.listDocuments(
        APP_DATABASE_ID,
        APP_COLLECTIONS.EXPENSES_DATA,
        [Query.equal('groupId', groupId), Query.limit(1)]
      );

      return response.documents.length > 0;
    } catch (error) {
      console.error(`❌ Error checking group data existence for ${groupId}:`, error);
      return false;
    }
  }

}

// Export singleton instance
export const groupDataService = new GroupDataService();
