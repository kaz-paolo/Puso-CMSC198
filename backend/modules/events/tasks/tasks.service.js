import { sql } from "../../../config/db.js";

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
      taskTitle,
      category,
      status = "To Do",
      priority,
      deadlineDate,
      deadlineTime,
      taskDetails,
      relevantLinks,
      createdBy,
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
        ${taskTitle},
        ${category},
        ${status},
        ${priority},
        ${deadlineDate || null},
        ${deadlineTime || null},
        ${taskDetails || null},
        ${relevantLinks || null},
        ${createdBy || null}
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
      // remove existing assignees
      await sql`DELETE FROM task_assignees WHERE task_id = ${taskId};`;

      // add new assignees
      for (const assignee of assignees) {
        if (assignee.type === "user") {
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
    }

    return updatedTask;
  },

  async deleteTask(taskId, deletedBy) {
    const softDeleted = await sql`
      UPDATE event_tasks
      SET 
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = ${deletedBy}
      WHERE id = ${taskId} AND deleted_at IS NULL
      RETURNING *;
    `;
    return softDeleted[0];
  },
};
