import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  TextInput,
  Button,
  Menu,
  ActionIcon,
  Table,
  Badge,
  Paper,
  Center,
  Loader,
  HoverCard,
  Modal,
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconEye,
} from "@tabler/icons-react";
import AddEventModal from "../../components/modal/AddEventModal.jsx";
import { getEventStatus } from "../../utils/eventStatus.js";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useEvents } from "../../hooks/useEvents";
import { useNavigate } from "react-router-dom";
import { useEventMutation } from "../../hooks/useEventMutation.js";

export default function EventManagement() {
  const { userProfile } = useUserProfile();
  const { events, loading, error, refetchEvents } = useEvents(userProfile);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [addEventOpened, setAddEventOpened] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { deleteEvent } = useEventMutation(userProfile?.auth_user_id);

  const handleDeleteEvent = async () => {
    if (!selectedEventId) return;

    await deleteEvent(selectedEventId);

    setSelectedEventId(null);
    setIsDeleteModalOpen(false);
  };

  const filteredEvents = events
    .filter((event) => {
      // exclude deleted events
      if (event.deleted_at) {
        return false;
      }

      const eventStatus = getEventStatus(event.start_date, event.end_date);
      if (statusFilter && eventStatus !== statusFilter) {
        return false;
      }
      if (
        searchQuery &&
        !event.event_title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // add filter logic
      return true;
    })
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  const statusColors = {
    ongoing: "green",
    upcoming: "blue",
    completed: "gray",
  };

  const rows = filteredEvents.map((event) => (
    <Table.Tr key={event.id}>
      <Table.Td>
        <Text fw={500} align="left">
          {event.event_title}
        </Text>
      </Table.Td>
      <Table.Td align="left">
        {new Date(event.start_date).toLocaleDateString()} @{" "}
        {new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Table.Td>
      <Table.Td align="left">{event.location}</Table.Td>
      <Table.Td align="left">
        <Badge
          color={statusColors[getEventStatus(event.start_date, event.end_date)]}
          variant="light"
        >
          {getEventStatus(event.start_date, event.end_date)}
        </Badge>
      </Table.Td>
      <Table.Td align="left">
        {event.volunteer_roles && event.volunteer_roles.length > 0 ? (
          <HoverCard width={160} shadow="md" position="top" withArrow>
            <HoverCard.Target>
              <Text size="sm" td="underline" style={{ cursor: "pointer" }}>
                {event.current_volunteers || 0} /{" "}
                {event.volunteer_roles.reduce((acc, r) => acc + r.capacity, 0)}
              </Text>
            </HoverCard.Target>
            {/* // Hovering role to show specifics */}
            <HoverCard.Dropdown>
              <Text size="sm" fw={500} mb="xs">
                Role Breakdown
              </Text>
              {event.volunteer_roles.map((role) => (
                <Group justify="space-between" key={role.id}>
                  <Text size="xs">{role.role_name || "Unnamed Role"}</Text>
                  <Text size="xs">
                    {role.current_count || 0} / {role.capacity}
                  </Text>
                </Group>
              ))}
            </HoverCard.Dropdown>
          </HoverCard>
        ) : (
          <Text size="sm">
            {event.current_volunteers || 0} / {event.volunteer_capacity || 0}
          </Text>
        )}
      </Table.Td>
      <Table.Td align="left">
        {event.registration_allowed ? (
          <Text size="sm">{event.current_participants || 0}</Text>
        ) : (
          <Text size="sm" c="dimmed">
            N/A
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={14} />}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              View Dashboard
            </Menu.Item>
            <Menu.Item leftSection={<IconPencil size={14} />}>
              Edit Event
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setSelectedEventId(event.id);
                setIsDeleteModalOpen(true);
              }}
              color="red"
              leftSection={<IconTrash size={14} />}
            >
              Delete Event
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Event Management</Title>
            <Text c="dimmed">Create, view, and manage all events.</Text>
          </div>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setAddEventOpened(true)}
          >
            Create New Event
          </Button>
        </Group>

        <Group>
          <TextInput
            placeholder="Search by title..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="default" leftSection={<IconFilter size={16} />}>
                Status:{" "}
                {statusFilter
                  ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
                  : "All"}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setStatusFilter(null)}>All</Menu.Item>
              <Menu.Item onClick={() => setStatusFilter("upcoming")}>
                Upcoming
              </Menu.Item>
              <Menu.Item onClick={() => setStatusFilter("ongoing")}>
                Ongoing
              </Menu.Item>
              <Menu.Item onClick={() => setStatusFilter("completed")}>
                Completed
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="default" leftSection={<IconFilter size={16} />}>
                Type: {typeFilter || "All"}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setTypeFilter(null)}>All</Menu.Item>
              <Menu.Item onClick={() => setTypeFilter("Medical Mission")}>
                Medical Mission
              </Menu.Item>
              {/* Add more filter?b */}
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Paper withBorder radius="md" p="0">
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Event Title</Table.Th>
                <Table.Th>Date & Time</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Slots</Table.Th>
                <Table.Th>Participants</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Center py="xl">
                      <Loader />
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : error ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="red" py="xl">
                      Error loading events.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">
                      No events found.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      <AddEventModal
        opened={addEventOpened}
        onClose={() => setAddEventOpened(false)}
        onEventCreated={refetchEvents}
      />

      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Event"
        centered
      >
        <Text size="sm">Are you sure you want to delete this event?</Text>
        <Stack gap="md" mt="md">
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
