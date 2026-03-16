import { tasksService } from "./tasks.service.js";

export async function getTasksByEventId(req, res) {
  try {
    const { eventId } = req.params;
    const categorizedTasks = await tasksService.getTasksByEventId(eventId);
    res.json({ success: true, data: categorizedTasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
}

export async function createTask(req, res) {
  try {
    const { eventId } = req.params;
    const newTask = await tasksService.createTask(eventId, req.body);
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, error: "Failed to create task" });
  }
}

export async function updateTask(req, res) {
  try {
    const { taskId } = req.params;
    const updatedTask = await tasksService.updateTask(taskId, req.body);

    if (!updatedTask) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, error: "Failed to update task" });
  }
}

export async function deleteTask(req, res) {
  try {
    const { taskId } = req.params;
    const { deletedBy } = req.body;

    if (!deletedBy) {
      return res.status(400).json({
        success: false,
        error: "deletedBy is required",
      });
    }

    const softDeleted = await tasksService.deleteTask(taskId, deletedBy);

    if (!softDeleted) {
      return res.status(404).json({
        success: false,
        error: "Task not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: softDeleted,
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, error: "Failed to delete task" });
  }
}
