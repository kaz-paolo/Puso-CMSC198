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
import { IconPlus, IconTrash, IconLink } from "@tabler/icons-react";
import { useAddTaskForm } from "../../hooks/useAddTaskForm";

function AddTaskModal({ opened, onClose, eventId, onTaskCreated }) {
  const {
    formData,
    setFormData,
    loading,
    error,
    setError,
    assigneeOptions,
    handleAddLink,
    handleRemoveLink,
    handleLinkChange,
    handleSubmit,
  } = useAddTaskForm({ opened, onClose, eventId, onTaskCreated });

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
