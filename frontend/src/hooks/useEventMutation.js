import { notifications } from "@mantine/notifications";

export function useEventMutation(userId) {
  const deleteEvent = async (eventId) => {
    console.log(`deleting event ${eventId}`);
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

  return { deleteEvent };
}
