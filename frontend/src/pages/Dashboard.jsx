import { Container, Title, Text, Button, Paper, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";
// import { auth } from '../../firebase/firebase';
// import { signOut } from 'firebase/auth';
import { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { ThemeSettings } from "../components/ThemeSettings";

// Main home page dashboard
function Dashboard() {
  const navigate = useNavigate();
  // const userEmail = auth.currentUser?.email || '';
  const [themeOpened, setThemeOpened] = useState(false);

  const handleLogout = async () => {
    try {
      // await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <NavBar />

        <div style={{ flex: 1, overflow: "auto", padding: "2rem" }}>
          <ThemeSettings
            opened={themeOpened}
            onClose={() => setThemeOpened(false)}
          />

          <Container size="sm">
            <Paper shadow="md" p="xl" radius="md">
              <Stack align="center" gap="xl">
                <Title order={1}>Welcome!</Title>
                <Text size="lg" c="dimmed" ta="center">
                  {"asdf@gmail.com"}
                </Text>

                <Button onClick={handleLogout} color="red" variant="outline">
                  Logout
                </Button>
              </Stack>
            </Paper>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
