import { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "../auth";

// context for global auth state
const AuthContext = createContext();

// provider to wrap
export function AuthProvider({ children }) {
  // user's details
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // validate token and fetch details
  const fetchSession = async () => {
    setLoading(true);
    try {
      const result = await authClient.getSession();
      setSession(result?.data || null);
    } catch (err) {
      console.error("Failed to fetch session:", err);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  // check token when first loading
  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, loading, refetchSession: fetchSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
