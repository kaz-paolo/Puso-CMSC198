import { notifications } from "@mantine/notifications";

//task deletion logic taskboard.jsx
export function useTaskMutation(eventId, userProfile, onRefresh) {
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletedBy: userProfile?.id }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete task");
      }

      notifications.show({
        title: "Success",
        message: "Task deleted successfully",
        color: "green",
      });

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Delete task error:", error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete task",
        color: "red",
      });
    }
  };

  return { deleteTask };
}
