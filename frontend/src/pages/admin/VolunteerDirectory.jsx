import { useState, useMemo, useEffect } from "react";
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
  Paper,
  Checkbox,
  Pagination,
  Loader,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconColumns,
  IconDownload,
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

const ALL_COLUMNS = [
  { id: "name", label: "Name" },
  { id: "arukahikBatch", label: "Arukahik Batch" },
  { id: "committees", label: "Committees" },
  { id: "email", label: "Email" },
  { id: "facebook", label: "Facebook Link" },
  { id: "actions", label: "Quick Action" },
];

export default function VolunteerDirectory() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_COLUMNS.map((c) => c.id),
  );

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users`,
      );
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map((user) => ({
          id: user.id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          arukahikBatch: user.arukahik_join_date,
          committees: [user.committee1, user.committee2, user.committee3]
            .filter(Boolean)
            .join(", "),
          email: user.email,
          facebook: user.facebook,
        }));
        setVolunteers(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch volunteers:", error);
    } finally {
      setLoading(false);
    }
  }

  const itemsPerPage = 10;

  // Filter volunteers based on search query
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((vol) =>
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, volunteers]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);
  const paginatedVolunteers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVolunteers.slice(start, start + itemsPerPage);
  }, [filteredVolunteers, currentPage, itemsPerPage]);

  // Handle column visibility toggling
  const toggleColumn = (colId) => {
    setVisibleColumns((prev) =>
      prev.includes(colId)
        ? prev.filter((id) => id !== colId)
        : [...prev, colId],
    );
  };

  // CSV Download logic
  const handleDownloadCSV = (dataToExport) => {
    const colsToExport = ALL_COLUMNS.filter(
      (c) => visibleColumns.includes(c.id) && c.id !== "actions",
    );

    const headers = colsToExport.map((c) => c.label).join(",");

    const csvRows = dataToExport.map((vol) => {
      return colsToExport
        .map((col) => {
          const val = vol[col.id];
          return `"${val ? String(val).replace(/"/g, '""') : "No Data"}"`;
        })
        .join(",");
    });

    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "volunteer_directory.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startIdx =
    filteredVolunteers.length === 0 || loading
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(
    currentPage * itemsPerPage,
    filteredVolunteers.length,
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} align="left">
            Volunteer Directory
          </Title>
          <Text c="dimmed" align="left">
            Manage and view all registered volunteers.
          </Text>
        </div>

        <Group justify="space-between">
          <Group style={{ flex: 1 }}>
            {/* Add/Remove Columns Menu */}
            <Menu shadow="md" width={200} closeOnItemClick={false}>
              <Menu.Target>
                <Button
                  variant="default"
                  leftSection={<IconColumns size={16} />}
                >
                  Columns
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Toggle Columns</Menu.Label>
                {ALL_COLUMNS.map((col) => (
                  <Menu.Item key={col.id}>
                    <Checkbox
                      label={col.label}
                      checked={visibleColumns.includes(col.id)}
                      onChange={() => toggleColumn(col.id)}
                    />
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            {/* Search Bar */}
            <TextInput
              placeholder="Search by name..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              style={{ flex: 1, maxWidth: 400 }}
            />
            <Text size="sm" c="dimmed">
              Showing {filteredVolunteers.length} out of {volunteers.length}{" "}
              volunteers
            </Text>
          </Group>

          {/* Filter Button */}
          <Button variant="default" leftSection={<IconFilter size={16} />}>
            Filter
          </Button>
        </Group>

        {/* Main Table */}
        <Paper withBorder radius="md" p="0">
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {ALL_COLUMNS.filter((col) =>
                  visibleColumns.includes(col.id),
                ).map((col) => (
                  <Table.Th key={col.id}>{col.label}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={visibleColumns.length} ta="center" py="xl">
                    <Loader />
                  </Table.Td>
                </Table.Tr>
              ) : paginatedVolunteers.length > 0 ? (
                paginatedVolunteers.map((vol) => (
                  <Table.Tr key={vol.id} align="left">
                    {visibleColumns.includes("name") && (
                      <Table.Td fw={500}>{vol.name || "No Data"}</Table.Td>
                    )}
                    {visibleColumns.includes("arukahikBatch") && (
                      <Table.Td>{vol.arukahikBatch || "No Data"}</Table.Td>
                    )}
                    {visibleColumns.includes("committees") && (
                      <Table.Td>{vol.committees || "No Data"}</Table.Td>
                    )}
                    {visibleColumns.includes("email") && (
                      <Table.Td>{vol.email || "No Data"}</Table.Td>
                    )}
                    {visibleColumns.includes("facebook") && (
                      <Table.Td>
                        {vol.facebook ? (
                          <Text
                            component="a"
                            href={`https://${vol.facebook}`}
                            target="_blank"
                            c="blue"
                            size="sm"
                          >
                            {vol.facebook}
                          </Text>
                        ) : (
                          "No Data"
                        )}
                      </Table.Td>
                    )}
                    {visibleColumns.includes("actions") && (
                      <Table.Td>
                        <Menu shadow="md" width={150} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEye size={14} />}>
                              View Profile
                            </Menu.Item>
                            <Menu.Item leftSection={<IconPencil size={14} />}>
                              Edit Info
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              leftSection={<IconTrash size={14} />}
                            >
                              Remove
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td
                    colSpan={visibleColumns.length}
                    ta="center"
                    py="xl"
                    c="dimmed"
                  >
                    No Data
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>

        {/* Footer Area */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Showing {startIdx}-{endIdx} out of {filteredVolunteers.length}{" "}
            results
          </Text>

          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
          />

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="light" leftSection={<IconDownload size={16} />}>
                Download CSV
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => handleDownloadCSV(volunteers)}>
                All Data
              </Menu.Item>
              <Menu.Item onClick={() => handleDownloadCSV(paginatedVolunteers)}>
                Currently Shown Data
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Stack>
    </Container>
  );
}
