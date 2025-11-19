import { create } from 'zustand';
import {
  getMemberNames,
  addMemberNames,
  getMemberSuggestions,
} from '@/lib/services/membersService';

interface MembersStore {
  memberNames: string[];
  loading: boolean;

  // Actions
  fetchMemberNames: (userId: string) => Promise<void>;
  addMembers: (userId: string, names: string[]) => Promise<void>;
  getSuggestions: (userId: string, query: string) => Promise<string[]>;
  clearMembers: () => void;
}

export const useMembersStore = create<MembersStore>((set, get) => ({
  memberNames: [],
  loading: false,

  fetchMemberNames: async (userId: string) => {
    set({ loading: true });
    try {
      const names = await getMemberNames(userId);
      set({ memberNames: names, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Error in fetchMemberNames:', error);
    }
  },

  addMembers: async (userId: string, names: string[]) => {
    try {
      await addMemberNames(userId, names);
      
      // Refresh member names
      const updatedNames = await getMemberNames(userId);
      set({ memberNames: updatedNames });
    } catch (error) {
      console.error('Error in addMembers:', error);
      throw error;
    }
  },

  getSuggestions: async (userId: string, query: string) => {
    try {
      const suggestions = await getMemberSuggestions(userId, query);
      return suggestions;
    } catch (error) {
      console.error('Error in getSuggestions:', error);
      return [];
    }
  },

  clearMembers: () => {
    set({ memberNames: [], loading: false });
  },
}));
