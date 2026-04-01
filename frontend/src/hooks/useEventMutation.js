import { notifications } from "@mantine/notifications";

export function useEventMutation(userId) {
  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletedBy: userId }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete event");
      }

      notifications.show({
        title: "Success",
        message: "Event deleted successfully",
        color: "green",
      });

      //   if (onRefresh) {
      //     await onRefresh();
      //   }
    } catch (error) {
      console.error("Delete event error:", error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete event",
        color: "red",
      });
    }
  };

  const archiveEvent = async (eventId, isArchived) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/archive`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to archive event");
      }

      notifications.show({
        title: "Success",
        message: `Event ${isArchived ? "unarchived" : "archived"} successfully`,
        color: "green",
      });
    } catch (error) {
      console.error("Archive event error:", error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to archive event",
        color: "red",
      });
    }
  };

  return { deleteEvent, archiveEvent };
}
