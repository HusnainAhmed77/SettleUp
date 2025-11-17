// Mock data for demonstration - replace with API calls later

import { Expense } from './split';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: User[];
  expenses: Expense[];
  createdAt: Date;
}

export const mockUsers: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com' },
  { id: '4', name: 'David', email: 'david@example.com' },
];

// Start with empty expenses - you can add your own!
export const mockExpenses: Expense[] = [];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Roommates',
    description: 'Shared apartment expenses',
    members: mockUsers,
    expenses: [], // Start with no expenses
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Trip to Paris',
    description: 'Summer vacation 2024',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    expenses: [], // Start with no expenses
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Office Lunch',
    description: 'Weekly team lunches',
    members: [mockUsers[0], mockUsers[3]],
    expenses: [], // Start with no expenses
    createdAt: new Date('2024-03-01'),
  },
];

// Current logged-in user (mock)
export const currentUser: User = mockUsers[0]; // Alice
