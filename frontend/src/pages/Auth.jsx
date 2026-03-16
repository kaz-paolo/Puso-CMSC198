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
  Group,
  Divider,
  ActionIcon,
  useMantineTheme,
  Loader,
  Center,
} from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import {
  IconAlertCircle,
  IconSchool,
  IconUserPlus,
  IconArrowLeft,
} from "@tabler/icons-react";
import Header from "../components/Header.jsx";
import { ThemeSettings } from "../components/ThemeSettings.jsx";
import { useSession } from "../hooks/useSession";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [themeOpened, setThemeOpened] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const { session, loading: checkingSession } = useSession();
  const navigate = useNavigate();
  const {
    view,
    setView,
    email,
    setEmail,
    name,
    setName,
    password,
    setPassword,
    error,
    setError,
    loading,
    verifiedEmail,
    handleArukahikSignup,
    handleEmailAuth,
    handleVerify,
  } = useAuth();

  useEffect(() => {
    // If a session exists, the user is logged in and should not be on the Auth page.
    // Redirect them to the appropriate page.
    if (session) {
      const justSignedUp = localStorage.getItem("justSignedUp") === "true";
      if (justSignedUp) {
        localStorage.removeItem("justSignedUp");
        navigate("/volunteer-form");
      } else {
        navigate("/dashboard");
      }
    }
  }, [session, navigate]);

  if (checkingSession) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  const renderLogin = () => (
    <>
      <Title order={2} ta="center">
        Welcome Back
      </Title>
      <Text size="sm" c="dimmed" ta="center">
        Please enter your details to sign in.
      </Text>

      <form onSubmit={handleEmailAuth} noValidate>
        <Stack gap="md" ta="left">
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
            label="Full Name"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            readOnly={!!verifiedEmail}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <Button color="primary" onClick={handleVerify} loading={loading}>
          Verify Email
        </Button>
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
          justifyContent: "center",
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
