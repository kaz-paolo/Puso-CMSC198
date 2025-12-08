import { useState } from "react";
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
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
// Authentication Hook, staackapp authentation, and useUser (info)
import { useStackApp, useUser } from "@stackframe/react";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect } from "react";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // hook for authentication
  const stackApp = useStackApp();
  // hook for user info
  const user = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await stackApp.signInWithCredential({
          email,
          password,
        });
      } else {
        await stackApp.signUpWithCredential({
          email,
          password,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      size="xs"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper shadow="md" p="xl" radius="md" style={{ width: "100%" }}>
        <Stack gap="md">
          <Title order={2} ta="center">
            {isLogin ? "Login" : "Create Account"}
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            {isLogin ? "Sign in to your account" : "Sign up for a new account"}
          </Text>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
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

              <Button type="submit" fullWidth loading={loading} color="brand">
                {isLogin ? "SIGN IN" : "SIGN UP"}
              </Button>
            </Stack>
          </form>

          <Text size="sm" ta="center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Anchor
              component="button"
              type="button"
              c="brand"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Auth;