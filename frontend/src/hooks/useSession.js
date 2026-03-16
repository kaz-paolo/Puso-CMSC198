// Found in: Auth.jsx, EventDashboard.jsx, TaskBoard.jsx, Profile.jsx, Dashboard.jsx

import { useState, useEffect } from "react";
import { authClient } from "../auth";

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const result = await authClient.getSession();
        setSession(result.data || result);
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  return { session, loading };
}
