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
} from "@mantine/core";
import {
  IconSearch,
  IconDownload,
  IconPrinter,
  IconDots,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";

function VolunteersTable({ volunteers }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

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
      CANCELLED: "red",
      COMPLETED: "blue",
    };
    return statusColors[status] || "gray";
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
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>View Details</Menu.Item>
            <Menu.Item>Send Message</Menu.Item>
            <Menu.Item color="red">Remove</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
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
            <Table.Th>JOIN STATUS</Table.Th>
            <Table.Th>QUICK ACTION</Table.Th>
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
  );
}

export default VolunteersTable;
