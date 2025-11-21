import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Appwrite client
vi.mock('@/lib/appwrite', () => ({
  databases: {
    listDocuments: vi.fn(),
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
  storage: {
    createFile: vi.fn(),
    deleteFile: vi.fn(),
    getFileView: vi.fn(),
  },
  account: {
    get: vi.fn(),
    createEmailPasswordSession: vi.fn(),
    deleteSession: vi.fn(),
  },
  Query: {
    equal: (attr: string, value: any) => `equal("${attr}", ${JSON.stringify(value)})`,
    search: (attr: string, value: string) => `search("${attr}", "${value}")`,
    limit: (value: number) => `limit(${value})`,
    offset: (value: number) => `offset(${value})`,
    orderDesc: (attr: string) => `orderDesc("${attr}")`,
    orderAsc: (attr: string) => `orderAsc("${attr}")`,
  },
  APP_DATABASE_ID: 'test_database_id',
  APP_COLLECTIONS: {
    GROUPS: 'groups',
    EXPENSES: 'expenses',
    MEMBER_NAMES: 'member_names',
    USER_PROFILES: 'user_profiles',
    CONTACT_SUBMISSIONS: 'contact_submissions',
    FRIENDS: 'friends',
    ADMIN_SETTLEMENTS: 'admin_settlements',
  },
  STORAGE_BUCKETS: {
    PROFILE_PICTURES: 'profile_pictures',
  },
}));
