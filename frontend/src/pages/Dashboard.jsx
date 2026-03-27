import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  SimpleGrid,
  useMantineTheme,
  Anchor,
  Box,
} from "@mantine/core";
import {
  IconCalendar,
  IconUsers,
  IconClock,
  IconListCheck,
  IconClipboardCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import { Loader, useMantineColorScheme } from "@mantine/core";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventCalendar from "../components/Calendar.jsx";
import EventCard from "../components/EventCard.jsx";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { useUserProfile } from "../hooks/useUserProfile";
import { useSession } from "../hooks/useSession.js";
import { useUserStats } from "../hooks/useUserStats.js";
import { useUpcomingEvents } from "../hooks/useUpcomingEvents";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

const quotes = [
  "Volunteers do not necessarily have the time; they just have the heart.",
  "The best way to find yourself is to lose yourself in the service of others.",
  "We make a living by what we get, but we make a life by what we give.",
  "The smallest act of kindness is worth more than the grandest intention.",
  "Act as if what you do makes a difference. It does.",
];

function StatCard({ icon, value, label, color }) {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const Icon = icon;
  return (
    <Paper withBorder p="md" radius="md">
      <Group>
        <Icon
          size={32}
          color={
            theme.colors[color]?.[colorScheme === "dark" ? 4 : 6] ||
            theme.colors.gray[6]
          }
        />
        <div>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
          <Text size="xl" fw={700} align="left">
            {value}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

function Dashboard() {
  const theme = useMantineTheme();
  const { session, loading: isSessionLoading } = useSession();
  const navigate = useNavigate();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const {
    upcomingEvents,
    loading: loadingEvents,
    error: eventsError,
  } = useUpcomingEvents(userProfile);
  const {
    userStats,
    loading: loadingUserStats,
    error: userStatsError,
  } = useUserStats();

  const randomQuote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    [],
  );

  useEffect(() => {
    if (isSessionLoading) return;

    if (!session?.user) {
      navigate("/auth");
      return;
    }
  }, [session, isSessionLoading, navigate]);

  if (loadingEvents || profileLoading || isSessionLoading || loadingUserStats) {
    // add loading anim
    return (
      <Container
        size="xl"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Loader size="xl" />
      </Container>
    );
  }

  if (userProfile.role === "admin") {
    return <AdminDashboard userProfile={userProfile} />;
  }

  const stats = [
    {
      icon: IconUsers,
      value: userStats?.total_individuals_reached?.toLocaleString() || "0",
      label: "Individuals Reached",
      color: "primary",
    },
    {
      icon: IconClipboardCheck,
      value: userStats?.total_events_joined?.toLocaleString() || "0",
      label: "Events Joined",
      color: "blue",
    },
    {
      icon: IconCalendar,
      value: userStats?.ongoing_events_joined?.toLocaleString() || "0",
      label: "Currently Joined",
      color: "teal",
    },
    {
      icon: IconListCheck,
      value: userStats?.pending_tasks?.toLocaleString() || "0",
      label: "Pending Tasks",
      color: "yellow",
    },
    {
      icon: IconClock,
      value: `${(Number(userStats?.total_hours_volunteered) || 0).toFixed(1)}h`,
      label: "Total Hours",
      color: "green",
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Welcome Section */}
        <div>
          <Title order={2} align="left">
            Welcome Back, {userProfile.first_name}!
          </Title>
          <Text c="dimmed" align="left">
            "{randomQuote}"
          </Text>
        </div>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </SimpleGrid>

        {/* Upcoming Events */}
        <div>
          <Group justify="space-between" mb="md">
            <Title order={3}>Upcoming Events</Title>
            <Anchor component="button" onClick={() => navigate("/events")}>
              <Group gap="xs">
                <Text>View All</Text>
                <IconArrowRight size={16} />
              </Group>
            </Anchor>
          </Group>
          <Carousel
            slideSize={{
              base: "100%",
              sm: "50%",
              md: "calc(33.333% - var(--mantine-spacing-md))",
            }}
            slideGap="md"
            align="start"
            withControls={upcomingEvents.length > 3}
            withIndicators
            loop
          >
            {upcomingEvents.map((event) => (
              <Carousel.Slide key={event.id}>
                <EventCard event={event} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>

        {/* Calendar and Announcements */}
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          <Paper withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Calendar
            </Title>
            <Box style={{ minHeight: 300 }}>
              <EventCalendar markedDates={[]} />
            </Box>
          </Paper>
          <Paper withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Announcement
            </Title>
            <Stack>
              <Text c="dimmed">No new announcements.</Text>
              {/* placeholder */}
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

export default Dashboard;
