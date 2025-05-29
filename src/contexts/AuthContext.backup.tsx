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
  refreshAuth: () => Promise<void>; // New method to manually refresh auth
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
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        setAuthState(prev => ({ ...prev, loading: true }));
        console.log("Checking current user...");
        const currentUser = await authService.getCurrentUser(); // LDAP getCurrentUser
        console.log("Current user from API:", currentUser);
        
        if (currentUser && currentUser.id) { // Assuming LDAP user has an 'id'
          console.log(`Fetching profile for user ID: ${currentUser.id}`);
          const userProfile = await authService.getUserProfile(currentUser.id); // LDAP getUserProfile
          console.log("User profile from API:", userProfile);
          
          setAuthState({
            user: currentUser,
            profile: userProfile,
            loading: false,
            error: null,
          });
        } else {
          console.log("No current user found or user ID not available");
          setAuthState({
            user: null,
            profile: null,
            loading: false,
            error: currentUser ? new Error("User ID not available from LDAP currentUser for profile fetching.") : null,
          });
        }
      } catch (e: any) {
        console.error("Auth useEffect error:", e);
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: e,
        });
      }
    };
    checkCurrentUser();
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { user: ldapUser, error } = await authService.signIn(credentials);
      if (error) throw error;
      if (ldapUser && ldapUser.id) { // Assuming LDAP user has an 'id'
        const userProfile = await authService.getUserProfile(ldapUser.id);
        setAuthState({
          user: ldapUser,
          profile: userProfile,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(ldapUser ? "User ID not available after LDAP sign in." : "LDAP sign in failed to return a user.");
      }
    } catch (e: any) {
      console.error("Auth signIn error:", e);
      setAuthState(prev => ({ ...prev, user: null, profile: null, loading: false, error: e }));
      throw e; // Re-throw to be caught by UI
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
      throw e; // Re-throw to be caught by UI
    }
  };

  const refreshAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const currentUser = await authService.getCurrentUser();
      if (currentUser && currentUser.id) {
        const userProfile = await authService.getUserProfile(currentUser.id);
        setAuthState({
          user: currentUser,
          profile: userProfile,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: null,
        });
      }
    } catch (e: any) {
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: e,
      });
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
