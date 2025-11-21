import { account } from '@/lib/appwrite';
import { ID, Models } from 'appwrite';

export type User = Models.User<Models.Preferences>;
export type Session = Models.Session;

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<{ user: User; session: Session }> {
  try {
    // Validate password length
    if (password.length < 8) {
      throw new AuthError('Password must be at least 8 characters', 'PASSWORD_TOO_SHORT');
    }

    // Create user account
    const user = await account.create(ID.unique(), email, password, name);

    // Create session automatically
    const session = await account.createEmailPasswordSession(email, password);

    return { user, session };
  } catch (error: any) {
    if (error.code === 409) {
      throw new AuthError('An account with this email already exists', 'EMAIL_EXISTS');
    }
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(error.message || 'Failed to sign up', error.code);
  }
}

/**
 * Log in an existing user with email and password
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<Session> {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    if (error.code === 401) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }
    throw new AuthError(error.message || 'Failed to log in', error.code);
  }
}

/**
 * Get the currently authenticated user
 * Returns null if no user is logged in (suppresses guest errors)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await account.get();
    return user;
  } catch (error: any) {
    // Expected error when no user is logged in - silently return null
    return null;
  }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    throw new AuthError(error.message || 'Failed to log out', error.code);
  }
}

/**
 * Check if there is an active session
 */
export async function checkSession(): Promise<boolean> {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Initiate Google OAuth sign-in flow
 * Appwrite handles the OAuth callback, then redirects to our success/failure URLs
 */
export async function signInWithGoogle(): Promise<void> {
  try {
    // Use same-origin URLs to avoid Safari cookie issues
    const successUrl = `${window.location.origin}/auth/callback`;
    const failureUrl = `${window.location.origin}/auth?mode=signin&error=oauth_failed`;
    
    // Open OAuth in same window to maintain session context in Safari
    account.createOAuth2Session(
      'google' as any,
      successUrl,
      failureUrl
    );
  } catch (error: any) {
    throw new AuthError(error.message || 'Failed to initiate Google sign-in', error.code);
  }
}

/**
 * Handle OAuth callback and verify session was created
 * Retries multiple times as the session might not be immediately available
 * Returns the user object once session is confirmed
 */
export async function handleOAuthCallback(): Promise<User> {
  const maxRetries = 12; // 12 retries over ~60 seconds
  let lastError: any;
  
  console.log('Starting OAuth callback handling...');
  console.log('Current URL:', typeof window !== 'undefined' ? window.location.href : 'N/A');
  
  // Initial wait for Appwrite to process the OAuth callback
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Wait between retries
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second intervals
      }
      
      console.log(`Attempt ${i + 1}/${maxRetries}: Checking for OAuth session...`);
      
      // Try to get the current user - this will succeed once the OAuth session is established
      const user = await account.get();
      
      if (user && user.$id) {
        console.log('✓ OAuth session established successfully for user:', user.email);
        return user;
      }
    } catch (error: any) {
      lastError = error;
      console.log(`✗ Attempt ${i + 1}/${maxRetries} failed:`, error.message, 'Code:', error.code, 'Type:', error.type);
      // Continue to next retry
    }
  }
  
  console.error('All OAuth session attempts failed. Last error:', lastError);
  throw new AuthError(
    'Failed to establish OAuth session. Please check that Google OAuth is properly configured in Appwrite console.', 
    lastError?.code
  );
}
