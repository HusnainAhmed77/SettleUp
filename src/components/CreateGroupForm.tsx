'use client';

import { useState, useEffect } from 'react';
import { X, Users, UserCheck } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { dataStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { currentUser } from '@/lib/mockData';
import { getFriends } from '@/services/friendService';
import { createGroup as createGroupService } from '@/lib/services/groupsService';

interface CreateGroupFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Friend {
  $id: string;
  userId: string;
  name: string;
  email: string;
}

export default function CreateGroupForm({ onClose, onSuccess }: CreateGroupFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberNames, setMemberNames] = useState<string[]>(['You']); // Start with "You"
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]); // Track selected friend IDs for sharing
  const [currentMemberName, setCurrentMemberName] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState('');

  // Load friends
  useEffect(() => {
    const loadFriends = async () => {
      if (user?.$id) {
        try {
          const friendsList = await getFriends(user.$id);
          setFriends(friendsList as Friend[]);
        } catch (error) {
          console.error('Failed to load friends:', error);
        }
      }
    };
    
    loadFriends();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    if (memberNames.length < 2 && selectedFriendIds.length === 0) {
      setError('Please add at least 2 members (including yourself) or select friends to share with');
      return;
    }

    try {
      // Create actual User objects for each member name
      const memberIds: string[] = [];
      
      memberNames.forEach((memberName) => {
        if (memberName === 'You') {
          // Always use the currentUser ID to ensure consistency
          memberIds.push(currentUser.id);
        } else {
          // Create a new user for each friend name
          const email = `${memberName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
          const existingUser = dataStore.getUsers().find(u => u.name === memberName);
          
          if (existingUser) {
            memberIds.push(existingUser.id);
          } else {
            const newUser = dataStore.createUser(memberName, email);
            memberIds.push(newUser.id);
          }
        }
      });

      // Combine member IDs with selected friend IDs (friends are verified users)
      const allMemberIds = [...new Set([...memberIds, ...selectedFriendIds])];

      // Ensure all selected friends exist in the dataStore users array
      const currentUsers = dataStore.getUsers();
      selectedFriendIds.forEach(friendId => {
        const friend = friends.find(f => f.userId === friendId);
        if (friend) {
          // Check if user already exists in dataStore
          const existingUser = currentUsers.find(u => u.id === friendId);
          if (!existingUser) {
            // Add friend as a user to dataStore directly
            currentUsers.push({
              id: friendId,
              name: friend.name,
              email: friend.email,
            });
          }
        }
      });

      // Convert member IDs to User objects
      const memberUsers = allMemberIds.map(id => {
        const user = currentUsers.find(u => u.id === id);
        if (user) return user;
        // Fallback for any missing users
        return {
          id,
          name: `User ${id.substring(0, 8)}`,
          email: `user-${id}@example.com`,
        };
      });

      // Create group using both dataStore (for local state) and groupsService (for Appwrite with sharedWith)
      if (user?.$id) {
        // Create in Appwrite with sharedWith support - pass selectedFriendIds directly
        const createdGroup = await createGroupService(user.$id, {
          name,
          description,
          members: memberUsers, // Pass User objects instead of IDs
        }, selectedFriendIds); // Pass friend IDs to be added to sharedWith during creation
      }
      
      // Also update local dataStore for immediate UI update
      await dataStore.createGroup(name, description, allMemberIds);

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    }
  };

  const addMember = () => {
    const trimmedName = currentMemberName.trim();
    if (trimmedName && !memberNames.includes(trimmedName)) {
      setMemberNames(prev => [...prev, trimmedName]);
      setCurrentMemberName('');
    }
  };

  const removeMember = (nameToRemove: string) => {
    // Don't allow removing "You"
    if (nameToRemove === 'You') {
      return;
    }
    setMemberNames(prev => prev.filter(name => name !== nameToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMember();
    }
  };

  const toggleFriendSelection = (friendUserId: string) => {
    setSelectedFriendIds(prev => {
      if (prev.includes(friendUserId)) {
        return prev.filter(id => id !== friendUserId);
      } else {
        return [...prev, friendUserId];
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Roommates, Trip to Paris"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Friends Selection Section */}
          {friends.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Add Friends to Group</span>
                </div>
              </label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {friends.map((friend) => (
                  <label
                    key={friend.userId}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFriendIds.includes(friend.userId)}
                      onChange={() => toggleFriendSelection(friend.userId)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{friend.name}</div>
                      <div className="text-xs text-gray-500">{friend.email}</div>
                    </div>
                    {selectedFriendIds.includes(friend.userId) && (
                      <UserCheck className="w-4 h-4 text-teal-600" />
                    )}
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {selectedFriendIds.length} friend{selectedFriendIds.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Add Members by Name (Optional)</span>
              </div>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Add members who aren't in your friends list yet
            </p>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={currentMemberName}
                onChange={(e) => setCurrentMemberName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter member name"
              />
              <Button
                type="button"
                onClick={addMember}
                variant="primary"
                disabled={!currentMemberName.trim()}
              >
                Add
              </Button>
            </div>
            
            {memberNames.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {memberNames.map((memberName) => (
                  <div
                    key={memberName}
                    className={`flex items-center justify-between p-2 rounded ${
                      memberName === 'You' ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`font-medium ${memberName === 'You' ? 'text-teal-700' : 'text-gray-900'}`}>
                      {memberName}
                      {memberName === 'You' && <span className="text-xs ml-2 text-teal-600">(You)</span>}
                    </span>
                    {memberName !== 'You' && (
                      <button
                        type="button"
                        onClick={() => removeMember(memberName)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              {memberNames.length} member{memberNames.length !== 1 ? 's' : ''} added
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
