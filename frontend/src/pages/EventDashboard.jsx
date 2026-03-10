import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Stack,
  useMantineTheme,
  Paper,
  Group,
  Loader,
  Center,
  Tabs,
  Grid,
  Button,
} from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import {
  IconUsers,
  IconClipboardList,
  IconCalendar,
  IconFileText,
  IconBell,
  IconFolder,
  IconLock,
  IconAlertCircle,
} from "@tabler/icons-react";
import { authClient } from "../auth.js";
import { Alert } from "@mantine/core";
import { useUserProfile } from "../hooks/useUserProfile";

// event dashboard components
import EventDescription from "../components/event-dashboard/EventDescription";
import EventTimeline from "../components/event-dashboard/EventTimeline";
import LatestAnnouncements from "../components/event-dashboard/LatestAnnouncements";
import ResourcesList from "../components/event-dashboard/ResourcesList";
import TaskBoard from "../components/event-dashboard/TaskBoard";
import VolunteersTable from "../components/event-dashboard/VolunteersTable";
import EventCalendar from "../components/Calendar";

// DUMMY DATA for features not yet in database

const DUMMY_ANNOUNCEMENTS = [
  {
    id: 1,
    icon: "building",
    iconColor: "yellow",
    title: "Venue Change Confirmed",
    message:
      "Please be informed that the venue for the event has been changed to Miagao Central Elementary School. The rest of the details remains unchanged.",
    author: "Veronica",
    timestamp: "3 hours ago",
  },
  {
    id: 2,
    icon: "calendar",
    iconColor: "purple",
    title: "Venue Change Confirmed",
    message:
      "We'll be having a meeting on March 29 10:00 AM, at the Pahinungod Office. Important updates and discussions will be covered, so see you there!",
    author: "Alonso",
    timestamp: "6 hours ago",
  },
];
const DUMMY_TIMELINE = [
  {
    id: 1,
    user: "Kevin Duhazm",
    action: "changed status from",
    from: "Draft",
    to: "In Progress",
    timestamp: "3hr ago",
    avatar: null,
  },
  {
    id: 2,
    user: "Monty Hayton",
    action: "created the",
    item: "Energy Charter Treaty",
    timestamp: "Yesterday",
    avatar: null,
  },
  {
    id: 3,
    user: "Monty Hayton",
    action: "edited the",
    item: "Energy Charter Treaty",
    timestamp: "Yesterday",
    avatar: null,
  },
];

function EventDashboard() {
  const { eventId } = useParams();
  const [session, setSession] = useState(null);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await authClient.getSession();
      setSession(session);
    };
    fetchSession();
  }, []);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const [loading, setLoading] = useState(true);

  // Database data state
  const [eventDetails, setEventDetails] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);

  // dummy data
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    inReview: [],
    done: [],
  });
  const [announcements] = useState(DUMMY_ANNOUNCEMENTS);
  const [resources, setResources] = useState([]);
  const [timeline] = useState(DUMMY_TIMELINE);

  const checkAccess = async (profile, sessionData) => {
    try {
      // admin access
      if (sessionData?.data?.user?.role === "admin") {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      if (!profile?.id) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Check if user is a volunteer in this event using user_info.id
      const res = await fetch(
        `http://localhost:3000/api/users/${profile.id}/joined-events`,
      );
      const data = await res.json();

      if (data.success) {
        const isVolunteer = data.data.some((e) => e.id === parseInt(eventId));
        setHasAccess(isVolunteer);
      }
    } catch (err) {
      console.error("Failed to check access:", err);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.data?.user?.role === "admin") {
      checkAccess(null, session);
      fetchEventDetails();
      fetchVolunteers();
      fetchTasks();
      fetchResources();
    } else if (userProfile) {
      checkAccess(userProfile, session);
      fetchEventDetails();
      fetchVolunteers();
      fetchTasks();
      fetchResources();
    }
  }, [eventId, userProfile, session]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/events/${eventId}`);
      const data = await res.json();

      if (data.success) {
        setEventDetails(data.data);
      } else {
        setEventDetails(null);
      }
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setEventDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/events/${eventId}/volunteers`,
      );
      const data = await res.json();

      if (data.success) {
        setVolunteers(data.data);
      } else {
        setVolunteers([]);
      }
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
      setVolunteers([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/events/${eventId}/tasks`,
      );
      const data = await res.json();

      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/events/${eventId}/resources`,
      );
      const data = await res.json();

      if (data.success) {
        setResources(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  };

  if (loading || profileLoading) {
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

  // Access check role
  if (!hasAccess) {
    return (
      <Container size="sm" py="xl">
        <Stack gap="xl" align="center">
          <IconLock size={80} color={theme.colors.red[6]} />
          <Stack gap="sm" align="center">
            <Title order={2}>Access Denied</Title>
            <Text size="lg" c="dimmed" ta="center">
              You don't have permission to view this event dashboard.
            </Text>
          </Stack>
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Access Restricted"
            color="red"
            variant="light"
          >
            <Stack gap="xs">
              <Text size="sm">This event dashboard is only accessible to:</Text>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  <Text size="sm">Event volunteers who have joined</Text>
                </li>
                <li>
                  <Text size="sm">Administrators</Text>
                </li>
              </ul>
              {session?.data?.user?.role !== "admin" && (
                <Text size="sm" mt="xs">
                  Please join this event first to access the dashboard.
                </Text>
              )}
            </Stack>
          </Alert>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Event Header */}
        <div>
          <Title order={1}>{eventDetails.event_title}</Title>
          <Group gap="xs" mt="xs">
            <Text size="sm" c="dimmed">
              {new Date(eventDetails.start_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <Text size="sm" c="dimmed">
              •
            </Text>
            <Text size="sm" c="dimmed">
              {eventDetails.location}
            </Text>
          </Group>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconFileText size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab
              value="tasks"
              leftSection={<IconClipboardList size={16} />}
            >
              Tasks
            </Tabs.Tab>
            <Tabs.Tab value="volunteers" leftSection={<IconUsers size={16} />}>
              Volunteers
            </Tabs.Tab>
            <Tabs.Tab value="resources" leftSection={<IconFolder size={16} />}>
              Resources
            </Tabs.Tab>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Panel value="overview" pt="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="md">
                  <EventDescription
                    description={eventDetails.description}
                    date={eventDetails.start_date}
                    time={eventDetails.start_time}
                    venue={eventDetails.location}
                  />
                  <LatestAnnouncements announcements={announcements} />
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="md">
                  <EventCalendar
                    markedDates={[
                      {
                        date: eventDetails.start_date,
                        title: eventDetails.event_title,
                        type: "event",
                      },
                    ]}
                  />
                  <EventTimeline activities={timeline} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Volunteers Tab */}
          <Tabs.Panel value="volunteers" pt="md">
            <VolunteersTable
              volunteers={volunteers}
              eventId={eventId}
              onVolunteersRefresh={() => {
                fetchVolunteers();
                fetchEventStats();
              }}
              isAdmin={session?.data?.user?.role === "admin"}
              currentUserId={userProfile?.id}
            />
          </Tabs.Panel>

          {/* Resources Tab */}
          <Tabs.Panel value="resources" pt="md">
            <ResourcesList
              resources={resources}
              eventId={eventId}
              userProfile={userProfile}
              onResourcesRefresh={fetchResources}
            />
          </Tabs.Panel>

          {/* Tasks Tab */}
          <Tabs.Panel value="tasks" pt="md">
            <TaskBoard
              eventId={eventId}
              tasks={tasks}
              onTasksRefresh={fetchTasks}
              userProfile={userProfile}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default EventDashboard;
