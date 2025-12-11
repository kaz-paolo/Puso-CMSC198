import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
} from "@mantine/core";
import { useUser, useStackApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { ThemeSettings } from "../components/ThemeSettings";

function Dashboard() {
  const user = useUser();
  const stackApp = useStackApp();
  const navigate = useNavigate();
  const [themeOpened, setThemeOpened] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await stackApp.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Header onThemeClick={() => setThemeOpened(true)} />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <NavBar />
        <ThemeSettings
          opened={themeOpened}
          onClose={() => setThemeOpened(false)}
        />

        <Paper shadow="md" p="xl" radius="md">
          <Stack gap="md">
            <Title order={1}>Dashboard</Title>
            <Text size="lg">Welcome, {user.primaryEmail}!</Text>
            <Text c="dimmed">User ID: {user.id}</Text>

            <Button
              onClick={handleSignOut}
              color="red"
              variant="outline"
              style={{ marginTop: "1rem" }}
            >
              Sign Out
            </Button>
          </Stack>
        </Paper>
      </div>
    </div>
  );
}

export default Dashboard;
