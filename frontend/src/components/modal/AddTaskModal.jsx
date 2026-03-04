import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Select,
  ActionIcon,
  Text,
  Alert,
  MultiSelect,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useState, useEffect } from "react";
import { IconPlus, IconTrash, IconLink } from "@tabler/icons-react";
import { authClient } from "../../auth.js";

function AddTaskModal({ opened, onClose, eventId, onTaskCreated }) {
  const [session, setSession] = useState(null);
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      setSession(data);
    };
    fetchSession();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    task_title: "",
    category: "",
    status: "To Do",
    priority: "",
    deadline_date: null,
    deadline_time: "",
    task_details: "",
    relevant_links: [""],
    assignees: [],
  });

  useEffect(() => {
    if (opened && eventId) {
      fetchVolunteersAndRoles();
    }
  }, [opened, eventId]);

  const fetchVolunteersAndRoles = async () => {
    try {
      // get volunteers from event to be assigned
      const volRes = await fetch(
        `http://localhost:3000/api/events/${eventId}/volunteers`,
      );
      const volData = await volRes.json();

      if (volData.success) {
        setVolunteers(
          volData.data.map((v) => ({
            value: `user-${v.id}`,
            label: `${v.first_name} ${v.last_name}`,
            type: "user",
            id: v.id,
          })),
        );
      }

      // get event details for roles to be assigned
      const eventRes = await fetch(
        `http://localhost:3000/api/events/${eventId}`,
      );
      const eventData = await eventRes.json();

      if (eventData.success && eventData.data.volunteer_roles) {
        setRoles(
          eventData.data.volunteer_roles.map((r) => ({
            value: `role-${r.id}`,
            label: r.role_name,
            type: "role",
            id: r.id,
          })),
        );
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      relevant_links: [...prev.relevant_links, ""],
    }));
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      relevant_links: prev.relevant_links.filter((_, i) => i !== index),
    }));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.relevant_links];
    newLinks[index] = value;
    setFormData((prev) => ({ ...prev, relevant_links: newLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // fetch user database ID
      const userRes = await fetch(
        `http://localhost:3000/api/users/${session.user.id}/basic-info`,
      );
      const userData = await userRes.json();

      if (!userData.success) {
        throw new Error("Failed to get user information");
      }

      // format assignees
      const assignees = formData.assignees.map((a) => {
        const [type, id] = a.split("-");
        return { type, id: parseInt(id) };
      });

      // filter  empty links
      const relevant_links = formData.relevant_links.filter((link) => link);

      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const submissionData = {
        ...formData,
        deadline_date: formatDate(formData.deadline_date),
        relevant_links,
        assignees,
        created_by: userData.data.id,
      };

      const response = await fetch(
        `http://localhost:3000/api/events/${eventId}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create task");

      // reset
      setFormData({
        task_title: "",
        category: "",
        status: "To Do",
        priority: "",
        deadline_date: null,
        deadline_time: "",
        task_details: "",
        relevant_links: [""],
        assignees: [],
      });

      if (onTaskCreated) onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      setError(error.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const assigneeOptions = [...volunteers, ...roles];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          Create New Task
        </Text>
      }
      size="lg"
      centered
    >
      {error && (
        <Alert
          color="red"
          mb="md"
          onClose={() => setError(null)}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {/* Task Title */}
          <TextInput
            label="Task Title"
            placeholder="Task Title"
            required
            value={formData.task_title}
            onChange={(e) =>
              setFormData({ ...formData, task_title: e.target.value })
            }
          />

          {/* Category and Assignee */}
          <Group grow>
            <Select
              // TODO: to be updated
              label="Category"
              placeholder="Select Category"
              required
              data={[
                { value: "Category 1", label: "Category 1" },
                { value: "Category 2", label: "Category 2" },
                { value: "Category 3", label: "Category 3" },
              ]}
              value={formData.category}
              onChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            />

            <MultiSelect
              label="Assignee"
              placeholder="Search volunteers or roles"
              data={assigneeOptions}
              value={formData.assignees}
              onChange={(value) =>
                setFormData({ ...formData, assignees: value })
              }
              searchable
              clearable
            />
          </Group>

          {/* Status and Priority */}
          <Group grow>
            <Select
              label="Status"
              required
              data={[
                { value: "To Do", label: "To Do" },
                { value: "In Progress", label: "In Progress" },
                { value: "In Review", label: "In Review" },
                { value: "Done", label: "Done" },
              ]}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
            />

            <Select
              label="Priority"
              placeholder="Select Priority"
              data={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
              value={formData.priority}
              onChange={(value) =>
                setFormData({ ...formData, priority: value })
              }
            />
          </Group>

          {/* Deadline */}
          <Group grow>
            <DatePickerInput
              label="Deadline"
              placeholder="mm/dd/yyyy"
              value={formData.deadline_date}
              onChange={(date) =>
                setFormData({ ...formData, deadline_date: date })
              }
            />
            <TimeInput
              label="Time"
              placeholder="--:-- --"
              value={formData.deadline_time}
              onChange={(e) =>
                setFormData({ ...formData, deadline_time: e.target.value })
              }
            />
          </Group>

          {/* Relevant Links */}
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Relevant Link
              </Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={handleAddLink}
              >
                Add Link
              </Button>
            </Group>

            {formData.relevant_links.map((link, index) => (
              <Group key={index} gap="xs">
                <TextInput
                  placeholder="https://"
                  leftSection={<IconLink size={16} />}
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                {formData.relevant_links.length > 1 && (
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => handleRemoveLink(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                )}
              </Group>
            ))}
          </Stack>

          {/* Task Details */}
          <Stack gap={4}>
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Task Details
              </Text>
              <Group gap="xs">
                <ActionIcon variant="subtle" size="sm">
                  <Text fw={700}>B</Text>
                </ActionIcon>
                <ActionIcon variant="subtle" size="sm">
                  <Text fw={500} fs="italic">
                    I
                  </Text>
                </ActionIcon>
                <ActionIcon variant="subtle" size="sm">
                  ≡
                </ActionIcon>
                <ActionIcon variant="subtle" size="sm">
                  ≡
                </ActionIcon>
              </Group>
            </Group>
            <Textarea
              placeholder="Enter detailed instructions..."
              minRows={4}
              value={formData.task_details}
              onChange={(e) =>
                setFormData({ ...formData, task_details: e.target.value })
              }
            />
          </Stack>

          {/* Actions */}
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} color="green">
              Create Task
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default AddTaskModal;
