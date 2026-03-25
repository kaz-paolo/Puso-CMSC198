import { useState, useEffect } from "react";
import {
  Stack,
  TextInput,
  Textarea,
  Switch,
  Button,
  Group,
  Card,
  Select,
  ActionIcon,
  Title,
  CopyButton,
  Text,
  Badge,
} from "@mantine/core";
import {
  IconTrash,
  IconPlus,
  IconCheck,
  IconCopy,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export default function AdminSurveyBuilder({ eventId }) {
  const [loading, setLoading] = useState(false);
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    privacy_notice: "",
    accepting_responses: false,
    questions: [],
  });

  const registrationLink = `${window.location.origin}/events/${eventId}/register`;

  useEffect(() => {
    fetchSurvey();
  }, [eventId]);

  const fetchSurvey = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL || ""}/api/events/${eventId}/survey`,
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to fetch survey: ${res.status} ${res.statusText}. ${errorText}`,
        );
      }
      const data = await res.json();
      if (data.success && data.data) {
        setSurvey(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch survey:", err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL || ""}/api/events/${eventId}/survey/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(survey),
        },
      );
      if (res.ok) {
        notifications.show({
          title: "Success",
          message: "Survey data saved successfully!",
          color: "green",
          icon: <IconCheck />,
        });
      } else {
        const errorText = await res.text();
        throw new Error(
          errorText || `Failed to save survey. Status: ${res.status}`,
        );
      }
    } catch (err) {
      console.error("Failed to save survey:", err);
      notifications.show({
        title: "Error Saving Survey",
        message: err.message,
        color: "red",
        autoClose: 7000,
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setSurvey({
      ...survey,
      questions: [
        ...survey.questions,
        {
          question_text: "",
          question_type: "text",
          validation_type: "none",
          is_required: true,
          options: [],
        },
      ],
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...survey.questions];
    updated[index][field] = value;
    setSurvey({ ...survey, questions: updated });
  };

  const removeQuestion = (index) => {
    const updated = [...survey.questions];
    updated.splice(index, 1);
    setSurvey({ ...survey, questions: updated });
  };

  return (
    <Stack gap="lg">
      <Card withBorder shadow="sm">
        <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <Title order={3}>Survey Settings</Title>
              {survey.accepting_responses ? (
                <Badge color="green">
                  Live (v{survey.current_version || 1})
                </Badge>
              ) : (
                <Badge color="gray">
                  Closed (v{survey.current_version || 1})
                </Badge>
              )}
            </Group>
            <Switch
              label="Accepting Responses"
              checked={survey.accepting_responses}
              onChange={(e) =>
                setSurvey({
                  ...survey,
                  accepting_responses: e.currentTarget.checked,
                })
              }
            />
          </Group>

          <Group>
            <Text fw={500}>Registration Link:</Text>
            <Text
              c="blue"
              component="a"
              href={registrationLink}
              target="_blank"
            >
              {registrationLink}
            </Text>
            <CopyButton value={registrationLink} timeout={2000}>
              {({ copied, copy }) => (
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  onClick={copy}
                  variant="light"
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              )}
            </CopyButton>
          </Group>

          <TextInput
            label="Survey Title"
            value={survey.title}
            onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
            placeholder="e.g. Literacy Project Registration"
          />
          <Textarea
            label="Description"
            value={survey.description}
            onChange={(e) =>
              setSurvey({ ...survey, description: e.target.value })
            }
          />
          <Textarea
            label="Data and Privacy Notice"
            value={survey.privacy_notice}
            onChange={(e) =>
              setSurvey({ ...survey, privacy_notice: e.target.value })
            }
          />
        </Stack>
      </Card>

      <Title order={4}>
        Questions (Standard fields like Name/Email/Contact are automatically
        included)
      </Title>

      {survey.questions.map((q, index) => (
        <Card key={index} withBorder shadow="sm">
          <Stack gap="sm">
            <Group align="flex-end">
              <TextInput
                flex={1}
                label={`Question ${index + 1}`}
                value={q.question_text}
                onChange={(e) =>
                  updateQuestion(index, "question_text", e.target.value)
                }
              />
              <Select
                label="Type"
                data={["text", "choices", "dropdown"]}
                value={q.question_type}
                onChange={(val) => updateQuestion(index, "question_type", val)}
              />
              <Select
                label="Validation"
                data={["none", "number", "email"]}
                value={q.validation_type}
                onChange={(val) =>
                  updateQuestion(index, "validation_type", val)
                }
                disabled={q.question_type !== "text"}
              />
              <Switch
                label="Required"
                checked={q.is_required}
                onChange={(e) =>
                  updateQuestion(index, "is_required", e.currentTarget.checked)
                }
              />
              <ActionIcon
                color="red"
                variant="light"
                size="lg"
                onClick={() => removeQuestion(index)}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Group>

            {(q.question_type === "choices" ||
              q.question_type === "dropdown") && (
              <TextInput
                label="Options (Comma separated)"
                placeholder="Option A, Option B, Option C"
                value={q.options ? q.options.join(", ") : ""}
                onChange={(e) =>
                  updateQuestion(
                    index,
                    "options",
                    e.target.value.split(",").map((s) => s.trim()),
                  )
                }
              />
            )}
          </Stack>
        </Card>
      ))}

      <Group justify="space-between">
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          onClick={addQuestion}
        >
          Add Question
        </Button>
        <Button
          onClick={handleSave}
          loading={loading}
          leftSection={<IconDeviceFloppy size={16} />}
        >
          Save Survey Data
        </Button>
      </Group>
    </Stack>
  );
}
