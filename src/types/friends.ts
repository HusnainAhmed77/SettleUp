/**
 * Friend System Type Definitions
 * Based on friends-and-admin-system design document
 */

// Friends are now stored as an array of user IDs in the user_profiles collection
// No separate Friend interface needed - just use UserProfile

export interface AdminSettlement {
  $id: string;
  groupId: string;
  adminUserId: string;      // Admin who recorded the settlement
  fromUserId: string;       // User who paid
  toUserId: string;         // User who received
  amountCents: number;
  currency: string;
  notes?: string;
  recordedAt: string;       // ISO timestamp
  $createdAt: string;
  $updatedAt: string;
}

export interface GroupEnhanced {
  $id: string;
  name: string;
  description: string;
  userId: string;           // Group creator (admin)
  adminUserId: string;      // Explicit admin field (same as userId initially)
  members: string;          // JSON array of member objects
  sharedWith: string;       // JSON array of user IDs who have access
  createdAt: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface GroupMember {
  id: string;               // User ID or generated ID for name-only members
  name: string;
  email?: string;           // Present for verified users
  isVerified: boolean;      // True if this is a real user account
  isFriend: boolean;        // True if this user is in creator's friend list
}

export interface UserProfileEnhanced {
  $id: string;
  userId: string;
  email: string;
  name: string;
  profilePicture?: string;      // Appwrite Storage file ID or URL
  googleProfilePicture?: string; // Original Google profile picture URL
  friendIds?: string[];         // Array of friend user IDs
  friendNames?: string[];       // Array of friend names (parallel to friendIds)
  provider: string;
  lastLoginAt: string;
  createdAt: string;
  $createdAt: string;
  $updatedAt: string;
}

// Error codes for friend system
export enum FriendErrorCode {
  USER_NOT_FOUND = 'FRIEND_USER_NOT_FOUND',
  SELF_ADD_FORBIDDEN = 'FRIEND_SELF_ADD_FORBIDDEN',
  ALREADY_EXISTS = 'FRIEND_ALREADY_EXISTS',
  NOT_FOUND = 'FRIEND_NOT_FOUND',
}

// Error codes for admin system
export enum AdminErrorCode {
  UNAUTHORIZED = 'ADMIN_UNAUTHORIZED',
  SETTLEMENT_INVALID = 'ADMIN_SETTLEMENT_INVALID',
  SETTLEMENT_DUPLICATE = 'ADMIN_SETTLEMENT_DUPLICATE',
}

// Error codes for profile system
export enum ProfileErrorCode {
  INVALID_FILE_TYPE = 'PROFILE_INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'PROFILE_FILE_TOO_LARGE',
  UPLOAD_FAILED = 'PROFILE_UPLOAD_FAILED',
  GOOGLE_PICTURE_UNAVAILABLE = 'PROFILE_GOOGLE_PICTURE_UNAVAILABLE',
}

export class FriendError extends Error {
  constructor(public code: FriendErrorCode, message: string) {
    super(message);
    this.name = 'FriendError';
  }
}

export class AdminError extends Error {
  constructor(public code: AdminErrorCode, message: string) {
    super(message);
    this.name = 'AdminError';
  }
}

export class ProfileError extends Error {
  constructor(public code: ProfileErrorCode, message: string) {
    super(message);
    this.name = 'ProfileError';
  }
}
