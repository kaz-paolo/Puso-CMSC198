// frontend/src/pages/PublicSurveyPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  TextInput,
  Select,
  Button,
  Paper,
} from "@mantine/core";

export default function PublicSurveyPage() {
  const { eventId } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    answers: {},
  });

  // check local storage on mount, add other checker, in case a different device is used
  useEffect(() => {
    const completed = localStorage.getItem(`survey_completed_${eventId}`);
    if (completed) {
      setHasCompleted(JSON.parse(completed)); // Contains their name and success status
    } else {
      // Fetch active survey questions from backend
      // fetch(`/api/events/${eventId}/active-survey`)
    }
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit formData to backend
      // const res = await fetch(...)

      // If successful:
      const successData = {
        name: formData.name,
        date: new Date().toISOString(),
      };
      localStorage.setItem(
        `survey_completed_${eventId}`,
        JSON.stringify(successData),
      );
      setHasCompleted(successData);
    } catch (error) {
      // Handle "Email already exists" error from backend
      if (error.message.includes("already registered")) {
        alert("This email has already registered for this event.");
      }
    }
  };

  // 2. Render Success State if already completed
  if (hasCompleted) {
    return (
      <Container size="sm" py="xl">
        <Paper withBorder p="xl" radius="md" ta="center">
          <Title order={2} c="green">
            Thank you for completing the survey!
          </Title>
          <Text mt="md" size="lg">
            Hello, {hasCompleted.name}.
          </Text>
          <Text c="dimmed">
            Your response was recorded on{" "}
            {new Date(hasCompleted.date).toLocaleDateString()}.
          </Text>
          <Text mt="lg" size="sm">
            You can keep this page as proof of your registration.
          </Text>
        </Paper>
      </Container>
    );
  }

  // 3. Render Form
  return (
    <Container size="sm" py="xl">
      <Title>{surveyData?.title}</Title>
      <Text>{surveyData?.description}</Text>
      <Text size="xs" c="dimmed" mt="sm">
        {surveyData?.privacy_notice}
      </Text>

      <form onSubmit={handleSubmit}>
        {/* Static Fields */}
        <TextInput
          label="Full Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextInput
          label="Email"
          type="email"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextInput
          label="Contact Number"
          required
          onChange={(e) =>
            setFormData({ ...formData, contact_number: e.target.value })
          }
        />

        {/* Dynamic Fields mapped from surveyData.questions */}
        {surveyData?.questions.map((q) => (
          <div key={q.id}>
            {/* Conditionally render TextInput, Select, or Textarea based on q.question_type */}
            {/* Apply HTML validation based on q.validation_type (type="number", type="email", etc.) */}
          </div>
        ))}
        <Button type="submit" mt="xl">
          Submit Registration
        </Button>
      </form>
    </Container>
  );
}
