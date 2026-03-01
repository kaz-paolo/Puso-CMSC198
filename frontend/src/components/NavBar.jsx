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
} from "@mantine/core";
import {
  IconHome,
  IconCalendar,
  IconUsers,
  IconBook,
  IconMessageCircle,
  IconSettings,
  IconChevronRight,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStackApp, useUser } from "@stackframe/react";

function NavBar() {
  const stackApp = useStackApp();
  const user = useUser();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const [needsVolunteerForm, setNeedsVolunteerForm] = useState(false);

  const [activeLink, setActiveLink] = useState();
  const [userProfile, setUserProfile] = useState();

  const [joinedEvents, setJoinedEvents] = useState([]);

  // Check if user has answered volunteer form
  // useEffect(() => {
  //   async function checkVolunteerForm() {
  //     if (!user) {
  //       setNeedsVolunteerForm(false);
  //       return;
  //     }

  //   }
  //   checkVolunteerForm();
  // }, [user]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${user.id}/basic-info`,
        );
        const data = await res.json();
        console.log("navbar.jsx: fetch basic info");

        if (data.success) setUserProfile(data.data);
      } catch (err) {
        console.error("Network error:", err);
      }
    }

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    async function fetchJoinedEvents() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${userProfile.id}/joined-events`,
        );
        const data = await res.json();
        console.log(userProfile.id);

        console.log("navbar.jsx: fetch joined events");

        if (data.success) {
          setJoinedEvents(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch joined events:", err);
      }
    }

    fetchJoinedEvents();
  }, [userProfile]);

  const userEmail = user?.primaryEmail || "";
  const userName = userProfile
    ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim()
    : "No Name";
  const userInitials =
    userProfile && userProfile.first_name && userProfile.last_name
      ? userProfile.first_name[0] + userProfile.last_name[0]
      : "";

  const handleLogout = async () => {
    await stackApp.signOut();
    navigate("/auth");
  };

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
            // setActiveLink(link);
            navigate("/events");
          }}
        />
        <NavLink
          label="Committee"
          leftSection={<IconUsers size={20} />}
          color="primary"
        />

        <Divider my="md" />

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

        {/* <NavLink
          label="EventName"
          leftSection={<IconCalendar size={20} />}
          color="primary"
        />
        <NavLink
          label="EventName"
          leftSection={<IconCalendar size={20} />}
          color="primary"
        />
        <NavLink
          label="More"
          leftSection={<IconChevronRight size={20} />}
          color="primary"
        /> */}

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
      {user && (
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
