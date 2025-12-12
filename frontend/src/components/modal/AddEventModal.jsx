import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Select,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useState } from "react";

function AddEventModal({ opened, onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    date: null,
    time: "",
    venue: "",
    volunteer_count: "",
    status: "upcoming",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/events/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: formData.event_name,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          venue: formData.venue,
          volunteer_count: formData.volunteer_count,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create event");

      setFormData({
        event_name: "",
        description: "",
        date: null,
        time: "",
        venue: "",
        volunteer_count: "",
        status: "upcoming",
      });
    } catch (error) {
      console.error("Error", error);
    }

    console.log("Form submitted:", formData);
    if (onEventCreated) onEventCreated();

    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add New Event"
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Event Name"
            placeholder="Enter event name"
            required
            value={formData.event_name}
            onChange={(e) =>
              setFormData({ ...formData, event_name: e.target.value })
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

          <DatePickerInput
            label="Event Date"
            placeholder="Select date"
            required
            value={formData.date}
            onChange={(date) => setFormData({ ...formData, date })}
          />

          <TimeInput
            label="Event Time"
            placeholder="Select time"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />

          <TextInput
            label="Venue"
            placeholder="Enter venue location"
            required
            value={formData.venue}
            onChange={(e) =>
              setFormData({ ...formData, venue: e.target.value })
            }
          />

          <TextInput
            label="Expected Volunteer Count"
            placeholder="Enter number of volunteers"
            type="number"
            required
            value={formData.volunteer_count}
            onChange={(e) =>
              setFormData({ ...formData, volunteer_count: e.target.value })
            }
          />

          <Select
            label="Status"
            placeholder="Select status"
            required
            data={[
              { value: "upcoming", label: "Upcoming" },
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" },
            ]}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
          />

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
