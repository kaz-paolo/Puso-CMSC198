import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Paper,
  Group,
  ThemeIcon,
  Button,
  RingProgress,
  Card,
  Box,
} from "@mantine/core";
import {
  IconUsers,
  IconCalendarEvent,
  IconClock,
  IconUserCheck,
  IconPlus,
  IconFileExport,
  IconSettings,
  IconReportAnalytics,
  IconMail,
  IconChartLine,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ userProfile }) {
  const navigate = useNavigate();

  // placeholder data
  const stats = [
    {
      label: "Total Volunteers",
      value: "1,204",
      icon: IconUsers,
      color: "blue",
    },
    {
      label: "Active Events",
      value: "12",
      icon: IconCalendarEvent,
      color: "green",
    },
    {
      label: "Total Hours Logged",
      value: "15,430h",
      icon: IconClock,
      color: "orange",
    },
    {
      label: "Total Participants",
      value: "8,942",
      icon: IconUserCheck,
      color: "violet",
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} align="left">
            Admin Dashboard
          </Title>
          <Text c="dimmed" align="left">
            Welcome back, {userProfile?.first_name || "Admin"}!
          </Text>
        </div>

        {/* Data Previews */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {stats.map((stat) => (
            <Paper withBorder p="md" radius="md" key={stat.label}>
              <Group>
                <ThemeIcon
                  color={stat.color}
                  variant="light"
                  size={48}
                  radius="md"
                >
                  <stat.icon size={24} />
                </ThemeIcon>
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {stat.label}
                  </Text>
                  <Text fw={700} size="xl" align="left">
                    {stat.value}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="xl">
          {/* Volunteer Engagements Graph */}
          <Paper withBorder p="xl" radius="md" style={{ gridColumn: "span 2" }}>
            <Group justify="space-between" mb="md">
              <Title order={4}>Volunteer Engagements</Title>
              <IconChartLine size={20} color="gray" />
            </Group>
            <Box
              bg="gray.1"
              style={{
                height: 250,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <Text c="dimmed" fs="italic">
                placeholder
              </Text>
            </Box>
          </Paper>

          {/* Event Status Distribution */}
          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="md">
              Event Status
            </Title>
            <Group justify="center">
              <RingProgress
                size={200}
                thickness={20}
                label={
                  <Text ta="center" size="lg" fw={700}>
                    24
                    <br />
                    <Text span size="xs" c="dimmed" fw={500}>
                      Events
                    </Text>
                  </Text>
                }
                sections={[
                  { value: 40, color: "blue", tooltip: "Upcoming (40%)" },
                  { value: 20, color: "green", tooltip: "Ongoing (20%)" },
                  { value: 40, color: "gray", tooltip: "Completed (40%)" },
                ]}
              />
            </Group>
            <Stack gap="xs" mt="md">
              <Group justify="space-between">
                <Group gap="xs">
                  <Box
                    w={12}
                    h={12}
                    bg="blue"
                    style={{ borderRadius: "50%" }}
                  />
                  <Text size="sm">Upcoming</Text>
                </Group>
                <Text size="sm" fw={500}>
                  10
                </Text>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <Box
                    w={12}
                    h={12}
                    bg="green"
                    style={{ borderRadius: "50%" }}
                  />
                  <Text size="sm">Ongoing</Text>
                </Group>
                <Text size="sm" fw={500}>
                  5
                </Text>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <Box
                    w={12}
                    h={12}
                    bg="gray"
                    style={{ borderRadius: "50%" }}
                  />
                  <Text size="sm">Completed</Text>
                </Group>
                <Text size="sm" fw={500}>
                  9
                </Text>
              </Group>
            </Stack>
          </Paper>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          {/* Recent Activity */}
          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="md" align="left">
              Recent Activity
            </Title>
            <Stack gap="sm" align="left">
              {[
                {
                  time: "2 hours ago",
                  text: "John Doe registered for Coastal Cleanup",
                },
                {
                  time: "4 hours ago",
                  text: "New event 'Medical Mission' created",
                },
                {
                  time: "1 day ago",
                  text: "Jane Smith completed 8 hours of service",
                },
                {
                  time: "2 days ago",
                  text: "Feedback received for Reading Program",
                },
              ].map((activity, i) => (
                <Card key={i} withBorder padding="sm" radius="md">
                  <Text size="sm" align="left">
                    {activity.text}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4} align="left">
                    {activity.time}
                  </Text>
                </Card>
              ))}
            </Stack>
          </Paper>

          {/* Quick Actions */}
          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="md" align="left">
              Quick Actions
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Button
                leftSection={<IconPlus size={18} />}
                variant="light"
                onClick={() => navigate("/events")}
              >
                Create Event
              </Button>
              <Button
                leftSection={<IconFileExport size={18} />}
                variant="light"
                color="green"
              >
                Export Data
              </Button>
              <Button
                leftSection={<IconReportAnalytics size={18} />}
                variant="light"
                color="violet"
              >
                View Reports
              </Button>
              <Button
                leftSection={<IconMail size={18} />}
                variant="light"
                color="orange"
              >
                Send Announcement
              </Button>
              <Button
                leftSection={<IconSettings size={18} />}
                variant="light"
                color="gray"
              >
                System Settings
              </Button>
            </SimpleGrid>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
