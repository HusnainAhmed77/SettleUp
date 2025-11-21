'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Search, Trash2, Clock } from 'lucide-react';
import { account } from '@/lib/appwrite';
import { getFriends, removeFriend, searchFriendsByName } from '@/services/friendService';
import { UserProfile } from '@/services/userProfileService';
import ProfilePictureDisplay from '@/components/ProfilePictureDisplay';
import AddFriendToListModal from '@/components/AddFriendToListModal';

/**
 * FriendListPage Component
 * Displays user's friends with search and management functionality
 * Implements Requirements: 2.1, 2.2, 2.4, 2.5, 15.2, 15.4
 */

export default function FriendsPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [removingFriendId, setRemovingFriendId] = useState<string | null>(null);

  // Check authentication and load friends
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await account.get();
      setCurrentUserId(user.$id);
      await loadFriends(user.$id);
    } catch (error) {
      console.error('Not authenticated:', error);
      router.push('/auth?mode=login');
    }
  };

  const loadFriends = async (userId: string) => {
    try {
      setLoading(true);
      const friendsList = await getFriends(userId);
      setFriends(friendsList);
      setFilteredFriends(friendsList);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFriends(friends);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(query) ||
        friend.email.toLowerCase().includes(query)
    );
    setFilteredFriends(filtered);
  }, [searchQuery, friends]);

  const handleRemoveFriend = async (friendUserId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      setRemovingFriendId(friendUserId);
      await removeFriend(currentUserId, friendUserId);
      
      // Update local state
      setFriends((prev) => prev.filter((f) => f.userId !== friendUserId));
      setFilteredFriends((prev) => prev.filter((f) => f.userId !== friendUserId));
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend. Please try again.');
    } finally {
      setRemovingFriendId(null);
    }
  };

  const handleFriendAdded = (newFriend: UserProfile) => {
    setFriends((prev) => [newFriend, ...prev]);
    setFilteredFriends((prev) => [newFriend, ...prev]);
    setIsAddFriendModalOpen(false);
  };

  // Calculate activity status
  const getActivityStatus = (lastLoginAt: string) => {
    const lastLogin = new Date(lastLoginAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return { active: true, text: 'Active' };
    }

    const daysDiff = Math.floor(hoursDiff / 24);
    if (daysDiff === 0) {
      return { active: false, text: 'Today' };
    } else if (daysDiff === 1) {
      return { active: false, text: 'Yesterday' };
    } else if (daysDiff < 7) {
      return { active: false, text: `${daysDiff} days ago` };
    } else {
      return { active: false, text: lastLogin.toLocaleDateString() };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="text-teal-600" />
                Friends
              </h1>
              <p className="mt-2 text-gray-600">
                {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
              </p>
            </div>
            <button
              onClick={() => setIsAddFriendModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <UserPlus size={20} />
              Add Friend
            </button>
          </div>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search friends by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Friends List */}
        {filteredFriends.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No friends found' : 'No friends yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Add friends to share expenses and track balances together'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsAddFriendModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <UserPlus size={20} />
                Add Your First Friend
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {filteredFriends.map((friend) => {
              const activityStatus = getActivityStatus(friend.lastLoginAt);
              
              return (
                <div
                  key={friend.userId}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <ProfilePictureDisplay
                        userId={friend.userId}
                        pictureUrl={friend.profilePicture || friend.googleProfilePicture}
                        name={friend.name}
                        size="large"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {friend.name}
                        </h3>
                        <p className="text-sm text-gray-600">{friend.email}</p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={14} className="text-gray-400" />
                          <span
                            className={`text-xs ${
                              activityStatus.active
                                ? 'text-green-600 font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            {activityStatus.active && (
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            )}
                            {activityStatus.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFriend(friend.userId)}
                      disabled={removingFriendId === friend.userId}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove friend"
                    >
                      {removingFriendId === friend.userId ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      <AddFriendToListModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onFriendAdded={handleFriendAdded}
        currentUserId={currentUserId}
      />
    </div>
  );
}
