'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { account, storage } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Check, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [profilePicture, setProfilePicture] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      // Load currency and profile picture from preferences
      const prefs = user.prefs as any;
      setCurrency(prefs?.currency || 'USD');
      setProfilePicture(prefs?.profilePicture || '');
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage(null);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be smaller than 5MB');
      }

      // Upload to Appwrite storage
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(
        'profile_pictures',
        fileId,
        file
      );

      // Get file URL
      const fileUrl = storage.getFileView('profile_pictures', uploadedFile.$id);
      const pictureUrl = fileUrl.toString();
      
      setProfilePicture(pictureUrl);
      setMessage({ type: 'success', text: 'Profile picture uploaded! Click "Save Changes" to apply.' });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload image. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      // Update name if changed
      if (name !== user.name) {
        await account.updateName(name);
      }

      // Build new preferences object - ensure it's a plain object
      const newPrefs: Record<string, any> = {
        currency: currency,
        profilePicture: profilePicture || '',
      };

      console.log('Updating preferences:', newPrefs);
      
      // Update preferences (currency and profile picture)
      await account.updatePrefs(newPrefs);

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00CFFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666666] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666666] font-medium">Please log in to access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Facets Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/facets.png"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      {/* Magenta Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#FF007F]/10 via-transparent to-[#00CFFF]/10 z-0"></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-[#333333]">Settings</h1>

          <div className="max-w-3xl space-y-6">
            {/* Success/Error Message */}
            {message && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {message.type === 'success' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-[#00CFFF]/30">
              <h2 className="text-xl font-semibold mb-4 text-[#333333]">Profile</h2>
              <div className="space-y-4">
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-[#333333]">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    {/* Current Profile Picture */}
                    <div className="relative">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-[#00CFFF]"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF007F] to-[#00CFFF] flex items-center justify-center text-white text-3xl font-bold border-4 border-[#00CFFF]">
                          {name.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="profile-picture"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="profile-picture"
                        className={`inline-block px-6 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00B8E6] transition-all cursor-pointer font-semibold ${
                          uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploadingImage ? 'Uploading...' : 'Upload New Picture'}
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG, GIF, or WebP. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#333333]">
                    Username
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-[#00CFFF] transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#333333]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-[#00CFFF]/30">
              <h2 className="text-xl font-semibold mb-4 text-[#333333]">Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#333333]">
                    Default Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-[#00CFFF] transition-all"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    This will be your default currency for new expenses
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-[#00CFFF] text-white px-8 py-3 rounded-lg hover:bg-[#00B8E6] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-red-300">
              <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="border-2 border-red-600 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition font-semibold">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
