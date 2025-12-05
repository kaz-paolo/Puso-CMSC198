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
  Divider,
  Alert,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
// import { auth } from '../../firebase/firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { IconAlertCircle, IconBrandGoogle } from "@tabler/icons-react";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleEmailAuth = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     if (isLogin) {
  //       await signInWithEmailAndPassword(auth, email, password);
  //     } else {
  //       await createUserWithEmailAndPassword(auth, email, password);
  //     }
  //     navigate('/dashboard');
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGoogleAuth = async () => {
  //   setError('');
  //   setLoading(true);
  //   const provider = new GoogleAuthProvider();

  //   try {
  //     await signInWithPopup(auth, provider);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

          {/* <form onSubmit={handleEmailAuth}> */}
          <form>
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

          <Divider label="OR" labelPosition="center" />

          <Button
            fullWidth
            onClick={console.log("clicking button")}
            loading={loading}
            variant="outline"
            color="brand"
            leftSection={<IconBrandGoogle size={18} />}
          >
            Continue with Google
          </Button>

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
