import {
  Stack,
  NavLink,
  Text,
  Avatar,
  Group,
  Divider,
  useMantineTheme,
  useMantineColorScheme,
  Button,
  ScrollArea,
  Select,
} from "@mantine/core";
import {
  IconHome,
  IconCalendar,
  IconUsers,
  IconBook,
  IconMessageCircle,
  IconSettings,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventStatus } from "../utils/eventStatus.js";
import { useUserProfile } from "../hooks/useUserProfile";
import { authClient } from "../auth.js";

function NavBar() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await authClient.getSession();
      setSession(session);
    };
    fetchSession();
  }, []);
  const { userProfile, loading: profileLoading } = useUserProfile();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const [needsVolunteerForm, setNeedsVolunteerForm] = useState(false);

  const [activeLink, setActiveLink] = useState();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState("upcoming");

  useEffect(() => {
    if (!session?.data?.user) return;

    if (session?.data?.user?.role === "admin") {
      fetchAllEvents();
    } else if (userProfile?.id) {
      fetchJoinedEvents();
    }
  }, [userProfile, session]);

  async function fetchJoinedEvents() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${userProfile.id}/joined-events`,
      );
      const data = await res.json();

      if (data.success) {
        setJoinedEvents(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch joined events:", err);
    }
  }

  async function fetchAllEvents() {
    try {
      const res = await fetch(
        "${import.meta.env.VITE_API_URL_BASE_URL}/api/events",
      );
      const data = await res.json();

      if (data.success) {
        // dynamic event status
        const eventsWithStatus = data.data.map((event) => ({
          ...event,
          dynamicStatus: getEventStatus(event.start_date, event.end_date),
        }));
        setAllEvents(eventsWithStatus);
      }
    } catch (err) {
      console.error("Failed to fetch all events:", err);
    }
  }

  const userEmail = session?.data?.user?.email || "";
  const userName = userProfile
    ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim()
    : "No Name";
  const userInitials =
    userProfile && userProfile.first_name && userProfile.last_name
      ? userProfile.first_name[0] + userProfile.last_name[0]
      : "";

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/auth");
  };

  // filter event status for admin
  const upcomingEvents = allEvents.filter(
    (e) => e.dynamicStatus === "upcoming",
  );
  const ongoingEvents = allEvents.filter((e) => e.dynamicStatus === "ongoing");

  // Get events based on filter
  const filteredEvents =
    eventFilter === "upcoming" ? upcomingEvents : ongoingEvents;

  return (
    <Stack
      gap={0}
      style={{
        width: 250,
        height: "100%",
        borderRight: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main Navigation */}
      <Stack gap={0} p="md" style={{ flex: 1, overflowY: "auto" }}>
        <NavLink
          label="Home"
          leftSection={<IconHome size={20} />}
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
        />
        <NavLink
          label="Events"
          leftSection={<IconCalendar size={20} />}
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/events");
          }}
        />
        <NavLink
          label="Committee"
          leftSection={<IconUsers size={20} />}
          color="primary"
        />

        <Divider my="md" />

        {session?.data?.user?.role === "admin" ? (
          <>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                Event Management
              </Text>
            </Group>

            <Select
              size="xs"
              value={eventFilter}
              onChange={setEventFilter}
              data={[
                {
                  value: "upcoming",
                  label: `Upcoming (${upcomingEvents.length})`,
                },
                {
                  value: "ongoing",
                  label: `Ongoing (${ongoingEvents.length})`,
                },
              ]}
              rightSection={<IconChevronDown size={14} />}
              mb="xs"
              styles={{
                input: {
                  fontSize: "0.85rem",
                },
              }}
            />

            <ScrollArea h={200} type="auto">
              <Stack gap="xs">
                {filteredEvents.length === 0 ? (
                  <Text size="xs" c="dimmed">
                    No {eventFilter} events
                  </Text>
                ) : (
                  filteredEvents
                    .slice(0, 10)
                    .map((event) => (
                      <NavLink
                        key={event.id}
                        label={event.event_title}
                        leftSection={<IconCalendar size={16} />}
                        onClick={() => navigate(`/events/${event.id}`)}
                        style={{ fontSize: "0.85rem" }}
                      />
                    ))
                )}
                {filteredEvents.length > 10 && (
                  <NavLink
                    label={`+${filteredEvents.length - 10} more`}
                    leftSection={<IconChevronRight size={16} />}
                    onClick={() => navigate("/events")}
                    c="dimmed"
                    style={{ fontSize: "0.85rem" }}
                  />
                )}
              </Stack>
            </ScrollArea>
          </>
        ) : (
          <>
            <Text size="xs" c="dimmed" fw={500} mb="xs" tt="uppercase">
              Joined Events
            </Text>

            {joinedEvents.length === 0 && (
              <Text size="xs" c="dimmed">
                No joined events
              </Text>
            )}

            {joinedEvents.slice(0, 3).map((event) => (
              <NavLink
                key={event.id}
                label={event.event_title}
                leftSection={<IconCalendar size={20} />}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}

            {joinedEvents.length > 3 && (
              <NavLink
                label="More"
                leftSection={<IconChevronRight size={20} />}
                onClick={() => navigate("/events")}
              />
            )}
          </>
        )}

        <Divider my="md" />

        <NavLink
          label="Resources"
          leftSection={<IconBook size={20} />}
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/resources");
          }}
        />
        <NavLink
          label="Feedback"
          leftSection={<IconMessageCircle size={20} />}
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/feedback");
          }}
        />
        <NavLink
          label="Settings"
          leftSection={<IconSettings size={20} />}
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/settings");
          }}
        />
      </Stack>

      {/* Volunteer Form Prompt */}
      {needsVolunteerForm && (
        <Group
          p="md"
          style={{
            borderTop: `1px solid ${
              colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
            }`,
          }}
        >
          <Button
            color="yellow"
            fullWidth
            onClick={() => navigate("/volunteer-form")}
          >
            Fill out personal data
          </Button>
        </Group>
      )}

      {/* User Profile at Bottom */}
      {session?.data?.user && (
        <>
          <Group
            p="md"
            style={{
              borderTop: `1px solid ${
                colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[3]
              }`,
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => navigate("/profile")}
          >
            <Avatar radius="xl" size="md" color="primary">
              {userInitials}
            </Avatar>
            <Stack gap={0} style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {userName}
              </Text>
              <Text size="xs" c="dimmed">
                {userEmail}
              </Text>
            </Stack>
            <IconChevronRight size={16} stroke={1.5} />
          </Group>
          <Button
            color="red"
            variant="light"
            fullWidth
            style={{
              borderTop: `1px solid ${
                colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[3]
              }`,
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      )}
    </Stack>
  );
}

export default NavBar;
