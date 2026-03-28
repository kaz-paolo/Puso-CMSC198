import { useState, useEffect, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import { authClient } from "../auth.js";
import {
  IconAlertCircle,
  IconSchool,
  IconUserPlus,
  IconArrowLeft,
  IconPalette,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import Header from "../components/Header";
import { ThemeSettings } from "../components/ThemeSettings";

function Auth() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [themeOpened, setThemeOpened] = useState(false);

  const [code, setCode] = useState("");
  // const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  // session checks
  const sessionCheckDone = useRef(false);
  const isNavigating = useRef(false);

  const arukahikAvailable = false;

  // check existing session
  useEffect(() => {
    if (sessionCheckDone.current || isNavigating.current) {
      return;
    }

    sessionCheckDone.current = true;

    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();

        if (data?.session && !isNavigating.current) {
          isNavigating.current = true;

          const justSignedUp = localStorage.getItem("justSignedUp") === "true";
          localStorage.removeItem("justSignedUp");

          // navigation
          if (justSignedUp) {
            window.location.replace("/volunteer-form");
          } else {
            window.location.replace("/dashboard");
          }
        } else {
          // show auth
          setCheckingSession(false);
        }
      } catch (err) {
        console.error("Session check error:", err);
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    setError("");
  }, [view]);

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

    // stop multiple submission
    if (loading || isNavigating.current) return;

    setLoading(true);

    try {
      if (view === "login") {
        isNavigating.current = true;
        const { data, error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) throw error;
        localStorage.removeItem("justSignedUp");
        window.location.replace("/dashboard");
      } else {
        // Sign up
        const formattedMi = middleInitial.replace(/\./g, "").trim();

        const { data, error } = await authClient.signUp.email({
          email,
          password,
          firstName: firstName.trim(),
          middleName: formattedMi,
          lastName: lastName.trim(),
        });

        if (error) throw error;

        if (data.verificationCode) {
          notifications.show({
            title: "Verification Code (for testing)",
            message: `Your code is: ${data.verificationCode}`,
            color: "blue",
            autoClose: false,
          });
        }
        setVerifiedEmail(email);
        setView("verify");
      }
    } catch (err) {
      const errorMessage = err.message || err.error?.message;
      if (errorMessage) {
        if (
          errorMessage.includes("Invalid credentials") ||
          errorMessage.includes("password")
        ) {
          setError("Incorrect email or password. Please try again.");
        } else if (errorMessage.includes("email")) {
          setError("Please enter a valid email address.");
        } else if (errorMessage.includes("already exists")) {
          setError("An account with this email already exists. Please log in.");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      isNavigating.current = false;
      setLoading(false);
    }
  };

  const handleVerifyMemberEmail = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(
        "${import.meta.env.VITE_API_URL_BASE_URL}/api/users/check-existing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        },
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      if (!data.exists) {
        setError("Email not found in existing members list.");
        return;
      }

      setVerifiedEmail(normalizedEmail);
      setEmail(normalizedEmail);
      setView("signup");
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (error) throw error;

      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) throw signInError;

      localStorage.setItem("justSignedUp", "true");
      window.location.replace("/volunteer-form");
    } catch (err) {
      setError(err?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // loader
  if (checkingSession) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  const handleResendCode = () => {
    console.log("resend code");
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
            label="First Name"
            placeholder="Juan"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Group grow>
            <TextInput
              label="Middle Initial (Optional)"
              placeholder="D"
              value={middleInitial}
              onChange={(e) =>
                setMiddleInitial(
                  e.target.value.replace(/\./g, "").toUpperCase(),
                )
              }
              maxLength={1}
            />
            <TextInput
              label="Last Name"
              placeholder="Dela Cruz"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Group>
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

  const renderRecover = () => {
    return (
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
          <Button
            color="primary"
            onClick={handleVerifyMemberEmail}
            loading={loading}
          >
            Verify Email
          </Button>
        </Stack>
      </>
    );
  };

  const renderVerify = () => (
    <>
      <Group miw={300}>
        <ActionIcon variant="light" onClick={() => navigate(-1)}>
          <IconArrowLeft />
        </ActionIcon>
        <Title order={3}>Verify Email</Title>
      </Group>

      <Text size="sm" c="dimmed">
        Enter the verification code sent to {email}
      </Text>

      <form onSubmit={handleCodeVerify}>
        <Stack gap="md">
          <TextInput
            label="Verification Code"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} fullWidth>
            Verify Code
          </Button>

          <Anchor
            component="button"
            type="button"
            size="sm"
            onClick={handleResendCode}
          >
            Resend Code (This is not available yet.)
          </Anchor>
        </Stack>
      </form>

      {error && (
        <Alert
          mt="md"
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          withCloseButton
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}
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
            {view === "verify" && renderVerify()}
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}

export default Auth;
