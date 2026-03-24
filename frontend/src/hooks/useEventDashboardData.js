import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserProfile } from "./useUserProfile";
import { useSession } from "./useSession";

export function useEventDashboardData() {
  const { eventId } = useParams();
  const { session } = useSession();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const [loading, setLoading] = useState(true);

  const [eventDetails, setEventDetails] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    inReview: [],
    done: [],
  });
  const [resources, setResources] = useState([]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}`,
      );
      const data = await res.json();
      if (data.success) {
        setEventDetails(data.data);
      } else {
        setEventDetails(null);
      }
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setEventDetails(null);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/volunteers`,
      );
      const data = await res.json();
      if (data.success) {
        setVolunteers(data.data);
      } else {
        setVolunteers([]);
      }
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
      setVolunteers([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/tasks`,
      );
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/resources`,
      );
      const data = await res.json();
      if (data.success) {
        setResources(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  };

  const checkAccess = async (profile, sessionData, eventId) => {
    try {
      const authUser = sessionData?.data?.user || sessionData?.user;
      if (authUser?.role === "admin") {
        return true;
      }

      if (!profile?.id) {
        return false;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${profile.id}/joined-events`,
      );
      const data = await res.json();

      return data.success && data.data.some((e) => e.id === parseInt(eventId));
    } catch (err) {
      console.error("Failed to check access:", err);
      return false;
    }
  };

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    const init = async () => {
      setLoading(true);
      const canAccess = await checkAccess(userProfile, session, eventId);
      setHasAccess(canAccess);

      if (canAccess) {
        await Promise.all([
          fetchEventDetails(),
          fetchVolunteers(),
          fetchTasks(),
          fetchResources(),
        ]);
      }
      setLoading(false);
    };

    init();
  }, [eventId, userProfile, session, profileLoading]);

  return {
    eventId,
    session,
    userProfile,
    profileLoading,
    loading,
    eventDetails,
    volunteers,
    hasAccess,
    tasks,
    resources,
    fetchVolunteers,
    fetchTasks,
    fetchResources,
  };
}
