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
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import EventCard from "../components/EventCard";
import AddEventModal from "../components/modal/AddEventModal";
import { useUser } from "@stackframe/react";

function Events() {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [addEventOpened, setAddEventOpened] = useState(false);
  const [events, setEvents] = useState([]);
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${user.id}/basic-info`,
        );
        const data = await res.json();
        console.log("events.jsx: fetch basic info");

        if (data.success) setUserProfile(data.data);
      } catch (err) {
        console.error("Network error:", err);
      }
    }

    fetchProfile();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/events`);
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filterEvents = (events, tab) => {
    let filtered = events;

    if (tab !== "all") {
      filtered = filtered.filter((event) => event.status === tab);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const filteredEvents = filterEvents(events, activeTab);

  // function to add event to databse

  return (
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
          {userProfile?.role === "admin" && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setAddEventOpened(true)}
            >
              Create Event
            </Button>
          )}
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
      {/* Add Event Modal */}
      <AddEventModal
        opened={addEventOpened}
        onClose={() => setAddEventOpened(false)}
        onEventCreated={fetchEvents}
      />
    </Container>
  );
}

export default Events;
