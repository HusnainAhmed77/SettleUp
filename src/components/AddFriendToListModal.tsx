'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, Search, Loader2 } from 'lucide-react';
import { searchUsers, addFriend, areFriends } from '@/services/friendService';
import { UserProfile } from '@/services/userProfileService';
import ProfilePictureDisplay from './ProfilePictureDisplay';

/**
 * AddFriendToListModal Component
 * Modal for searching and adding friends by email
 * Implements Requirements: 1.1, 1.2, 1.3, 14.1, 14.2, 14.3, 14.4
 */

interface AddFriendToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFriendAdded: (friend: UserProfile) => void;
  currentUserId: string;
}

export default function AddFriendToListModal({
  isOpen,
  onClose,
  onFriendAdded,
  currentUserId,
}: AddFriendToListModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [friendStatuses, setFriendStatuses] = useState<Record<string, boolean>>({});

  // Search users when query changes
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const results = await searchUsers(searchQuery, currentUserId, 10);
        setSearchResults(results);

        // Check friend status for each result
        const statuses: Record<string, boolean> = {};
        await Promise.all(
          results.map(async (user) => {
            statuses[user.userId] = await areFriends(currentUserId, user.userId);
          })
        );
        setFriendStatuses(statuses);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Failed to search users. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(delaySearch);
  }, [searchQuery, currentUserId]);

  const handleAddFriend = async (user: UserProfile) => {
    try {
      setAdding(user.userId);
      setError('');
      
      const addedFriend = await addFriend(currentUserId, user.userId);
      
      // Update friend status
      setFriendStatuses((prev) => ({ ...prev, [user.userId]: true }));
      
      // Notify parent
      onFriendAdded(addedFriend);
      
      // Clear search and close after a brief delay
      setTimeout(() => {
        setSearchQuery('');
        setSearchResults([]);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Error adding friend:', err);
      setError(err.message || 'Failed to add friend. Please try again.');
    } finally {
      setAdding(null);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="text-teal-600" />
            Add Friend
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-teal-600" size={32} />
            </div>
          )}

          {/* Search Results */}
          {!loading && searchQuery.trim().length >= 2 && (
            <div>
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No users found matching "{searchQuery}"</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try searching by email address
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                  </p>
                  {searchResults.map((user) => {
                    const isFriend = friendStatuses[user.userId];
                    const isAdding = adding === user.userId;

                    return (
                      <div
                        key={user.userId}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <ProfilePictureDisplay
                            userId={user.userId}
                            pictureUrl={user.profilePicture || user.googleProfilePicture}
                            name={user.name}
                            size="medium"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>

                        {isFriend ? (
                          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                            Already Friends
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddFriend(user)}
                            disabled={isAdding}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isAdding ? (
                              <>
                                <Loader2 className="animate-spin" size={16} />
                                Adding...
                              </>
                            ) : (
                              <>
                                <UserPlus size={16} />
                                Add Friend
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!loading && searchQuery.trim().length < 2 && (
            <div className="text-center py-12">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">
                Search for friends by name or email address
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Type at least 2 characters to start searching
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
