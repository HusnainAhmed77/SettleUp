'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Session,
  signUpWithEmail as signUpService,
  loginWithEmail as loginService,
  signInWithGoogle as signInWithGoogleService,
  getCurrentUser,
  logout as logoutService,
  checkSession,
} from '@/services/authService';
import { checkForLocalData, migrateLocalData, MigrationData } from '@/services/migrationService';
import MigrationPrompt from '@/components/MigrationPrompt';
import { dataStore } from '@/lib/store';
import { account } from '@/lib/appwrite';
import { createOrUpdateUserProfile } from '@/services/userProfileService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [migrationData, setMigrationData] = useState<MigrationData | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // Initialize data store with user's data
        if (currentUser) {
          // Determine provider from sessions
          let provider = 'email';
          try {
            const sessions = await account.listSessions();
            if (sessions.sessions.length > 0) {
              const latestSession = sessions.sessions[0];
              provider = latestSession.provider || 'email';
            }
          } catch (error) {
            console.log('Could not check sessions:', error);
          }
          
          // Create or update user profile in database
          await createOrUpdateUserProfile(
            currentUser.$id,
            currentUser.email,
            currentUser.name,
            provider,
            undefined
          );
          
          dataStore.setUserId(currentUser.$id);
          await dataStore.initialize(currentUser.$id);
        }
      } catch (error) {
        // Silently handle - user is not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const checkAndPromptMigration = (newUser: User, redirectPath: string) => {
    const localData = checkForLocalData();
    if (localData.hasLocalData) {
      setMigrationData(localData);
      setShowMigrationPrompt(true);
      setPendingRedirect(redirectPath);
    } else {
      router.push(redirectPath);
    }
  };

  const handleMigrate = async () => {
    if (!user) return;
    
    try {
      await migrateLocalData(user.$id);
      setShowMigrationPrompt(false);
      if (pendingRedirect) {
        router.push(pendingRedirect);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSkipMigration = () => {
    setShowMigrationPrompt(false);
    if (pendingRedirect) {
      router.push(pendingRedirect);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user: newUser } = await signUpService(email, password, name);
      setUser(newUser);
      
      // Create user profile in database
      await createOrUpdateUserProfile(
        newUser.$id,
        newUser.email,
        newUser.name,
        'email', // Provider is email/password
        undefined // No profile picture yet
      );
      
      // Initialize data store for new user
      dataStore.setUserId(newUser.$id);
      await dataStore.initialize(newUser.$id);
      
      checkAndPromptMigration(newUser, '/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await loginService(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Update user profile in database (updates lastLoginAt)
        await createOrUpdateUserProfile(
          currentUser.$id,
          currentUser.email,
          currentUser.name,
          'email', // Provider is email/password
          undefined
        );
        
        // Initialize data store with user's data
        dataStore.setUserId(currentUser.$id);
        await dataStore.initialize(currentUser.$id);
        
        checkAndPromptMigration(currentUser, '/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogleService();
      // OAuth will redirect, so no need to update state here
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      
      // Clear all user data from store
      dataStore.clear();
      
      router.push('/auth?mode=signin');
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signUp,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showMigrationPrompt && migrationData && (
        <MigrationPrompt
          migrationData={migrationData}
          onMigrate={handleMigrate}
          onSkip={handleSkipMigration}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
