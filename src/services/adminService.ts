import { databases, APP_DATABASE_ID, APP_COLLECTIONS, Query } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { AdminSettlement, AdminError, AdminErrorCode, GroupEnhanced } from '@/types/friends';

/**
 * AdminService - Manages admin settlement functionality
 * Implements Requirements: 6.2, 7.3, 7.4, 7.5, 8.1
 */

/**
 * Check if user is admin of a group
 * @param groupId - ID of the group
 * @param userId - ID of the user to check
 * @returns True if user is admin, false otherwise
 */
export async function isGroupAdmin(
  groupId: string,
  userId: string
): Promise<boolean> {
  try {
    const groupResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.GROUPS,
      [Query.equal('$id', groupId)]
    );

    if (groupResult.documents.length === 0) {
      return false;
    }

    const group = groupResult.documents[0] as unknown as GroupEnhanced;
    return group.adminUserId === userId || group.userId === userId;
  } catch (error) {
    console.error('Error checking group admin:', error);
    return false;
  }
}

/**
 * Record an admin settlement
 * @param groupId - ID of the group
 * @param adminUserId - ID of the admin recording the settlement
 * @param fromUserId - ID of the user who paid
 * @param toUserId - ID of the user who received payment
 * @param amountCents - Amount in cents
 * @param notes - Optional notes about the settlement
 * @returns The created admin settlement record
 * @throws AdminError if validation fails
 */
export async function recordAdminSettlement(
  groupId: string,
  adminUserId: string,
  fromUserId: string,
  toUserId: string,
  amountCents: number,
  notes?: string
): Promise<AdminSettlement> {
  try {
    // Verify admin status
    const isAdmin = await isGroupAdmin(groupId, adminUserId);
    if (!isAdmin) {
      throw new AdminError(
        AdminErrorCode.UNAUTHORIZED,
        'Only group admins can perform this action'
      );
    }

    // Validate amount
    if (amountCents <= 0) {
      throw new AdminError(
        AdminErrorCode.SETTLEMENT_INVALID,
        'Invalid settlement: amount must be positive'
      );
    }

    // Validate users are different
    if (fromUserId === toUserId) {
      throw new AdminError(
        AdminErrorCode.SETTLEMENT_INVALID,
        'Invalid settlement: payer and payee must be different'
      );
    }

    // Create settlement record
    const now = new Date().toISOString();
    const settlement = await databases.createDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.ADMIN_SETTLEMENTS,
      ID.unique(),
      {
        groupId,
        adminUserId,
        fromUserId,
        toUserId,
        amountCents,
        currency: 'USD',
        notes: notes || null,
        recordedAt: now,
      }
    );

    return settlement as unknown as AdminSettlement;
  } catch (error) {
    if (error instanceof AdminError) {
      throw error;
    }
    console.error('Error recording admin settlement:', error);
    throw error;
  }
}

/**
 * Get all admin settlements for a group
 * @param groupId - ID of the group
 * @returns Array of admin settlements
 */
export async function getGroupAdminSettlements(
  groupId: string
): Promise<AdminSettlement[]> {
  try {
    const result = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.ADMIN_SETTLEMENTS,
      [
        Query.equal('groupId', groupId),
        Query.orderDesc('recordedAt')
      ]
    );

    return result.documents as unknown as AdminSettlement[];
  } catch (error) {
    console.error('Error getting group admin settlements:', error);
    return [];
  }
}

/**
 * Get admin settlements involving a specific user
 * @param userId - ID of the user
 * @returns Array of admin settlements where user is payer or payee
 */
export async function getUserAdminSettlements(
  userId: string
): Promise<AdminSettlement[]> {
  try {
    // Get settlements where user is the payer
    const fromResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.ADMIN_SETTLEMENTS,
      [
        Query.equal('fromUserId', userId),
        Query.orderDesc('recordedAt')
      ]
    );

    // Get settlements where user is the payee
    const toResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.ADMIN_SETTLEMENTS,
      [
        Query.equal('toUserId', userId),
        Query.orderDesc('recordedAt')
      ]
    );

    // Combine and sort by date
    const allSettlements = [
      ...fromResult.documents,
      ...toResult.documents
    ] as unknown as AdminSettlement[];

    // Remove duplicates and sort
    const uniqueSettlements = Array.from(
      new Map(allSettlements.map(s => [s.$id, s])).values()
    );

    return uniqueSettlements.sort((a, b) => 
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );
  } catch (error) {
    console.error('Error getting user admin settlements:', error);
    return [];
  }
}

/**
 * Get admin settlements recorded by a specific admin
 * @param adminUserId - ID of the admin
 * @returns Array of admin settlements recorded by this admin
 */
export async function getAdminRecordedSettlements(
  adminUserId: string
): Promise<AdminSettlement[]> {
  try {
    const result = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.ADMIN_SETTLEMENTS,
      [
        Query.equal('adminUserId', adminUserId),
        Query.orderDesc('recordedAt')
      ]
    );

    return result.documents as unknown as AdminSettlement[];
  } catch (error) {
    console.error('Error getting admin recorded settlements:', error);
    return [];
  }
}

/**
 * Delete an admin settlement (admin only)
 * @param settlementId - ID of the settlement to delete
 * @param userId - ID of the user attempting to delete
 * @throws AdminError if user is not authorized
 */
export async function deleteAdminSettlement(
  settlementId: string,
  userId: string
): Promise<void> {
  try {
    // Get the settlement
    const settlementResult = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.ADMIN_SETTLEMENTS,
      [Query.equal('$id', settlementId)]
    );

    if (settlementResult.documents.length === 0) {
      throw new AdminError(
        AdminErrorCode.SETTLEMENT_INVALID,
        'Settlement not found'
      );
    }

    const settlement = settlementResult.documents[0] as unknown as AdminSettlement;

    // Verify user is admin of the group
    const isAdmin = await isGroupAdmin(settlement.groupId, userId);
    if (!isAdmin) {
      throw new AdminError(
        AdminErrorCode.UNAUTHORIZED,
        'Only group admins can delete settlements'
      );
    }

    // Delete the settlement
    await databases.deleteDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.ADMIN_SETTLEMENTS,
      settlementId
    );
  } catch (error) {
    if (error instanceof AdminError) {
      throw error;
    }
    console.error('Error deleting admin settlement:', error);
    throw error;
  }
}

/**
 * Get settlement count for a group
 * @param groupId - ID of the group
 * @returns Number of admin settlements in the group
 */
export async function getGroupSettlementCount(groupId: string): Promise<number> {
  try {
    const result = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.ADMIN_SETTLEMENTS,
      [Query.equal('groupId', groupId)]
    );

    return result.total;
  } catch (error) {
    console.error('Error getting group settlement count:', error);
    return 0;
  }
}
