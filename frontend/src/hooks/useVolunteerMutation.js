// volunteer status update, volunteers table.jsx
import { notifications } from "@mantine/notifications";

export function useVolunteerMutation(eventId, onRefresh) {
  const updateStatus = async (volunteerId, newStatus) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/volunteers/${volunteerId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await res.json();
      if (data.success) {
        notifications.show({
          title: "Success",
          message: `Volunteer status updated to ${newStatus}`,
          color: "green",
        });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      notifications.show({
        title: "Error",
        message: "Failed to update volunteer status",
        color: "red",
      });
    }
  };

  const removeVolunteer = async (volunteerId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/volunteers/${volunteerId}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (data.success) {
        notifications.show({
          title: "Success",
          message: "Volunteer removed from event",
          color: "green",
        });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error("Failed to remove volunteer:", err);
      notifications.show({
        title: "Error",
        message: "Failed to remove volunteer",
        color: "red",
      });
    }
  };

  return { updateStatus, removeVolunteer };
}
