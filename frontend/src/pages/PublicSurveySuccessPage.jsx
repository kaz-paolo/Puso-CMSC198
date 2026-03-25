import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Loader,
  Center,
  Stack,
} from "@mantine/core";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function PublicSurveySuccessPage() {
  const { eventId, registrationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState(location.state);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL_BASE_URL || ""}/api/events/${eventId}/survey/response/${registrationId}`,
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Registration not found");
        }

        const data = await res.json();
        if (data.success && data.data) {
          setSuccessData(data.data);
        } else {
          throw new Error("Failed to retrieve registration details.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [eventId, registrationId]);

  if (loading) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="sm" py="xl">
        <Paper withBorder p="xl" radius="md" ta="center">
          <Stack>
            <Title order={2} c="red">
              Registration Not Found
            </Title>
            <Text mt="md" size="lg">
              We could not find a registration with the ID: {registrationId}
            </Text>
            <Button mt="xl" variant-="light" onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (!successData) {
    return (
      <Container size="sm" py="xl">
        <Paper withBorder p="xl" radius="md" ta="center">
          <Title order={2}>Loading Registration...</Title>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Paper withBorder p="xl" radius="md" ta="center">
        <Title order={2} c="green">
          Thank you for completing the form!
        </Title>
        <Text mt="md" size="lg">
          Hello, {successData.name}.
        </Text>
        <Text c="dimmed">
          Your response was recorded on{" "}
          {new Date(successData.date).toLocaleDateString()}.
        </Text>
        <Text mt="lg" size="sm" fw={500}>
          Registration ID: {registrationId || successData.regId}
        </Text>
        <Text mt="xs" size="sm" c="dimmed">
          Please save this link or your Registration ID as proof of your
          registration.
        </Text>

        <Button mt="xl" variant="light" onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </Paper>
    </Container>
  );
}
