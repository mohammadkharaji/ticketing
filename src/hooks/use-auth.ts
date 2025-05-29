import { useAuth } from "@/contexts/AuthContext";

export const useSignIn = () => {
  const { signIn, loading } = useAuth();
  return { signIn, isLoading: loading };
};