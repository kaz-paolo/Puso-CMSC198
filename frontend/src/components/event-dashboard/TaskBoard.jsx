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
} from "@mantine/core";
import { IconPlus, IconDots } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import AddTaskModal from "../modal/AddTaskModal";
import { authClient } from "../../auth.js";

function TaskColumn({ title, count, tasks, color }) {
  //TODO
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
    <Stack gap="sm">
      <Group
        justify="space-between"
        p="xs"
        style={{ backgroundColor: headerColors[color], borderRadius: "4px" }}
      >
        <Group gap="xs">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor:
                color === "done"
                  ? "#22c55e"
                  : color === "inProgress"
                    ? "#6366f1"
                    : color === "inReview"
                      ? "#f59e0b"
                      : "#94a3b8",
            }}
          />
          <Text fw={600} size="sm">
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            ({count})
          </Text>
        </Group>
      </Group>

      <Stack gap="sm">
        {tasks.map((task) => (
          <Paper key={task.id} p="md" withBorder shadow="xs">
            <Stack gap="xs">
              <Group gap="xs">
                <Badge size="xs" variant="light" color="blue">
                  {task.category}
                </Badge>
                {task.priority && (
                  <Badge
                    size="xs"
                    variant="light"
                    color={getPriorityColor(task.priority)}
                  >
                    {task.priority}
                  </Badge>
                )}
              </Group>

              <Text size="sm" fw={500} style={{ lineHeight: 1.4 }}>
                {task.task_title}
              </Text>

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
              onClick={() => setAddTaskOpened(true)}
            >
              Add Task
            </Button>
          )}
        </Group>

        <SimpleGrid cols={4} spacing="md">
          <TaskColumn
            title="To Do"
            count={tasks.todo?.length || 0}
            tasks={tasks.todo || []}
            color="todo"
          />
          <TaskColumn
            title="In Progress"
            count={tasks.inProgress?.length || 0}
            tasks={tasks.inProgress || []}
            color="inProgress"
          />
          <TaskColumn
            title="In Review"
            count={tasks.inReview?.length || 0}
            tasks={tasks.inReview || []}
            color="inReview"
          />
          <TaskColumn
            title="Done"
            count={tasks.done?.length || 0}
            tasks={tasks.done || []}
            color="done"
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
