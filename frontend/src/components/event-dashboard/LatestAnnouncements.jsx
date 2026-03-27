import { Paper, Text, Stack, Group, Avatar, ActionIcon } from "@mantine/core";
import {
  IconSpeakerphone,
  IconBuilding,
  IconCalendar,
  IconChevronRight,
} from "@tabler/icons-react";

function LatestAnnouncements({ announcements }) {
  const getIcon = (iconName, color) => {
    const iconProps = { size: 20 };
    switch (iconName) {
      case "building":
        return <IconBuilding {...iconProps} />;
      case "calendar":
        return <IconCalendar {...iconProps} />;
      default:
        return <IconSpeakerphone {...iconProps} />;
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case "yellow":
        return "yellow";
      case "purple":
        return "violet";
      default:
        return "blue";
    }
  };

  return (
    <Paper withBorder p="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Group>
          <IconSpeakerphone size={20} />
          <Text fw={600} size="lg">
            Latest Announcements
          </Text>
        </Group>
        <ActionIcon variant="subtle" color="gray">
          <Text size="sm" c="primary" fw={500}>
            View More
          </Text>
        </ActionIcon>
      </Group>

      <Stack gap="md">
        {announcements.map((announcement) => (
          <Paper key={announcement.id} p="md" withBorder>
            <Group gap="md" wrap="nowrap">
              <Avatar
                color={getIconColor(announcement.iconColor)}
                variant="light"
                radius="md"
                size="lg"
              >
                {getIcon(announcement.icon)}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Text fw={600} size="sm" align="left">
                  {announcement.title}
                </Text>
                <Text size="sm" c="dimmed" mt={4} align="left">
                  {announcement.message}
                </Text>
                <Group gap={4} mt="xs">
                  <Avatar size="xs" radius="xl" />
                  <Text size="xs" c="dimmed" align="left">
                    Posted by {announcement.author}
                  </Text>
                  <Text size="xs" c="dimmed" align="left">
                    • {announcement.timestamp}
                  </Text>
                </Group>
              </div>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

export default LatestAnnouncements;
