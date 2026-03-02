import { useState, useEffect } from "react";
import { useUser } from "@stackframe/react";

export function useUserProfile() {
  const user = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${user.id}/basic-info`,
        );
        const data = await res.json();
        if (data.success) {
          setUserProfile(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  return { userProfile, loading, error };
}
