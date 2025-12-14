import { Modal, Text, Badge, Group, Stack, Button, Divider, useMantineTheme } from '@mantine/core';
import { IconCalendar, IconMapPin, IconUsers, IconClock } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

function EventDetailsModal({ opened, onClose, eventId }) {
  const theme = useMantineTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (opened && eventId) {
      fetchEventDetail();
    }
  }, [opened, eventId]);

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
    upcoming: 'blue',
    ongoing: 'green',
    completed: 'gray',
  };

  if (loading) {
    return (
      <Modal opened={opened} onClose={onClose} title="Event Details" size="lg" centered>
        <Text>Loading...</Text>
      </Modal>
    );
  }

  if (!event) {
    return (
      <Modal opened={opened} onClose={onClose} title="Event Details" size="lg" centered>
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
            {event.event_name}
          </Text>
          <Badge color={statusColors[event.status]} variant="light" size="lg">
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </Group>

        <Divider />

        <Stack gap="sm">
          <Text fw={600} size="md">Description</Text>
          <Text size="sm" c="dimmed">
            {event.description}
          </Text>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Text fw={600} size="md">Event Information</Text>
          
          <Group gap="xs">
            <IconCalendar size={20} color={theme.colors.gray[6]} />
            <Text size="sm">
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Group>

          <Group gap="xs">
            <IconClock size={20} color={theme.colors.gray[6]} />
            <Text size="sm">{event.time}</Text>
          </Group>

          <Group gap="xs">
            <IconMapPin size={20} color={theme.colors.gray[6]} />
            <Text size="sm">{event.venue}</Text>
          </Group>

          <Group gap="xs">
            <IconUsers size={20} color={theme.colors.gray[6]} />
            <Text size="sm">
              {event.volunteerCount} {event.volunteerCount === 1 ? 'Volunteer' : 'Volunteers'}
            </Text>
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