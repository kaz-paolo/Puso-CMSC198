import {
  Paper,
  Text,
  Table,
  Avatar,
  Badge,
  TextInput,
  Group,
  ActionIcon,
  Menu,
  Button,
  Select,
  Stack,
  Modal,
} from "@mantine/core";
import {
  IconSearch,
  IconDownload,
  IconPrinter,
  IconDots,
  IconCheck,
  IconX,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { useVolunteerMutation } from "../../hooks/useVolunteerMutation";
import { useVolunteerFilters } from "../../hooks/useFilteredData";

function VolunteersTable({
  volunteers,
  eventId,
  onVolunteersRefresh,
  isAdmin,
  currentUserId,
}) {
  const {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    filteredVolunteers,
    uniqueRoles,
    uniqueStatuses,
  } = useVolunteerFilters(volunteers);

  const { updateStatus, removeVolunteer } = useVolunteerMutation(
    eventId,
    onVolunteersRefresh,
  );

  const [confirmModal, setConfirmModal] = useState({
    opened: false,
    volunteer: null,
    action: "",
  });

  const openConfirmModal = (volunteer, action) => {
    setConfirmModal({
      opened: true,
      volunteer,
      action,
    });
  };

  const handleRemove = async () => {
    if (confirmModal.volunteer) {
      await removeVolunteer(confirmModal.volunteer.id);
    }
    setConfirmModal({
      opened: false,
      volunteer: null,
      action: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "green";
      case "PENDING":
        return "yellow";
      case "DECLINED":
        return "red";
      case "REMOVED":
        return "gray";
      default:
        return "blue";
    }
  };

  const rows = filteredVolunteers.map((volunteer) => (
    <Table.Tr key={volunteer.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar color="primary" radius="xl">
            {volunteer.first_name[0]}
            {volunteer.last_name[0]}
          </Avatar>
          <div>
            <Text size="sm" fw={500}>
              {volunteer.first_name} {volunteer.last_name}
            </Text>
            <Text size="xs" c="dimmed">
              {volunteer.email || "No email"}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color={volunteer.role_name ? "blue" : "gray"}>
          {volunteer.role_name || "Volunteer"}
        </Badge>
      </Table.Td>
      <Table.Td>
        {volunteer.student_number || (
          <Text size="sm" c="dimmed">
            Not provided
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(volunteer.volunteer_status)} variant="dot">
          {volunteer.volunteer_status}
        </Badge>
      </Table.Td>
      <Table.Td>
        {isAdmin && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {volunteer.volunteer_status === "PENDING" && (
                <>
                  <Menu.Item
                    leftSection={<IconCheck size={16} />}
                    color="green"
                    onClick={() => updateStatus(volunteer.id, "CONFIRMED")}
                  >
                    Approve
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconX size={16} />}
                    color="orange"
                    onClick={() => updateStatus(volunteer.id, "DECLINED")}
                  >
                    Decline
                  </Menu.Item>
                </>
              )}
              {volunteer.volunteer_status === "CONFIRMED" && (
                <Menu.Item
                  leftSection={<IconX size={16} />}
                  color="gray"
                  onClick={() => updateStatus(volunteer.id, "REMOVED")}
                >
                  Mark as Removed
                </Menu.Item>
              )}
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={() => openConfirmModal(volunteer, "remove")}
              >
                Remove from Event
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Paper withBorder p="lg" radius="md">
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search volunteers..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: 300 }}
          />
          <Text size="xs" c="dimmed">
            Showing {filteredVolunteers.length} out of {volunteers.length} total
            volunteers
          </Text>
          <Group gap="xs">
            <Select
              placeholder="Role"
              data={uniqueRoles}
              value={roleFilter}
              onChange={setRoleFilter}
              clearable
              style={{ width: 150 }}
            />
            <Select
              placeholder="Status"
              data={uniqueStatuses}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
              style={{ width: 150 }}
            />
            <ActionIcon variant="subtle" size="lg">
              <IconDownload size={18} />
            </ActionIcon>
            <ActionIcon variant="subtle" size="lg">
              <IconPrinter size={18} />
            </ActionIcon>
          </Group>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>ID Number</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody align="left">
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">
                  <Text c="dimmed" py="xl">
                    No volunteers found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        <Group justify="flex-end" mt="md">
          <Group gap="xs">
            <Button variant="subtle" size="xs" disabled>
              Previous
            </Button>
            <Button variant="subtle" size="xs" disabled>
              Next
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModal.opened}
        onClose={() =>
          setConfirmModal({ opened: false, volunteer: null, action: "" })
        }
        title="Confirm Action"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to remove{" "}
            <Text span fw={600}>
              {confirmModal.volunteer?.first_name}{" "}
              {confirmModal.volunteer?.last_name}
            </Text>{" "}
            from this event? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() =>
                setConfirmModal({ opened: false, volunteer: null, action: "" })
              }
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleRemove}>
              Remove
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default VolunteersTable;
