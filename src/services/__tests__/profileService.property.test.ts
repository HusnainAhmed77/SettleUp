import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import {
  uploadProfilePicture,
  validateImageFile,
  uploadAndSetProfilePicture,
  updateProfilePicture,
  getProfilePicture,
} from '../profileService';
import { databases, storage, APP_DATABASE_ID, APP_COLLECTIONS, STORAGE_BUCKETS } from '@/lib/appwrite';
import { ProfileErrorCode } from '@/types/friends';

/**
 * Property-Based Tests for ProfileService
 * Feature: friends-and-admin-system
 * 
 * These tests verify universal properties that should hold across all inputs
 * using fast-check library with minimum 100 iterations per property.
 */

// Mock modules
vi.mock('@/lib/appwrite', () => ({
  databases: {
    listDocuments: vi.fn(),
    updateDocument: vi.fn(),
  },
  storage: {
    createFile: vi.fn(),
    getFileView: vi.fn(),
  },
  APP_DATABASE_ID: 'test-db',
  APP_COLLECTIONS: {
    USER_PROFILES: 'user_profiles',
  },
  STORAGE_BUCKETS: {
    PROFILE_PICTURES: 'profile_pictures',
  },
  Query: {
    equal: (field: string, value: string) => `equal("${field}", "${value}")`,
  },
}));

describe('ProfileService - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property 12: Profile picture upload and validation
   * Feature: friends-and-admin-system, Property 12: Profile picture upload and validation
   * Validates: Requirements 10.3, 10.4
   * 
   * For any image file upload, the system should validate file type and size,
   * and if valid, store it in Appwrite storage and update the user profile.
   */
  describe('Property 12: Profile picture upload and validation', () => {
    // Arbitrary for valid image files
    const validImageFile = () =>
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s}.jpg`),
        type: fc.constantFrom('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'),
        size: fc.integer({ min: 1, max: 5 * 1024 * 1024 }), // 1 byte to 5MB
      });

    // Arbitrary for invalid file types
    const invalidFileType = () =>
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s}.pdf`),
        type: fc.constantFrom('application/pdf', 'text/plain', 'video/mp4', 'application/zip'),
        size: fc.integer({ min: 1, max: 1024 * 1024 }),
      });

    // Arbitrary for files that are too large
    const tooLargeFile = () =>
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s}.jpg`),
        type: fc.constantFrom('image/jpeg', 'image/png'),
        size: fc.integer({ min: 5 * 1024 * 1024 + 1, max: 50 * 1024 * 1024 }), // > 5MB
      });

    it('should accept and store valid image files', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          validImageFile(),
          async (userId, fileData) => {
            // Create a mock File object
            const file = new File(['test'], fileData.name, { type: fileData.type });
            Object.defineProperty(file, 'size', { value: fileData.size });

            const mockFileId = 'file-' + Math.random().toString(36).substring(7);
            const mockFileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKETS.PROFILE_PICTURES}/files/${mockFileId}/view`;

            // Mock storage upload
            vi.mocked(storage.createFile).mockResolvedValueOnce({
              $id: mockFileId,
              bucketId: STORAGE_BUCKETS.PROFILE_PICTURES,
              $createdAt: new Date().toISOString(),
              $updatedAt: new Date().toISOString(),
              name: fileData.name,
              signature: 'test-signature',
              mimeType: fileData.type,
              sizeOriginal: fileData.size,
              chunksTotal: 1,
              chunksUploaded: 1,
            } as any);

            // Mock getFileView
            vi.mocked(storage.getFileView).mockReturnValueOnce({
              toString: () => mockFileUrl,
            } as any);

            // Execute: Upload profile picture
            const result = await uploadProfilePicture(userId, file);

            // Verify: File was uploaded to storage
            expect(storage.createFile).toHaveBeenCalledWith(
              STORAGE_BUCKETS.PROFILE_PICTURES,
              expect.any(String),
              file
            );

            // Verify: URL was returned
            expect(result).toBe(mockFileUrl);
            expect(result).toContain(STORAGE_BUCKETS.PROFILE_PICTURES);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject files with invalid types', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          invalidFileType(),
          async (userId, fileData) => {
            // Create a mock File object with invalid type
            const file = new File(['test'], fileData.name, { type: fileData.type });
            Object.defineProperty(file, 'size', { value: fileData.size });

            // Execute: Attempt to upload invalid file type
            await expect(uploadProfilePicture(userId, file)).rejects.toThrow(
              'Please upload an image file (JPG, PNG, GIF, or WebP)'
            );

            // Verify: No storage upload was attempted
            expect(storage.createFile).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject files that are too large', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          tooLargeFile(),
          async (userId, fileData) => {
            // Create a mock File object that's too large
            const file = new File(['test'], fileData.name, { type: fileData.type });
            Object.defineProperty(file, 'size', { value: fileData.size });

            // Execute: Attempt to upload oversized file
            await expect(uploadProfilePicture(userId, file)).rejects.toThrow(
              'Image must be smaller than 5MB'
            );

            // Verify: No storage upload was attempted
            expect(storage.createFile).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate file type before upload', async () => {
      await fc.assert(
        fc.property(
          validImageFile(),
          (fileData) => {
            // Create a mock File object
            const file = new File(['test'], fileData.name, { type: fileData.type });
            Object.defineProperty(file, 'size', { value: fileData.size });

            // Execute: Validate should pass for valid files
            expect(() => validateImageFile(file)).not.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate file size before upload', async () => {
      await fc.assert(
        fc.property(
          tooLargeFile(),
          (fileData) => {
            // Create a mock File object that's too large
            const file = new File(['test'], fileData.name, { type: fileData.type });
            Object.defineProperty(file, 'size', { value: fileData.size });

            // Execute: Validate should throw for oversized files
            expect(() => validateImageFile(file)).toThrow('Image must be smaller than 5MB');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should update user profile after successful upload', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          validImageFile(),
          async (userId, fileData) => {
            // Create a mock File object
            const file = new File(['test'], fileData.name, { type: fileData.type });
            Object.defineProperty(file, 'size', { value: fileData.size });

            const mockFileId = 'file-' + Math.random().toString(36).substring(7);
            const mockFileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKETS.PROFILE_PICTURES}/files/${mockFileId}/view`;

            // Mock storage upload
            vi.mocked(storage.createFile).mockResolvedValueOnce({
              $id: mockFileId,
              bucketId: STORAGE_BUCKETS.PROFILE_PICTURES,
              $createdAt: new Date().toISOString(),
              $updatedAt: new Date().toISOString(),
              name: fileData.name,
              signature: 'test-signature',
              mimeType: fileData.type,
              sizeOriginal: fileData.size,
              chunksTotal: 1,
              chunksUploaded: 1,
            } as any);

            // Mock getFileView
            vi.mocked(storage.getFileView).mockReturnValueOnce({
              toString: () => mockFileUrl,
            } as any);

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

            // Mock profile update
            vi.mocked(databases.updateDocument).mockResolvedValueOnce({} as any);

            // Execute: Upload and set profile picture
            const result = await uploadAndSetProfilePicture(userId, file);

            // Verify: File was uploaded
            expect(storage.createFile).toHaveBeenCalled();

            // Verify: Profile was updated with new picture URL
            expect(databases.updateDocument).toHaveBeenCalledWith(
              APP_DATABASE_ID,
              APP_COLLECTIONS.USER_PROFILES,
              'profile-id',
              { profilePicture: mockFileUrl }
            );

            // Verify: URL was returned
            expect(result).toBe(mockFileUrl);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should retrieve uploaded profile picture', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.webUrl(),
          async (userId, pictureUrl) => {
            // Mock user profile with picture
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({
              documents: [{
                $id: 'profile-id',
                userId,
                email: 'user@example.com',
                name: 'Test User',
                profilePicture: pictureUrl,
                provider: 'email',
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
              }],
              total: 1,
            } as any);

            // Execute: Get profile picture
            const result = await getProfilePicture(userId);

            // Verify: Correct picture URL was returned
            expect(result).toBe(pictureUrl);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle validation errors with appropriate error codes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.oneof(invalidFileType(), tooLargeFile()),
          async (userId, fileData) => {
            // Create a mock File object
            const file = new File(['test'], fileData.name, { type: fileData.type });
            Object.defineProperty(file, 'size', { value: fileData.size });

            // Execute: Attempt to upload invalid file
            try {
              await uploadProfilePicture(userId, file);
              // Should not reach here
              expect(true).toBe(false);
            } catch (error: any) {
              // Verify: Error has correct code
              expect(error.code).toMatch(/PROFILE_INVALID_FILE_TYPE|PROFILE_FILE_TOO_LARGE/);
              
              // Verify: Error is a ProfileError
              expect(error.name).toBe('ProfileError');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
