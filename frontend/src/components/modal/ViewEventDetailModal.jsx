import {
  Modal,
  Text,
  Badge,
  Group,
  Stack,
  Button,
  Divider,
  useMantineTheme,
  Alert,
} from "@mantine/core";
import {
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useUser } from "@stackframe/react";

function EventDetailsModal({ opened, onClose, eventId }) {
  const theme = useMantineTheme();
  const user = useUser();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (opened && eventId) {
      fetchEventDetail();
      fetchUserProfile();
    }
  }, [opened, eventId]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${user.id}/basic-info`,
      );
      const data = await res.json();
      if (data.success) {
        setUserProfile(data.data);
        checkJoinStatus(data.data.id);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  const checkJoinStatus = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${userId}/joined-events`,
      );
      const data = await res.json();

      if (data.success) {
        const joined = data.data.some((e) => e.id === eventId);
        setHasJoined(joined);
      }
    } catch (err) {
      console.error("Failed to check join status:", err);
    }
  };

  const fetchEventDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/events/${eventId}`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.data);
      } else {
        setEvent(null);
      }
    } catch (err) {
      setEvent(null);
    }
    setLoading(false);
  };

  const statusColors = {
    upcoming: "blue",
    ongoing: "green",
    completed: "gray",
  };

  if (loading) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title="Event Details"
        size="lg"
        centered
      >
        <Text>Loading...</Text>
      </Modal>
    );
  }

  if (!event) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title="Event Details"
        size="lg"
        centered
      >
        <Text>Event not found</Text>
      </Modal>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Event Details"
      size="lg"
      centered
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <Text fw={700} size="xl">
            {event.event_title}
          </Text>
          <Badge color={statusColors[event.status]} variant="light" size="lg">
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </Group>

        {hasJoined && (
          <Alert
            icon={<IconCheck size={16} />}
            color="green"
            variant="light"
            title="You've joined this event"
          >
            You are registered as a volunteer for this event.
          </Alert>
        )}

        <Divider />

        <Stack gap="sm">
          <Text fw={600} size="md">
            Description
          </Text>
          <Text size="sm" c="dimmed">
            {event.description}
          </Text>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Text fw={600} size="md">
            Event Information
          </Text>

          <Group gap="xs">
            <IconCalendar size={20} color={theme.colors.gray[6]} />
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
            <IconClock size={20} color={theme.colors.gray[6]} />
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
            <IconMapPin size={20} color={theme.colors.gray[6]} />
            <Text size="sm">{event.location}</Text>
          </Group>

          <Group gap="xs" align="flex-start">
            <IconUsers size={20} color={theme.colors.gray[6]} />
            {event.volunteer_roles && event.volunteer_roles.length > 0 ? (
              <Stack gap="xs">
                {event.volunteer_roles.map((role) => {
                  const remaining = role.capacity - (role.current_count || 0);
                  return (
                    <Text size="sm" key={role.id}>
                      {role.role_name}: {remaining}/{role.capacity} slots
                      remaining
                    </Text>
                  );
                })}
              </Stack>
            ) : (
              <Text size="sm">
                {event.volunteer_capacity - (event.current_volunteers || 0)}/
                {event.volunteer_capacity} slots remaining
              </Text>
            )}
          </Group>
        </Stack>

        <Divider />

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default EventDetailsModal;
