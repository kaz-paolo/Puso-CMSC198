import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  TextInput,
  Select,
  Button,
  Paper,
  Stack,
  Radio,
  Loader,
  Center,
} from "@mantine/core";

export default function PublicSurveyPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    answers: {},
  });

  useEffect(() => {
    fetchActiveSurvey();
  }, [eventId]);

  const fetchActiveSurvey = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL || ""}/api/events/${eventId}/survey/active`,
      );
      const data = await res.json();
      if (data.success) {
        setSurveyData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch survey:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL || ""}/api/events/${eventId}/survey/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit registration");
      }

      const successData = {
        name: formData.name,
        email: formData.email,
        date: new Date().toISOString(),
        regId: data.data?.registrationId || encodeURIComponent(formData.email),
      };

      navigate(`/events/${eventId}/success/${successData.regId}`, {
        state: successData,
      });
    } catch (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        alert("This email has already been registered for this event.");
      } else {
        alert(error.message || "An error occurred while submitting.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!surveyData || !surveyData.accepting_responses) {
    return (
      <Container size="sm" py="xl">
        <Paper withBorder p="xl" radius="md" ta="center">
          <Title order={3}>Survey Unavailable</Title>
          <Text mt="md" c="dimmed">
            This event is not currently accepting responses.
          </Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Paper withBorder p="xl" radius="md">
        <Title>{surveyData.title}</Title>
        <Text mt="sm">{surveyData.description}</Text>
        {surveyData.privacy_notice && (
          <Text size="xs" c="dimmed" mt="md" fs="italic">
            Privacy Notice: {surveyData.privacy_notice}
          </Text>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
          <Stack gap="md">
            <TextInput
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextInput
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextInput
              label="Contact Number"
              required
              value={formData.contact_number}
              onChange={(e) =>
                setFormData({ ...formData, contact_number: e.target.value })
              }
            />

            {/* mapped from surveyData.questions */}
            {surveyData.questions?.map((q) => {
              const inputType =
                q.validation_type === "none" ? "text" : q.validation_type;

              if (q.question_type === "text") {
                return (
                  <TextInput
                    key={q.id || q.question_text}
                    label={q.question_text}
                    type={inputType}
                    required={q.is_required}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                );
              }

              if (q.question_type === "dropdown") {
                return (
                  <Select
                    key={q.id || q.question_text}
                    label={q.question_text}
                    required={q.is_required}
                    data={q.options || []}
                    onChange={(val) => handleAnswerChange(q.id, val)}
                    placeholder="Select an option"
                  />
                );
              }

              if (q.question_type === "choices") {
                return (
                  <Radio.Group
                    key={q.id || q.question_text}
                    label={q.question_text}
                    required={q.is_required}
                    onChange={(val) => handleAnswerChange(q.id, val)}
                  >
                    <Stack mt="xs" gap="xs">
                      {q.options?.map((opt, idx) => (
                        <Radio key={idx} value={opt} label={opt} />
                      ))}
                    </Stack>
                  </Radio.Group>
                );
              }
              return null;
            })}

            <Button type="submit" mt="xl" loading={submitting}>
              Submit Registration
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
