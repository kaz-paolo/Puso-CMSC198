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
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventCalendar from "../components/Calendar.jsx";
import EventCard from "../components/EventCard.jsx";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { useUserProfile } from "../hooks/useUserProfile";
import { useSession } from "../hooks/useSession.js";
import { useUpcomingEvents } from "../hooks/useUpcomingEvents";

const quotes = [
  "Volunteers do not necessarily have the time; they just have the heart.",
  "The best way to find yourself is to lose yourself in the service of others.",
  "We make a living by what we get, but we make a life by what we give.",
  "The smallest act of kindness is worth more than the grandest intention.",
  "Act as if what you do makes a difference. It does.",
];

function StatCard({ icon, value, label, color }) {
  const theme = useMantineTheme();
  const Icon = icon;
  return (
    <Paper withBorder p="md" radius="md">
      <Group>
        <Icon
          size={32}
          color={theme.colors[color]?.[6] || theme.colors.gray[6]}
        />
        <div>
          <Text size="xl" fw={700}>
            {value}
          </Text>
          <Text size="xs" c="dimmed">
            {label}
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
  const { upcomingEvents, loading, error } = useUpcomingEvents(userProfile);

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

  if (loading || profileLoading || !userProfile || isSessionLoading) {
    // add loading anim
    return null;
  }

  const stats = [
    {
      icon: IconUsers,
      value: "310",
      label: "Individuals Reached",
      color: "primary",
    },
    {
      icon: IconClipboardCheck,
      value: "8",
      label: "Events Joined",
      color: "blue",
    },
    {
      icon: IconCalendar,
      value: "2",
      label: "Currently Joined",
      color: "teal",
    },
    { icon: IconClock, value: "124h", label: "Total Hours", color: "green" },
    {
      icon: IconListCheck,
      value: "3",
      label: "Pending Tasks",
      color: "yellow",
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Welcome Section */}
        <div>
          <Title order={2}>Welcome Back, {userProfile.first_name}!</Title>
          <Text c="dimmed">"{randomQuote}"</Text>
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
