import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Select,
  Alert,
} from "@mantine/core";
import { useState } from "react";

function AddResourceModal({
  opened,
  onClose,
  eventId,
  onResourceCreated,
  parentResources = [],
  uploadedBy,
}) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    parentResourceId: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/resources`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            uploadedBy,
          }),
        },
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: text || `Server error: ${response.status}` };
      }
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // reset form
      setFormData({
        title: "",
        url: "",
        description: "",
        parentResourceId: null,
      });

      if (onResourceCreated) onResourceCreated();
      onClose();
    } catch (error) {
      console.error("Error creating resource:", error);
      setError(error.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add New Resource"
      size="md"
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
          <TextInput
            label="Title"
            placeholder="Enter resource title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <TextInput
            label="URL/Link"
            placeholder="https://example.com"
            required
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />

          <Textarea
            label="Description"
            placeholder="Brief description of the resource"
            minRows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Select
            label="Group Under (Optional)"
            placeholder="Select parent resource to group this link"
            clearable
            data={parentResources.map((resource) => ({
              value: resource.id.toString(),
              label: resource.title,
            }))}
            value={formData.parentResourceId}
            onChange={(value) =>
              setFormData({ ...formData, parentResourceId: value })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add Resource
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default AddResourceModal;
