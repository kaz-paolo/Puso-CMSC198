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
// import { db, auth } from '../../firebase/firebase';
// import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function NavBar() {
  // const userEmail = auth.currentUser?.email || '';
  // const userName = auth.currentUser?.displayName || 'No Name';
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const [needsVolunteerForm, setNeedsVolunteerForm] = useState(false);

  // Check if user has answered volunteer form
  // useEffect(() => {
  //   async function checkVolunteerForm() {
  //     const user = auth.currentUser;
  //     if (!user) {
  //       setNeedsVolunteerForm(false);
  //       return;
  //     }
  //     const docRef = doc(db, 'volunteerForms', user.uid);
  //     const docSnap = await getDoc(docRef);
  //     setNeedsVolunteerForm(!docSnap.exists());
  //   }
  //   checkVolunteerForm();
  // }, [userEmail]);

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
        />
        <NavLink
          label="Events"
          leftSection={<IconCalendar size={20} />}
          color="brand"
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
      <Group
        p="md"
        style={{
          borderTop: `1px solid ${
            colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
          }`,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Avatar radius="xl" size="md" color="brand">
          {"testaccount"}
        </Avatar>
        <Stack gap={0} style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {"Lester Magnolia"}
          </Text>
          <Text size="xs" c="dimmed">
            {"lala@gmail.com"}
          </Text>
        </Stack>
        <IconChevronRight size={16} stroke={1.5} />
      </Group>
    </Stack>
  );
}

export default NavBar;
