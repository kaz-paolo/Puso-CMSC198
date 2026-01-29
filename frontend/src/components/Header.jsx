import {
  Group,
  Text,
  ActionIcon,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconBell, IconPalette } from "@tabler/icons-react";

function Header({ onThemeClick }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Group
      justify="space-between"
      p="md"
      style={{
        borderBottom: `1px solid ${colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      }}
    >
      <Group>
        <Text size="xl" fw={700}>
          PULSO
        </Text>
      </Group>

      <Group gap="sm">
        <ActionIcon variant="subtle" size="lg" color="primary">
          <IconBell size={20} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={onThemeClick}
          color="primary"
        >
          <IconPalette size={20} />
        </ActionIcon>
      </Group>
    </Group>
  );
}

export default Header;
