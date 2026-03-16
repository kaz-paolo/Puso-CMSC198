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
import { useAddResourceForm } from "../../hooks/useAddResourceForm";

function AddResourceModal({
  opened,
  onClose,
  eventId,
  onResourceCreated,
  parentResources = [],
  uploadedBy,
}) {
  const { formData, setFormData, error, setError, loading, handleSubmit } =
    useAddResourceForm({
      eventId,
      onResourceCreated,
      uploadedBy,
      onClose,
    });

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
