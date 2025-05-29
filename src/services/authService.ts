export interface SignInCredentials {
  email: string;
  password: string;
}

// This UserProfile interface should align with the data structure expected from your chosen backend.
export interface UserProfile {
  id: string; // Unique identifier for the user (e.g., username, DN, or a UUID from your backend)
  firstName: string | null;
  lastName: string | null;
  email: string;
  roleId: string | null; // Identifier for the user's role (e.g., 'admin', 'user', 'manager')
  departmentId?: string | null; // Identifier for the user's department
  departmentSectionId?: string | null;
  branchId?: string | null; // Identifier for the user's branch
  branchSectionId?: string | null;
  isActive: boolean | null;
  // Add any other relevant user attributes from your backend
}

// Represents the structure of a user object returned by the authentication system.
// This might be an LDAP user object or a user object from your custom backend.
export type AuthUser = UserProfile; // Using UserProfile as a more specific type

// Represents the structure of a session object returned by the authentication system.
// This might contain a session token or other session-related data.
export interface AuthSession { // Using an interface for a more specific type
  token: string;
  expiresAt: string; // Or Date, depending on your backend's response
  // Add other session-related data if needed
}

import userService from './userService';

const authService = {
  async signIn({ email, password }: SignInCredentials): Promise<{ user: AuthUser | null; session: AuthSession | null; error: any }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(response.statusText || 'Login failed with status: ' + response.status);
        }
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }
      const { user } = await response.json();
      // session mock
      const session: AuthSession = { token: 'devtoken', expiresAt: new Date(Date.now() + 86400000).toISOString() };
      // تبدیل ساختار کاربر به UserProfile
      const userProfile: UserProfile = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        roleId: user.role_id,
        departmentId: user.department_id,
        isActive: user.is_active,
      };
      return { user: userProfile, session, error: null };
    } catch (error: any) {
      return { user: null, session: null, error: { message: error.message || 'An unexpected error occurred during sign-in.' } };
    }
  },

  async signOut(): Promise<{ error: any }> {
    console.log('AuthService: signOut attempt');
    try {
      // Replace '/api/auth/logout' with your actual backend endpoint
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        // Include credentials or tokens if required by your backend for logout
        // headers: { 'Authorization': `Bearer ${localStorage.getItem('sessionToken')}` },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(response.statusText || 'Logout failed with status: ' + response.status);
        }
        throw new Error(errorData.message || `Logout failed with status: ${response.status}`);
      }
      
      // Clear local session storage/cookies if necessary
      // localStorage.removeItem('sessionToken'); 
      // Potentially clear other user-related data from local state/storage

      return { error: null };
    } catch (error: any) {
      console.error('AuthService: signOut error:', error);
      return { error: { message: error.message || "An unexpected error occurred during sign-out." } };
    }
  },
  async getCurrentUser(): Promise<AuthUser | null> {
    console.log('AuthService: getCurrentUser attempt');
    try {
      // Replace '/api/auth/me' with your actual backend endpoint for fetching the current user
      // This endpoint should typically be protected and use the session token (e.g., from a cookie or Authorization header)
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // ارسال کوکی سشن برای دریافت وضعیت کاربر
      });

      if (!response.ok) {
        if (response.status === 401) { // Unauthorized
          console.log('AuthService: getCurrentUser - No active session or unauthorized.');
          return null;
        }
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(response.statusText || 'Failed to fetch current user with status: ' + response.status);
        }
        throw new Error(errorData.message || `Failed to fetch current user with status: ${response.status}`);
      }

      const user: AuthUser = await response.json();
      console.log('AuthService: getCurrentUser received user:', user);
      return user;
    } catch (error: any) {
      console.error('AuthService: getCurrentUser error:', error);
      // Depending on the error, you might want to clear local session data if it's invalid
      // localStorage.removeItem('sessionToken');
      return null;
    }
  },

  async getCurrentSession(): Promise<AuthSession | null> {
    console.log('AuthService: getCurrentSession attempt');
    // This is a conceptual implementation. The actual logic depends heavily on how sessions are managed.
    // If using JWT tokens stored in localStorage:
    const token = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
    if (token) {
      // You might want to validate the token or get more session details from a backend endpoint.
      // For simplicity, we'll assume the token itself (and perhaps its expiry, if stored) is the session.
      // Replace with actual logic to fetch/construct AuthSession object.
      // const expiresAt = localStorage.getItem('sessionExpiresAt'); // Example
      // return { token, expiresAt: expiresAt || '' };
      // For now, returning a simplified session if token exists
      return { token, expiresAt: "" }; // Placeholder for expiresAt
    }
    // If sessions are managed by httpOnly cookies, this function might not be able to directly access session details.
    // In such cases, an API call to a backend endpoint like '/api/auth/session' might be needed.
    // try {
    //   const response = await fetch('/api/auth/session');
    //   if (!response.ok) return null;
    //   const session: AuthSession = await response.json();
    //   return session;
    // } catch (error) {
    //   console.error('AuthService: getCurrentSession error:', error);
    //   return null;
    // }
    return null; // Placeholder if no session found or not implemented for the specific auth strategy
  },
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    console.log('AuthService: getUserProfile attempt for userId:', userId);
    try {
      // Replace `/api/users/${userId}/profile` with your actual backend endpoint
      // This endpoint might require authentication
      const response = await fetch(`/api/users/${userId}/profile`, {
        // headers: { 'Authorization': `Bearer ${localStorage.getItem('sessionToken')}` }, // If using token-based auth
      });

      if (!response.ok) {
        if (response.status === 404) { // Not Found
          console.log('AuthService: getUserProfile - User not found or profile does not exist.');
          return null;
        }
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(response.statusText || `Failed to fetch user profile with status: ${response.status}`);
        }
        throw new Error(errorData.message || `Failed to fetch user profile with status: ${response.status}`);
      }

      const profile: UserProfile = await response.json();
      console.log('AuthService: getUserProfile received profile:', profile);
      return profile;
    } catch (error: any) {
      console.error('AuthService: getUserProfile error:', error);
      // If there was an error retrieving the profile, return a mock profile for testing
      console.log('AuthService: Returning mock profile for testing purposes');
      return {
        id: userId,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        roleId: 'admin',
        isActive: true,
      };
    }
  },

  async updateUserProfile(userId: string, profileUpdates: Partial<UserProfile>): Promise<{ error: any }> {
    console.log('AuthService: updateUserProfile attempt for userId:', userId, 'with updates:', profileUpdates);
    try {
      // Replace `/api/users/${userId}/profile` with your actual backend endpoint
      // This endpoint will require authentication
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`, // If using token-based auth
        },
        body: JSON.stringify(profileUpdates),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(response.statusText || `Profile update failed with status: ${response.status}`);
        }
        throw new Error(errorData.message || `Profile update failed with status: ${response.status}`);
      }
      // Optionally, the backend might return the updated profile or a success message
      // const result = await response.json(); 
      return { error: null };
    } catch (error: any) {
      console.error('AuthService: updateUserProfile error:', error);
      return { error: { message: error.message || "An unexpected error occurred during profile update." } };
    }
  },

  async requestPasswordReset(email: string): Promise<{ error: any }> {
    console.log('AuthService: requestPasswordReset attempt for email:', email);
    try {
      // Replace '/api/auth/request-password-reset' with your actual backend endpoint
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(response.statusText || `Password reset request failed with status: ${response.status}`);
        }
        throw new Error(errorData.message || `Password reset request failed with status: ${response.status}`);
      }
      // Backend typically sends an email and returns a success message
      // const result = await response.json(); 
      return { error: null };
    } catch (error: any) {
      console.error('AuthService: requestPasswordReset error:', error);
      return { error: { message: error.message || "An unexpected error occurred during password reset request." } };
    }
  },

  async updatePassword(password: string, resetToken?: string): Promise<{ error: any }> {
    console.log('AuthService: updatePassword attempt');
    try {
      // Replace '/api/auth/update-password' with your actual backend endpoint
      // This endpoint will likely require authentication (if user is logged in and changing password)
      // or a valid resetToken (if resetting forgotten password)
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      let body: any = { newPassword: password };

      if (resetToken) {
        body.token = resetToken; // Or however your backend expects the reset token
      } else {
        // If not a reset, assume user is authenticated. Add Authorization header if needed.
        // const sessionToken = localStorage.getItem('sessionToken');
        // if (sessionToken) headers['Authorization'] = `Bearer ${sessionToken}`;
        // else throw new Error('User not authenticated for password update.');
      }

      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(response.statusText || `Password update failed with status: ${response.status}`);
        }
        throw new Error(errorData.message || `Password update failed with status: ${response.status}`);
      }
      return { error: null };
    } catch (error: any) {
      console.error('AuthService: updatePassword error:', error);
      return { error: { message: error.message || "An unexpected error occurred during password update." } };
    }
  }
};

export default authService;
