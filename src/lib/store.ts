// Store for managing groups and expenses with Appwrite backend

import { Group, User, mockUsers, mockGroups as initialGroups, currentUser } from './mockData';
import { Expense, computeShares, SplitType, UpcomingExpense } from './split';
import * as dataService from '@/services/dataService';

const STORAGE_KEY_UPCOMING = 'splitwise-upcoming-expenses';
const STORAGE_KEY_GROUPS = 'splitwise-groups';
const STORAGE_KEY_USERS = 'splitwise-users';

// Utility functions for localStorage
function saveUpcomingExpenses(expenses: UpcomingExpense[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_UPCOMING, JSON.stringify(expenses));
    } catch (error) {
      console.error('Failed to save upcoming expenses to localStorage:', error);
    }
  }
}

function loadUpcomingExpenses(): UpcomingExpense[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_UPCOMING);
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

function saveGroups(groups: Group[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
    } catch (error) {
      console.error('Failed to save groups to localStorage:', error);
    }
  }
}

function loadGroups(): Group[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GROUPS);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((group: any) => ({
          ...group,
          createdAt: new Date(group.createdAt),
          expenses: group.expenses.map((exp: any) => ({
            ...exp,
            date: new Date(exp.date),
          })),
        }));
      }
    } catch (error) {
      console.error('Failed to load groups from localStorage:', error);
    }
  }
  return [...initialGroups]; // Return initial groups if nothing in localStorage
}

function saveUsers(users: User[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }
}

function loadUsers(): User[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load users from localStorage:', error);
    }
  }
  return [...mockUsers]; // Return initial users if nothing in localStorage
}

class DataStore {
  private groups: Group[] = [];
  private users: User[] = [...mockUsers];
  private upcomingExpenses: UpcomingExpense[] = [];
  private listeners: (() => void)[] = [];
  private idCounter: number = 0;
  private userId: string | null = null;
  private isInitialized: boolean = false;
  private isLoading: boolean = false;

  // Set the current user ID (call this after login)
  setUserId(userId: string) {
    this.userId = userId;
  }

  // Check if data is currently loading
  getIsLoading(): boolean {
    return this.isLoading;
  }

  // Clear all data (call on logout)
  clear() {
    this.groups = [];
    this.upcomingExpenses = [];
    this.userId = null;
    this.isInitialized = false;
    this.isLoading = false;
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_GROUPS);
      localStorage.removeItem(STORAGE_KEY_UPCOMING);
    }
    
    this.notify();
  }

  // Initialize data from Appwrite
  async initialize(userId: string) {
    if (this.isInitialized && this.userId === userId) return;
    
    this.userId = userId;
    this.isLoading = true;
    this.notify();

    try {
      // Load groups and expenses from Appwrite
      const groups = await dataService.getUserGroups(userId);
      this.groups = groups;
      
      // Load upcoming expenses
      const upcoming = await dataService.getUserUpcomingExpenses(userId);
      this.upcomingExpenses = upcoming;
      
      this.isInitialized = true;
      this.isLoading = false;
      this.notify();
    } catch (error) {
      console.error('Failed to initialize data from Appwrite:', error);
      // Start with empty data on error
      this.groups = [];
      this.upcomingExpenses = [];
      this.isInitialized = true;
      this.isLoading = false;
      this.notify();
    }
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${this.idCounter++}`;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    // Save to localStorage as backup
    saveGroups(this.groups);
    saveUsers(this.users);
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
    // This ensures React detects changes when expenses are added
    return {
      ...group,
      members: [...group.members],
      expenses: group.expenses.map(e => ({ ...e })),
    };
  }

  async createGroup(name: string, description: string, memberIds: string[]): Promise<Group> {
    const members = this.users.filter(u => memberIds.includes(u.id));
    
    if (this.userId) {
      // Save to Appwrite
      try {
        const newGroup = await dataService.createGroup(name, description, members, this.userId);
        this.groups.push(newGroup);
        this.notify();
        return newGroup;
      } catch (error) {
        console.error('Failed to create group in Appwrite:', error);
      }
    }
    
    // Fallback to local storage
    const newGroup: Group = {
      id: this.generateId(),
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

  async deleteGroup(id: string) {
    if (this.userId) {
      try {
        await dataService.deleteGroup(id);
      } catch (error) {
        console.error('Failed to delete group from Appwrite:', error);
      }
    }
    
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
      id: this.generateId(),
      name,
      email,
    };
    this.users.push(newUser);
    this.notify();
    return newUser;
  }

  // Expenses
  async addExpense(
    groupId: string,
    title: string,
    amountCents: number,
    payerId: string,
    participantIds: string[],
    splitType: SplitType,
    customSplits?: { [userId: string]: number },
    payers?: { userId: string; amountCents: number }[]
  ): Promise<Expense> {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');

    // Compute shares based on split type
    const splits = computeShares(amountCents, participantIds, splitType, customSplits);

    const newExpense: Expense = {
      id: this.generateId(),
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

    if (this.userId) {
      try {
        const savedExpense = await dataService.createExpense(groupId, newExpense, this.userId);
        group.expenses.push(savedExpense);
        this.notify();
        return savedExpense;
      } catch (error) {
        console.error('Failed to create expense in Appwrite:', error);
      }
    }

    group.expenses.push(newExpense);
    this.notify();
    return newExpense;
  }

  async deleteExpense(groupId: string, expenseId: string) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    if (this.userId) {
      try {
        await dataService.deleteExpense(expenseId);
      } catch (error) {
        console.error('Failed to delete expense from Appwrite:', error);
      }
    }

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
  async addMemberToGroup(groupId: string, userId: string) {
    const group = this.groups.find(g => g.id === groupId);
    const user = this.getUser(userId);
    if (!group || !user) return;

    if (!group.members.find(m => m.id === userId)) {
      group.members.push(user);
      
      // Update in Appwrite
      if (this.userId) {
        try {
          await dataService.updateGroup(groupId, { members: group.members }, this.userId);
        } catch (error) {
          console.error('Failed to update group in Appwrite:', error);
        }
      }
      
      this.notify();
    }
  }

  // Remove member from group
  async removeMemberFromGroup(groupId: string, userId: string) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    group.members = group.members.filter(m => m.id !== userId);
    
    // Update in Appwrite
    if (this.userId) {
      try {
        await dataService.updateGroup(groupId, { members: group.members }, this.userId);
      } catch (error) {
        console.error('Failed to update group in Appwrite:', error);
      }
    }
    
    this.notify();
  }

  // Record a payment (settle up)
  async recordPayment(
    groupId: string,
    fromUserId: string,
    toUserId: string,
    amountCents: number
  ) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');

    // Initialize settlements array if it doesn't exist
    if (!group.settlements) {
      group.settlements = [];
    }

    // Record the settlement payment
    const settlement = {
      id: this.generateId(),
      fromUserId,
      toUserId,
      amountCents,
      date: new Date(),
      note: `${this.getUser(fromUserId)?.name} paid ${this.getUser(toUserId)?.name}`
    };

    group.settlements.push(settlement);

    // TODO: Save settlement to Appwrite (create settlements collection)
    // For now, just save to local storage
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
      id: this.generateId(),
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

  async deleteUpcomingExpense(id: string) {
    if (this.userId) {
      try {
        await dataService.deleteUpcomingExpense(id);
      } catch (error) {
        console.error('Failed to delete upcoming expense from Appwrite:', error);
      }
    }
    
    this.upcomingExpenses = this.upcomingExpenses.filter(e => e.id !== id);
    this.notify();
  }

  async convertToExpense(
    upcomingId: string,
    payerId: string,
    actualDate: Date,
    removeAfter: boolean
  ): Promise<Expense | null> {
    const upcoming = this.upcomingExpenses.find(e => e.id === upcomingId);
    if (!upcoming) return null;

    // Convert splits object to Split array format
    const splitsArray = upcoming.participants.map(userId => ({
      userId,
      amountCents: upcoming.splits[userId] || 0,
    }));

    // Create actual expense
    const expense = await this.addExpense(
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
      await this.deleteUpcomingExpense(upcomingId);
    }

    return expense;
  }
}

export const dataStore = new DataStore();
