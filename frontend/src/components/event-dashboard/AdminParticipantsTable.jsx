import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Title,
  Modal,
  Stack,
  Text,
  Badge,
  Group,
} from "@mantine/core";

export default function AdminParticipantsTable({ eventId }) {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/survey/responses`,
      );
      const data = await res.json();
      if (data.success) {
        setParticipants(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch participants:", err);
    }
  };

  const rows = participants.map((p) => (
    <Table.Tr
      key={p.id}
      onClick={() => setSelectedParticipant(p)}
      style={{ cursor: "pointer" }}
    >
      <Table.Td>{p.name}</Table.Td>
      <Table.Td>{p.email}</Table.Td>
      <Table.Td>{p.contact_number}</Table.Td>
      <Table.Td>{new Date(p.registered_at).toLocaleString()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Card withBorder shadow="sm">
        <Title order={3} mb="md">
          Registered Participants
        </Title>
        <Table highlightOnHover striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Contact Number</Table.Th>
              <Table.Th>Registered At</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4} ta="center">
                  No participants registered yet.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Detail Modal */}
      <Modal
        opened={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
        title={<Title order={4}>Participant Survey Details</Title>}
        size="lg"
      >
        {selectedParticipant && (
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={600} size="xl">
                {selectedParticipant.name}
              </Text>
              <Badge>
                {new Date(
                  selectedParticipant.registered_at,
                ).toLocaleDateString()}
              </Badge>
            </Group>
            <Text c="dimmed">
              {selectedParticipant.email} | {selectedParticipant.contact_number}
            </Text>

            <Title order={5} mt="md">
              Survey Answers
            </Title>
            {selectedParticipant.answers?.length > 0 ? (
              selectedParticipant.answers.map((answer, idx) => (
                <Card key={idx} withBorder shadow="xs" py="xs">
                  <Text fw={500} size="sm">
                    {answer.question_text}
                  </Text>
                  <Text mt="xs">{answer.answer_text}</Text>
                </Card>
              ))
            ) : (
              <Text fs="italic" c="dimmed">
                No additional survey questions answered.
              </Text>
            )}
          </Stack>
        )}
      </Modal>
    </>
  );
}
