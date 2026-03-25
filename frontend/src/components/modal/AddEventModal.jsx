import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Select,
  Switch,
  NumberInput,
  SegmentedControl,
  ActionIcon,
  Alert,
  Text,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useAddEventForm } from "../../hooks/useAddEventForm";

function AddEventModal({ opened, onClose, onEventCreated }) {
  const {
    formData,
    setFormData,
    capacityType,
    setCapacityType,
    error,
    setError,
    handleAddRole,
    handleRemoveRole,
    handleRoleChange,
    handleSubmit,
  } = useAddEventForm({ onEventCreated, onClose });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          Create New Event
        </Text>
      }
      size="lg"
      centered
      closeOnClickOutside={false}
      closeOnEscape={true}
      trapFocus
      withinPortal={true}
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
          <TextInput
            label="Event Title"
            placeholder="Enter event title"
            required
            value={formData.event_title}
            onChange={(e) =>
              setFormData({ ...formData, event_title: e.target.value })
            }
          />

          <Textarea
            label="Description"
            placeholder="Enter event description"
            required
            minRows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Select
            label="Event Type"
            placeholder="Select event type"
            required
            data={[
              "Academic",
              "Community",
              "Recreation",
              "Creative",
              "Career",
              "Service",
              "Administrative",
              "Environment",
              "Health",
            ]}
            value={formData.event_type}
            onChange={(value) =>
              setFormData({ ...formData, event_type: value })
            }
          />

          <TextInput
            label="Location"
            placeholder="Enter event location"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />

          <Group grow>
            <DatePickerInput
              label="Start Date"
              placeholder="Select date"
              required
              value={formData.start_date}
              onChange={(date) =>
                setFormData({ ...formData, start_date: date })
              }
            />
            <TimeInput
              label="Start Time"
              placeholder="Select time"
              required
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
            />
          </Group>

          <Group grow>
            <DatePickerInput
              label="End Date"
              placeholder="Select date"
              required
              value={formData.end_date}
              onChange={(date) => setFormData({ ...formData, end_date: date })}
            />
            <TimeInput
              label="End Time"
              placeholder="Select time"
              required
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
            />
          </Group>

          <Group grow>
            <Switch
              label="Allow Registration"
              checked={formData.registration_allowed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registration_allowed: e.currentTarget.checked,
                })
              }
            />
            <Switch
              label="Require Approval"
              description="Volunteers need admin approval to join"
              checked={formData.approval_required}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  approval_required: e.currentTarget.checked,
                })
              }
            />
            <Switch
              label="Publish Event"
              checked={formData.publish_event}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publish_event: e.currentTarget.checked,
                })
              }
            />
          </Group>

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Volunteer Capacity
            </Text>
            <SegmentedControl
              value={capacityType}
              onChange={setCapacityType}
              data={[
                { label: "Simple", value: "simple" },
                { label: "By Roles", value: "roles" },
              ]}
            />
            {capacityType === "simple" ? (
              <NumberInput
                placeholder="Enter number of volunteers"
                required
                value={formData.volunteer_capacity}
                onChange={(value) =>
                  setFormData({ ...formData, volunteer_capacity: value })
                }
                min={0}
              />
            ) : (
              <Stack gap="xs">
                {formData.volunteer_roles.map((role, index) => (
                  <Group key={index} grow>
                    <TextInput
                      placeholder="Role Name (e.g. Logistics)"
                      value={role.role_name || role.role || ""}
                      onChange={(e) =>
                        handleRoleChange(index, "role_name", e.target.value)
                      }
                    />
                    <NumberInput
                      placeholder="Number of volunteers"
                      value={role.capacity}
                      onChange={(value) =>
                        handleRoleChange(index, "capacity", value)
                      }
                      min={1}
                    />
                    <ActionIcon
                      color="red"
                      onClick={() => handleRemoveRole(index)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  leftSection={<IconPlus size={14} />}
                  variant="outline"
                  onClick={handleAddRole}
                >
                  Add Role
                </Button>
              </Stack>
            )}
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default AddEventModal;
