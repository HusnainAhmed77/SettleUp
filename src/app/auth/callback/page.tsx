'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleOAuthCallback } from '@/services/authService';
import { createOrUpdateUserProfile } from '@/services/userProfileService';
import { importGoogleProfilePictureFromUrl } from '@/services/profileService';
import { dataStore } from '@/lib/store';
import { account } from '@/lib/appwrite';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');
        
        // Wait for OAuth session to be established
        const user = await handleOAuthCallback();
        
        console.log('✅ User authenticated:', user.email);
        console.log('📋 User object:', user);
        
        // Determine provider from sessions
        let provider = 'google';
        try {
          const sessions = await account.listSessions();
          if (sessions.sessions.length > 0) {
            const latestSession = sessions.sessions[0];
            provider = latestSession.provider || 'google';
          }
        } catch (error) {
          console.log('Could not check sessions:', error);
        }
        
        // Extract profile picture URL from OAuth response
        let profilePictureUrl: string | undefined;
        let googlePictureStorageUrl: string | undefined;
        
        if (provider === 'google') {
          console.log('🔍 Extracting Google profile picture...');
          console.log('📋 User prefs:', user.prefs);
          
          // Check various possible locations for the profile picture URL
          // Cast to any since Appwrite's Preferences type doesn't include OAuth fields
          const prefs = user.prefs as any;
          
          if (prefs && prefs.picture) {
            profilePictureUrl = prefs.picture;
            console.log('✓ Found picture in user.prefs.picture:', profilePictureUrl);
          } else if (prefs && prefs.avatar) {
            profilePictureUrl = prefs.avatar;
            console.log('✓ Found picture in user.prefs.avatar:', profilePictureUrl);
          } else if (prefs && prefs.photoURL) {
            profilePictureUrl = prefs.photoURL;
            console.log('✓ Found picture in user.prefs.photoURL:', profilePictureUrl);
          } else {
            console.log('ℹ️ No profile picture URL found in OAuth response');
          }
          
          // If we found a picture URL, download and upload it to Appwrite storage
          if (profilePictureUrl) {
            try {
              console.log('📥 Importing Google profile picture to Appwrite storage...');
              const storageUrl = await importGoogleProfilePictureFromUrl(
                user.$id,
                profilePictureUrl
              );
              
              if (storageUrl) {
                googlePictureStorageUrl = storageUrl;
                console.log('✅ Google profile picture imported successfully:', googlePictureStorageUrl);
              } else {
                console.log('⚠️ Failed to import Google profile picture (graceful failure)');
              }
            } catch (error) {
              console.error('⚠️ Error importing Google profile picture:', error);
              console.log('ℹ️ Continuing with authentication despite picture import failure');
              // Continue with authentication - picture import is not critical
            }
          }
        }
        
        // Create or update user profile in database
        await createOrUpdateUserProfile(
          user.$id,
          user.email,
          user.name,
          provider,
          googlePictureStorageUrl
        );
        
        // Initialize data store with user's data
        dataStore.setUserId(user.$id);
        await dataStore.initialize(user.$id);
        
        console.log('✅ User profile created/updated, redirecting to dashboard...');
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error: any) {
        console.error('❌ OAuth callback error:', error);
        setError(error.message || 'Authentication failed');
        
        // Redirect to login with error after 3 seconds
        setTimeout(() => {
          router.push('/auth?mode=signin&error=oauth_failed');
        }, 3000);
      }
    };

    processCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border-2 border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border-2 border-[#FF007F]">
        <div className="w-16 h-16 border-4 border-[#FF007F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Completing Sign In</h2>
        <p className="text-gray-600">Please wait while we set up your account...</p>
      </div>
    </div>
  );
}
