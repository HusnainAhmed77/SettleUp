// Splitwise split logic - all amounts in cents (integers) to avoid floating point errors

export type SplitType = 'equal' | 'percentage' | 'exact';

export interface Split {
  userId: string;
  amountCents: number;
}

export interface Payment {
  userId: string;
  amountCents: number;
}

export interface Expense {
  id: string;
  title: string;
  amountCents: number;
  currency: string;
  payerId: string; // For single payer (backward compatibility)
  payers?: Payment[]; // For multiple payers
  participants: string[];
  splitType: SplitType;
  splits: Split[];
  date: Date;
}

export interface Settlement {
  from: string;
  to: string;
  amountCents: number;
}

export interface NetBalance {
  userId: string;
  netCents: number; // positive = owed to them, negative = they owe
}

export interface UpcomingExpense {
  id: string;
  title: string;
  amountCents: number;
  currency: string;
  targetDate: Date;
  groupId: string;
  createdBy: string;
  participants: string[];
  splitType: SplitType;
  splits: { [userId: string]: number }; // Amount in cents or percentage
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Split an amount equally among participants (cents-safe)
 * Distributes remainder cents to first N participants
 */
export function splitEqual(amountCents: number, numParticipants: number): number[] {
  if (numParticipants === 0) return [];
  
  const base = Math.floor(amountCents / numParticipants);
  const remainder = amountCents % numParticipants;
  const shares = Array(numParticipants).fill(base);
  
  // Distribute remainder cents to first N participants
  for (let i = 0; i < remainder; i++) {
    shares[i]++;
  }
  
  return shares;
}

/**
 * Split by percentages (cents-safe)
 * Percentages should sum to 100
 */
export function splitByPercentage(
  amountCents: number,
  percentages: number[]
): number[] {
  const shares: number[] = [];
  let allocated = 0;
  
  for (let i = 0; i < percentages.length; i++) {
    if (i === percentages.length - 1) {
      // Last person gets remainder to ensure exact total
      shares.push(amountCents - allocated);
    } else {
      const share = Math.floor((amountCents * percentages[i]) / 100);
      shares.push(share);
      allocated += share;
    }
  }
  
  return shares;
}

/**
 * Compute shares for an expense based on split type
 */
export function computeShares(
  totalCents: number,
  participants: string[],
  splitType: SplitType,
  customSplits?: { [userId: string]: number }
): Split[] {
  const shares: Split[] = [];
  
  switch (splitType) {
    case 'equal': {
      const amounts = splitEqual(totalCents, participants.length);
      participants.forEach((userId, index) => {
        shares.push({ userId, amountCents: amounts[index] });
      });
      break;
    }
    
    case 'percentage': {
      if (!customSplits) throw new Error('Percentages required for percentage split');
      const percentages = participants.map(id => customSplits[id] || 0);
      const amounts = splitByPercentage(totalCents, percentages);
      participants.forEach((userId, index) => {
        shares.push({ userId, amountCents: amounts[index] });
      });
      break;
    }
    
    case 'exact': {
      if (!customSplits) throw new Error('Exact amounts required for exact split');
      participants.forEach(userId => {
        shares.push({ userId, amountCents: customSplits[userId] || 0 });
      });
      break;
    }
  }
  
  return shares;
}

/**
 * Build ledger matrix from expenses
 * ledger[debtor][creditor] = amount debtor owes to creditor
 */
export function buildLedger(
  expenses: Expense[],
  userIds: string[]
): Map<string, Map<string, number>> {
  const ledger = new Map<string, Map<string, number>>();
  
  // Initialize ledger
  userIds.forEach(userId => {
    ledger.set(userId, new Map());
    userIds.forEach(otherId => {
      ledger.get(userId)!.set(otherId, 0);
    });
  });
  
  // Process each expense
  expenses.forEach(expense => {
    // Handle multiple payers
    if (expense.payers && expense.payers.length > 0) {
      // Multiple payers scenario
      // Each person's share is their split amount
      // Each person's payment is what they paid
      // Net = payment - share
      
      expense.splits.forEach(split => {
        const personShare = split.amountCents;
        const personPayment = expense.payers!.find(p => p.userId === split.userId)?.amountCents || 0;
        const netOwed = personPayment - personShare;
        
        if (netOwed > 0) {
          // This person paid more than their share, others owe them
          expense.splits.forEach(otherSplit => {
            if (otherSplit.userId !== split.userId) {
              const otherShare = otherSplit.amountCents;
              const otherPayment = expense.payers!.find(p => p.userId === otherSplit.userId)?.amountCents || 0;
              const otherNetOwed = otherPayment - otherShare;
              
              if (otherNetOwed < 0) {
                // Other person paid less than their share
                // They owe a portion to this person
                const proportionOwed = Math.abs(otherNetOwed) / expense.splits
                  .filter(s => {
                    const payment = expense.payers!.find(p => p.userId === s.userId)?.amountCents || 0;
                    return payment - s.amountCents < 0;
                  })
                  .reduce((sum, s) => {
                    const payment = expense.payers!.find(p => p.userId === s.userId)?.amountCents || 0;
                    return sum + Math.abs(payment - s.amountCents);
                  }, 0);
                
                const amountOwed = Math.round(netOwed * proportionOwed);
                const current = ledger.get(otherSplit.userId)!.get(split.userId) || 0;
                ledger.get(otherSplit.userId)!.set(split.userId, current + amountOwed);
              }
            }
          });
        }
      });
    } else {
      // Single payer scenario (original logic)
      expense.splits.forEach(split => {
        if (split.userId !== expense.payerId) {
          // This person owes the payer
          const current = ledger.get(split.userId)!.get(expense.payerId) || 0;
          ledger.get(split.userId)!.set(expense.payerId, current + split.amountCents);
        }
      });
    }
  });
  
  return ledger;
}

/**
 * Compute net balance for each user
 * Positive = owed to them, Negative = they owe
 */
export function computeNetBalances(
  ledger: Map<string, Map<string, number>>,
  userIds: string[]
): NetBalance[] {
  const balances: NetBalance[] = [];
  
  userIds.forEach(userId => {
    let owedToUser = 0;
    let userOwes = 0;
    
    // Sum what others owe to this user
    userIds.forEach(otherId => {
      owedToUser += ledger.get(otherId)!.get(userId) || 0;
    });
    
    // Sum what this user owes to others
    userIds.forEach(otherId => {
      userOwes += ledger.get(userId)!.get(otherId) || 0;
    });
    
    balances.push({
      userId,
      netCents: owedToUser - userOwes,
    });
  });
  
  return balances;
}

/**
 * Simplify debts using greedy algorithm
 * Returns minimal set of settlements to clear all balances
 */
export function simplifyDebts(balances: NetBalance[]): Settlement[] {
  // Separate creditors (positive) and debtors (negative)
  const creditors = balances
    .filter(b => b.netCents > 0)
    .map(b => ({ userId: b.userId, amount: b.netCents }))
    .sort((a, b) => b.amount - a.amount); // Largest first
  
  const debtors = balances
    .filter(b => b.netCents < 0)
    .map(b => ({ userId: b.userId, amount: -b.netCents }))
    .sort((a, b) => b.amount - a.amount); // Largest first
  
  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amountCents: amount,
    });
    
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }
  
  return settlements;
}

/**
 * Apply a payment to the ledger
 * Returns updated ledger and any overpayment amount
 */
export function applyPayment(
  ledger: Map<string, Map<string, number>>,
  fromUserId: string,
  toUserId: string,
  amountCents: number
): { ledger: Map<string, Map<string, number>>; overpayment: number } {
  const owed = ledger.get(fromUserId)!.get(toUserId) || 0;
  
  if (amountCents <= owed) {
    // Normal payment
    ledger.get(fromUserId)!.set(toUserId, owed - amountCents);
    return { ledger, overpayment: 0 };
  } else {
    // Overpayment
    ledger.get(fromUserId)!.set(toUserId, 0);
    return { ledger, overpayment: amountCents - owed };
  }
}

/**
 * Get balance between two users
 * Positive = user1 is owed by user2
 * Negative = user1 owes user2
 */
export function getBalanceBetween(
  ledger: Map<string, Map<string, number>>,
  user1Id: string,
  user2Id: string
): number {
  const user1OwesUser2 = ledger.get(user1Id)!.get(user2Id) || 0;
  const user2OwesUser1 = ledger.get(user2Id)!.get(user1Id) || 0;
  
  return user2OwesUser1 - user1OwesUser2;
}

/**
 * Format cents to currency string
 */
export function formatCents(cents: number, currency: string = 'USD'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Parse currency string to cents
 */
export function parseToCents(amount: string | number): number {
  if (typeof amount === 'number') {
    return Math.round(amount * 100);
  }
  const cleaned = amount.replace(/[^0-9.-]/g, '');
  return Math.round(parseFloat(cleaned) * 100);
}

/**
 * Calculate total spending for a user in a specific month
 * Returns the sum of all expenses where the user is the payer
 * For multiple payers, only counts the amount the user actually paid
 */
export function calculateMonthlySpending(
  expenses: Expense[],
  userId: string,
  month: number,
  year: number
): number {
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === month &&
        expenseDate.getFullYear() === year
      );
    })
    .reduce((total, expense) => {
      // Check if this user paid anything for this expense
      if (expense.payers && expense.payers.length > 0) {
        // Multiple payers - only count what this user paid
        const userPayment = expense.payers.find(p => p.userId === userId);
        return total + (userPayment?.amountCents || 0);
      } else if (expense.payerId === userId) {
        // Single payer - count full amount
        return total + expense.amountCents;
      }
      return total;
    }, 0);
}

/**
 * Calculate total spending for a user in the current month
 */
export function getCurrentMonthSpending(
  expenses: Expense[],
  userId: string
): number {
  const now = new Date();
  return calculateMonthlySpending(
    expenses,
    userId,
    now.getMonth(),
    now.getFullYear()
  );
}
