// Service for computing group balances and settlements

import { User } from '@/lib/mockData';
import { Expense } from '@/lib/split';
import { SettlementPayment, ComputedGroupState, LedgerMatrix, NetBalance, Settlement } from '@/types/groupData';
import { buildLedger as buildLedgerFromSplit, computeNetBalances as computeNetBalancesFromSplit, simplifyDebts as simplifyDebtsFromSplit } from '@/lib/split';

/**
 * Service for computing derived group data
 */
export class GroupComputationService {
  /**
   * Compute full group state from raw data
   * @param members - Array of group members
   * @param expenses - Array of expenses
   * @param settlements - Array of settlement payments
   * @returns Computed group state with ledger, balances, and settlements
   */
  computeGroupState(
    members: User[],
    expenses: Expense[],
    settlements: SettlementPayment[]
  ): ComputedGroupState {
    console.log('🧮 Computing group state...');
    
    const userIds = members.map(m => m.id);
    
    // Convert SettlementPayment[] to format expected by buildLedger
    const settlementsForLedger = settlements.map(s => ({
      fromUserId: s.fromUserId,
      toUserId: s.toUserId,
      amountCents: s.amountCents,
    }));
    
    // Build ledger using existing split.ts logic
    const ledgerMap = buildLedgerFromSplit(expenses, userIds, settlementsForLedger);
    
    // Convert Map to plain object for JSON serialization
    const ledger: LedgerMatrix = {};
    ledgerMap.forEach((creditors, debtorId) => {
      ledger[debtorId] = {};
      creditors.forEach((amount, creditorId) => {
        ledger[debtorId][creditorId] = amount;
      });
    });
    
    // Compute net balances
    const netBalances = computeNetBalancesFromSplit(ledgerMap, userIds);
    
    // Simplify debts
    const simplifiedSettlements = simplifyDebtsFromSplit(netBalances);
    
    console.log('✅ Group state computed successfully');
    
    return {
      ledger,
      netBalances,
      simplifiedSettlements,
      lastComputedAt: new Date().toISOString(),
    };
  }

  /**
   * Build ledger matrix from expenses and settlements
   * @param expenses - Array of expenses
   * @param userIds - Array of user IDs
   * @param settlements - Array of settlement payments
   * @returns Ledger matrix
   */
  buildLedger(
    expenses: Expense[],
    userIds: string[],
    settlements: SettlementPayment[]
  ): LedgerMatrix {
    const settlementsForLedger = settlements.map(s => ({
      fromUserId: s.fromUserId,
      toUserId: s.toUserId,
      amountCents: s.amountCents,
    }));
    
    const ledgerMap = buildLedgerFromSplit(expenses, userIds, settlementsForLedger);
    
    // Convert Map to plain object
    const ledger: LedgerMatrix = {};
    ledgerMap.forEach((creditors, debtorId) => {
      ledger[debtorId] = {};
      creditors.forEach((amount, creditorId) => {
        ledger[debtorId][creditorId] = amount;
      });
    });
    
    return ledger;
  }

  /**
   * Compute net balances from ledger
   * @param ledger - Ledger matrix
   * @param userIds - Array of user IDs
   * @returns Array of net balances
   */
  computeNetBalances(ledger: LedgerMatrix, userIds: string[]): NetBalance[] {
    // Convert plain object back to Map for computation
    const ledgerMap = new Map<string, Map<string, number>>();
    
    userIds.forEach(userId => {
      ledgerMap.set(userId, new Map());
    });
    
    Object.keys(ledger).forEach(debtorId => {
      Object.keys(ledger[debtorId]).forEach(creditorId => {
        ledgerMap.get(debtorId)?.set(creditorId, ledger[debtorId][creditorId]);
      });
    });
    
    return computeNetBalancesFromSplit(ledgerMap, userIds);
  }

  /**
   * Simplify debts into minimal settlements
   * @param balances - Array of net balances
   * @returns Array of simplified settlements
   */
  simplifyDebts(balances: NetBalance[]): Settlement[] {
    return simplifyDebtsFromSplit(balances);
  }

  /**
   * Convert ledger Map to plain object for JSON serialization
   * @param ledgerMap - Ledger as Map
   * @returns Ledger as plain object
   */
  ledgerMapToObject(ledgerMap: Map<string, Map<string, number>>): LedgerMatrix {
    const ledger: LedgerMatrix = {};
    
    ledgerMap.forEach((creditors, debtorId) => {
      ledger[debtorId] = {};
      creditors.forEach((amount, creditorId) => {
        ledger[debtorId][creditorId] = amount;
      });
    });
    
    return ledger;
  }

  /**
   * Convert ledger plain object to Map for computation
   * @param ledger - Ledger as plain object
   * @param userIds - Array of user IDs
   * @returns Ledger as Map
   */
  ledgerObjectToMap(ledger: LedgerMatrix, userIds: string[]): Map<string, Map<string, number>> {
    const ledgerMap = new Map<string, Map<string, number>>();
    
    userIds.forEach(userId => {
      ledgerMap.set(userId, new Map());
    });
    
    Object.keys(ledger).forEach(debtorId => {
      Object.keys(ledger[debtorId]).forEach(creditorId => {
        ledgerMap.get(debtorId)?.set(creditorId, ledger[debtorId][creditorId]);
      });
    });
    
    return ledgerMap;
  }
}

// Export singleton instance
export const groupComputationService = new GroupComputationService();
