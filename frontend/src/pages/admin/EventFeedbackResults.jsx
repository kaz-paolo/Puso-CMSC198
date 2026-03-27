import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Tabs,
  Table,
  Badge,
  Button,
  Modal,
  Rating,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function EventFeedbackResults() {
  const { eventId } = useParams();
  const { userProfile } = useUserProfile();
  const [results, setResults] = useState({
    questions: [],
    answers: [],
    volunteers: [],
  });

  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchResults();
  }, [eventId]);

  async function fetchResults() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/admin/event/${eventId}/results`,
      );
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function openRateModal(vol) {
    setSelectedVolunteer(vol);
    setRating(vol.rating || 0);
    setNote(vol.note || "");
    setRateModalOpen(true);
  }

  async function submitRating() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/evaluation/admin/event/${eventId}/rate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedVolunteer.id,
            adminId: userProfile.id,
            rating,
            note,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        notifications.show({
          title: "Success",
          message: "Rating saved",
          color: "green",
        });
        setRateModalOpen(false);
        fetchResults();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const answered = results.volunteers.filter((v) => v.has_answered);
  const pending = results.volunteers.filter((v) => !v.has_answered);

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Title order={2} align="left">
          Event Feedback Results
        </Title>

        <Tabs defaultValue="summary">
          <Tabs.List>
            <Tabs.Tab value="summary">Summary & Responses</Tabs.Tab>
            <Tabs.Tab value="volunteers">Volunteer Ratings</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="summary" pt="md">
            <Stack gap="md">
              <Text align="left">
                <b>Answered:</b> {answered.length} | <b>Pending:</b>{" "}
                {pending.length}
              </Text>
              {results.questions.map((q) => (
                <Paper key={q.id} withBorder p="md" radius="md">
                  <Text fw={600} mb="sm" align="left">
                    {q.question_text}
                  </Text>
                  <Stack gap="xs">
                    {results.answers
                      .filter((a) => a.question_id === q.id)
                      .map((a, i) => (
                        <Text size="sm" key={i} align="left">
                          <b>
                            {a.first_name} {a.last_name}:
                          </b>{" "}
                          {a.answer_text}
                        </Text>
                      ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="volunteers" pt="md">
            <Paper withBorder radius="md" p="0">
              <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Feedback Status</Table.Th>
                    <Table.Th>Rating</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody align="left">
                  {results.volunteers.map((v) => (
                    <Table.Tr key={v.id}>
                      <Table.Td>
                        {v.first_name} {v.last_name}
                      </Table.Td>
                      <Table.Td>
                        <Badge color={v.has_answered ? "green" : "gray"}>
                          {v.has_answered ? "Answered" : "Pending"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {v.rating ? `${v.rating} / 5` : "Not Rated"}
                      </Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => openRateModal(v)}
                        >
                          Rate & Note
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <Modal
        opened={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        title={`Rate Volunteer: ${selectedVolunteer?.first_name}`}
      >
        <Stack gap="md">
          <Text size="sm">Rating (1 to 5):</Text>
          <Rating value={rating} onChange={setRating} fractions={2} size="xl" />
          <Textarea
            label="Internal Note"
            placeholder="Add comments regarding their performance"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
          />
          <Button onClick={submitRating}>Save Rating</Button>
        </Stack>
      </Modal>
    </Container>
  );
}
