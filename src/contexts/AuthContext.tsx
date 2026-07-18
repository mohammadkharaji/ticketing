import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import authService, {
  AuthUser,
  UserProfile,
  SignInCredentials,
} from "../services/authService";

interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  isAdmin: boolean;
  isDepartmentManager: boolean;
  isBranchManager: boolean;
  isCEO: boolean;
  isDeputy: boolean;
}

/** useAuth also exposes userProfile as an alias of profile */
export type UseAuthReturn = AuthContextType & {
  userProfile: UserProfile | null;
};

function toError(e: unknown, fallback: string): Error {
  if (e instanceof Error) return e;
  if (e && typeof e === "object" && "message" in e) {
    return new Error(String((e as { message: unknown }).message) || fallback);
  }
  return new Error(fallback);
}

function profileFromUser(user: AuthUser): UserProfile {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roleId: user.roleId,
    departmentId: user.departmentId,
    departmentSectionId: user.departmentSectionId,
    branchId: user.branchId,
    branchSectionId: user.branchSectionId,
    isActive: user.isActive,
  };
}

async function resolveProfile(user: AuthUser): Promise<UserProfile> {
  const base = profileFromUser(user);
  try {
    const fetched = await authService.getUserProfile(user.id);
    if (fetched?.id) return fetched;
  } catch (err) {
    console.warn("Profile fetch failed, using session user:", err);
  }
  return base;
}

const defaultAuth: AuthContextType = {
  user: null,
  profile: null,
  loading: true,
  error: null,
  signIn: async () => {
    throw new Error("signIn is not available (AuthProvider missing)");
  },
  signOut: async () => {
    throw new Error("signOut is not available (AuthProvider missing)");
  },
  refreshAuth: async () => {
    throw new Error("refreshAuth is not available (AuthProvider missing)");
  },
  isAdmin: false,
  isDepartmentManager: false,
  isBranchManager: false,
  isCEO: false,
  isDeputy: false,
};

const AuthContext = createContext<AuthContextType>(defaultAuth);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const roleId = authState.profile?.roleId ?? authState.user?.roleId ?? null;
  const isAdmin = roleId === "admin";
  const isDepartmentManager = roleId === "department_manager";
  const isBranchManager = roleId === "branch_manager";
  const isCEO = roleId === "ceo";
  const isDeputy = roleId === "deputy";

  const refreshAuth = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const currentUser = await authService.getCurrentUser();

      if (currentUser?.id) {
        const userProfile = await resolveProfile(currentUser);
        setAuthState({
          user: currentUser,
          profile: userProfile,
          loading: false,
          error: null,
        });
        return;
      }

      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
    } catch (e: unknown) {
      console.error("Auth refresh error:", e);
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: toError(e, "Auth refresh failed"),
      });
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { user: signedInUser, error } = await authService.signIn(credentials);
      if (error) {
        throw toError(error, "ورود ناموفق بود");
      }
      if (!signedInUser?.id) {
        throw new Error("ورود کاربر را برنگرداند.");
      }

      const userProfile = await resolveProfile(signedInUser);
      setAuthState({
        user: signedInUser,
        profile: userProfile,
        loading: false,
        error: null,
      });
    } catch (e: unknown) {
      console.error("Auth signIn error:", e);
      const err = toError(e, "خطا در ورود");
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: err,
      });
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await authService.signOut();
      if (error) {
        console.warn("SignOut API warning:", error);
      }
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
    } catch (e: unknown) {
      console.error("Auth signOut error:", e);
      // Always clear local auth so the user is not stuck logged-in
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: toError(e, "خطا در خروج"),
      });
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      ...authState,
      signIn,
      signOut,
      refreshAuth,
      isAdmin,
      isDepartmentManager,
      isBranchManager,
      isCEO,
      isDeputy,
    }),
    [
      authState,
      signIn,
      signOut,
      refreshAuth,
      isAdmin,
      isDepartmentManager,
      isBranchManager,
      isCEO,
      isDeputy,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): UseAuthReturn => {
  const ctx = useContext(AuthContext);
  return {
    ...ctx,
    userProfile: ctx.profile,
  };
};
