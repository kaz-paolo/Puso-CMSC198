import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  useMantineTheme,
  useMantineColorScheme,
  Paper,
  Group,
  Loader,
  Center,
} from '@mantine/core';
import { IconUsers, IconClipboardList, IconClipboardCheck } from '@tabler/icons-react';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { ThemeSettings } from '../components/ThemeSettings';
import AnnouncementResourcesReminders from '../components/AnnouncementResourcesReminders';
import EventCalendar from '../components/Calendar';
import VolunteerList from '../components/VolunteerList';
import TasksList from '../components/TasksList';
import EventInfo from '../components/EventInfo';

// PLACEHOLDER
const PLACEHOLDER_DATA = {
  eventDetails: {
    name: 'Community Outreach Program 2024',
    date: '2024-02-15',
    time: '09:00 AM',
    location: 'Miagao Town Plaza',
    status: 'ongoing',
    description: 'A community outreach program to provide assistance to families in need.',
    volunteerCount: 45,
  },
  volunteers: [
    { id: 1, name: 'Juan Dela Cruz', committee: 'Logistics', batch: 1 },
    { id: 2, name: 'Maria Santos', committee: 'Documentation', batch: 2 },
    { id: 3, name: 'Pedro Garcia', committee: 'Finance', batch: 5 },
    { id: 4, name: 'Ana Lopez', committee: 'Publicity', batch: 4 },
    { id: 5, name: 'Jose Reyes', committee: 'Logistics', batch: 3 },
  ],
  markedDates: [
    { date: '2024-02-10', type: 'deadline', title: 'Submit Budget' },
    { date: '2024-02-15', type: 'event', title: 'Event Day' },
    { date: '2024-02-20', type: 'deadline', title: 'Post-Event Report' },
  ],
  assignedTasks: [
    {
      id: 1,
      title: 'Prepare Event Materials',
      description: 'Gather all necessary materials for the outreach program including flyers, forms, and supplies.',
      deadline: '2024-02-12',
      priority: 'high',
      assignedTo: 'You',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Coordinate with Local Officials',
      description: 'Meet with barangay officials to finalize event logistics.',
      deadline: '2024-02-13',
      priority: 'medium',
      assignedTo: 'You',
      status: 'pending',
    },
  ],
  pendingTasks: [
    {
      id: 3,
      title: 'Finalize Budget Report',
      description: 'Complete the budget report with all expenses documented.',
      deadline: '2024-02-14',
      priority: 'high',
      assignedTo: 'Finance Committee',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Social Media Posts',
      description: 'Create and schedule social media posts for event promotion.',
      deadline: '2024-02-11',
      priority: 'medium',
      assignedTo: 'Publicity Committee',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Update Volunteer List',
      description: 'Verify and update the final list of volunteers.',
      deadline: '2024-02-10',
      priority: 'low',
      assignedTo: 'Logistics Committee',
      status: 'pending',
    },
  ],
  announcements: [
    {
      id: 1,
      title: 'Venue Change Notice',
      content: 'The event venue has been moved to the covered court due to weather concerns.',
      date: '2024-02-08',
      pinned: true,
    },
    {
      id: 2,
      title: 'Volunteer Meeting Tomorrow',
      content: 'All volunteers are required to attend the pre-event meeting at 3 PM.',
      date: '2024-02-09',
      pinned: false,
    },
  ],
  resources: [
    {
      id: 1,
      title: 'Event Guidelines Document',
      url: 'https://website.com/guidelines',
      description: 'Complete guidelines and protocols for the event',
    },
    {
      id: 2,
      title: 'Budget Template',
      url: 'https://website.com/budget',
      description: 'Template for budget reporting',
    },
    {
      id: 3,
      title: 'Emergency Contacts',
      url: 'https://website.com/contacts',
      description: 'List of emergency contacts and hotlines',
    },
  ],
  reminders: [
    {
      id: 1,
      message: 'Submit attendance confirmation by Feb 10',
      date: '2024-02-10',
    },
    {
      id: 2,
      message: 'Wear volunteer shirt on event day',
      date: '2024-02-15',
    },
  ],
};

function EventDashboard() {
  const { eventId } = useParams();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [themeOpened, setThemeOpened] = useState(false);
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
  }, [eventId]);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // TODO: Backend Database

      // PLACEHOLDER
      setEventDetails(PLACEHOLDER_DATA.eventDetails);
      setVolunteers(PLACEHOLDER_DATA.volunteers);
      setMarkedDates(PLACEHOLDER_DATA.markedDates);
      setAssignedTasks(PLACEHOLDER_DATA.assignedTasks);
      setPendingTasks(PLACEHOLDER_DATA.pendingTasks);
      setAnnouncements(PLACEHOLDER_DATA.announcements);
      setResources(PLACEHOLDER_DATA.resources);
      setReminders(PLACEHOLDER_DATA.reminders);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!eventDetails) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Text>Event not found</Text>
      </Center>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Header onThemeClick={() => setThemeOpened(true)} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <NavBar />

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '2rem',
            backgroundColor:
              colorScheme === 'dark'
                ? theme.colors.dark[7]
                : theme.colors.gray[0],
          }}
        >
          <ThemeSettings
            opened={themeOpened}
            onClose={() => setThemeOpened(false)}
          />

          <Container size="xl">
            <Stack gap="xl">

              {/* Event Info at the top */}
              <EventInfo event={eventDetails} />

              {/* Main grid - 5 columns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1rem',
                alignItems: 'start',
              }}>
                {/* Column 1: Members */}
                <Stack gap="lg">
                  <Paper shadow="sm" p="md" withBorder>
                    <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>MEMBERS</Title>
                    <Stack gap="md">
                      <Paper p="sm" withBorder>
                        <Group gap="sm" wrap="nowrap">
                          <IconUsers size={24} color={theme.colors.brand[6]} />
                          <div style={{ flex: 1 }}>
                            <Text size="xs" c="dimmed">Total Volunteers</Text>
                          </div>
                          <Text size="xl" fw={700}>{volunteers.length}</Text>
                        </Group>
                      </Paper>
                      <VolunteerList volunteers={volunteers} compact />
                    </Stack>
                  </Paper>
                </Stack>

                {/* Column 2: Calendar */}
                <Stack gap="lg">
                  <Paper shadow="sm" p="md" withBorder>
                    <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>CALENDAR</Title>
                    <EventCalendar markedDates={markedDates} compact />
                  </Paper>
                </Stack>

                {/* Column 3: Assigned Tasks */}
                <Stack gap="lg">
                  <Paper shadow="sm" p="md" withBorder>
                    <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>ASSIGNED</Title>
                    <Stack gap="md">
                      <Paper p="sm" withBorder>
                        <Group gap="sm" wrap="nowrap">
                          <IconClipboardCheck size={24} color={theme.colors.brand[6]} />
                          <div style={{ flex: 1 }}>
                            <Text size="xs" c="dimmed">Assigned Tasks</Text>
                            <Text size="lg" fw={700}>{assignedTasks.length}</Text>
                          </div>
                        </Group>
                      </Paper>
                      <TasksList assignedTasks={assignedTasks} pendingTasks={[]} compact showAssigned />
                    </Stack>
                  </Paper>
                </Stack>

                {/* Column 4: Pending Tasks */}
                <Stack gap="lg">
                  <Paper shadow="sm" p="md" withBorder>
                    <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>PENDING</Title>
                    <Stack gap="md">
                      <Paper p="sm" withBorder>
                        <Group gap="sm" wrap="nowrap">
                          <IconClipboardList size={24} color={theme.colors.brand[6]} />
                          <div style={{ flex: 1 }}>
                            <Text size="xs" c="dimmed">Pending Tasks</Text>
                            <Text size="lg" fw={700}>{pendingTasks.length}</Text>
                          </div>
                        </Group>
                      </Paper>
                      <TasksList assignedTasks={[]} pendingTasks={pendingTasks} compact showPending />
                    </Stack>
                  </Paper>
                </Stack>

                {/* Column 5: Announcements */}
                <Stack gap="lg">
                  <Paper shadow="sm" p="md" withBorder>
                    <Title order={5} mb="md" ta="center" c={theme.colors.brand[6]}>ANNOUNCEMENTS</Title>
                    <AnnouncementResourcesReminders
                      announcements={announcements}
                      resources={resources}
                      reminders={reminders}
                      compact
                    />
                  </Paper>
                </Stack>
              </div>
            </Stack>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default EventDashboard;