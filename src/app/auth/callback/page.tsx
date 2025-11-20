'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { createOrUpdateUserProfile } from '@/services/userProfileService';
import { dataStore } from '@/lib/store';

/**
 * OAuth callback handler
 * Creates user profile in database after OAuth authentication
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get current user from Appwrite
        const user = await account.get();
        
        if (user) {
          console.log('[OAuth Callback] User authenticated:', user.email);
          
          // Determine provider from sessions
          let provider = 'email';
          let googlePictureUrl: string | undefined;
          
          try {
            const sessions = await account.listSessions();
            if (sessions.sessions.length > 0) {
              const latestSession = sessions.sessions[0];
              provider = latestSession.provider || 'email';
              
              // If Google OAuth, try to get profile picture
              if (provider === 'google') {
                // Google profile picture URL is typically in user prefs or we can construct it
                const prefs = user.prefs as any;
                googlePictureUrl = prefs?.picture || undefined;
              }
            }
          } catch (error) {
            console.log('[OAuth Callback] Could not check sessions:', error);
          }
          
          // Create or update user profile in database
          console.log('[OAuth Callback] Creating/updating user profile');
          await createOrUpdateUserProfile(
            user.$id,
            user.email,
            user.name,
            provider,
            googlePictureUrl
          );
          
          // Initialize data store
          dataStore.setUserId(user.$id);
          await dataStore.initialize(user.$id);
          
          console.log('[OAuth Callback] Profile created, redirecting to dashboard');
          
          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          throw new Error('No user found after OAuth');
        }
      } catch (error: any) {
        console.error('[OAuth Callback] Error:', error);
        setError(error.message || 'Authentication failed');
        
        // Redirect to auth page with error
        setTimeout(() => {
          router.push('/auth?mode=signin&error=oauth_failed');
        }, 2000);
      }
    };

    handleOAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Setting up your account...</p>
      </div>
    </div>
  );
}
