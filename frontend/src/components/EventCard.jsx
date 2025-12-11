import { Card, Text, Badge, Group, Stack, Button, useMantineTheme } from '@mantine/core';
import { IconCalendar, IconMapPin, IconUsers, IconClock } from '@tabler/icons-react';
import { useState } from 'react';
import EventDetailsModal from '../components/modal/ViewEventDetailModal';

function EventCard({ event }) {
  const theme = useMantineTheme();
  const { id, name, date, venue, volunteerCount, status } = event;
  const [detailsOpened, setDetailsOpened] = useState(false);

  const statusColors = {
    upcoming: 'blue',
    ongoing: 'green',
    completed: 'gray',
  };

  // cut characters to show
  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600} size="lg">
              {name}
            </Text>
            <Badge color={statusColors[status]} variant="light">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={2}>
            {truncateDescription(event.description)}
          </Text>

          <Stack gap="xs">
            <Group gap="xs">
              <IconCalendar size={16} color={theme.colors.gray[6]} />
              <Text size="sm">{new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</Text>
            </Group>

            <Group gap="xs">
              <IconClock size={16} color={theme.colors.gray[6]} />
              <Text size="sm">{event.time}</Text>
            </Group>

            <Group gap="xs">
              <IconMapPin size={16} color={theme.colors.gray[6]} />
              <Text size="sm">{venue}</Text>
            </Group>

            <Group gap="xs">
              <IconUsers size={16} color={theme.colors.gray[6]} />
              <Text size="sm">
                {volunteerCount} {volunteerCount === 1 ? 'Volunteer' : 'Volunteers'}
              </Text>
            </Group>
          </Stack>

          <Group gap="xs" mt="md">
            <Button variant="light" fullWidth onClick={() => setDetailsOpened(true)}>
              View Details
            </Button>
            {status === 'upcoming' && (
              <Button fullWidth onClick={() => setDetailsOpened(true)}>
                Volunteer
              </Button>
            )}
          </Group>
        </Stack>
      </Card>

      <EventDetailsModal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        eventId={id}
      />
    </>
  );
}

export default EventCard;