// Schema validation for GroupData

import { GroupData, GroupInfo, SettlementPayment, ComputedGroupState, LedgerMatrix, NetBalance, Settlement } from '@/types/groupData';
import { User } from '@/lib/mockData';
import { Expense } from '@/lib/split';

/**
 * Validates if an unknown value is a valid GroupData object
 */
export function validateGroupData(data: unknown): data is GroupData {
  if (!data || typeof data !== 'object') {
    console.error('GroupData validation failed: not an object');
    return false;
  }

  const d = data as any;

  // Check required top-level fields
  if (typeof d.groupId !== 'string' || !d.groupId) {
    console.error('GroupData validation failed: invalid groupId');
    return false;
  }

  if (typeof d.version !== 'string' || !d.version) {
    console.error('GroupData validation failed: invalid version');
    return false;
  }

  if (typeof d.lastUpdated !== 'string' || !d.lastUpdated) {
    console.error('GroupData validation failed: invalid lastUpdated');
    return false;
  }

  // Validate group info
  if (!validateGroupInfo(d.group)) {
    console.error('GroupData validation failed: invalid group info');
    return false;
  }

  // Validate members array
  if (!Array.isArray(d.members) || !d.members.every(validateUser)) {
    console.error('GroupData validation failed: invalid members array');
    return false;
  }

  // Validate expenses array
  if (!Array.isArray(d.expenses) || !d.expenses.every(validateExpense)) {
    console.error('GroupData validation failed: invalid expenses array');
    return false;
  }

  // Validate settlements array
  if (!Array.isArray(d.settlements) || !d.settlements.every(validateSettlement)) {
    console.error('GroupData validation failed: invalid settlements array');
    return false;
  }

  // Validate computed state
  if (!validateComputedState(d.computed)) {
    console.error('GroupData validation failed: invalid computed state');
    return false;
  }

  return true;
}

/**
 * Validates GroupInfo
 */
function validateGroupInfo(info: unknown): info is GroupInfo {
  if (!info || typeof info !== 'object') return false;
  
  const i = info as any;
  return (
    typeof i.id === 'string' && i.id &&
    typeof i.name === 'string' && i.name &&
    typeof i.description === 'string' &&
    typeof i.userId === 'string' && i.userId &&
    typeof i.currency === 'string' && i.currency &&
    typeof i.createdAt === 'string' && i.createdAt
  );
}

/**
 * Validates User
 */
function validateUser(user: unknown): user is User {
  if (!user || typeof user !== 'object') return false;
  
  const u = user as any;
  return (
    typeof u.id === 'string' && u.id &&
    typeof u.name === 'string' && u.name &&
    typeof u.email === 'string' && u.email
  );
}

/**
 * Validates Expense
 */
function validateExpense(expense: unknown): expense is Expense {
  if (!expense || typeof expense !== 'object') return false;
  
  const e = expense as any;
  
  // Date can be either string or Date object
  const hasValidDate = typeof e.date === 'string' || e.date instanceof Date;
  
  return (
    typeof e.id === 'string' && e.id &&
    typeof e.title === 'string' && e.title &&
    typeof e.amountCents === 'number' && e.amountCents >= 0 &&
    typeof e.currency === 'string' && e.currency &&
    typeof e.payerId === 'string' && e.payerId &&
    Array.isArray(e.participants) &&
    typeof e.splitType === 'string' &&
    Array.isArray(e.splits) &&
    hasValidDate
  );
}

/**
 * Validates SettlementPayment
 */
function validateSettlement(settlement: unknown): settlement is SettlementPayment {
  if (!settlement || typeof settlement !== 'object') return false;
  
  const s = settlement as any;
  return (
    typeof s.id === 'string' && s.id &&
    typeof s.fromUserId === 'string' && s.fromUserId &&
    typeof s.toUserId === 'string' && s.toUserId &&
    typeof s.amountCents === 'number' && s.amountCents >= 0 &&
    typeof s.date === 'string' && s.date
  );
}

/**
 * Validates ComputedGroupState
 */
function validateComputedState(computed: unknown): computed is ComputedGroupState {
  if (!computed || typeof computed !== 'object') return false;
  
  const c = computed as any;
  return (
    validateLedger(c.ledger) &&
    Array.isArray(c.netBalances) && c.netBalances.every(validateNetBalance) &&
    Array.isArray(c.simplifiedSettlements) && c.simplifiedSettlements.every(validateSettlement_) &&
    typeof c.lastComputedAt === 'string' && c.lastComputedAt
  );
}

/**
 * Validates LedgerMatrix
 */
function validateLedger(ledger: unknown): ledger is LedgerMatrix {
  if (!ledger || typeof ledger !== 'object') return false;
  
  const l = ledger as any;
  
  // Check that all values are objects with number values
  for (const debtorId in l) {
    if (typeof l[debtorId] !== 'object') return false;
    
    for (const creditorId in l[debtorId]) {
      if (typeof l[debtorId][creditorId] !== 'number') return false;
    }
  }
  
  return true;
}

/**
 * Validates NetBalance
 */
function validateNetBalance(balance: unknown): balance is NetBalance {
  if (!balance || typeof balance !== 'object') return false;
  
  const b = balance as any;
  return (
    typeof b.userId === 'string' && b.userId &&
    typeof b.netCents === 'number'
  );
}

/**
 * Validates Settlement
 */
function validateSettlement_(settlement: unknown): settlement is Settlement {
  if (!settlement || typeof settlement !== 'object') return false;
  
  const s = settlement as any;
  return (
    typeof s.from === 'string' && s.from &&
    typeof s.to === 'string' && s.to &&
    typeof s.amountCents === 'number' && s.amountCents >= 0
  );
}

/**
 * Validates that a string is valid JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely parses JSON with validation
 */
export function parseAndValidateGroupData(jsonString: string): GroupData | null {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (validateGroupData(parsed)) {
      return parsed as GroupData;
    }
    
    console.error('Parsed JSON does not match GroupData schema');
    return null;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}
