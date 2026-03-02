import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconInfoCircle, IconPinFilled } from "@tabler/icons-react";

function EventDescription({ description }) {
  return (
    <Paper shadow="sm" p="lg" withBorder>
      <Group gap="sm" mb="md">
        <IconInfoCircle size={24} style={{ color: "#22c55e" }} />
        <Title order={4}>Event Description</Title>
      </Group>

      <Stack gap="md">
        <Text size="sm" style={{ lineHeight: 1.6 }}>
          {description}
        </Text>
      </Stack>
    </Paper>
  );
}

export default EventDescription;
