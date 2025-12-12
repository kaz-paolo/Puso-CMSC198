import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Tabs,
  Group,
  TextInput,
  Button,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { ThemeSettings } from "../components/ThemeSettings";
import EventCard from "../components/EventCard";
import AddEventModal from "../components/modal/AddEventModal";

function Events() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [themeOpened, setThemeOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [addEventOpened, setAddEventOpened] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error:", err);
      }
    }

    fetchEvents();
  }, []);

  // TODO: Replace with actual API call to fetch events from database
  // Example: useEffect(() => { fetch('/api/events').then(res => res.json()).then(setEvents) }, [])
  // const sampleEvents = [
  //   {
  //     id: 1,
  //     event_name: "Community Outreach Program",
  //     description:
  //       "Join us in this meaningful community outreach program where we will distribute goods and provide assistance to families in need.",
  //     date: "2024-02-15",
  //     time: "09:00 AM",
  //     location: "Miagao Town Plaza",
  //     volunteerCount: 5,
  //     status: "upcoming",
  //   },
  //   {
  //     id: 3,
  //     event_name: "Tree Planting Activity",
  //     description:
  //       "Help us plant trees and contribute to environmental conservation. We will be planting native species across the campus grounds.",
  //     date: "2024-01-30",
  //     time: "07:00 AM",
  //     location: "UP Visayas Campus",
  //     volunteerCount: 30,
  //     status: "completed",
  //   },
  //   {
  //     id: 4,
  //     event_name: "Educational Workshop",
  //     description:
  //       "An interactive workshop focused on teaching basic computer literacy and digital skills to community members of all ages.",
  //     date: "2024-02-10",
  //     time: "02:00 PM",
  //     location: "UPV CAS Building",
  //     volunteerCount: 20,
  //     status: "ongoing",
  //   },
  //   {
  //     id: 5,
  //     event_name: "Educational Workshop",
  //     description:
  //       "An interactive workshop focused on teaching basic computer literacy and digital skills to community members of all ages.",
  //     date: "2024-02-10",
  //     time: "02:00 PM",
  //     location: "UPV CAS Building",
  //     volunteerCount: 20,
  //     status: "ongoing",
  //   },
  // ];

  const filterEvents = (events, tab) => {
    let filtered = events;

    if (tab !== "all") {
      filtered = filtered.filter((event) => event.status === tab);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredEvents = filterEvents(sampleEvents, activeTab);

  // function to add event to databse

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Header onThemeClick={() => setThemeOpened(true)} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <NavBar />

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "2rem",
            backgroundColor:
              colorScheme === "dark"
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
              {/* Header Section */}
              <Group justify="space-between">
                <div>
                  <Title order={1}>Events</Title>
                  <Text c="dimmed" size="sm">
                    Browse and register for volunteer events
                  </Text>
                </div>
                <Button
                  leftSection={<IconPlus size={18} />}
                  onClick={() => setAddEventOpened(true)}
                >
                  Create Event
                </Button>
              </Group>

              {/* Search Bar */}
              <TextInput
                placeholder="Search events by name, location, or description..."
                leftSection={<IconSearch size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="md"
              />

              {/* Tabs for filtering */}
              <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                  <Tabs.Tab value="all">All Events</Tabs.Tab>
                  <Tabs.Tab value="upcoming">Upcoming</Tabs.Tab>
                  <Tabs.Tab value="ongoing">Ongoing</Tabs.Tab>
                  <Tabs.Tab value="completed">Completed</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={activeTab} pt="xl">
                  {filteredEvents.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">
                      No events found
                    </Text>
                  ) : (
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                      {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </SimpleGrid>
                  )}
                </Tabs.Panel>
              </Tabs>
            </Stack>
          </Container>
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        opened={addEventOpened}
        onClose={() => setAddEventOpened(false)}
      />
    </div>
  );
}

export default Events;
