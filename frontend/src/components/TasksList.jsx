import { Paper, Text, Stack, Group, Badge, Button, Select, Tabs } from '@mantine/core';
import { IconCalendar, IconUser } from '@tabler/icons-react';
import { useState } from 'react';

function TasksList({ assignedTasks, pendingTasks }) {
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('assigned');

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
  };

  const getPriorityColor = (priority) => {
    return priority === 'high' ? 'red' : priority === 'medium' ? 'yellow' : 'blue';
  };

  const renderTaskItem = (task) => (
    <Paper key={task.id} p="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={600}>{task.title}</Text>
          <Badge color={getPriorityColor(task.priority)} variant="light">
            {task.priority}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed" lineClamp={2}>{task.description}</Text>
        <Group gap="md">
          <Group gap="xs">
            <IconCalendar size={16} />
            <Text size="xs">
              {new Date(task.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </Group>
          {task.assignedTo && (
            <Group gap="xs">
              <IconUser size={16} />
              <Text size="xs">{task.assignedTo}</Text>
            </Group>
          )}
        </Group>
        <Button variant="light" size="xs" fullWidth>
          View Details
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={600} size="lg">Tasks</Text>
          <Select
            size="xs"
            value={sortBy}
            onChange={setSortBy}
            data={[
              { value: 'date', label: 'Sort by Date' },
              { value: 'priority', label: 'Sort by Priority' },
            ]}
            style={{ width: 150 }}
          />
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="assigned">
              My Tasks ({assignedTasks.length})
            </Tabs.Tab>
            <Tabs.Tab value="pending">
              All Pending ({pendingTasks.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="assigned" pt="md">
            <Stack gap="sm">
              {sortTasks(assignedTasks).map(renderTaskItem)}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="pending" pt="md">
            <Stack gap="sm">
              {sortTasks(pendingTasks).map(renderTaskItem)}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Paper>
  );
}

export default TasksList;