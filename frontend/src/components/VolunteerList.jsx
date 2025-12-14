import {
  Paper,
  Text,
  Stack,
  Group,
  Avatar,
  Badge,
  ScrollArea,
  TextInput,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { useState, useMemo } from "react";

function VolunteerList({ volunteers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [committeeFilter, setCommitteeFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");

  // FILTERS SETUP
  const committees = useMemo(() => {
    const setC = new Set();
    (volunteers || []).forEach((v) => {
      if (v.committee) setC.add(v.committee);
    });
    return ["All", ...Array.from(setC)];
  }, [volunteers]);

  const batches = useMemo(() => {
    const setB = new Set();
    (volunteers || []).forEach((v) => {
      if (v.batch) setB.add(v.batch);
    });
    return ["All", ...Array.from(setB).sort()];
  }, [volunteers]);

  const filteredVolunteers = (volunteers || [])
    .filter(
      (v) =>
        (v.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.committee || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((v) =>
      committeeFilter === "All" ? true : v.committee === committeeFilter
    )
    .filter((v) => (batchFilter === "All" ? true : v.batch === batchFilter));

  console.log(volunteers);

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Volunteers
          </Text>
          <Badge size="lg" variant="light">
            {filteredVolunteers.length} / {volunteers?.length || 0}
          </Badge>
        </Group>

        <Group gap="xs">
          <TextInput
            placeholder="Search volunteers..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="light" size="lg">
                <IconFilter size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Committee</Menu.Label>
              {committees.map((c) => (
                <Menu.Item
                  key={c}
                  onClick={() => setCommitteeFilter(c)}
                  rightSection={committeeFilter === c ? "✓" : null}
                >
                  {c}
                </Menu.Item>
              ))}

              <Menu.Divider />

              <Menu.Label>Batch</Menu.Label>
              {batches.map((b) => (
                <Menu.Item
                  key={b}
                  onClick={() => setBatchFilter(b)}
                  rightSection={batchFilter === b ? "✓" : null}
                >
                  {b === "All" ? "All" : `Batch ${b}`}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>

        <ScrollArea h={400}>
          <Stack gap="xs">
            {filteredVolunteers.map((volunteer) => (
              <Paper key={volunteer.id} p="sm" withBorder>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar color="brand" radius="xl">
                      {volunteer.first_name[0]}
                      {volunteer.last_name[0]}
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>
                        {volunteer.first_name} {volunteer.last_name}{" "}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {volunteer.committee}
                      </Text>
                    </div>
                  </Group>
                  <Badge variant="light">Batch {volunteer.batch}</Badge>
                </Group>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Paper>
  );
}

export default VolunteerList;
