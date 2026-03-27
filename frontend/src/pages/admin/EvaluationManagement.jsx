import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Table,
  Badge,
  Paper,
  Modal,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const PREMADE_QUESTIONS = [
  { text: "How would you rate the overall organization of the event?" },
  { text: "Did you feel adequately prepared for your role?" },
  { text: "What went well during the event?" },
  { text: "What could be improved for future events?" },
];

export default function EvaluationManagement() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [templateChoiceMode, setTemplateChoiceMode] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/admin/events`,
      );
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function openLaunchModal(eventId) {
    setSelectedEventId(eventId);
    setTemplateChoiceMode(true);
    setLaunchModalOpen(true);
  }

  function setupQuestions(usePremade) {
    setQuestions(usePremade ? [...PREMADE_QUESTIONS] : [{ text: "" }]);
    setTemplateChoiceMode(false);
  }

  async function launchEvaluation() {
    const validQuestions = questions.filter((q) => q.text.trim() !== "");
    if (validQuestions.length === 0)
      return notifications.show({
        title: "Error",
        message: "Add at least one question.",
        color: "red",
      });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/admin/event/${selectedEventId}/launch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: validQuestions }),
        },
      );
      const data = await res.json();
      if (data.success) {
        notifications.show({
          title: "Success",
          message: "Evaluation launched!",
          color: "green",
        });
        setLaunchModalOpen(false);
        fetchEvents();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function closeEvaluation(eventId) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/admin/event/${eventId}/close`,
        {
          method: "POST",
        },
      );
      if ((await res.json()).success) fetchEvents();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} align="left">
            Evaluation Management
          </Title>
          <Text c="dimmed" align="left">
            Manage post-event evaluations and view feedback results.
          </Text>
        </div>

        <Paper withBorder radius="md" p="0">
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Event Title</Table.Th>
                <Table.Th>Date Completed</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody align="left">
              {events.map((e) => (
                <Table.Tr key={e.id}>
                  <Table.Td fw={500}>{e.event_title}</Table.Td>
                  <Table.Td>
                    {new Date(e.end_date).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        !e.evaluation_status
                          ? "gray"
                          : e.evaluation_status === "open"
                            ? "green"
                            : "blue"
                      }
                    >
                      {e.evaluation_status || "No Evaluation"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {!e.evaluation_status && (
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => openLaunchModal(e.id)}
                        >
                          Start Event Feedback
                        </Button>
                      )}
                      {e.evaluation_status === "open" && (
                        <Button
                          size="xs"
                          color="red"
                          variant="light"
                          onClick={() => closeEvaluation(e.id)}
                        >
                          Close Responses
                        </Button>
                      )}
                      {e.evaluation_status && (
                        <Button
                          size="xs"
                          variant="default"
                          onClick={() =>
                            navigate(`/evaluation-management/${e.id}/results`)
                          }
                        >
                          View Results
                        </Button>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      <Modal
        opened={launchModalOpen}
        onClose={() => setLaunchModalOpen(false)}
        title="Launch Event Feedback"
        size="lg"
      >
        {templateChoiceMode ? (
          <Group grow>
            <Button variant="light" onClick={() => setupQuestions(true)}>
              Use Premade Template
            </Button>
            <Button variant="default" onClick={() => setupQuestions(false)}>
              Make New Template
            </Button>
          </Group>
        ) : (
          <Stack gap="sm">
            {questions.map((q, i) => (
              <Group key={i}>
                <TextInput
                  style={{ flex: 1 }}
                  value={q.text}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[i].text = e.currentTarget.value;
                    setQuestions(newQ);
                  }}
                />
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() =>
                    setQuestions(questions.filter((_, idx) => idx !== i))
                  }
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
            <Button
              variant="subtle"
              leftSection={<IconPlus size={16} />}
              onClick={() => setQuestions([...questions, { text: "" }])}
            >
              Add Question
            </Button>
            <Button onClick={launchEvaluation} mt="md">
              Publish Feedback Form
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
