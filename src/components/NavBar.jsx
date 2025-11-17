import { Stack, NavLink, Text, Avatar, Group, Divider, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconHome, IconCalendar, IconUsers, IconBook, IconMessageCircle, IconSettings, IconChevronRight } from '@tabler/icons-react';
import { auth } from '../../firebase/firebase';

function NavBar() {
  const userEmail = auth.currentUser?.email || '';
  const userName = auth.currentUser?.displayName || 'No Name';
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Stack 
      gap={0} 
      style={{ 
        width: 250, 
        height: '100%',
        borderRight: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Main Navigation */}
      <Stack gap={0} p="md" style={{ flex: 1, overflowY: 'auto' }}>
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

      {/* User Profile at Bottom */}
      <Group 
        p="md" 
        style={{ 
          borderTop: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <Avatar radius="xl" size="md" color="brand">
          {userName.charAt(0)}
        </Avatar>
        <Stack gap={0} style={{ flex: 1 }}>
          <Text size="sm" fw={500}>{userName}</Text>
          <Text size="xs" c="dimmed">{userEmail}</Text>
        </Stack>
        <IconChevronRight size={16} stroke={1.5} />
      </Group>
    </Stack>
  );
}

export default NavBar;