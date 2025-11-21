import { dataStore } from '@/lib/store';
import { createGroup } from '@/lib/services/groupsService';
import { createExpense } from '@/lib/services/expensesService';

const UPCOMING_EXPENSES_KEY = 'splitwise-upcoming-expenses';

export interface MigrationData {
  hasLocalData: boolean;
  groupCount: number;
  expenseCount: number;
}

/**
 * Check if there is local demo data to migrate
 */
export function checkForLocalData(): MigrationData {
  const groups = dataStore.getGroups();
  const upcomingExpenses = dataStore.getUpcomingExpenses();

  // Count expenses across all groups
  const expenseCount = groups.reduce((total, group) => total + group.expenses.length, 0);

  return {
    hasLocalData: groups.length > 0 || upcomingExpenses.length > 0,
    groupCount: groups.length,
    expenseCount: expenseCount + upcomingExpenses.length,
  };
}

/**
 * Migrate local demo data to Appwrite for authenticated user
 */
export async function migrateLocalData(userId: string): Promise<void> {
  try {
    const groups = dataStore.getGroups();

    // Map old group IDs to new Appwrite IDs
    const groupIdMap: { [oldId: string]: string } = {};

    // Migrate groups
    for (const group of groups) {
      const newGroup = await createGroup(userId, {
        name: group.name,
        description: group.description || '',
        members: group.members,
      });

      groupIdMap[group.id] = newGroup.$id;

      // Migrate expenses for this group
      for (const expense of group.expenses) {
        await createExpense(userId, {
          groupId: newGroup.$id,
          description: expense.title,
          amountCents: expense.amountCents,
          payerId: expense.payerId,
          splitBetween: expense.participants,
          date: expense.date.toISOString(),
          category: '',
        });
      }
    }

    // Clear local storage after successful migration
    clearLocalData();
  } catch (error) {
    console.error('Error migrating local data:', error);
    throw new Error('Failed to migrate your demo data. Please try again.');
  }
}

/**
 * Clear all local demo data
 */
export function clearLocalData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(UPCOMING_EXPENSES_KEY);
    // Note: We don't clear the in-memory dataStore here as it might be needed
    // The app will naturally switch to Appwrite data after migration
  }
}
