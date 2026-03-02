import { sql } from "../config/db.js";

export async function getTasksByEventId(req, res) {
  try {
    const { eventId } = req.params;

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

    res.json({ success: true, data: categorizedTasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
}

export async function createTask(req, res) {
  try {
    const { eventId } = req.params;
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
    } = req.body;

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

    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, error: "Failed to create task" });
  }
}

export async function updateTask(req, res) {
  try {
    const { taskId } = req.params;
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
    } = req.body;

    // update task
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

    // update assignees
    if (assignees) {
      // remove existing assignees
      await sql`DELETE FROM task_assignees WHERE task_id = ${taskId};`;

      // add new
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

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, error: "Failed to update task" });
  }
}

export async function deleteTask(req, res) {
  try {
    const { taskId } = req.params;

    await sql`DELETE FROM event_tasks WHERE id = ${taskId};`;

    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, error: "Failed to delete task" });
  }
}
