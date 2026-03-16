import { useState, useEffect, useCallback } from "react";
import { getEventStatus } from "../utils/eventStatus";

export function useEvents(user) {
  const [events, setEvents] = useState([]);
  const [joinedEventIds, setJoinedEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events`,
      );
      const data = await res.json();
      if (data.success) {
        const eventsWithStatus = data.data.map((event) => ({
          ...event,
          dynamicStatus: getEventStatus(event.start_date, event.end_date),
        }));
        setEvents(eventsWithStatus);
      } else {
        setError(new Error(data.message || "Failed to fetch events"));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJoinedEvents = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${userId}/joined-events`,
      );
      const data = await res.json();
      if (data.success) {
        setJoinedEventIds(data.data.map((e) => e.id));
      }
    } catch (err) {
      console.error("Failed to fetch joined events:", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (user?.id) {
      fetchJoinedEvents(user.id);
    }
  }, [user, fetchJoinedEvents]);

  return { events, joinedEventIds, loading, error, refetchEvents: fetchEvents };
}
