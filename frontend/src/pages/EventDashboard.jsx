import { useState } from "react";
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
  IconListCheck,
  IconFileAnalytics,
} from "@tabler/icons-react";
import { Alert } from "@mantine/core";
import { useEventDashboardData } from "../hooks/useEventDashboardData";

// event dashboard components
import EventDescription from "../components/event-dashboard/EventDescription.jsx";
import EventTimeline from "../components/event-dashboard/EventTimeline.jsx";
import LatestAnnouncements from "../components/event-dashboard/LatestAnnouncements.jsx";
import ResourcesList from "../components/event-dashboard/ResourcesList.jsx";
import TaskBoard from "../components/event-dashboard/TaskBoard.jsx";
import VolunteersTable from "../components/event-dashboard/VolunteersTable.jsx";
import EventCalendar from "../components/Calendar.jsx";

import AdminParticipantsTable from "../components/event-dashboard/AdminParticipantsTable.jsx";
import AdminSurveyBuilder from "../components/event-dashboard/AdminSurveyBuilder.jsx";

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
  const theme = useMantineTheme();
  const {
    eventId,
    session,
    userProfile,
    profileLoading,
    loading,
    eventDetails,
    volunteers,
    hasAccess,
    tasks,
    resources,
    fetchVolunteers,
    fetchTasks,
    fetchResources,
  } = useEventDashboardData();
  const [announcements] = useState(DUMMY_ANNOUNCEMENTS);
  const [timeline] = useState(DUMMY_TIMELINE);

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
              {userProfile?.role !== "admin" && (
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

  // Check if ADMIN
  const isAdmin = userProfile?.role === "admin";
  const showRegistrationTabs = isAdmin;

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Event Header */}
        <div>
          <Title order={1} align="left">
            {eventDetails.event_title}
          </Title>
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

            {/* Participants Registration */}
            {showRegistrationTabs && (
              <>
                <Tabs.Tab
                  value="participants"
                  leftSection={<IconListCheck size={16} />}
                >
                  Participants Table
                </Tabs.Tab>
                <Tabs.Tab
                  value="survey"
                  leftSection={<IconFileAnalytics size={16} />}
                >
                  Participants Survey
                </Tabs.Tab>
              </>
            )}
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
              }}
              isAdmin={isAdmin}
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

          {/* registration */}
          {showRegistrationTabs && (
            <>
              <Tabs.Panel value="participants" pt="md">
                <AdminParticipantsTable eventId={eventId} />
              </Tabs.Panel>

              <Tabs.Panel value="survey" pt="md">
                <AdminSurveyBuilder eventId={eventId} />
              </Tabs.Panel>
            </>
          )}
        </Tabs>
      </Stack>
    </Container>
  );
}

export default EventDashboard;
