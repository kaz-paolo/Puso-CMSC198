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
import {
  getEventStatus,
  getStatusColor,
  getStatusLabel,
} from "../utils/eventStatus";

function EventInfo({ event }) {
  const theme = useMantineTheme();

  if (!event) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text c="dimmed">No event information available</Text>
      </Card>
    );
  }

  const dynamicStatus = getEventStatus(event.start_date, event.end_date);
  const statusColor = getStatusColor(dynamicStatus);
  const statusLabel = getStatusLabel(dynamicStatus);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Stack gap={4}>
            <Text fw={700} size="xl">
              {event.event_title}
            </Text>
          </Stack>
          <Badge color={statusColor} variant="light" size="lg">
            {statusLabel}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {event.description}
        </Text>

        <Stack gap="xs">
          <Group gap="xs">
            <IconCalendar size={18} color={theme.colors.gray[6]} />
            <Text size="sm">
              {new Date(event.start_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at {event.start_time}
            </Text>
          </Group>

          <Group gap="xs">
            <IconCalendar size={18} color={theme.colors.gray[6]} />
            <Text size="sm">
              to{" "}
              {new Date(event.end_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at {event.end_time}
            </Text>
          </Group>

          <Group gap="xs">
            <IconMapPin size={18} color={theme.colors.gray[6]} />
            <Text size="sm">{event.location}</Text>
          </Group>

          <Group gap="xs">
            <IconUsers size={18} color={theme.colors.gray[6]} />
            {event.volunteer_roles && event.volunteer_roles.length > 0 ? (
              <Stack gap="xs">
                {event.volunteer_roles.map((role) => (
                  <Text size="sm" key={role.id}>
                    {role.role_name}: {role.capacity}
                  </Text>
                ))}
              </Stack>
            ) : (
              <Text size="sm">
                {event.volunteer_capacity || 0}{" "}
                {event.volunteer_capacity === 1 ? "Volunteer" : "Volunteers"}
              </Text>
            )}
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}

export default EventInfo;
