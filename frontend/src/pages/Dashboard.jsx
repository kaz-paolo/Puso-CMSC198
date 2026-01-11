import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  SimpleGrid,
  Badge,
  Divider,
  Button,
  useMantineTheme,
  Skeleton,
} from "@mantine/core";
import { IconCalendar, IconBell, IconActivity } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useUser } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import EventCalendar from "../components/Calendar";

function Home() {
  const theme = useMantineTheme();
  const user = useUser();
  const navigate = useNavigate();

  // Example infoData definition
  const infoData = [
    { label: "Total Volunteers", value: 120 },
    { label: "Upcoming Events", value: 4 },
    { label: "Active Committees", value: 7 },
    { label: "Hours Contributed", value: 320 },
  ];

  // Fetch events from backend
  const [eventCards, setEventCards] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // Fetch events from backend
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:3000/api/events");
        const data = await res.json();
        if (data.success) {
          // Only show upcoming events, sort by date, and limit to 3
          const upcoming = data.data
            .filter((e) => e.status === "upcoming")
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
          setEventCards(upcoming);
        }
      } catch (err) {
        console.error(err);
        setEventCards([]);
      }
    }
    fetchEvents();
  }, [user, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Example announcements definition
  const announcements = [
    {
      title: "Form Change Notice",
      date: "Feb 8, 2024",
      content: "The forms for registration has been changed.",
    },
    {
      title: "Volunteer Meeting",
      date: "Feb 9, 2024",
      content:
        "All volunteers are required to attend the pre-event meeting at 3 PM.",
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Top Row: Welcome and Quick Stats */}
        <Group align="flex-start" gap="xl">
          <Paper
            shadow="sm"
            radius="md"
            p="xl"
            style={{ flex: 2, minWidth: 0 }}
          >
            <Title order={2}>Welcome to PULSO</Title>
            <Text c="dimmed" mt="sm">
              Pahinungod Unified Lingkod System for Operations.
            </Text>
          </Paper>
          <Paper
            shadow="sm"
            radius="md"
            p="xl"
            style={{ flex: 1, minWidth: 0 }}
          >
            <Group gap="md" align="center" justify="center">
              <IconBell
                size={32}
                color={theme.colors.brand?.[6] || theme.primaryColor}
              />
              <Text fw={600} size="lg">
                Notifications
              </Text>
            </Group>
            <Divider my="sm" />
            <Text size="sm" c="dimmed">
              No new notifications.
            </Text>
          </Paper>
        </Group>

        {/* Info Data Cards */}
        <Group gap="md" grow>
          {infoData.map((info, idx) => (
            <Paper key={idx} shadow="xs" radius="md" p="md" withBorder>
              <Text size="xs" c="dimmed" fw={500} mb={4}>
                {info.label}
              </Text>
              <Text fw={700} size="xl">
                {info.value}
              </Text>
            </Paper>
          ))}
        </Group>

        {/* Main Grid: Events, Announcements, Calendar */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {/* Events Column */}
          <div
            style={{
              minHeight: 340,
              maxHeight: 500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text fw={600} size="md" mb={-8}>
              Upcoming Events
            </Text>
            <Stack gap="md" mt="sm" style={{ overflowY: "auto" }}>
              {eventCards.length === 0 ? (
                <Text c="dimmed" ta="center">
                  No upcoming events
                </Text>
              ) : (
                eventCards.map((event, idx) => (
                  <Paper
                    key={event.id || idx}
                    shadow="xs"
                    radius="md"
                    p="md"
                    withBorder
                    style={{
                      maxHeight: 140,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Group gap="xs">
                      <IconCalendar
                        size={18}
                        color={theme.colors.brand?.[6] || theme.primaryColor}
                      />
                      <Text fw={500}>{event.event_name}</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Button
                      mt="md"
                      size="xs"
                      variant="light"
                      color="brand"
                      fullWidth
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View Details
                    </Button>
                  </Paper>
                ))
              )}
            </Stack>
          </div>

          {/* Announcements Column */}
          <div
            style={{
              minHeight: 340,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text fw={600} size="md" mb={-8}>
              Announcements
            </Text>
            <Stack gap="md" mt="sm">
              {announcements.map((a, idx) => (
                <Paper key={idx} shadow="xs" radius="md" p="md" withBorder>
                  <Group gap="xs" mb={4}>
                    <Badge color="yellow" variant="light" size="sm">
                      Announcement
                    </Badge>
                    <Text fw={500}>{a.title}</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mb={4}>
                    {a.date}
                  </Text>
                  <Text size="sm">{a.content}</Text>
                </Paper>
              ))}
            </Stack>
          </div>

          {/* Calendar Column */}
          <div
            style={{
              minHeight: 340,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text fw={600} size="md" mb={-8}>
              Calendar
            </Text>
            <div style={{ flex: 1, marginTop: "1rem" }}>
              <EventCalendar markedDates={[]} compact />
            </div>
          </div>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

export default Home;
