import {
  Card,
  Text,
  Stack,
  Group,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconClock,
} from "@tabler/icons-react";

function EventInfo({ event }) {
  const theme = useMantineTheme();

  if (!event) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text c="dimmed">No event information available</Text>
      </Card>
    );
  }

  const statusColors = {
    upcoming: "blue",
    ongoing: "green",
    completed: "gray",
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Stack gap={4}>
            <Text fw={700} size="xl">
              {event.name}
            </Text>
          </Stack>
          <Badge color={statusColors[event.status]} variant="light" size="lg">
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {event.description}
        </Text>

        <Stack gap="xs">
          <Group gap="xs">
            <IconCalendar size={18} color={theme.colors.gray[6]} />
            <Text size="sm">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Group>

          <Group gap="xs">
            <IconClock size={18} color={theme.colors.gray[6]} />
            <Text size="sm">{event.time}</Text>
          </Group>

          <Group gap="xs">
            <IconMapPin size={18} color={theme.colors.gray[6]} />
            <Text size="sm">{event.venue}</Text>
          </Group>

          <Group gap="xs">
            <IconUsers size={18} color={theme.colors.gray[6]} />
            <Text size="sm">
              {event.volunteerCount || 0}{" "}
              {event.volunteerCount === 1 ? "Volunteer" : "Volunteers"}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}

export default EventInfo;
