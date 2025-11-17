// Simple in-memory store for managing groups and expenses
// In production, this would be replaced with API calls to backend

import { Group, User, mockUsers, mockGroups as initialGroups } from './mockData';
import { Expense, computeShares, SplitType, UpcomingExpense } from './split';

const STORAGE_KEY = 'splitwise-upcoming-expenses';

// Utility functions for localStorage
function saveUpcomingExpenses(expenses: UpcomingExpense[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Failed to save upcoming expenses to localStorage:', error);
    }
  }
}

function loadUpcomingExpenses(): UpcomingExpense[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((exp: any) => ({
          ...exp,
          targetDate: new Date(exp.targetDate),
          createdAt: new Date(exp.createdAt),
          updatedAt: new Date(exp.updatedAt),
        }));
      }
    } catch (error) {
      console.error('Failed to load upcoming expenses from localStorage:', error);
    }
  }
  return [];
}

class DataStore {
  private groups: Group[] = [...initialGroups];
  private users: User[] = [...mockUsers];
  private upcomingExpenses: UpcomingExpense[] = loadUpcomingExpenses();
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    // Save upcoming expenses to localStorage
    saveUpcomingExpenses(this.upcomingExpenses);
    // Notify all listeners immediately
    this.listeners.forEach(listener => listener());
  }

  // Groups
  getGroups(): Group[] {
    return [...this.groups]; // Return a new array to ensure reference changes
  }

  getGroup(id: string): Group | undefined {
    const group = this.groups.find(g => g.id === id);
    if (!group) return undefined;
    
    // Deep clone to ensure all nested arrays get new references
    return {
      ...group,
      members: [...group.members],
      expenses: [...group.expenses],
    };
  }

  createGroup(name: string, description: string, memberIds: string[]): Group {
    const members = this.users.filter(u => memberIds.includes(u.id));
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      members,
      expenses: [],
      createdAt: new Date(),
    };
    this.groups.push(newGroup);
    this.notify();
    return newGroup;
  }

  deleteGroup(id: string) {
    this.groups = this.groups.filter(g => g.id !== id);
    this.notify();
  }

  // Users
  getUsers(): User[] {
    return this.users;
  }

  getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  createUser(name: string, email: string): User {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
    };
    this.users.push(newUser);
    this.notify();
    return newUser;
  }

  // Expenses
  addExpense(
    groupId: string,
    title: string,
    amountCents: number,
    payerId: string,
    participantIds: string[],
    splitType: SplitType,
    customSplits?: { [userId: string]: number },
    payers?: { userId: string; amountCents: number }[]
  ): Expense {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');

    // Compute shares based on split type
    const splits = computeShares(amountCents, participantIds, splitType, customSplits);

    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amountCents,
      currency: 'USD',
      payerId,
      payers,
      participants: participantIds,
      splitType,
      splits,
      date: new Date(),
    };

    group.expenses.push(newExpense);
    this.notify();
    return newExpense;
  }

  deleteExpense(groupId: string, expenseId: string) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    group.expenses = group.expenses.filter(e => e.id !== expenseId);
    this.notify();
  }

  updateExpense(
    groupId: string,
    expenseId: string,
    updates: Partial<Expense>
  ) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    const expenseIndex = group.expenses.findIndex(e => e.id === expenseId);
    if (expenseIndex === -1) return;

    group.expenses[expenseIndex] = {
      ...group.expenses[expenseIndex],
      ...updates,
    };
    this.notify();
  }

  // Add member to group
  addMemberToGroup(groupId: string, userId: string) {
    const group = this.groups.find(g => g.id === groupId);
    const user = this.getUser(userId);
    if (!group || !user) return;

    if (!group.members.find(m => m.id === userId)) {
      group.members.push(user);
      this.notify();
    }
  }

  // Remove member from group
  removeMemberFromGroup(groupId: string, userId: string) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    group.members = group.members.filter(m => m.id !== userId);
    this.notify();
  }

  // Record a payment (settle up)
  recordPayment(
    groupId: string,
    fromUserId: string,
    toUserId: string,
    amountCents: number
  ) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');

    // Create a payment expense that zeros out the debt
    // Logic: If A owes B $50, we record an expense where:
    // - A is the payer (paid $50)
    // - B is the participant (owes $50)
    // This creates: B owes A $50, which cancels the existing A owes B $50
    const paymentExpense: Expense = {
      id: Date.now().toString(),
      title: `💸 Payment: ${this.getUser(fromUserId)?.name} → ${this.getUser(toUserId)?.name}`,
      amountCents: amountCents,
      currency: 'USD',
      payerId: fromUserId, // The person making the payment
      participants: [toUserId], // The person receiving is the participant
      splitType: 'exact',
      splits: [
        { userId: toUserId, amountCents: amountCents }, // Receiver's "share" is the full amount
      ],
      date: new Date(),
    };

    group.expenses.push(paymentExpense);
    this.notify();
  }

  // Upcoming Expenses
  getUpcomingExpenses(): UpcomingExpense[] {
    return [...this.upcomingExpenses];
  }

  getUpcomingExpense(id: string): UpcomingExpense | undefined {
    return this.upcomingExpenses.find(e => e.id === id);
  }

  addUpcomingExpense(
    title: string,
    amountCents: number,
    targetDate: Date,
    groupId: string,
    createdBy: string,
    participants: string[],
    splitType: SplitType,
    splits: { [userId: string]: number },
    notes?: string
  ): UpcomingExpense {
    const newUpcoming: UpcomingExpense = {
      id: Date.now().toString(),
      title,
      amountCents,
      currency: 'USD',
      targetDate,
      groupId,
      createdBy,
      participants,
      splitType,
      splits,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.upcomingExpenses.push(newUpcoming);
    this.notify();
    return newUpcoming;
  }

  updateUpcomingExpense(
    id: string,
    updates: Partial<Omit<UpcomingExpense, 'id' | 'createdAt' | 'createdBy'>>
  ) {
    const index = this.upcomingExpenses.findIndex(e => e.id === id);
    if (index === -1) return;

    this.upcomingExpenses[index] = {
      ...this.upcomingExpenses[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.notify();
  }

  deleteUpcomingExpense(id: string) {
    this.upcomingExpenses = this.upcomingExpenses.filter(e => e.id !== id);
    this.notify();
  }

  convertToExpense(
    upcomingId: string,
    payerId: string,
    actualDate: Date,
    removeAfter: boolean
  ): Expense | null {
    const upcoming = this.upcomingExpenses.find(e => e.id === upcomingId);
    if (!upcoming) return null;

    // Convert splits object to Split array format
    const splitsArray = upcoming.participants.map(userId => ({
      userId,
      amountCents: upcoming.splits[userId] || 0,
    }));

    // Create actual expense
    const expense = this.addExpense(
      upcoming.groupId,
      upcoming.title,
      upcoming.amountCents,
      payerId,
      upcoming.participants,
      upcoming.splitType,
      upcoming.splits
    );

    // Optionally remove upcoming expense
    if (removeAfter) {
      this.deleteUpcomingExpense(upcomingId);
    }

    return expense;
  }
}

export const dataStore = new DataStore();
