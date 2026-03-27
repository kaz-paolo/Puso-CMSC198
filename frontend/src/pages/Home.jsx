import { useState, useEffect } from "react";
import { ThemeSettings } from "../components/ThemeSettings";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Box,
  rem,
  Loader,
  Grid,
  Paper,
  SimpleGrid,
  Card,
  Badge,
  Image,
  TextInput,
  ActionIcon,
  Avatar,
  Anchor,
  useMantineTheme,
  useMantineColorScheme,
  rgba,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Link } from "react-router-dom";
import {
  IconCalendar,
  IconUsers,
  IconActivity,
  IconTarget,
  IconArrowRight,
  IconMail,
  IconPhone,
  IconMapPin,
  IconPalette,
  IconHeartHandshake,
} from "@tabler/icons-react";

import { useSession } from "../hooks/useSession";
import heroBg from "../assets/hero-image.png";
import event1 from "../assets/hero-image.png";

const mockEvents = [
  {
    category: "MEDICAL MISSION",
    title: "Barangay San Jose Outreach",
    description:
      "Join us for a day of medical service. We need medical students, logistics volunteers, and friendly faces to assi...",
    date: "OCT 24",
    image: event1,
  },
  {
    category: "ENVIRONMENTAL",
    title: "River Cleanup Drive",
    description:
      "Help us restore the beauty of Pasig River! We need volunteers for trash collection, sorting, and awareness...",
    date: "NOV 05",
    image: event1,
  },
  {
    category: "EDUCATION",
    title: "Kids' Reading Program",
    description:
      "Help foster a love for reading! We need tutors and activity facilitators for our weekly session with elementary...",
    date: "NOV 18",
    image: event1,
  },
  {
    category: "COMMUNITY AID",
    title: "Holiday Food Drive",
    description:
      "Spread cheer this holiday season! We need volunteers to pack and distribute food baskets to families in need.",
    date: "DEC 02",
    image: event1,
  },
];

function Header({ onThemeClick }) {
  const [scroll] = useWindowScroll();
  const [scrolled, setScrolled] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  useEffect(() => {
    setScrolled(scroll.y > 60);
  }, [scroll]);

  return (
    <Box
      component="header"
      h={rem(60)}
      px="xl"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled
          ? colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.white
          : "transparent",
        backdropFilter: "none",
        borderBottom: scrolled
          ? `${rem(1)} solid ${
              colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
            }`
          : "none",
        transition: "background-color 0.3s ease, border-bottom 0.3s ease",
      }}
    >
      <Group justify="space-between" style={{ height: "100%" }}>
        <Text
          size="xl"
          fw={700}
          c={colorScheme === "dark" || !scrolled ? theme.white : theme.black}
          style={{
            fontFamily: "Inter, sans-serif",
            transition: "color 0.3s ease",
          }}
        >
          PULSO
        </Text>
        <Group>
          <Button component={Link} to="/auth" variant="filled" radius="md">
            Volunteer Login
          </Button>
          <ActionIcon
            variant="default"
            onClick={onThemeClick}
            size="lg"
            radius="md"
          >
            <IconPalette size={20} />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
}

function Footer() {
  const theme = useMantineTheme();
  return (
    <Box bg={theme.colors.dark[9]} c={theme.white} py={rem(60)} px="xl">
      <Container size="lg">
        <Grid ta={"start"} justify="center">
          <Grid.Col span={5}>
            <Group wrap="nowrap" gap="xs">
              <IconHeartHandshake size={32} />
              <Title order={3}>PULSO</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md" maw={300}>
              The Pahinungod Unified Lingkod System for Operations. Dedicated to
              fostering a culture of volunteerism and service within the
              university.
            </Text>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Title order={5} c="white">
              QUICK LINKS
            </Title>
            <Stack gap="xs" mt="md">
              <Anchor c="dimmed" href="#">
                About Pahinungod
              </Anchor>
              <Anchor c="dimmed" href="#">
                Upcoming Events
              </Anchor>
              <Anchor c="dimmed" href="#">
                Volunteer Stories
              </Anchor>
              <Anchor c="dimmed" href="#">
                Partner With Us
              </Anchor>
            </Stack>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Title order={5} c="white">
              CONTACT
            </Title>
            <Stack gap="sm" mt="md">
              <Group wrap="nowrap" gap="xs">
                <IconMapPin size={16} />
                <Text size="sm" c="dimmed">
                  University of the Philippines Visayas, Miagao, Iloilo
                </Text>
              </Group>
              <Group wrap="nowrap" gap="xs">
                <IconPhone size={16} />
                <Text size="sm" c="dimmed">
                  (02) 8981-8500
                </Text>
              </Group>
              <Group wrap="nowrap" gap="xs">
                <IconMail size={16} />
                <Text size="sm" c="dimmed">
                  email@email.com
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
        <Group
          justify="space-between"
          mt={rem(60)}
          pt="md"
          style={{ borderTop: `1px solid ${theme.colors.dark[4]}` }}
        >
          <Text c="dimmed" size="xs">
            © 2026 PULSO. All rights reserved.
          </Text>
          <Group gap="sm">
            <Anchor c="dimmed" size="xs">
              Privacy Policy
            </Anchor>
            <Anchor c="dimmed" size="xs">
              Terms of Service
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

export default function Home() {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [themeOpened, setThemeOpened] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchDashboardStats() {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/dashboard-stats`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardStats(data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Optionally set an error state to display an error message
      } finally {
        setLoading(false);
      }
    }

    async function fetchEvents() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL_BASE_URL}/api/events`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }

    fetchDashboardStats();
    fetchEvents();
  }, [session]);

  return (
    <Box
      style={{
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      }}
    >
      <Header onThemeClick={() => setThemeOpened(true)} />
      <ThemeSettings
        opened={themeOpened}
        onClose={() => setThemeOpened(false)}
      />
      {/* Hero Section */}
      <Box
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
        }}
        pt={rem(180)}
        pb={rem(120)}
      >
        <Container size="md">
          <Title order={1} style={{ fontSize: rem(56), lineHeight: 1.1 }}>
            Welcome to PULSO
          </Title>
          <Text size="lg" mt="xl" maw={600} mx="auto">
            UPV Ugnayan ng Pahinungod Unified Lingkod System for Operations
          </Text>
          <Group justify="center" mt={rem(40)} gap="md">
            <Button size="lg" leftSection={<IconCalendar size={20} />}>
              View all Events
            </Button>
            <Button
              size="lg"
              variant="outline"
              color="gray"
              leftSection={<IconUsers size={20} />}
            >
              Partner with Us
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container
        size="lg"
        style={{ marginTop: rem(-60), position: "relative" }}
      >
        {loading ? (
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "20vh",
            }}
          >
            <Loader size="sm" />
          </Container>
        ) : (
          <Paper shadow="md" p="xl" radius="md">
            <Grid align="center">
              <Grid.Col span={4}>
                <Group justify="center" gap="sm">
                  <IconActivity color={theme.colors.primary[6]} size={32} />
                  <div>
                    <Text size="xs" c="dimmed">
                      TOTAL IMPACT
                    </Text>
                    <Text fw={700} size={rem(28)}>
                      {dashboardStats?.totalImpactHours !== undefined &&
                      dashboardStats.totalImpactHours !== null
                        ? `${Number(dashboardStats.totalImpactHours).toFixed(0)}+`
                        : "0+"}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Hours Served
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
              <Grid.Col span={4}>
                <Group justify="center" gap="sm">
                  <IconTarget color={theme.colors.primary[6]} size={32} />
                  <div>
                    <Text size="xs" c="dimmed">
                      REACH
                    </Text>
                    <Text fw={700} size={rem(28)}>
                      {dashboardStats?.partnerCommunities
                        ? `${dashboardStats.partnerCommunities}+`
                        : "0+"}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Partner Communities
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
              <Grid.Col span={4}>
                <Group justify="center" gap="sm">
                  <IconUsers color={theme.colors.primary[6]} size={32} />
                  <div>
                    <Text size="xs" c="dimmed">
                      FORCE
                    </Text>
                    <Text fw={700} size={rem(28)}>
                      {dashboardStats?.totalVolunteers
                        ? `${dashboardStats.totalVolunteers}+`
                        : "0+"}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Active Student Volunteers
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
            </Grid>
          </Paper>
        )}
      </Container>

      {/* Highlights and News Section */}
      <Container size="xl" py={rem(100)}>
        <Title order={2} ta="center" mb="sm">
          Highlights and News
        </Title>
        <Text c="dimmed" ta="center" mb={rem(40)}>
          Enter another sentence about this chuchuchu.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {events.map((event) => (
            <Card
              key={event.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Card.Section>
                <Image
                  src={event.image || heroBg}
                  height={160}
                  alt={event.event_title}
                />
              </Card.Section>
              <Badge
                color="yellow"
                variant="filled"
                style={{
                  position: "absolute",
                  top: rem(10),
                  right: rem(10),
                }}
              >
                {event.start_date}
              </Badge>
              <Text fw={500} size="xs" c="primary" mt="md">
                {event.event_type}
              </Text>
              <Text fw={600} size="lg" mt="xs">
                {event.event_title}
              </Text>
              <Text size="sm" c="dimmed" mt="sm" lineClamp={3}>
                {event.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
        <Group justify="center" mt={rem(40)}>
          <Button
            variant="outline"
            color="gray"
            size="md"
            rightSection={<IconArrowRight size={18} />}
          >
            View All
          </Button>
        </Group>
      </Container>

      {/* Volunteer Stories & Donations */}
      <Box
        bg={colorScheme === "dark" ? theme.colors.dark[7] : theme.white}
        py={rem(100)}
      >
        <Container size="xl">
          <Title order={2} ta="center" mb={rem(40)}>
            Our Volunteer Stories
          </Title>
          <Grid gutter="xl" align="stretch">
            <Grid.Col span={7}>
              <Paper withBorder p="xl" radius="md" style={{ height: "100%" }}>
                <Group align="flex-start">
                  <Avatar size={120} radius="md" />
                  <Box style={{ flex: 1 }}>
                    <Text c="dimmed" size="sm">
                      VOLUNTEER TESTIMONIAL
                    </Text>
                    <Text size="xl" mt="sm" fw={500}>
                      "Volunteering with Pahinungod changed my perspective on
                      service. It's not just about helping; it's about learning
                      from the community."
                    </Text>
                    <Text fw={600} mt="lg">
                      Joseph Estephan
                    </Text>
                    <Text size="sm" c="dimmed">
                      Student Volunteer • BS in Public Health
                    </Text>
                  </Box>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={5}>
              <Paper
                p="xl"
                radius="md"
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? rgba(theme.colors.yellow[8], 0.2)
                      : theme.colors.yellow[0],
                  height: "100%",
                }}
              >
                <Title order={3}>Call for Donations</Title>
                <Text mt="sm" size="sm">
                  We are currently collecting school supplies for the upcoming
                  "Balik Eskwela" drive in Iloilo. Your contribution can help
                  200+ students start the year right.
                </Text>

                <Button fullWidth mt="xl" color="dark" size="md">
                  Donate Now
                </Button>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Stay Updated Section */}
      <Box bg={theme.colors.dark[8]} c={theme.white} py={rem(80)} ta="center">
        <Container size="sm">
          <Title order={2}>Stay Updated with PULSO</Title>
          <Text c="dimmed" mt="sm">
            Get the latest stories, event announcements, and volunteer
            opportunities delivered to your inbox.
          </Text>
          <Group justify="center" mt={rem(40)}>
            <TextInput
              placeholder="Enter your email address"
              size="lg"
              style={{ flex: 1 }}
            />
            <Button size="lg" color="yellow" c="black">
              Subscribe
            </Button>
          </Group>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
