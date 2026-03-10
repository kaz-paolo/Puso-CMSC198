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
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";

function VolunteersTable({
  volunteers,
  eventId,
  onVolunteersRefresh,
  isAdmin,
  currentUserId,
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    opened: false,
    volunteer: null,
    action: "",
  });

  // extract unique roles and status from volunteers
  const uniqueRoles = useMemo(() => {
    const roles = new Set(volunteers.map((v) => v.role_name || "Volunteer"));
    return ["All", ...Array.from(roles)];
  }, [volunteers]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(volunteers.map((v) => v.volunteer_status));
    return ["All", ...Array.from(statuses)];
  }, [volunteers]);

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const fullName =
      `${volunteer.first_name} ${volunteer.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      (volunteer.student_number || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesRole =
      !roleFilter ||
      roleFilter === "All" ||
      (volunteer.role_name || "Volunteer") === roleFilter;
    const matchesStatus =
      !statusFilter ||
      statusFilter === "All" ||
      volunteer.volunteer_status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    const statusColors = {
      CONFIRMED: "green",
      PENDING: "yellow",
      REMOVED: "red",
      DECLINED: "gray",
    };
    return statusColors[status] || "gray";
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${eventId}/volunteers/${userId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update status");
      }

      notifications.show({
        title: "Success",
        message: `Volunteer status updated to ${newStatus}`,
        color: "green",
      });

      if (onVolunteersRefresh) onVolunteersRefresh();
    } catch (error) {
      console.error("Update status error:", error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update volunteer status",
        color: "red",
      });
    }
  };

  const handleRemoveVolunteer = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${eventId}/volunteers/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletedBy: currentUserId }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to remove volunteer");
      }

      notifications.show({
        title: "Success",
        message: "Volunteer removed from event",
        color: "green",
      });

      if (onVolunteersRefresh) onVolunteersRefresh();
      setConfirmModal({ opened: false, volunteer: null, action: "" });
    } catch (error) {
      console.error("Remove volunteer error:", error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to remove volunteer",
        color: "red",
      });
    }
  };

  const openConfirmModal = (volunteer, action) => {
    setConfirmModal({ opened: true, volunteer, action });
  };

  const rows = filteredVolunteers.map((volunteer) => (
    <Table.Tr key={volunteer.id}>
      <Table.Td>
        <input type="checkbox" />
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Avatar radius="xl" size="md" color="primary">
            {volunteer.first_name.charAt(0)}
            {volunteer.last_name.charAt(0)}
          </Avatar>
          <div>
            <Text size="sm" fw={500}>
              {volunteer.first_name} {volunteer.last_name}
            </Text>
            <Text size="xs" c="dimmed">
              {volunteer.student_number || "N/A"}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" size="sm">
          {volunteer.role_name || "Volunteer"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{volunteer.email || "N/A"}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{volunteer.mobile || "N/A"}</Text>
      </Table.Td>
      <Table.Td>
        <Badge
          color={getStatusColor(volunteer.volunteer_status)}
          variant="light"
        >
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
                    onClick={() =>
                      handleStatusUpdate(volunteer.id, "CONFIRMED")
                    }
                  >
                    Approve
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconX size={16} />}
                    color="orange"
                    onClick={() => handleStatusUpdate(volunteer.id, "DECLINED")}
                  >
                    Decline
                  </Menu.Item>
                </>
              )}
              {volunteer.volunteer_status === "CONFIRMED" && (
                <Menu.Item
                  leftSection={<IconX size={16} />}
                  onClick={() => handleStatusUpdate(volunteer.id, "REMOVED")}
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

        <Text size="xs" c="dimmed" mb="md">
          Showing {filteredVolunteers.length} out of {volunteers.length} total
          volunteers
        </Text>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <input type="checkbox" />
              </Table.Th>
              <Table.Th>VOLUNTEER NAME</Table.Th>
              <Table.Th>ASSIGNED ROLE</Table.Th>
              <Table.Th>EMAIL</Table.Th>
              <Table.Th>CONTACT</Table.Th>
              <Table.Th>STATUS</Table.Th>
              {isAdmin && <Table.Th>ACTIONS</Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Group justify="space-between" mt="md">
          <Text size="xs" c="dimmed">
            Showing 1-{filteredVolunteers.length} out of{" "}
            {filteredVolunteers.length} results
          </Text>
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
            <Button
              color="red"
              onClick={() => handleRemoveVolunteer(confirmModal.volunteer?.id)}
            >
              Remove Volunteer
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default VolunteersTable;
