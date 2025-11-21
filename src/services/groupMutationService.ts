// Service for mutating group data (add/delete expenses, settlements, members)

import { User } from '@/lib/mockData';
import { Expense } from '@/lib/split';
import { GroupData, SettlementPayment } from '@/types/groupData';
import { groupDataService } from './groupDataService';
import { groupComputationService } from './groupComputationService';

/**
 * Service for mutating group data with automatic recomputation
 */
export class GroupMutationService {
  /**
   * Add expense to group
   * @param groupId - The group ID
   * @param expense - The expense to add (without id, will be generated)
   * @returns Promise with updated GroupData
   */
  async addExpense(
    groupId: string,
    expense: Omit<Expense, 'id'>
  ): Promise<GroupData> {
    try {
      console.log(`➕ Adding expense to group: ${groupId}`);
      console.log('Expense data:', expense);
      
      // Load current group data
      const groupData = await groupDataService.loadGroupData(groupId);
      
      if (!groupData) {
        throw new Error(`Group data not found for: ${groupId}`);
      }

      // Generate ID for new expense
      // Ensure date is a Date object for computation
      const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
      
      const newExpense: Expense = {
        ...expense,
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: expenseDate,
      };

      console.log('New expense created:', newExpense);

      // Add expense to array
      groupData.expenses.push(newExpense);
      console.log(`Total expenses after add: ${groupData.expenses.length}`);

      // Recompute derived data
      groupData.computed = groupComputationService.computeGroupState(
        groupData.members,
        groupData.expenses,
        groupData.settlements
      );

      console.log('Computed state:', groupData.computed);

      // Save updated data
      await groupDataService.saveGroupData(groupData);

      console.log(`✅ Expense added successfully: ${newExpense.id}`);
      return groupData;
      
    } catch (error) {
      console.error(`❌ Error adding expense to group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Delete expense from group
   * @param groupId - The group ID
   * @param expenseId - The expense ID to delete
   * @returns Promise with updated GroupData
   */
  async deleteExpense(
    groupId: string,
    expenseId: string
  ): Promise<GroupData> {
    try {
      console.log(`🗑️ Deleting expense ${expenseId} from group: ${groupId}`);
      
      // Load current group data
      const groupData = await groupDataService.loadGroupData(groupId);
      
      if (!groupData) {
        throw new Error(`Group data not found for: ${groupId}`);
      }

      // Remove expense from array
      const initialLength = groupData.expenses.length;
      groupData.expenses = groupData.expenses.filter(e => e.id !== expenseId);

      if (groupData.expenses.length === initialLength) {
        console.warn(`⚠️ Expense ${expenseId} not found in group ${groupId}`);
      }

      // Recompute derived data
      groupData.computed = groupComputationService.computeGroupState(
        groupData.members,
        groupData.expenses,
        groupData.settlements
      );

      // Save updated data
      await groupDataService.saveGroupData(groupData);

      console.log(`✅ Expense deleted successfully: ${expenseId}`);
      return groupData;
      
    } catch (error) {
      console.error(`❌ Error deleting expense ${expenseId} from group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Record settlement payment
   * @param groupId - The group ID
   * @param settlement - The settlement to record (without id, will be generated)
   * @returns Promise with updated GroupData
   */
  async recordSettlement(
    groupId: string,
    settlement: Omit<SettlementPayment, 'id'>
  ): Promise<GroupData> {
    try {
      console.log(`💰 Recording settlement in group: ${groupId}`);
      
      // Load current group data
      const groupData = await groupDataService.loadGroupData(groupId);
      
      if (!groupData) {
        throw new Error(`Group data not found for: ${groupId}`);
      }

      // Generate ID for new settlement
      const newSettlement: SettlementPayment = {
        ...settlement,
        id: `settle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Add settlement to array
      groupData.settlements.push(newSettlement);

      // Recompute derived data (settlements reduce debts in ledger)
      groupData.computed = groupComputationService.computeGroupState(
        groupData.members,
        groupData.expenses,
        groupData.settlements
      );

      // Save updated data
      await groupDataService.saveGroupData(groupData);

      console.log(`✅ Settlement recorded successfully: ${newSettlement.id}`);
      return groupData;
      
    } catch (error) {
      console.error(`❌ Error recording settlement in group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Add member to group
   * @param groupId - The group ID
   * @param member - The member to add
   * @returns Promise with updated GroupData
   */
  async addMember(
    groupId: string,
    member: User
  ): Promise<GroupData> {
    try {
      console.log(`👤 Adding member ${member.name} to group: ${groupId}`);
      
      // Load current group data
      const groupData = await groupDataService.loadGroupData(groupId);
      
      if (!groupData) {
        throw new Error(`Group data not found for: ${groupId}`);
      }

      // Check if member already exists
      if (groupData.members.find(m => m.id === member.id)) {
        console.warn(`⚠️ Member ${member.id} already exists in group ${groupId}`);
        return groupData;
      }

      // Add member to array
      groupData.members.push(member);

      // Recompute derived data (new member affects balances)
      groupData.computed = groupComputationService.computeGroupState(
        groupData.members,
        groupData.expenses,
        groupData.settlements
      );

      // Save updated data
      await groupDataService.saveGroupData(groupData);

      console.log(`✅ Member added successfully: ${member.id}`);
      return groupData;
      
    } catch (error) {
      console.error(`❌ Error adding member to group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Remove member from group
   * @param groupId - The group ID
   * @param userId - The user ID to remove
   * @returns Promise with updated GroupData
   */
  async removeMember(
    groupId: string,
    userId: string
  ): Promise<GroupData> {
    try {
      console.log(`👤 Removing member ${userId} from group: ${groupId}`);
      
      // Load current group data
      const groupData = await groupDataService.loadGroupData(groupId);
      
      if (!groupData) {
        throw new Error(`Group data not found for: ${groupId}`);
      }

      // Remove member from array
      const initialLength = groupData.members.length;
      groupData.members = groupData.members.filter(m => m.id !== userId);

      if (groupData.members.length === initialLength) {
        console.warn(`⚠️ Member ${userId} not found in group ${groupId}`);
      }

      // Recompute derived data (removing member affects balances)
      groupData.computed = groupComputationService.computeGroupState(
        groupData.members,
        groupData.expenses,
        groupData.settlements
      );

      // Save updated data
      await groupDataService.saveGroupData(groupData);

      console.log(`✅ Member removed successfully: ${userId}`);
      return groupData;
      
    } catch (error) {
      console.error(`❌ Error removing member from group ${groupId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const groupMutationService = new GroupMutationService();
