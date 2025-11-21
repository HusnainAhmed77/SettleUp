// Hook for expense operations that works with both old and new systems

import { useState } from 'react';
import { SplitType } from '@/lib/split';
import { dataStore } from '@/lib/store';
import { groupMutationService } from '@/services/groupMutationService';
import { computeShares } from '@/lib/split';

interface UseExpenseOperationsProps {
  groupId: string;
  useJsonSystem: boolean;
  onSuccess?: () => void;
}

export function useExpenseOperations({ groupId, useJsonSystem, onSuccess }: UseExpenseOperationsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Add expense using appropriate system
   */
  const addExpense = async (
    title: string,
    amountCents: number,
    payerId: string,
    participantIds: string[],
    splitType: SplitType,
    customSplits?: { [userId: string]: number },
    payers?: { userId: string; amountCents: number }[],
    currency: string = 'USD'
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (useJsonSystem) {
        // Use new JSON system
        console.log('💾 Adding expense via JSON system');
        
        const splits = computeShares(amountCents, participantIds, splitType, customSplits);
        
        await groupMutationService.addExpense(groupId, {
          title,
          amountCents,
          currency,
          payerId,
          payers,
          participants: participantIds,
          splitType,
          splits,
          date: new Date(),
        });
      } else {
        // Use old system
        console.log('💾 Adding expense via old system');
        await dataStore.addExpense(
          groupId,
          title,
          amountCents,
          payerId,
          participantIds,
          splitType,
          customSplits,
          payers
        );
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete expense using appropriate system
   */
  const deleteExpense = async (expenseId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (useJsonSystem) {
        // Use new JSON system
        console.log('🗑️ Deleting expense via JSON system');
        await groupMutationService.deleteExpense(groupId, expenseId);
      } else {
        // Use old system
        console.log('🗑️ Deleting expense via old system');
        await dataStore.deleteExpense(groupId, expenseId);
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Record settlement using appropriate system
   */
  const recordSettlement = async (
    fromUserId: string,
    toUserId: string,
    amountCents: number,
    note?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (useJsonSystem) {
        // Use new JSON system
        console.log('💰 Recording settlement via JSON system');
        await groupMutationService.recordSettlement(groupId, {
          fromUserId,
          toUserId,
          amountCents,
          date: new Date().toISOString(),
          note,
        });
      } else {
        // Use old system
        console.log('💰 Recording settlement via old system');
        await dataStore.recordPayment(groupId, fromUserId, toUserId, amountCents);
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error recording settlement:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addExpense,
    deleteExpense,
    recordSettlement,
    loading,
    error,
  };
}
