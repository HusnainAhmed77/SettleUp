import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { addFriend, searchUsers, removeFriend, getFriends } from '../friendService';
import { databases, APP_DATABASE_ID, APP_COLLECTIONS } from '@/lib/appwrite';
import { FriendErrorCode } from '@/types/friends';

/**
 * Property-Based Tests for FriendService
 * Feature: friends-and-admin-system
 * 
 * These tests verify universal properties that should hold across all inputs
 * using fast-check library with minimum 100 iterations per property.
 */

describe('FriendService - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property 1: Friend addition by email
   * Feature: friends-and-admin-system, Property 1: Friend addition by email
   * Validates: Requirements 1.1, 1.2, 1.4
   * 
   * For any user database and email query, when searching for a user by email
   * and adding them as a friend, the friend should appear in the user's friend
   * list with correct name and profile picture.
   */
  describe('Property 1: Friend addition by email', () => {
    it('should add friend to list with correct information after search and add', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate random user IDs
          fc.uuid(),
          fc.uuid(),
          // Generate random user data
          fc.record({
            email: fc.emailAddress(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            profilePicture: fc.option(fc.webUrl(), { nil: null }),
          }),
          async (userId, friendUserId, friendData) => {
            // Ensure users are different
            fc.pre(userId !== friendUserId);

            // Mock search results
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({
              documents: [{
                $id: 'profile-id',
                userId: friendUserId,
                email: friendData.email,
                name: friendData.name,
                profilePicture: friendData.profilePicture,
                provider: 'email',
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
              }],
              total: 1,
            } as any);

            // Mock check for existing friendship (none exists)
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({
              documents: [],
              total: 0,
            } as any);

            // Mock friend creation
            const mockFriendDoc = {
              $id: 'friend-id',
              userId,
              friendUserId,
              friendEmail: friendData.email,
              friendName: friendData.name,
              friendProfilePicture: friendData.profilePicture,
              status: 'active',
              addedAt: new Date().toISOString(),
              $createdAt: new Date().toISOString(),
              $updatedAt: new Date().toISOString(),
            };

            vi.mocked(databases.createDocument)
              .mockResolvedValueOnce(mockFriendDoc as any)
              .mockResolvedValueOnce({} as any); // Reciprocal connection

            // Mock getFriends to return the added friend
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({
              documents: [mockFriendDoc],
              total: 1,
            } as any);

            // Execute: Add friend
            const addedFriend = await addFriend(userId, friendUserId);

            // Verify: Friend was added with correct information
            expect(addedFriend.friendEmail).toBe(friendData.email);
            expect(addedFriend.friendName).toBe(friendData.name);
            expect(addedFriend.friendProfilePicture).toBe(friendData.profilePicture);
            expect(addedFriend.status).toBe('active');

            // Verify: Friend appears in friend list
            const friends = await getFriends(userId);
            expect(friends).toHaveLength(1);
            expect(friends[0].friendUserId).toBe(friendUserId);
            expect(friends[0].friendEmail).toBe(friendData.email);
            expect(friends[0].friendName).toBe(friendData.name);
          }
        ),
        { numRuns: 100 } // Run 100 iterations as specified in design
      );
    });

    it('should reject self-friend attempts for any user', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          async (userId) => {
            // Mock user profile lookup
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({
              documents: [{
                $id: 'profile-id',
                userId,
                email: 'user@example.com',
                name: 'Test User',
                profilePicture: null,
                provider: 'email',
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
              }],
              total: 1,
            } as any);

            // Attempt to add self as friend should throw error
            await expect(addFriend(userId, userId)).rejects.toThrow('You cannot add yourself as a friend');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject duplicate friend additions for any user pair', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.uuid(),
          async (userId, friendUserId) => {
            fc.pre(userId !== friendUserId);

            // Mock user profile lookup
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({
              documents: [{
                $id: 'profile-id',
                userId: friendUserId,
                email: 'friend@example.com',
                name: 'Friend User',
                profilePicture: null,
                provider: 'email',
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
              }],
              total: 1,
            } as any);

            // Mock existing friendship
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({
              documents: [{
                $id: 'existing-friend-id',
                userId,
                friendUserId,
                friendEmail: 'friend@example.com',
                friendName: 'Friend User',
                friendProfilePicture: null,
                status: 'active',
                addedAt: new Date().toISOString(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
              }],
              total: 1,
            } as any);

            // Attempt to add existing friend should throw error
            await expect(addFriend(userId, friendUserId)).rejects.toThrow('This user is already in your friend list');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: Bidirectional friend removal
   * Feature: friends-and-admin-system, Property 2: Bidirectional friend removal
   * Validates: Requirements 2.2, 2.3
   * 
   * For any two users who are friends, when one user removes the other as a friend,
   * both users' friend lists should no longer contain each other.
   */
  describe('Property 2: Bidirectional friend removal', () => {
    it('should remove friendship from both users when either removes the other', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.uuid(),
          async (userId, friendUserId) => {
            fc.pre(userId !== friendUserId);

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
                addedAt: new Date().toISOString(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
              }],
              total: 1,
            } as any);

            // Mock update for user's friendship
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
                addedAt: new Date().toISOString(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
              }],
              total: 1,
            } as any);

            // Mock update for reciprocal friendship
            vi.mocked(databases.updateDocument).mockResolvedValueOnce({} as any);

            // Execute: Remove friend
            await removeFriend(userId, friendUserId);

            // Verify: Both friendships were updated to 'removed' status
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

            // Mock empty friend lists after removal
            vi.mocked(databases.listDocuments)
              .mockResolvedValueOnce({ documents: [], total: 0 } as any)
              .mockResolvedValueOnce({ documents: [], total: 0 } as any);

            // Verify: Neither user has the other in their friend list
            const userFriends = await getFriends(userId);
            const friendFriends = await getFriends(friendUserId);
            
            expect(userFriends).toHaveLength(0);
            expect(friendFriends).toHaveLength(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle removal gracefully when friendship does not exist', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.uuid(),
          async (userId, friendUserId) => {
            fc.pre(userId !== friendUserId);

            // Mock no existing friendships
            vi.mocked(databases.listDocuments)
              .mockResolvedValueOnce({ documents: [], total: 0 } as any)
              .mockResolvedValueOnce({ documents: [], total: 0 } as any);

            // Execute: Remove non-existent friend should not throw
            await expect(removeFriend(userId, friendUserId)).resolves.not.toThrow();

            // Verify: No update calls were made
            expect(databases.updateDocument).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
