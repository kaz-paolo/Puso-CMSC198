import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Group,
  TextInput,
  Button,
  Badge,
  Menu,
  ActionIcon,
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconClock,
  IconCalendar,
  IconCategory,
} from "@tabler/icons-react";
import EventCard from "../components/EventCard";
import AddEventModal from "../components/modal/AddEventModal";
import { useUser } from "@stackframe/react";

function Events() {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [dateFilterType, setDateFilterType] = useState(null);
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

  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setDateFilterType(null);
  };

  const getDateRange = (filterType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filterType) {
      case "today":
        return {
          start: today,
          end: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1,
          ),
        };
      case "week": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return { start: startOfWeek, end: endOfWeek };
      }
      case "month": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1,
        );
        return { start: startOfMonth, end: endOfMonth };
      }
      case "year": {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
        return { start: startOfYear, end: endOfYear };
      }
      default:
        return null;
    }
  };

  const isDateInRange = (eventDate, filterType) => {
    if (!filterType) return true;

    const event = new Date(eventDate);
    const range = getDateRange(filterType);
    if (!range) return true;

    return event >= range.start && event < range.end;
  };

  const filterEvents = (events) => {
    let filtered = events;

    // by default hide completed events
    if (statusFilter.length === 0) {
      filtered = filtered.filter((event) => event.status !== "completed");
    } else {
      // status filter
      filtered = filtered.filter((event) =>
        statusFilter.includes(event.status),
      );
    }

    // date filter
    if (dateFilterType) {
      filtered = filtered.filter((event) =>
        isDateInRange(event.date, dateFilterType),
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // upcoming events first, ascending
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    return filtered;
  };

  const filteredEvents = filterEvents(events);

  const statusColors = {
    ongoing: "green",
    upcoming: "blue",
    completed: "gray",
  };

  const getDateFilterLabel = () => {
    if (!dateFilterType) return "Date";

    switch (dateFilterType) {
      case "today":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      default:
        return "Date";
    }
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Header Section */}
        <Stack gap={4} align="flex-start">
          <Title order={1}>Events</Title>
          <Text c="dimmed" size="sm">
            Be part of events that inspire action and strengthen communities.
          </Text>
        </Stack>

        {/* Search and Filter Bar */}
        <Group gap="md" align="flex-end">
          <TextInput
            placeholder="Search for events..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 400, maxWidth: "100%" }}
          />

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="default" leftSection={<IconClock size={16} />}>
                Status
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => toggleStatusFilter("ongoing")}>
                <Group justify="space-between">
                  Ongoing
                  {statusFilter.includes("ongoing") && "✓"}
                </Group>
              </Menu.Item>
              <Menu.Item onClick={() => toggleStatusFilter("upcoming")}>
                <Group justify="space-between">
                  Upcoming
                  {statusFilter.includes("upcoming") && "✓"}
                </Group>
              </Menu.Item>
              <Menu.Item onClick={() => toggleStatusFilter("completed")}>
                <Group justify="space-between">
                  Completed
                  {statusFilter.includes("completed") && "✓"}
                </Group>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Menu shadow="md" width={150}>
            <Menu.Target>
              <Button
                variant="default"
                leftSection={<IconCalendar size={16} />}
              >
                {getDateFilterLabel()}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setDateFilterType("today")}>
                <Group justify="space-between">
                  Today
                  {dateFilterType === "today" && "✓"}
                </Group>
              </Menu.Item>
              <Menu.Item onClick={() => setDateFilterType("week")}>
                <Group justify="space-between">
                  This Week
                  {dateFilterType === "week" && "✓"}
                </Group>
              </Menu.Item>
              <Menu.Item onClick={() => setDateFilterType("month")}>
                <Group justify="space-between">
                  This Month
                  {dateFilterType === "month" && "✓"}
                </Group>
              </Menu.Item>
              <Menu.Item onClick={() => setDateFilterType("year")}>
                <Group justify="space-between">
                  This Year
                  {dateFilterType === "year" && "✓"}
                </Group>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Button variant="default" leftSection={<IconCategory size={16} />}>
            Type
          </Button>

          {userProfile?.role === "admin" && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setAddEventOpened(true)}
            >
              Create Event
            </Button>
          )}
        </Group>

        {/* Active Filters */}
        {(statusFilter.length > 0 || dateFilterType) && (
          <Group gap="xs">
            {statusFilter.map((status) => (
              <Badge
                key={status}
                variant="light"
                color={statusColors[status]}
                rightSection={
                  <ActionIcon
                    size="xs"
                    variant="transparent"
                    onClick={() => toggleStatusFilter(status)}
                  >
                    ×
                  </ActionIcon>
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            ))}
            {dateFilterType && (
              <Badge
                variant="light"
                color="blue"
                rightSection={
                  <ActionIcon
                    size="xs"
                    variant="transparent"
                    onClick={() => setDateFilterType(null)}
                  >
                    ×
                  </ActionIcon>
                }
              >
                {getDateFilterLabel()}
              </Badge>
            )}
            <Button variant="subtle" size="xs" onClick={clearFilters}>
              Clear all
            </Button>
          </Group>
        )}

        {/* Results Count */}
        <Text size="sm" c="dimmed" align="left">
          Showing {filteredEvents.length} out of {events.length} results
        </Text>

        {/* Events Grid */}
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
