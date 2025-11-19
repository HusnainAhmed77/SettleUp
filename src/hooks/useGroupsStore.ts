import { create } from 'zustand';
import {
  Group,
  CreateGroupData,
  getUserGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from '@/lib/services/groupsService';
import { addMemberNames } from '@/lib/services/membersService';

interface GroupsStore {
  groups: Group[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchGroups: (userId: string) => Promise<void>;
  addGroup: (userId: string, data: CreateGroupData) => Promise<Group>;
  updateGroupData: (groupId: string, data: Partial<CreateGroupData>) => Promise<void>;
  removeGroup: (groupId: string) => Promise<void>;
  clearGroups: () => void;
}

export const useGroupsStore = create<GroupsStore>((set, get) => ({
  groups: [],
  loading: false,
  error: null,

  fetchGroups: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const groups = await getUserGroups(userId);
      set({ groups, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch groups', loading: false });
      console.error('Error in fetchGroups:', error);
    }
  },

  addGroup: async (userId: string, data: CreateGroupData) => {
    set({ loading: true, error: null });
    try {
      const newGroup = await createGroup(userId, data);
      
      // Update member names for autocomplete
      await addMemberNames(userId, data.members);
      
      set(state => ({
        groups: [newGroup, ...state.groups],
        loading: false,
      }));
      
      return newGroup;
    } catch (error) {
      set({ error: 'Failed to create group', loading: false });
      console.error('Error in addGroup:', error);
      throw error;
    }
  },

  updateGroupData: async (groupId: string, data: Partial<CreateGroupData>) => {
    set({ loading: true, error: null });
    try {
      const updatedGroup = await updateGroup(groupId, data);
      
      set(state => ({
        groups: state.groups.map(g => g.$id === groupId ? updatedGroup : g),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update group', loading: false });
      console.error('Error in updateGroupData:', error);
      throw error;
    }
  },

  removeGroup: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      await deleteGroup(groupId);
      
      set(state => ({
        groups: state.groups.filter(g => g.$id !== groupId),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete group', loading: false });
      console.error('Error in removeGroup:', error);
      throw error;
    }
  },

  clearGroups: () => {
    set({ groups: [], loading: false, error: null });
  },
}));
