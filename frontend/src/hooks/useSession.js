import { useAuthContext } from "../contexts/AuthContext";

export function useSession() {
  const { session, loading, refetchSession } = useAuthContext();
  return { session, loading, refetchSession };
}
