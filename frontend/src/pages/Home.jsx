import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Paper,
  ActionIcon,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ThemeSettings } from "../components/ThemeSettings";
import { IconPalette } from "@tabler/icons-react";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [themeOpened, setThemeOpened] = useState(false);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <Container
      size="sm"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <ActionIcon
        variant="filled"
        size="xl"
        aria-label="Theme Settings"
        onClick={() => setThemeOpened(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
        }}
      >
        <IconPalette size={24} />
      </ActionIcon>

      <ThemeSettings
        opened={themeOpened}
        onClose={() => setThemeOpened(false)}
      />

      <Paper shadow="md" p="xl" radius="md" style={{ width: "100%" }}>
        <Stack align="center" gap="xl">
          <Title order={1}>Landing Page</Title>
          <Text size="lg" c="dimmed" ta="center">
            Get started by logging in or creating a new account
          </Text>

          <Group gap="md" mt="xl">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Home;
