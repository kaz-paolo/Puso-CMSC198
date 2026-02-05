import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
  Checkbox,
  Group,
  Divider,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useStackApp, useUser } from "@stackframe/react";
import {
  IconAlertCircle,
  IconSettings,
  IconSchool,
  IconUserPlus,
  IconArrowLeft,
  IconBell,
  IconPalette,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import Header from "../components/Header";
import { ThemeSettings } from "../components/ThemeSettings";

function Auth() {
  const [view, setView] = useState("login"); // login signup recover
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [themeOpened, setThemeOpened] = useState(false);
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  // hook for authentication
  const stackApp = useStackApp();
  // hook for user info
  const user = useUser();

  // condition for Arukahik Training
  // true allow application, false show alert
  const arukahikAvailable = false;

  useEffect(() => {
    if (!user) return;
    const justSignedUp = localStorage.getItem("justSignedUp") === "true";
    if (justSignedUp) {
      navigate("/volunteer-form");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleArukahikSignup = () => {
    if (arukahikAvailable) {
      navigate("/volunteerapplication");
    } else {
      notifications.show({
        title: "Coming Soon!",
        message: "There are currently no available Arukahik trainings.",
        color: "yellow",
      });
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      if (view === "login") {
        await stackApp.signInWithCredential({ email, password });
        localStorage.setItem("justSignedUp", "false");
      } else {
        await stackApp.signUpWithCredential({ email, password });
        localStorage.setItem("justSignedUp", "true");
      }
    } catch (err) {
      const errorMessage = err.message;
      if (errorMessage) {
        if (errorMessage.includes("Wrong e-mail or password.")) {
          setError("Incorrect email or password. Please try again.");
        } else if (errorMessage.includes("must be a valid email")) {
          setError("Please enter a valid email address.");
        } else if (errorMessage.includes("already in use")) {
          setError("An account with this email already exists. Please log in.");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderLogin = () => (
    <>
      <Title order={2} ta="center">
        Welcome Back
      </Title>
      <Text size="sm" c="dimmed" ta="center">
        Please enter your details to sign in.
      </Text>

      <form onSubmit={handleEmailAuth} noValidate>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Group justify="space-between" align="center">
            <Anchor
              component="button"
              type="button"
              size="xs"
              onClick={() => setView("signup")}
            >
              Create an account
            </Anchor>
          </Group>
          <Button
            type="submit"
            fullWidth
            loading={loading}
            color="primary"
            size="md"
          >
            Login
          </Button>
        </Stack>
      </form>
      {error && (
        <Alert
          mt="md"
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          onClose={() => setError("")}
          withCloseButton
        >
          {error}
        </Alert>
      )}
      <Divider
        my="xs"
        label="JOIN PAHINUNGOD"
        labelPosition="center"
        color="gray.3"
      />

      <Stack gap="md">
        <Paper withBorder p="sm" radius="md">
          <Group>
            <IconSchool size={32} color={theme.colors.primary[6]} />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Want to be a volunteer?
              </Text>
              <Text size="xs" c="dimmed">
                Be one through the Arukahik training.
              </Text>
              <Anchor
                component="button"
                type="button"
                size="sm"
                fw={500}
                onClick={handleArukahikSignup}
              >
                View Schedule & Sign Up →
              </Anchor>
            </div>
          </Group>
        </Paper>
        <Paper withBorder p="sm" radius="md">
          <Group>
            <IconUserPlus size={32} color={theme.colors.primary[6]} />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Already a volunteer and don't have an account?
              </Text>
              <Anchor
                component="button"
                type="button"
                size="sm"
                fw={500}
                onClick={() => setView("recover")}
              >
                Make one here →
              </Anchor>
            </div>
          </Group>
        </Paper>
      </Stack>
    </>
  );

  const renderSignup = () => (
    <>
      <Group>
        <ActionIcon variant="light" onClick={() => setView("login")}>
          <IconArrowLeft />
        </ActionIcon>
        <Title order={3}>Create an Account</Title>
      </Group>
      <Text size="sm" c="dimmed">
        Please enter your details to create an account.
      </Text>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          onClose={() => setError("")}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleEmailAuth}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            loading={loading}
            color="primary"
            size="md"
          >
            Sign Up
          </Button>
        </Stack>
      </form>
    </>
  );

  const renderRecover = () => (
    <>
      <Group>
        <ActionIcon variant="light" onClick={() => setView("login")}>
          <IconArrowLeft />
        </ActionIcon>
        <Title order={3}>Create Your Account</Title>
      </Group>
      <Text size="sm" c="dimmed">
        Enter the email you used in your arukahik registration (Only for
        Arukahik 1 to 4).
      </Text>
      <Stack gap="lg" mt="md">
        <TextInput
          label="Volunteer Registration Email"
          placeholder="youremail@email.com"
          type="email"
        />
        <Button color="primary">Get Verification Code</Button>
      </Stack>
    </>
  );

  return (
    <div
      style={{
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        onThemeClick={() => setThemeOpened(true)}
        showNotifications={false}
      />
      <ThemeSettings
        opened={themeOpened}
        onClose={() => setThemeOpened(false)}
      />
      <Container
        size="xs"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          paddingBottom: "5vh",
        }}
      >
        <Paper
          shadow="md"
          p="xl"
          radius="md"
          withBorder
          style={{ width: "100%" }}
        >
          <Stack gap="md">
            {view === "login" && renderLogin()}
            {view === "signup" && renderSignup()}
            {view === "recover" && renderRecover()}
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}

export default Auth;
