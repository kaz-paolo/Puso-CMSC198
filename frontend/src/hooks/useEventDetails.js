import { useState, useEffect } from "react";
import { getEventStatus } from "../utils/eventStatus.js";

export function useEventDetails({ eventId, userId, opened }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}`,
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setEvent(data.data);
      } else {
        setEvent(null);
        setError(data.message || "Failed to fetch event details.");
      }
    } catch (err) {
      console.error("Failed to fetch event detail:", err);
      setEvent(null);
      setError("An error occurred while fetching event details.");
    } finally {
      setLoading(false);
    }
  };

  const checkJoinStatus = async (currentUserId) => {
    if (!currentUserId || !eventId) {
      setHasJoined(false);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${currentUserId}/joined-events`,
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        const joined = data.data.some((e) => e.id === parseInt(eventId));
        setHasJoined(joined);
      } else {
        setHasJoined(false);
        console.warn("Failed to check join status:", data.message);
      }
    } catch (err) {
      console.error("Failed to check join status:", err);
      setHasJoined(false);
    }
  };

  useEffect(() => {
    if (opened && eventId) {
      fetchEventDetail();
    }
  }, [opened, eventId]);

  useEffect(() => {
    if (opened && eventId && userId) {
      checkJoinStatus(userId);
    } else if (opened && !userId) {
      setHasJoined(false);
    }
  }, [opened, eventId, userId]);

  // dynamic status from event data
  const dynamicStatus = event
    ? getEventStatus(event.start_date, event.end_date)
    : null;

  return {
    event,
    loading,
    hasJoined,
    error,
    dynamicStatus,
    // refetch functions if needed for actions within the modal
    refetchEventDetail: fetchEventDetail,
    refetchJoinStatus: () => checkJoinStatus(userId),
  };
}
