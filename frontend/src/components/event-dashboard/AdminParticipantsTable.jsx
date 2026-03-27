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
  ActionIcon,
} from "@mantine/core";
import { IconEye } from "@tabler/icons-react";

export default function AdminParticipantsTable({ eventId }) {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL || ""}/api/events/${eventId}/survey/responses`,
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to fetch participants: ${res.status} ${res.statusText}. ${errorText}`,
        );
      }
      const data = await res.json();
      if (data.success) {
        setParticipants(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch participants:", err);
    }
  };

  const rows = participants.map((p) => (
    <Table.Tr key={p.id}>
      <Table.Td>
        <Text fw={500}>{p.registration_id || "N/A"}</Text>
      </Table.Td>
      <Table.Td>{p.name}</Table.Td>
      <Table.Td>{p.email}</Table.Td>
      <Table.Td>{p.contact_number}</Table.Td>
      <Table.Td>
        <Badge color="gray" variant="light">
          v{p.survey_version || 1}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(p.registered_at).toLocaleString()}</Table.Td>
      <Table.Td>
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => setSelectedParticipant(p)}
        >
          <IconEye size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Card withBorder shadow="sm">
        <Group justify="space-between" mb="md">
          <Title order={3}>Registered Participants</Title>
          <Badge size="lg">{participants.length} Participant(s)</Badge>
        </Group>

        <Table highlightOnHover striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Reg ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Contact Number</Table.Th>
              <Table.Th>Version</Table.Th>
              <Table.Th>Registered At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody align="left">
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} ta="center">
                  <Text c="dimmed">No participants registered yet.</Text>
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
            {selectedParticipant.registration_id && (
              <Group justify="space-between">
                <Text c="dimmed" size="sm">
                  Registration ID:
                </Text>
                <Badge variant="light" color="blue">
                  {selectedParticipant.registration_id}
                </Badge>
              </Group>
            )}
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
              {selectedParticipant.email} • {selectedParticipant.contact_number}
            </Text>

            <Title order={5} mt="md">
              Custom Survey Answers
            </Title>

            {selectedParticipant.answers &&
            selectedParticipant.answers.length > 0 ? (
              selectedParticipant.answers.map((answer, idx) => (
                <Card key={idx} withBorder shadow="xs" py="xs">
                  <Text fw={600} size="sm">
                    {answer.question_text || `Question ${idx + 1}`}
                  </Text>
                  <Text mt="xs">{answer.answer_text}</Text>
                </Card>
              ))
            ) : (
              <Card withBorder shadow="none" bg="var(--mantine-color-gray-0)">
                <Text fs="italic" c="dimmed" ta="center">
                  No additional survey questions answered.
                </Text>
              </Card>
            )}
          </Stack>
        )}
      </Modal>
    </>
  );
}
