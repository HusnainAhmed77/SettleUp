'use client';

import { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import { searchUsers, addFriend } from '@/services/friendService';
import { useAuth } from '@/contexts/AuthContext';

interface AddFriendModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFriendModal({ onClose, onSuccess }: AddFriendModalProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!email.trim() || !user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const results = await searchUsers(email, user.$id);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No user found with that email');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search for user');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendUserId: string) => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      await addFriend(user.$id, friendUserId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add friend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Add Friend</h2>
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#FF007F] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#666666] mb-2">
              Friend's Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="friend@example.com"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF007F] focus:outline-none"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !email.trim()}
                className="bg-[#FF007F] hover:bg-[#00CFFF] text-white"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#666666]">Search Results:</p>
              {searchResults.map((result) => (
                <div
                  key={result.userId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-[#333333]">{result.name}</p>
                    <p className="text-sm text-[#666666]">{result.email}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddFriend(result.userId)}
                    disabled={loading}
                    className="bg-[#10B981] hover:bg-[#059669] text-white gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
