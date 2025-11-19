import { databases, APP_DATABASE_ID, APP_COLLECTIONS, Query } from '../appwrite';
import { ID, Permission, Role } from 'appwrite';

// TypeScript Interfaces
export interface Expense {
  $id: string;
  userId: string;
  groupId: string;
  description: string;
  amountCents: number;
  payerId: string;
  splitBetween: string[];
  date: string;
  category?: string;
  createdAt: string;
}

export interface CreateExpenseData {
  groupId: string;
  description: string;
  amountCents: number;
  payerId: string;
  splitBetween: string[];
  date: string;
  category?: string;
}

/**
 * Fetches all expenses for a specific group
 * @param groupId Group ID
 * @returns Promise with array of expenses
 */
export async function getGroupExpenses(groupId: string): Promise<Expense[]> {
  try {
    const response = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.EXPENSES,
      [Query.equal('groupId', groupId), Query.orderDesc('date')]
    );

    return response.documents.map(doc => ({
      $id: doc.$id,
      userId: doc.userId,
      groupId: doc.groupId,
      description: doc.description,
      amountCents: doc.amountCents,
      payerId: doc.payerId,
      splitBetween: doc.splitBetween,
      date: doc.date,
      category: doc.category,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching group expenses:', error);
    throw error;
  }
}

/**
 * Fetches all expenses for the current user
 * @param userId Current user's ID
 * @returns Promise with array of expenses
 */
export async function getUserExpenses(userId: string): Promise<Expense[]> {
  try {
    const response = await databases.listDocuments(
      APP_DATABASE_ID,
      APP_COLLECTIONS.EXPENSES,
      [Query.equal('userId', userId), Query.orderDesc('date')]
    );

    return response.documents.map(doc => ({
      $id: doc.$id,
      userId: doc.userId,
      groupId: doc.groupId,
      description: doc.description,
      amountCents: doc.amountCents,
      payerId: doc.payerId,
      splitBetween: doc.splitBetween,
      date: doc.date,
      category: doc.category,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching user expenses:', error);
    throw error;
  }
}

/**
 * Creates a new expense
 * @param userId Current user's ID
 * @param data Expense data
 * @returns Promise with created expense
 */
export async function createExpense(
  userId: string,
  data: CreateExpenseData
): Promise<Expense> {
  try {
    const expenseData = {
      userId,
      groupId: data.groupId,
      description: data.description,
      amountCents: data.amountCents,
      payerId: data.payerId,
      splitBetween: data.splitBetween,
      date: data.date,
      category: data.category || '',
      createdAt: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.EXPENSES,
      ID.unique(),
      expenseData,
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );

    return {
      $id: response.$id,
      userId: response.userId,
      groupId: response.groupId,
      description: response.description,
      amountCents: response.amountCents,
      payerId: response.payerId,
      splitBetween: response.splitBetween,
      date: response.date,
      category: response.category,
      createdAt: response.createdAt,
    };
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}

/**
 * Updates an expense
 * @param expenseId Expense ID to update
 * @param data Partial expense data to update
 * @returns Promise with updated expense
 */
export async function updateExpense(
  expenseId: string,
  data: Partial<CreateExpenseData>
): Promise<Expense> {
  try {
    const response = await databases.updateDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.EXPENSES,
      expenseId,
      data
    );

    return {
      $id: response.$id,
      userId: response.userId,
      groupId: response.groupId,
      description: response.description,
      amountCents: response.amountCents,
      payerId: response.payerId,
      splitBetween: response.splitBetween,
      date: response.date,
      category: response.category,
      createdAt: response.createdAt,
    };
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

/**
 * Deletes an expense
 * @param expenseId Expense ID to delete
 */
export async function deleteExpense(expenseId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.EXPENSES,
      expenseId
    );
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}
