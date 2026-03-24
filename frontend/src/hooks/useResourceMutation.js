import { notifications } from "@mantine/notifications";

// resource submission logic, addresourcemodal
// hgandle delete resourceslist.jsx

export function useResourceMutation(eventId, userProfile, onRefresh) {
  const deleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/resources/${resourceId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletedBy: userProfile?.id }),
        },
      );

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: "Success",
          message: "Resource deleted successfully",
          color: "green",
        });
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete resource",
        color: "red",
      });
    }
  };

  return { deleteResource };
}
