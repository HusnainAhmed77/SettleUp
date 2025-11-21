// Helper to migrate old group data to new JSON format

import { Group } from '@/lib/mockData';
import { GroupData } from '@/types/groupData';
import { groupComputationService } from './groupComputationService';
import { groupDataService } from './groupDataService';

/**
 * Convert old Group format to new GroupData format
 * @param group - Old group format
 * @returns New GroupData format
 */
export function convertGroupToGroupData(group: Group): GroupData {
  // Convert settlements to new format
  const settlements = (group.settlements || []).map(s => ({
    id: s.id,
    fromUserId: s.fromUserId,
    toUserId: s.toUserId,
    amountCents: s.amountCents,
    date: s.date instanceof Date ? s.date.toISOString() : typeof s.date === 'string' ? s.date : new Date(s.date).toISOString(),
    note: s.note,
  }));

  // Convert expenses to ensure dates are Date objects for computation
  const expensesForComputation = group.expenses.map(e => ({
    ...e,
    date: e.date instanceof Date ? e.date : new Date(e.date),
  }));

  // Compute derived data
  const computed = groupComputationService.computeGroupState(
    group.members,
    expensesForComputation,
    settlements
  );

  // Build GroupData object
  const groupData: GroupData = {
    groupId: group.id,
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    group: {
      id: group.id,
      name: group.name,
      description: group.description,
      userId: group.userId || '',
      currency: group.currency || 'USD',
      createdAt: group.createdAt instanceof Date 
        ? group.createdAt.toISOString() 
        : new Date(group.createdAt).toISOString(),
    },
    members: group.members,
    expenses: group.expenses.map(e => ({
      ...e,
      date: e.date instanceof Date ? e.date : new Date(e.date),
    })),
    settlements,
    computed,
  };

  return groupData;
}

/**
 * Migrate a group from old format to new JSON format
 * @param group - Old group format
 * @returns Promise that resolves when migration is complete
 */
export async function migrateGroupToJSON(group: Group): Promise<void> {
  try {
    console.log(`🔄 Migrating group to JSON: ${group.name} (${group.id})`);
    
    // Check if already migrated
    const exists = await groupDataService.groupDataExists(group.id);
    
    if (exists) {
      console.log(`⚠️ Group ${group.id} already has JSON data, skipping migration`);
      return;
    }

    // Convert to new format
    const groupData = convertGroupToGroupData(group);

    // Save to expenses_data collection
    await groupDataService.createGroupData(groupData);

    console.log(`✅ Successfully migrated group: ${group.name}`);
  } catch (error) {
    console.error(`❌ Error migrating group ${group.id}:`, error);
    throw error;
  }
}

/**
 * Check if a group has been migrated to JSON format
 * @param groupId - The group ID to check
 * @returns Promise with boolean indicating if migrated
 */
export async function isGroupMigrated(groupId: string): Promise<boolean> {
  return await groupDataService.groupDataExists(groupId);
}
