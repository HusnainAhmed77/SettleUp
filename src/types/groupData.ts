// Type definitions for JSON-based group data persistence

import { User } from '@/lib/mockData';
import { Expense, Split, Payment } from '@/lib/split';

/**
 * Complete group data structure stored in expenses_data collection
 */
export interface GroupData {
  // Metadata
  groupId: string;
  version: string; // Schema version for future migrations
  lastUpdated: string; // ISO timestamp
  
  // Group information
  group: GroupInfo;
  
  // Members
  members: User[];
  
  // Raw transaction data
  expenses: Expense[];
  settlements: SettlementPayment[];
  
  // Pre-computed data
  computed: ComputedGroupState;
}

/**
 * Group metadata
 */
export interface GroupInfo {
  id: string;
  name: string;
  description: string;
  userId: string; // Creator/admin
  currency: string; // e.g., "USD", "EUR"
  createdAt: string; // ISO timestamp
}

/**
 * Settlement payment record
 */
export interface SettlementPayment {
  id: string;
  fromUserId: string;
  toUserId: string;
  amountCents: number;
  date: string; // ISO timestamp
  note?: string;
}

/**
 * Pre-computed group state
 */
export interface ComputedGroupState {
  ledger: LedgerMatrix;
  netBalances: NetBalance[];
  simplifiedSettlements: Settlement[];
  lastComputedAt: string; // ISO timestamp
}

/**
 * Ledger matrix: who owes whom
 * Structure: { [debtorId]: { [creditorId]: amountCents } }
 */
export interface LedgerMatrix {
  [debtorId: string]: {
    [creditorId: string]: number;
  };
}

/**
 * Net balance for a user
 */
export interface NetBalance {
  userId: string;
  netCents: number; // Positive = owed to them, negative = they owe
}

/**
 * Simplified settlement
 */
export interface Settlement {
  from: string; // User ID
  to: string; // User ID
  amountCents: number;
}

/**
 * Appwrite document structure for expenses_data collection
 */
export interface ExpensesDataDocument {
  $id: string;
  groupId: string;
  jsonData: string; // Stringified GroupData
  version: string;
  lastUpdated: string; // ISO timestamp
  $createdAt?: string;
  $updatedAt?: string;
}
