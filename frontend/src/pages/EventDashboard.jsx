import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  useMantineTheme,
  Paper,
  Group,
  Loader,
  Center,
  Tabs,
} from "@mantine/core";
import {
  IconUsers,
  IconClipboardList,
  IconClipboardCheck,
} from "@tabler/icons-react";
import AnnouncementResourcesReminders from "../components/AnnouncementResourcesReminders";
import EventCalendar from "../components/Calendar";
import VolunteerList from "../components/VolunteerList";
import TasksList from "../components/TasksList";
import EventInfo from "../components/EventInfo";

// PLACEHOLDER
const PLACEHOLDER_DATA = {
  eventDetails: {
    name: "Community Outreach Program 2024",
    date: "2024-02-15",
    time: "09:00 AM",
    location: "Miagao Town Plaza",
    status: "ongoing",
    description:
      "A community outreach program to provide assistance to families in need.",
    volunteerCount: 45,
  },
  volunteers: [
    { id: 1, name: "Juan Dela Cruz", committee: "Logistics", batch: 1 },
    { id: 2, name: "Maria Santos", committee: "Documentation", batch: 2 },
    { id: 3, name: "Pedro Garcia", committee: "Finance", batch: 5 },
    { id: 4, name: "Ana Lopez", committee: "Publicity", batch: 4 },
    { id: 5, name: "Jose Reyes", committee: "Logistics", batch: 3 },
  ],
  markedDates: [
    { date: "2024-02-10", type: "deadline", title: "Submit Budget" },
    { date: "2024-02-15", type: "event", title: "Event Day" },
    { date: "2024-02-20", type: "deadline", title: "Post-Event Report" },
  ],
  assignedTasks: [
    {
      id: 1,
      title: "Prepare Event Materials",
      description:
        "Gather all necessary materials for the outreach program including flyers, forms, and supplies.",
      deadline: "2024-02-12",
      priority: "high",
      assignedTo: "You",
      status: "pending",
    },
    {
      id: 2,
      title: "Coordinate with Local Officials",
      description: "Meet with barangay officials to finalize event logistics.",
      deadline: "2024-02-13",
      priority: "medium",
      assignedTo: "You",
      status: "pending",
    },
  ],
  pendingTasks: [
    {
      id: 3,
      title: "Finalize Budget Report",
      description: "Complete the budget report with all expenses documented.",
      deadline: "2024-02-14",
      priority: "high",
      assignedTo: "Finance Committee",
      status: "pending",
    },
    {
      id: 4,
      title: "Social Media Posts",
      description:
        "Create and schedule social media posts for event promotion.",
      deadline: "2024-02-11",
      priority: "medium",
      assignedTo: "Publicity Committee",
      status: "pending",
    },
    {
      id: 5,
      title: "Update Volunteer List",
      description: "Verify and update the final list of volunteers.",
      deadline: "2024-02-10",
      priority: "low",
      assignedTo: "Logistics Committee",
      status: "pending",
    },
  ],
  announcements: [
    {
      id: 1,
      title: "Venue Change Notice",
      content:
        "The event venue has been moved to the covered court due to weather concerns.",
      date: "2024-02-08",
      pinned: true,
    },
    {
      id: 2,
      title: "Volunteer Meeting Tomorrow",
      content:
        "All volunteers are required to attend the pre-event meeting at 3 PM.",
      date: "2024-02-09",
      pinned: false,
    },
  ],
  resources: [
    {
      id: 1,
      title: "Event Guidelines Document",
      url: "https://website.com/guidelines",
      description: "Complete guidelines and protocols for the event",
    },
    {
      id: 2,
      title: "Budget Template",
      url: "https://website.com/budget",
      description: "Template for budget reporting",
    },
    {
      id: 3,
      title: "Emergency Contacts",
      url: "https://website.com/contacts",
      description: "List of emergency contacts and hotlines",
    },
  ],
  reminders: [
    {
      id: 1,
      message: "Submit attendance confirmation by Feb 10",
      date: "2024-02-10",
    },
    {
      id: 2,
      message: "Wear volunteer shirt on event day",
      date: "2024-02-15",
    },
  ],
};

function EventDashboard() {
  const { eventId } = useParams();
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(true);

  // Dashboard data state
  const [eventDetails, setEventDetails] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchVolunteers();
  }, [eventId]);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/events/${eventId}/volunteers`
      );
      const data = await res.json();
      if (data.success) {
        setVolunteers(data.data);
      } else {
        setVolunteers([]);
      }
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/events/${eventId}`);

      const data = await res.json();

      if (!data.success) {
        setEventDetails(null);
        return;
      }
      setEventDetails(data.data);

      // TODO: Backend Database
      // PLACEHOLDER
      // setEventDetails(PLACEHOLDER_DATA.eventDetails);
      // setVolunteers(PLACEHOLDER_DATA.volunteers);
      // setMarkedDates(PLACEHOLDER_DATA.markedDates);
      // setAssignedTasks(PLACEHOLDER_DATA.assignedTasks);
      // setPendingTasks(PLACEHOLDER_DATA.pendingTasks);
      // setAnnouncements(PLACEHOLDER_DATA.announcements);
      // setResources(PLACEHOLDER_DATA.resources);
      // setReminders(PLACEHOLDER_DATA.reminders);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!eventDetails) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Text>Event not found</Text>
      </Center>
    );
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Event Info at the top */}
        <EventInfo event={eventDetails} />

        {/* Tabs for dashboard sections */}
        <Tabs defaultValue="members" color="brand" variant="outline">
          <Tabs.List mb="md">
            <Tabs.Tab value="members">Members</Tabs.Tab>
            <Tabs.Tab value="calendar">Calendar</Tabs.Tab>
            <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
            <Tabs.Tab value="announcements">Announcements</Tabs.Tab>
            <Tabs.Tab value="resources">Resources</Tabs.Tab>
            <Tabs.Tab value="reminders">Reminders</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="members" pt="md">
            <Stack gap="lg">
              <Paper shadow="sm" p="md" withBorder>
                <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>
                  MEMBERS
                </Title>
                <Stack gap="md">
                  {/* Header: icon, label, number grouped left */}
                  <Group
                    gap="xs"
                    align="center"
                    style={{ width: "fit-content" }}
                  >
                    <IconUsers size={24} color={theme.colors.brand[6]} />
                    <Text size="xs" c="dimmed">
                      Total Volunteers
                    </Text>
                    <Text size="xl" fw={700}>
                      {volunteers.length}
                    </Text>
                  </Group>
                  <VolunteerList volunteers={volunteers} compact />
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="calendar" pt="md">
            <Stack gap="lg">
              <Paper shadow="sm" p="md" withBorder>
                <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>
                  CALENDAR
                </Title>
                <EventCalendar markedDates={markedDates} compact />
              </Paper>
            </Stack>
          </Tabs.Panel>

          {/* Combined Tasks Tab */}
          <Tabs.Panel value="tasks" pt="md">
            <Stack gap="lg">
              <Paper shadow="sm" p="md" withBorder>
                <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>
                  TASKS
                </Title>
                <Stack gap="md">
                  <Paper p="sm" withBorder>
                    <Group gap="sm" wrap="nowrap">
                      <IconClipboardCheck
                        size={24}
                        color={theme.colors.brand[6]}
                      />
                      <div style={{ flex: 1 }}>
                        <Text size="xs" c="dimmed">
                          Assigned Tasks
                        </Text>
                        <Text size="lg" fw={700}>
                          {assignedTasks.length}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                  <TasksList
                    assignedTasks={assignedTasks}
                    pendingTasks={pendingTasks}
                    compact
                    showAssigned
                    showPending
                  />
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="announcements" pt="md">
            <Stack gap="lg">
              <Paper shadow="sm" p="md" withBorder>
                <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>
                  ANNOUNCEMENTS
                </Title>
                <Stack gap="md">
                  {announcements.map((announcement) => (
                    <Paper key={announcement.id} p="sm" withBorder>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Group gap="xs">
                            {announcement.pinned && (
                              <span
                                style={{
                                  color: "#fab005",
                                  fontWeight: 700,
                                }}
                              >
                                📌
                              </span>
                            )}
                            <Text fw={500}>{announcement.title}</Text>
                          </Group>
                          <Text size="xs" c="dimmed">
                            {new Date(announcement.date).toLocaleDateString()}
                          </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {announcement.content}
                        </Text>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="resources" pt="md">
            <Stack gap="lg">
              <Paper shadow="sm" p="md" withBorder>
                <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>
                  RESOURCES
                </Title>
                {/* Render resources directly */}
                <Stack gap="sm">
                  {resources.map((resource) => (
                    <Paper key={resource.id} p="sm" withBorder>
                      <Group gap="xs">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontWeight: 500 }}
                        >
                          {resource.title}
                        </a>
                        <Text size="xs" c="dimmed">
                          {resource.description}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="reminders" pt="md">
            <Stack gap="lg">
              <Paper shadow="sm" p="md" withBorder>
                <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>
                  REMINDERS
                </Title>
                {/* Render reminders directly */}
                <Stack gap="xs">
                  {reminders.map((reminder) => (
                    <Paper key={reminder.id} p="sm" withBorder bg="yellow.0">
                      <Group justify="space-between">
                        <Text size="sm">{reminder.message}</Text>
                        <Text size="xs" c="yellow">
                          {new Date(reminder.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default EventDashboard;
