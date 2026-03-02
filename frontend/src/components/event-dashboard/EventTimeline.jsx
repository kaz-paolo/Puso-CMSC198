import { Paper, Title, Stack, Group, Text, Avatar } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

function EventTimeline({ activities = [] }) {
  return (
    <Paper shadow="sm" p="lg" withBorder>
      <Group gap="sm" mb="md">
        <IconClock size={24} />
        <Title order={5}>Event Timeline</Title>
      </Group>

      <Stack gap="sm">
        {activities.map((activity) => (
          <Group key={activity.id} gap="xs" align="flex-start">
            <Avatar src={activity.avatar} size="sm" radius="xl">
              {!activity.avatar && activity.user.charAt(0)}
            </Avatar>
            <Stack gap={0} style={{ flex: 1 }}>
              <Group gap="xs" wrap="wrap">
                <Text size="sm" fw={500}>
                  {activity.user}
                </Text>
                <Text size="sm" c="dimmed">
                  {activity.action}
                </Text>
                {activity.item && (
                  <Text size="sm" fw={500}>
                    {activity.item}
                  </Text>
                )}
                {activity.from && activity.to && (
                  <Text size="sm" c="dimmed">
                    {activity.from} → {activity.to}
                  </Text>
                )}
              </Group>
              <Text size="xs" c="dimmed">
                {activity.timestamp}
              </Text>
            </Stack>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}

export default EventTimeline;
