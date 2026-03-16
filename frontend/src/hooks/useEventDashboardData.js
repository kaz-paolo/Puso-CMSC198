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

  const checkAccess = async (profile, sessionData) => {
    try {
      if (sessionData?.data?.user?.role === "admin") {
        setHasAccess(true);
        return;
      }
      if (!profile?.id) {
        setHasAccess(false);
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${profile.id}/joined-events`,
      );
      const data = await res.json();
      if (data.success) {
        const isVolunteer = data.data.some((e) => e.id === parseInt(eventId));
        setHasAccess(isVolunteer);
      }
    } catch (err) {
      console.error("Failed to check access:", err);
      setHasAccess(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkAccess(userProfile, session);
      await Promise.all([
        fetchEventDetails(),
        fetchVolunteers(),
        fetchTasks(),
        fetchResources(),
      ]);
      setLoading(false);
    };
    if (userProfile || session?.data?.user?.role === "admin") {
      init();
    }
  }, [eventId, userProfile, session]);

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
