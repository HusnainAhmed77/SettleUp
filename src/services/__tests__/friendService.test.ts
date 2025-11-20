import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  addFriend,
  searchUsers,
  removeFriend,
  getFriends,
  areFriends,
  getFriend,
  getFriendCount,
  updateFriendProfileInfo,
} from '../friendService';
import { databases, APP_DATABASE_ID, APP_COLLECTIONS } from '@/lib/appwrite';
import { FriendError, FriendErrorCode } from '@/types/friends';

/**
 * Unit Tests for FriendService
 * Tests specific examples and edge cases
 * Requirements: 1.1, 1.2, 1.3, 1.5, 2.5
 */

describe('FriendService - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addFriend', () => {
    it('should add a friend with valid email', async () => {
      const userId = 'user-123';
      const friendUserId = 'friend-456';
      const friendData = {
        $id: 'profile-id',
        userId: friendUserId,
        email: 'friend@example.com',
        name: 'John Doe',
        profilePicture: 'https://example.com/pic.jpg',
        provider: 'email',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: '2024-01-01T00:00:00.000Z',
        $createdAt: '2024-01-01T00:00:00.000Z',
        $updatedAt: '2024-01-01T00:00:00.000Z',
      };

      // Mock friend profile lookup
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [friendData],
        total: 1,
      } as any);

      // Mock no existing friendship
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [],
        total: 0,
      } as any);

      // Mock friend creation
      const mockFriend = {
        $id: 'friend-connection-id',
        userId,
        friendUserId,
        friendEmail: friendData.email,
        friendName: friendData.name,
        friendProfilePicture: friendData.profilePicture,
        status: 'active',
        addedAt: '2024-01-01T00:00:00.000Z',
        $createdAt: '2024-01-01T00:00:00.000Z',
        $updatedAt: '2024-01-01T00:00:00.000Z',
      };

      vi.mocked(databases.createDocument)
        .mockResolvedValueOnce(mockFriend as any)
        .mockResolvedValueOnce({} as any);

      const result = await addFriend(userId, friendUserId);

      expect(result.friendEmail).toBe('friend@example.com');
      expect(result.friendName).toBe('John Doe');
      expect(result.friendProfilePicture).toBe('https://example.com/pic.jpg');
      expect(databases.createDocument).toHaveBeenCalledTimes(2); // Bidirectional
    });

    it('should reject self-friend attempts', async () => {
      const userId = 'user-123';

      await expect(addFriend(userId, userId)).rejects.toThrow(FriendError);
      await expect(addFriend(userId, userId)).rejects.toThrow('You cannot add yourself as a friend');
    });

    it('should handle non-existent email', async () => {
      const userId = 'user-123';
      const friendUserId = 'non-existent';

      // Mock no user found
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [],
        total: 0,
      } as any);

      await expect(addFriend(userId, friendUserId)).rejects.toThrow(FriendError);
      await expect(addFriend(userId, friendUserId)).rejects.toThrow('No user found with that ID');
    });

    it('should reject duplicate friend addition', async () => {
      const userId = 'user-123';
      const friendUserId = 'friend-456';

      // Mock friend profile lookup
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [{
          $id: 'profile-id',
          userId: friendUserId,
          email: 'friend@example.com',
          name: 'John Doe',
          profilePicture: null,
          provider: 'email',
          createdAt: '2024-01-01T00:00:00.000Z',
          lastLoginAt: '2024-01-01T00:00:00.000Z',
          $createdAt: '2024-01-01T00:00:00.000Z',
          $updatedAt: '2024-01-01T00:00:00.000Z',
        }],
        total: 1,
      } as any);

      // Mock existing friendship
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [{
          $id: 'existing-friend',
          userId,
          friendUserId,
          friendEmail: 'friend@example.com',
          friendName: 'John Doe',
          friendProfilePicture: null,
          status: 'active',
          addedAt: '2024-01-01T00:00:00.000Z',
          $createdAt: '2024-01-01T00:00:00.000Z',
          $updatedAt: '2024-01-01T00:00:00.000Z',
        }],
        total: 1,
      } as any);

      await expect(addFriend(userId, friendUserId)).rejects.toThrow(FriendError);
      await expect(addFriend(userId, friendUserId)).rejects.toThrow('This user is already in your friend list');
    });
  });

  describe('removeFriend', () => {
    it('should remove friendship bidirectionally', async () => {
      const userId = 'user-123';
      const friendUserId = 'friend-456';

      // Mock finding user's friendship
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [{
          $id: 'friendship-1',
          userId,
          friendUserId,
          friendEmail: 'friend@example.com',
          friendName: 'Friend',
          friendProfilePicture: null,
          status: 'active',
          addedAt: '2024-01-01T00:00:00.000Z',
          $createdAt: '2024-01-01T00:00:00.000Z',
          $updatedAt: '2024-01-01T00:00:00.000Z',
        }],
        total: 1,
      } as any);

      vi.mocked(databases.updateDocument).mockResolvedValueOnce({} as any);

      // Mock finding reciprocal friendship
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [{
          $id: 'friendship-2',
          userId: friendUserId,
          friendUserId: userId,
          friendEmail: 'user@example.com',
          friendName: 'User',
          friendProfilePicture: null,
          status: 'active',
          addedAt: '2024-01-01T00:00:00.000Z',
          $createdAt: '2024-01-01T00:00:00.000Z',
          $updatedAt: '2024-01-01T00:00:00.000Z',
        }],
        total: 1,
      } as any);

      vi.mocked(databases.updateDocument).mockResolvedValueOnce({} as any);

      await removeFriend(userId, friendUserId);

      expect(databases.updateDocument).toHaveBeenCalledTimes(2);
      expect(databases.updateDocument).toHaveBeenCalledWith(
        APP_DATABASE_ID,
        APP_COLLECTIONS.FRIENDS,
        'friendship-1',
        { status: 'removed' }
      );
      expect(databases.updateDocument).toHaveBeenCalledWith(
        APP_DATABASE_ID,
        APP_COLLECTIONS.FRIENDS,
        'friendship-2',
        { status: 'removed' }
      );
    });
  });

  describe('getFriends', () => {
    it('should return empty array when user has no friends', async () => {
      const userId = 'user-123';

      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [],
        total: 0,
      } as any);

      const result = await getFriends(userId);

      expect(result).toEqual([]);
      expect(databases.listDocuments).toHaveBeenCalledWith(
        APP_DATABASE_ID,
        APP_COLLECTIONS.FRIENDS,
        expect.arrayContaining([
          expect.stringContaining('equal("userId"'),
          expect.stringContaining('equal("status"'),
          expect.stringContaining('orderDesc("addedAt"'),
        ])
      );
    });

    it('should return list of active friends', async () => {
      const userId = 'user-123';
      const mockFriends = [
        {
          $id: 'friend-1',
          userId,
          friendUserId: 'friend-456',
          friendEmail: 'friend1@example.com',
          friendName: 'Friend One',
          friendProfilePicture: null,
          status: 'active',
          addedAt: '2024-01-01T00:00:00.000Z',
          $createdAt: '2024-01-01T00:00:00.000Z',
          $updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          $id: 'friend-2',
          userId,
          friendUserId: 'friend-789',
          friendEmail: 'friend2@example.com',
          friendName: 'Friend Two',
          friendProfilePicture: 'https://example.com/pic.jpg',
          status: 'active',
          addedAt: '2024-01-02T00:00:00.000Z',
          $createdAt: '2024-01-02T00:00:00.000Z',
          $updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: mockFriends,
        total: 2,
      } as any);

      const result = await getFriends(userId);

      expect(result).toHaveLength(2);
      expect(result[0].friendEmail).toBe('friend1@example.com');
      expect(result[1].friendEmail).toBe('friend2@example.com');
    });
  });

  describe('searchUsers', () => {
    it('should return empty array for empty query', async () => {
      const result = await searchUsers('', 'user-123');
      expect(result).toEqual([]);
    });

    it('should search by email and name', async () => {
      const currentUserId = 'user-123';
      const query = 'john';

      const mockUsers = [
        {
          $id: 'user-1',
          userId: 'user-456',
          email: 'john@example.com',
          name: 'John Doe',
          profilePicture: null,
          provider: 'email',
          createdAt: '2024-01-01T00:00:00.000Z',
          lastLoginAt: '2024-01-01T00:00:00.000Z',
          $createdAt: '2024-01-01T00:00:00.000Z',
          $updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      // Mock email search
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: mockUsers,
        total: 1,
      } as any);

      // Mock name search
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [],
        total: 0,
      } as any);

      const result = await searchUsers(query, currentUserId);

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('john@example.com');
    });

    it('should filter out current user from results', async () => {
      const currentUserId = 'user-123';
      const query = 'test';

      const mockUsers = [
        {
          $id: 'user-1',
          userId: currentUserId, // Current user
          email: 'test@example.com',
          name: 'Test User',
          profilePicture: null,
          provider: 'email',
          createdAt: '2024-01-01T00:00:00.000Z',
          lastLoginAt: '2024-01-01T00:00:00.000Z',
          $createdAt: '2024-01-01T00:00:00.000Z',
          $updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          $id: 'user-2',
          userId: 'user-456',
          email: 'test2@example.com',
          name: 'Test User 2',
          profilePicture: null,
          provider: 'email',
          createdAt: '2024-01-01T00:00:00.000Z',
          lastLoginAt: '2024-01-01T00:00:00.000Z',
          $createdAt: '2024-01-01T00:00:00.000Z',
          $updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      vi.mocked(databases.listDocuments)
        .mockResolvedValueOnce({ documents: mockUsers, total: 2 } as any)
        .mockResolvedValueOnce({ documents: [], total: 0 } as any);

      const result = await searchUsers(query, currentUserId);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('user-456');
    });
  });

  describe('areFriends', () => {
    it('should return true when users are friends', async () => {
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [{ $id: 'friendship-id' }],
        total: 1,
      } as any);

      const result = await areFriends('user-123', 'friend-456');
      expect(result).toBe(true);
    });

    it('should return false when users are not friends', async () => {
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [],
        total: 0,
      } as any);

      const result = await areFriends('user-123', 'friend-456');
      expect(result).toBe(false);
    });
  });

  describe('getFriendCount', () => {
    it('should return correct friend count', async () => {
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [{}, {}, {}],
        total: 3,
      } as any);

      const result = await getFriendCount('user-123');
      expect(result).toBe(3);
    });

    it('should return 0 when user has no friends', async () => {
      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: [],
        total: 0,
      } as any);

      const result = await getFriendCount('user-123');
      expect(result).toBe(0);
    });
  });

  describe('updateFriendProfileInfo', () => {
    it('should update denormalized friend data across all connections', async () => {
      const userId = 'user-123';
      const newName = 'Updated Name';
      const newEmail = 'updated@example.com';
      const newPicture = 'https://example.com/new-pic.jpg';

      const mockConnections = [
        { $id: 'connection-1' },
        { $id: 'connection-2' },
        { $id: 'connection-3' },
      ];

      vi.mocked(databases.listDocuments).mockResolvedValueOnce({
        documents: mockConnections,
        total: 3,
      } as any);

      vi.mocked(databases.updateDocument)
        .mockResolvedValueOnce({} as any)
        .mockResolvedValueOnce({} as any)
        .mockResolvedValueOnce({} as any);

      await updateFriendProfileInfo(userId, newName, newEmail, newPicture);

      expect(databases.updateDocument).toHaveBeenCalledTimes(3);
      expect(databases.updateDocument).toHaveBeenCalledWith(
        APP_DATABASE_ID,
        APP_COLLECTIONS.FRIENDS,
        'connection-1',
        {
          friendName: newName,
          friendEmail: newEmail,
          friendProfilePicture: newPicture,
        }
      );
    });
  });
});
