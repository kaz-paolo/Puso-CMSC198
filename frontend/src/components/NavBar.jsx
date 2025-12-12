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
import { useStackApp } from "@stackframe/react";

function NavBar() {
  const stackApp = useStackApp();
  const user = stackApp.useUser();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const [needsVolunteerForm, setNeedsVolunteerForm] = useState(false);

  const [activeLink, setActiveLink] = useState();
  const [userProfile, setUserProfile] = useState();

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
      console.log("is it first");
      if (!user) return;

      try {
        const res = await fetch(
          `http://localhost:3000/api/users/basic-info/${user.id}`
        );
        const data = await res.json();

        if (data.success) setUserProfile(data.data);
      } catch (err) {
        console.error("Network error:", err);
      }
    }

    fetchProfile();
  }, [user]);

  const userEmail = user?.primaryEmail || "";
  const userName = userProfile?.full_name || "No Name";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

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
          color="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
        />
        <NavLink
          label="Events"
          leftSection={<IconCalendar size={20} />}
          color="brand"
          onClick={(e) => {
            e.preventDefault();
            // setActiveLink(link);
            navigate("/events");
          }}
        />
        <NavLink
          label="Committee"
          leftSection={<IconUsers size={20} />}
          color="brand"
        />

        <Divider my="md" />

        <Text size="xs" c="dimmed" fw={500} mb="xs" tt="uppercase">
          Your Workspaces
        </Text>

        <NavLink
          label="EventName One"
          leftSection={<IconCalendar size={20} />}
          color="brand"
        />
        <NavLink
          label="Another Event"
          leftSection={<IconCalendar size={20} />}
          color="brand"
        />
        <NavLink
          label="More"
          leftSection={<IconChevronRight size={20} />}
          color="brand"
        />

        <Divider my="md" />

        <NavLink
          label="Resources"
          leftSection={<IconBook size={20} />}
          color="brand"
        />
        <NavLink
          label="Feedback"
          leftSection={<IconMessageCircle size={20} />}
          color="brand"
        />
        <NavLink
          label="Settings"
          leftSection={<IconSettings size={20} />}
          color="brand"
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
        >
          <Avatar radius="xl" size="md" color="brand">
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
      )}
    </Stack>
  );
}

export default NavBar;
