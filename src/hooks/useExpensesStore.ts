import { create } from 'zustand';
import {
  Expense,
  CreateExpenseData,
  getGroupExpenses,
  getUserExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '@/lib/services/expensesService';

interface ExpensesStore {
  expenses: Record<string, Expense[]>; // groupId -> expenses
  loading: boolean;
  error: string | null;

  // Actions
  fetchGroupExpenses: (groupId: string) => Promise<void>;
  fetchUserExpenses: (userId: string) => Promise<void>;
  addExpense: (userId: string, data: CreateExpenseData) => Promise<Expense>;
  updateExpenseData: (expenseId: string, data: Partial<CreateExpenseData>) => Promise<void>;
  removeExpense: (expenseId: string, groupId: string) => Promise<void>;
  clearExpenses: () => void;
}

export const useExpensesStore = create<ExpensesStore>((set, get) => ({
  expenses: {},
  loading: false,
  error: null,

  fetchGroupExpenses: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const expenses = await getGroupExpenses(groupId);
      
      set(state => ({
        expenses: {
          ...state.expenses,
          [groupId]: expenses,
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to fetch expenses', loading: false });
      console.error('Error in fetchGroupExpenses:', error);
    }
  },

  fetchUserExpenses: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const expenses = await getUserExpenses(userId);
      
      // Group expenses by groupId
      const groupedExpenses: Record<string, Expense[]> = {};
      expenses.forEach(expense => {
        if (!groupedExpenses[expense.groupId]) {
          groupedExpenses[expense.groupId] = [];
        }
        groupedExpenses[expense.groupId].push(expense);
      });
      
      set({ expenses: groupedExpenses, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user expenses', loading: false });
      console.error('Error in fetchUserExpenses:', error);
    }
  },

  addExpense: async (userId: string, data: CreateExpenseData) => {
    set({ loading: true, error: null });
    try {
      const newExpense = await createExpense(userId, data);
      
      set(state => ({
        expenses: {
          ...state.expenses,
          [data.groupId]: [
            newExpense,
            ...(state.expenses[data.groupId] || []),
          ],
        },
        loading: false,
      }));
      
      return newExpense;
    } catch (error) {
      set({ error: 'Failed to create expense', loading: false });
      console.error('Error in addExpense:', error);
      throw error;
    }
  },

  updateExpenseData: async (expenseId: string, data: Partial<CreateExpenseData>) => {
    set({ loading: true, error: null });
    try {
      const updatedExpense = await updateExpense(expenseId, data);
      
      set(state => ({
        expenses: {
          ...state.expenses,
          [updatedExpense.groupId]: (state.expenses[updatedExpense.groupId] || []).map(e =>
            e.$id === expenseId ? updatedExpense : e
          ),
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update expense', loading: false });
      console.error('Error in updateExpenseData:', error);
      throw error;
    }
  },

  removeExpense: async (expenseId: string, groupId: string) => {
    set({ loading: true, error: null });
    try {
      await deleteExpense(expenseId);
      
      set(state => ({
        expenses: {
          ...state.expenses,
          [groupId]: (state.expenses[groupId] || []).filter(e => e.$id !== expenseId),
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete expense', loading: false });
      console.error('Error in removeExpense:', error);
      throw error;
    }
  },

  clearExpenses: () => {
    set({ expenses: {}, loading: false, error: null });
  },
}));
