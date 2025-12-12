import { Paper, Text, Stack, Badge, Divider, Anchor, Group, Accordion } from '@mantine/core';
import { IconLink, IconPin } from '@tabler/icons-react';
import { useState } from 'react';

function AnnouncementResourcesReminders({ announcements = [], resources = [], reminders = [] }) {
  const [activeAccordion, setActiveAccordion] = useState('announcements');

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Stack gap="xl">
        <Accordion 
          variant="separated" 
          value={activeAccordion} 
          onChange={setActiveAccordion}
        >
          <Accordion.Item value="announcements">
            <Accordion.Control>
              <Text fw={600} size="lg" mb="md">Announcements</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                {announcements.map((announcement) => (
                  <Paper key={announcement.id} p="sm" withBorder>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Group gap="xs">
                          {announcement.pinned && <IconPin size={16} color="#fab005" />}
                          <Text fw={500}>{announcement.title}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {new Date(announcement.date).toLocaleDateString()}
                        </Text>
                      </Group>
                      <Text size="sm" c="dimmed">{announcement.content}</Text>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="resources">
            <Accordion.Control>
              <Text fw={600} size="lg" mb="md">Resources</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                {resources.map((resource) => (
                  <Paper key={resource.id} p="sm" withBorder>
                    <Group gap="xs">
                      <IconLink size={16} />
                      <div style={{ flex: 1 }}>
                        <Anchor href={resource.url} target="_blank" size="sm" fw={500}>
                          {resource.title}
                        </Anchor>
                        {resource.description && (
                          <Text size="xs" c="dimmed">{resource.description}</Text>
                        )}
                      </div>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="reminders">
            <Accordion.Control>
              <Text fw={600} size="lg" mb="md">Reminders</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {reminders.map((reminder) => (
                  <Paper key={reminder.id} p="sm" withBorder bg="yellow.0">
                    <Group justify="space-between">
                      <Text size="sm">{reminder.message}</Text>
                      <Badge variant="light" color="yellow">
                        {new Date(reminder.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Paper>
  );
}

export default AnnouncementResourcesReminders;