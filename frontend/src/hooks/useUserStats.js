import { useState, useEffect, useCallback } from "react";
import { useUserProfile } from "./useUserProfile";

export function useUserStats() {
  const {
    userProfile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async (userId) => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${userId}/stats`,
      );
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Server returned a non-JSON response" }));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setUserStats(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch user stats");
      }
    } catch (err) {
      setError(err.message);
      console.error("useUserStats fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUserStats = useCallback(async () => {
    if (!userProfile?.id) return;
    // The refresh endpoint already returns the latest stats
    await fetchStats(userProfile.id);
  }, [userProfile?.id, fetchStats]);

  useEffect(() => {
    if (profileLoading) {
      setLoading(true);
      return;
    }
    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }
    if (userProfile?.id) {
      fetchStats(userProfile.id);
    } else if (!profileLoading && !userProfile) {
      // Not logged in or no profile
      setLoading(false);
      setUserStats(null);
    }
  }, [userProfile, profileLoading, profileError, fetchStats]);

  return { userStats, loading, error, refreshUserStats };
}
