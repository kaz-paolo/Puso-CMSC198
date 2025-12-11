import { Modal, TextInput, Textarea, Button, Stack, Group, Select } from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { useState } from 'react';

function AddEventModal({ opened, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: null,
    time: '',
    venue: '',
    volunteerCount: '',
    status: 'upcoming',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Database

    console.log('Form submitted:', formData);
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Textarea
            label="Description"
            placeholder="Enter event description"
            required
            minRows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />

          <TextInput
            label="Expected Volunteer Count"
            placeholder="Enter number of volunteers"
            type="number"
            required
            value={formData.volunteerCount}
            onChange={(e) => setFormData({ ...formData, volunteerCount: e.target.value })}
          />

          <Select
            label="Status"
            placeholder="Select status"
            required
            data={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' },
            ]}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Event
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default AddEventModal;