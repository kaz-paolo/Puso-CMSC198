import { sql } from "../../../config/db.js";
import { userStatsService } from "../../users/userStats.service.js";

export const tasksService = {
  async getTasksByEventId(eventId) {
    const tasks = await sql`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ta.id,
              'user_id', ta.user_id,
              'name', CONCAT(ui.first_name, ' ', ui.last_name)
            )
          ) FILTER (WHERE ta.id IS NOT NULL),
          '[]'
        ) as assignees
      FROM event_tasks t
      LEFT JOIN task_assignees ta ON t.id = ta.task_id
      LEFT JOIN user_info ui ON ta.user_id = ui.id
      WHERE t.event_id = ${eventId}
        AND t.deleted_at IS NULL
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `;

    // categorize tasks by status
    const categorizedTasks = {
      todo: [],
      inProgress: [],
      inReview: [],
      done: [],
    };

    tasks.forEach((task) => {
      const formattedTask = {
        ...task,
        deadline: task.deadline_date
          ? new Date(task.deadline_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : null,
      };

      switch (task.status?.toLowerCase()) {
        case "to do":
          categorizedTasks.todo.push(formattedTask);
          break;
        case "in progress":
          categorizedTasks.inProgress.push(formattedTask);
          break;
        case "in review":
          categorizedTasks.inReview.push(formattedTask);
          break;
        case "done":
          categorizedTasks.done.push(formattedTask);
          break;
        default:
          categorizedTasks.todo.push(formattedTask);
      }
    });

    return categorizedTasks;
  },

  async createTask(eventId, taskData) {
    const {
      task_title,
      category,
      status = "To Do",
      priority,
      deadline_date,
      deadline_time,
      task_details,
      relevant_links,
      created_by,
    } = taskData;

    const result = await sql`
      INSERT INTO event_tasks (
        event_id,
        task_title,
        category,
        status,
        priority,
        deadline_date,
        deadline_time, 
        task_details, 
        relevant_links, 
        created_by 
      ) VALUES (
        ${eventId},
        ${task_title}, 
        ${category},
        ${status},
        ${priority},
        ${deadline_date || null},
        ${deadline_time || null},
        ${task_details || null},
        ${relevant_links || null},
        ${created_by || null}
      )
      RETURNING *
    `;

    return result[0];
  },

  async updateTask(taskId, taskData) {
    const {
      task_title,
      category,
      status,
      priority,
      deadline_date,
      deadline_time,
      task_details,
      relevant_links,
      assignees,
    } = taskData;

    // update task details
    const [updatedTask] = await sql`
      UPDATE event_tasks
      SET
        task_title = COALESCE(${task_title}, task_title),
        category = COALESCE(${category}, category),
        status = COALESCE(${status}, status),
        priority = COALESCE(${priority}, priority),
        deadline_date = COALESCE(${deadline_date}, deadline_date),
        deadline_time = COALESCE(${deadline_time}, deadline_time),
        task_details = COALESCE(${task_details}, task_details),
        relevant_links = COALESCE(${relevant_links}, relevant_links),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${taskId}
      RETURNING *;
    `;

    // update assignees if provided
    if (assignees && updatedTask) {
      // update stats
      const oldAssignees =
        await sql`SELECT user_id FROM task_assignees WHERE task_id = ${taskId} AND user_id IS NOT NULL`;

      // remove existing assignees
      await sql`DELETE FROM task_assignees WHERE task_id = ${taskId};`;

      // add new assignees
      const newAssignees = [];
      for (const assignee of assignees) {
        if (assignee.type === "user") {
          newAssignees.push({ user_id: assignee.id });
          await sql`
            INSERT INTO task_assignees (task_id, user_id)
            VALUES (${taskId}, ${assignee.id});
          `;
        } else if (assignee.type === "role") {
          await sql`
            INSERT INTO task_assignees (task_id, role_id)
            VALUES (${taskId}, ${assignee.id});
          `;
        }
      }

      // update stats for all involve users
      const allAffectedUsers = new Set([
        ...oldAssignees.map((u) => u.user_id),
        ...newAssignees.map((u) => u.user_id),
      ]);
      for (const userId of allAffectedUsers) {
        if (userId)
          userStatsService.updateUserTaskStats(userId).catch(console.error);
      }
    } else if (taskData.status && updatedTask) {
      //status change, update stats for existing assigned users
      const existingAssignees =
        await sql`SELECT user_id FROM task_assignees WHERE task_id = ${taskId} AND user_id IS NOT NULL`;
      for (const assignee of existingAssignees) {
        if (assignee.user_id)
          userStatsService
            .updateUserTaskStats(assignee.user_id)
            .catch(console.error);
      }
    }

    return updatedTask;
  },

  async deleteTask(taskId, deletedBy) {
    // get assignees to update stats
    const assignees =
      await sql`SELECT user_id FROM task_assignees WHERE task_id = ${taskId} AND user_id IS NOT NULL`;

    const softDeleted = await sql`
      UPDATE event_tasks
      SET 
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = ${deletedBy}
      WHERE id = ${taskId} AND deleted_at IS NULL
      RETURNING *;
    `;

    if (softDeleted[0]) {
      // update stats for all assigned users
      for (const assignee of assignees) {
        if (assignee.user_id)
          userStatsService
            .updateUserTaskStats(assignee.user_id)
            .catch(console.error);
      }
    }
    return softDeleted[0];
  },
};
