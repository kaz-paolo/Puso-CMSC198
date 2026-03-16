import { useState, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";

export function useEventJoinStatus(userId, eventId) {
  const [volunteerStatus, setVolunteerStatus] = useState(null);
  const [checkingJoinStatus, setCheckingJoinStatus] = useState(true);

  const checkStatus = useCallback(async () => {
    if (!userId || !eventId) {
      setCheckingJoinStatus(false);
      return;
    }
    setCheckingJoinStatus(true);
    try {
      // return all events a user has joined including their status for each
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${userId}/joined-events`,
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const eventInfo = data.data.find((e) => e.id === parseInt(eventId));
        if (eventInfo && eventInfo.volunteer_status) {
          setVolunteerStatus(eventInfo.volunteer_status);
        } else {
          setVolunteerStatus(null);
        }
      } else {
        setVolunteerStatus(null);
      }
    } catch (err) {
      console.error("Failed to check join status:", err);
      setVolunteerStatus(null);
    } finally {
      setCheckingJoinStatus(false);
    }
  }, [userId, eventId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const joinEvent = async (selectedRole) => {
    if (!userId || !eventId) {
      notifications.show({
        title: "Cannot Join Event",
        message: "You must be logged in to volunteer for an event.",
        color: "red",
      });
      return null;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            roleId: selectedRole ? selectedRole.id : null,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: "Success!",
          message: data.message || "Your request to join has been sent.",
          color: "green",
        });
        await checkStatus();
        return data.newStatus || null;
      } else {
        throw new Error(data.message || "An unknown error occurred.");
      }
    } catch (err) {
      console.error("Failed to join event:", err);
      notifications.show({
        title: "Join Failed",
        message: err.message,
        color: "red",
      });
      return null;
    }
  };

  const hasJoined =
    volunteerStatus === "CONFIRMED" || volunteerStatus === "PENDING";

  return { hasJoined, volunteerStatus, checkingJoinStatus, joinEvent };
}
