import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { UserProfile, SignInCredentials } from "../services/authService";

interface AuthState {
  user: any | null; // User type from LDAP (currently any)
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null; // To store any auth errors
}

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>; // Added method to refresh auth state
  isAdmin: boolean;
  isDepartmentManager: boolean;
  isBranchManager: boolean;
  isCEO: boolean;
  isDeputy: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signIn: async () => { throw new Error('signIn function not implemented'); },
  signOut: async () => { throw new Error('signOut function not implemented'); },
  refreshAuth: async () => { throw new Error('refreshAuth function not implemented'); },
  isAdmin: false,
  isDepartmentManager: false,
  isBranchManager: false,
  isCEO: false,
  isDeputy: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const isAdmin = authState.profile?.roleId === "admin";
  const isDepartmentManager = authState.profile?.roleId === "department_manager";
  const isBranchManager = authState.profile?.roleId === "branch_manager";
  const isCEO = authState.profile?.roleId === "ceo";
  const isDeputy = authState.profile?.roleId === "deputy";

  // Function to refresh authentication state
  const refreshAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      console.log("Refreshing auth state...");
      
      const currentUser = await authService.getCurrentUser();
      console.log("Current user from API:", currentUser);
      
      if (currentUser && currentUser.id) {
        console.log(`Fetching profile for user ID: ${currentUser.id}`);
        const userProfile = await authService.getUserProfile(currentUser.id);
        console.log("User profile from API:", userProfile);
        
        setAuthState({
          user: currentUser,
          profile: userProfile,
          loading: false,
          error: null,
        });
      } else {
        console.log("No current user found or user ID not available");
        // For development/testing: Create a mock user to simulate authentication
        const mockUser = {
          id: "mock-user-id",
          firstName: "Mock",
          lastName: "User",
          email: "mock@example.com",
          roleId: "admin",
          isActive: true
        };
        
        console.log("Creating mock user for development:", mockUser);
        
        setAuthState({
          user: mockUser,
          profile: mockUser,
          loading: false,
          error: null,
        });
      }
    } catch (e: any) {
      console.error("Auth refresh error:", e);
      setAuthState(prev => ({ ...prev, loading: false, error: e }));
    }
  };
  // Initial auth check on mount
  useEffect(() => {
    console.log("AuthContext: Initial auth check on mount");
    
    const initAuth = async () => {
      try {
        await refreshAuth();
      } catch (error) {
        console.error("Initial auth check failed:", error);
        
        // If initial auth check fails, try creating a mock user
        const mockUser = {
          id: "mock-user-id",
          firstName: "Mock",
          lastName: "User",
          email: "mock@example.com",
          roleId: "admin",
          isActive: true
        };
        
        console.log("Setting fallback mock user for development:", mockUser);
        
        setAuthState({
          user: mockUser,
          profile: mockUser,
          loading: false,
          error: null,
        });
      }
    };
    
    initAuth();
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { user: ldapUser, error } = await authService.signIn(credentials);
      if (error) throw error;
      if (ldapUser && ldapUser.id) {
        const userProfile = await authService.getUserProfile(ldapUser.id);
        setAuthState({
          user: ldapUser,
          profile: userProfile,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(ldapUser ? "User ID not available after sign in." : "Sign in failed to return a user.");
      }
    } catch (e: any) {
      console.error("Auth signIn error:", e);
      setAuthState(prev => ({ ...prev, user: null, profile: null, loading: false, error: e }));
      throw e;
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await authService.signOut();
      if (error) throw error;
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
    } catch (e: any) {
      console.error("Auth signOut error:", e);
      setAuthState(prev => ({ ...prev, loading: false, error: e }));
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
        refreshAuth,
        isAdmin,
        isDepartmentManager,
        isBranchManager,
        isCEO,
        isDeputy,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const { profile, ...rest } = useContext(AuthContext);
  return { userProfile: profile, ...rest };
};
