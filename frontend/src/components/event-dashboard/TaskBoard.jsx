import {
  Paper,
  Text,
  Stack,
  Group,
  Badge,
  Avatar,
  Button,
  ActionIcon,
  SimpleGrid,
  Menu,
  Modal,
} from "@mantine/core";
import { IconPlus, IconDots, IconTrash, IconEdit } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import AddTaskModal from "../modal/AddTaskModal";
import { authClient } from "../../auth.js";
import { notifications } from "@mantine/notifications";

function TaskColumn({ title, count, tasks, color, onDeleteTask }) {
  const [confirmDelete, setConfirmDelete] = useState({
    opened: false,
    taskId: null,
  });

  const handleDeleteClick = (taskId) => {
    setConfirmDelete({ opened: true, taskId });
  };

  const handleConfirmDelete = async () => {
    if (onDeleteTask) {
      await onDeleteTask(confirmDelete.taskId);
    }
    setConfirmDelete({ opened: false, taskId: null });
  };

  const headerColors = {
    todo: "#e2e8f0",
    inProgress: "#e0e7ff",
    inReview: "#fff7ed",
    done: "#dcfce7",
  };

  const getPriorityColor = (priority) => {
    if (!priority) return "blue";
    return priority === "High"
      ? "red"
      : priority === "Medium"
        ? "yellow"
        : "blue";
  };

  return (
    <>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
            <Text size="sm" fw={600}>
              {title}
            </Text>
          </Group>
          <Badge variant="light" color={color.replace("#", "")} size="sm">
            {count}
          </Badge>
        </Group>

        <Stack gap="sm">
          {tasks.map((task) => (
            <Paper
              key={task.id}
              p="sm"
              withBorder
              radius="md"
              style={{ cursor: "pointer" }}
            >
              <Stack gap="xs">
                <Group justify="space-between" wrap="nowrap">
                  <Text size="sm" fw={500} style={{ lineHeight: 1.4 }}>
                    {task.task_title}
                  </Text>
                  <Menu shadow="md" width={150}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" size="sm" color="gray">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => handleDeleteClick(task.id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                <Group justify="space-between" align="center" mt="xs">
                  <Avatar.Group spacing="xs">
                    {task.assignees?.map((assignee, idx) => (
                      <Avatar key={idx} size="xs" radius="xl" color="primary">
                        {assignee.name?.charAt(0) || "?"}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                  {task.deadline && (
                    <Text size="xs" c="dimmed">
                      {task.deadline}
                    </Text>
                  )}
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmDelete.opened}
        onClose={() => setConfirmDelete({ opened: false, taskId: null })}
        title="Delete Task"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => setConfirmDelete({ opened: false, taskId: null })}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete}>
              Delete Task
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

function TaskBoard({
  eventId,
  tasks = { todo: [], inProgress: [], inReview: [], done: [] },
  onTasksRefresh,
  userProfile,
}) {
  const [session, setSession] = useState(null);
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      setSession(data);
    };
    fetchSession();
  }, []);
  const [addTaskOpened, setAddTaskOpened] = useState(false);

  const handleTaskCreated = async () => {
    if (onTasksRefresh) {
      await onTasksRefresh();
    }
    setAddTaskOpened(false);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${eventId}/tasks/${taskId}`,
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

      if (onTasksRefresh) {
        await onTasksRefresh();
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

  return (
    <>
      <Paper shadow="sm" p="lg" withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <Text fw={600}>Tasks</Text>
          </Group>
          {session?.user?.role === "admin" && (
            <Button
              leftSection={<IconPlus size={16} />}
              size="xs"
              variant="light"
              onClick={() => setAddTaskOpened(true)}
            >
              Add Task
            </Button>
          )}
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <TaskColumn
            title="To Do"
            count={tasks.todo.length}
            tasks={tasks.todo}
            color="#3b82f6"
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="In Progress"
            count={tasks.inProgress.length}
            tasks={tasks.inProgress}
            color="#f59e0b"
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="In Review"
            count={tasks.inReview.length}
            tasks={tasks.inReview}
            color="#8b5cf6"
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Done"
            count={tasks.done.length}
            tasks={tasks.done}
            color="#10b981"
            onDeleteTask={handleDeleteTask}
          />
        </SimpleGrid>
      </Paper>

      {session?.user?.role === "admin" && (
        <AddTaskModal
          opened={addTaskOpened}
          onClose={() => setAddTaskOpened(false)}
          eventId={eventId}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </>
  );
}

export default TaskBoard;
