import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Group,
  Badge,
  Button,
  Select,
  Textarea,
  Card,
  SimpleGrid,
  Modal,
  Image,
  Grid,
  Checkbox,
  List,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  IconClipboardText,
  IconSpeakerphone,
  IconMapPin,
  IconMessageReport,
  IconFlare,
  IconHistory,
} from "@tabler/icons-react";
import heroImage from "../assets/hero-image.png";

function Evaluation() {
  const { userProfile } = useUserProfile();
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);

  // answering event evaluation
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // general feedback
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userProfile?.id) {
      fetchPendingEvaluations();
      fetchHistory();
    }
  }, [userProfile]);

  async function fetchPendingEvaluations() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/user/${userProfile.id}/pending`,
      );
      const data = await res.json();
      if (data.success) setPending(data.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchHistory() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/user/${userProfile.id}/history`,
      );
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleOpenEvaluation(event) {
    setSelectedEvent(event);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/event/${event.event_id}/questions`,
      );
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
        setAnswers({});
        setEvaluationModalOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function submitEventEvaluation() {
    const formattedAnswers = questions.map((q) => ({
      question_id: q.id,
      answer_text: answers[q.id] || "",
    }));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/event/${selectedEvent.event_id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userProfile.id,
            answers: formattedAnswers,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        notifications.show({
          title: "Success",
          message: "evaluation submitted!",
          color: "green",
        });
        setEvaluationModalOpen(false);
        fetchPendingEvaluations();
        fetchHistory();
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        title: "Error",
        message: "Failed to submit.",
        color: "red",
      });
    }
  }

  async function submitGeneralEvaluation() {
    if (!topic || !subject || !message) {
      notifications.show({
        title: "Error",
        message: "Please fill all fields.",
        color: "red",
      });
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/general`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userProfile.id,
            topic,
            subject,
            message,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        notifications.show({
          title: "Success",
          message: "Thank you for your evaluation!",
          color: "green",
        });
        setTopic("");
        setSubject("");
        setMessage("");
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        title: "Error",
        message: "Failed to submit evaluation.",
        color: "red",
      });
    }
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Group align="center" justify="space-between" mb="lg">
            <Group align="center" gap="sm">
              <ThemeIcon variant="transparent" color="orange" size="lg">
                <IconClipboardText size="2rem" />
              </ThemeIcon>
              <Title order={3}>Pending Event Evaluation</Title>
            </Group>
            {pending.length > 0 && (
              <Badge color="gray" variant="light" size="lg" radius="xl">
                {pending.length} Pending
              </Badge>
            )}
          </Group>

          {pending.length === 0 ? (
            <Text c="dimmed">
              You have no pending event evaluation to complete.
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {pending.map((event) => (
                <Card
                  key={event.event_id}
                  withBorder
                  shadow="xs"
                  radius="xl"
                  p={0}
                >
                  <Grid
                    gutter={0}
                    align="stretch"
                    style={{ minHeight: "180px" }}
                  >
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                      <Image
                        src={heroImage}
                        height="100%"
                        alt="Event cover"
                        fit="cover"
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 8 }}>
                      <Stack justify="space-between" h="100%" p="md">
                        <div>
                          <Group justify="space-between" mb="xs">
                            <Badge color="blue" variant="light" radius="xl">
                              Community Engagement
                            </Badge>
                            <Text size="xs" c="dimmed">
                              {new Date(event.end_date).toLocaleDateString()}
                            </Text>
                          </Group>

                          <Text fw={700} size="lg" mb={4}>
                            {event.event_title}
                          </Text>
                          <Group gap={4} mb="sm" wrap="nowrap">
                            <IconMapPin size={16} color="gray" />
                            <Text size="sm" c="dimmed" truncate="end">
                              {event.location}
                            </Text>
                          </Group>
                        </div>

                        <Group justify="space-between" align="flex-end" mt="md">
                          <div>
                            <Text size="xs" c="dimmed" mb={2}>
                              Completed
                            </Text>
                            <Text size="xs" fw={500} c="dimmed">
                              {new Date(event.end_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                },
                              )}
                            </Text>
                          </div>
                          <Button
                            color="green.8"
                            leftSection={<IconMessageReport size={18} />}
                            onClick={() => handleOpenEvaluation(event)}
                            radius="xl"
                          >
                            Give Evaluation
                          </Button>
                        </Group>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </div>

        <div>
          <Group align="center" gap="sm" mb="lg">
            <ThemeIcon variant="transparent" color="green.8" size="lg">
              <IconSpeakerphone size="2rem" />
            </ThemeIcon>
            <Title order={3}>General Feedback</Title>
          </Group>

          <Paper p="xl" radius="xl" withBorder bg="white">
            <Grid gutter={40}>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Title order={4} mb="xs">
                  Share Your Thoughts with Pahinungod
                </Title>
                <Text size="sm" c="dimmed" mb="xl">
                  Your insights help us grow. Whether it's a suggestion for
                  improvement, a story from the field, or a general comment
                  about our volunteer program, we want to hear it.
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 7 }}>
                <Stack gap="md">
                  <Select
                    label="Topic"
                    placeholder="General Suggestion"
                    data={[
                      "General Suggestion",
                      "Organization",
                      "Events",
                      "Facilities",
                      "Other",
                    ]}
                    value={topic}
                    onChange={setTopic}
                    radius="md"
                    required
                  />
                  <Select
                    label="Subject"
                    placeholder="Select a subject"
                    data={[
                      "Volunteer Experience",
                      "Process Improvement",
                      "Commendation",
                      "Issue Report",
                      "Other",
                    ]}
                    value={subject}
                    onChange={setSubject}
                    radius="md"
                    required
                  />
                  <Textarea
                    label="Your Message"
                    placeholder="Write your feedback here..."
                    minRows={6}
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    radius="md"
                    required
                  />
                  <Group justify="space-between" mt="md">
                    <Checkbox
                      label="Submit anonymously"
                      color="green.8"
                      radius="sm"
                    />
                    <Button
                      onClick={submitGeneralEvaluation}
                      color="green.8"
                      radius="xl"
                      px="xl"
                    >
                      Submit Feedback
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Group align="center" gap="sm" mb="md">
            <ThemeIcon variant="transparent" color="blue" size="md">
              <IconHistory size="1.5rem" />
            </ThemeIcon>
            <Title order={3}>Evaluation History</Title>
          </Group>
          {history.length === 0 ? (
            <Text c="dimmed">No evaluation history available.</Text>
          ) : (
            <Stack gap="sm">
              {history.map((event, idx) => (
                <Paper key={idx} withBorder p="md" radius="md">
                  <Group justify="space-between">
                    <div>
                      <Text fw={600} size="md">
                        {event.event_title}
                      </Text>
                      <Group gap={4} mt={2}>
                        <IconMapPin size={14} color="gray" />
                        <Text size="xs" c="dimmed">
                          {event.location}
                        </Text>
                      </Group>
                    </div>
                    <Stack gap={2} align="flex-end">
                      <Badge color="gray" variant="light" size="sm">
                        Submitted
                      </Badge>
                      <Text size="xs" c="dimmed" fw={500}>
                        {new Date(event.submitted_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "2-digit", year: "numeric" },
                        )}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
        </div>
      </Stack>

      <Modal
        opened={evaluationModalOpen}
        onClose={() => setevaluationModalOpen(false)}
        title={`Event evaluation: ${selectedEvent?.event_title}`}
        size="lg"
      >
        <Stack gap="md">
          {questions.map((q) => (
            <Textarea
              key={q.id}
              label={q.question_text}
              value={answers[q.id] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [q.id]: e.currentTarget.value })
              }
            />
          ))}
          <Button onClick={submitEventEvaluation}>Submit Responses</Button>
        </Stack>
      </Modal>
    </Container>
  );
}

export default Evaluation;
