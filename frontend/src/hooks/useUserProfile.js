import { useState, useEffect } from "react";
import { authClient } from "../auth.js";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const { data } = await authClient.getSession();
        const user = data?.user;

        if (!user) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${user.id}/basic-info`,
        );
        const result = await res.json();
        if (result.success) {
          setUserProfile(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return { userProfile, loading, error };
}
