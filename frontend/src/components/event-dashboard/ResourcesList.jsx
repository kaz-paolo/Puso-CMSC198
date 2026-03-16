import { useState } from "react";
import {
  Paper,
  Text,
  Stack,
  Group,
  ActionIcon,
  Button,
  Accordion,
  Badge,
  Menu,
  CopyButton,
  Tooltip,
} from "@mantine/core";
import {
  IconLink,
  IconExternalLink,
  IconPlus,
  IconDots,
  IconCopy,
  IconCheck,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";
import AddResourceModal from "../modal/AddResourceModal";
import { useSession } from "../../hooks/useSession";
import { useExternalLink } from "../../hooks/useExternalLink";
import { useResourceMutation } from "../../hooks/useResourceMutation";

function ResourcesList({
  resources,
  eventId,
  userProfile,
  onResourcesRefresh,
}) {
  const [addResourceOpened, setAddResourceOpened] = useState(false);
  const { session } = useSession();
  const { openLink } = useExternalLink();
  const { deleteResource } = useResourceMutation(
    eventId,
    userProfile,
    onResourcesRefresh,
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const ResourceItem = ({ resource, isSublink = false }) => (
    <Paper p="md" withBorder>
      <Group justify="space-between" wrap="nowrap">
        <div style={{ flex: 1 }}>
          <Group gap="xs" mb="xs">
            <IconLink size={16} />
            <Text fw={600} size="sm">
              {resource.title}
            </Text>
            {isSublink && (
              <Badge size="xs" variant="light" color="gray">
                Sub-link
              </Badge>
            )}
          </Group>
          {resource.description && (
            <Text size="xs" c="dimmed" mb="xs">
              {resource.description}
            </Text>
          )}
          <Group gap="md">
            <Text size="xs" c="dimmed">
              Uploaded by: {resource.uploader}
            </Text>
            <Text size="xs" c="dimmed">
              Added: {formatDate(resource.created_at)}
            </Text>
            {resource.updated_at !== resource.created_at && (
              <Text size="xs" c="dimmed">
                Modified: {formatDate(resource.updated_at)}
              </Text>
            )}
          </Group>
        </div>

        <Group gap="xs">
          <CopyButton value={resource.url}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied!" : "Copy link"}>
                <ActionIcon
                  variant="subtle"
                  color={copied ? "green" : "gray"}
                  onClick={copy}
                >
                  {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>

          <Tooltip label="Open in new tab">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => openLink(resource.url)}
            >
              <IconExternalLink size={18} />
            </ActionIcon>
          </Tooltip>

          {session?.user?.role === "admin" && (
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEdit size={16} />}>Edit</Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size={16} />}
                  color="red"
                  onClick={() => deleteResource(resource.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
    </Paper>
  );

  return (
    <>
      <Paper withBorder p="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group>
            <IconLink size={20} />
            <Text fw={600} size="lg">
              Available Resources and Links
            </Text>
          </Group>
          {session?.user?.role === "admin" && (
            <Button
              leftSection={<IconPlus size={16} />}
              size="xs"
              variant="light"
              onClick={() => setAddResourceOpened(true)}
            >
              Add Resource
            </Button>
          )}
        </Group>

        <Stack gap="md">
          {resources.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No resources available yet
            </Text>
          ) : (
            resources.map((resource) => {
              if (resource.sublinks && resource.sublinks.length > 0) {
                return (
                  <Accordion key={resource.id} variant="separated">
                    <Accordion.Item value={resource.id.toString()}>
                      <Accordion.Control>
                        <Group justify="space-between">
                          <div>
                            <Text fw={600} size="sm">
                              {resource.title}
                            </Text>
                            {resource.description && (
                              <Text size="xs" c="dimmed">
                                {resource.description}
                              </Text>
                            )}
                          </div>
                          <Badge variant="light">
                            {resource.sublinks.length} sub-link
                            {resource.sublinks.length !== 1 ? "s" : ""}
                          </Badge>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="sm">
                          <ResourceItem resource={resource} />
                          {resource.sublinks.map((sublink) => (
                            <ResourceItem
                              key={sublink.id}
                              resource={sublink}
                              isSublink
                            />
                          ))}
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                );
              }

              return <ResourceItem key={resource.id} resource={resource} />;
            })
          )}
        </Stack>
      </Paper>

      <AddResourceModal
        opened={addResourceOpened}
        onClose={() => setAddResourceOpened(false)}
        eventId={eventId}
        onResourceCreated={onResourcesRefresh}
        parentResources={resources.filter((r) => !r.parent_resource_id)}
        uploadedBy={userProfile?.id}
      />
    </>
  );
}

export default ResourcesList;
