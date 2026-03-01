import { Modal, Stack, Button, Text, Group, Badge } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

function SelectRoleModal({ opened, onClose, roles, onSelectRole }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Your Role"
      centered
      size="md"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Please select the role you'd like to volunteer for in this event.
        </Text>

        {roles.map((role) => {
          const isFull = role.current_count >= role.capacity;
          const remaining = role.capacity - (role.current_count || 0);

          return (
            <Button
              key={role.id}
              variant="light"
              size="lg"
              fullWidth
              disabled={isFull}
              onClick={() => onSelectRole(role)}
              styles={{
                root: {
                  height: "auto",
                  padding: "1rem",
                },
              }}
            >
              <Group justify="space-between" style={{ width: "100%" }}>
                <div style={{ textAlign: "left" }}>
                  <Text fw={600}>{role.role_name}</Text>
                  <Group gap="xs" mt={4}>
                    <IconUsers size={14} />
                    <Text size="xs" c="dimmed">
                      {role.current_count || 0}/{role.capacity} filled
                    </Text>
                  </Group>
                </div>
                <Badge color={isFull ? "red" : "green"} variant="light">
                  {isFull ? "Full" : `${remaining} remaining`}
                </Badge>
              </Group>
            </Button>
          );
        })}
      </Stack>
    </Modal>
  );
}

export default SelectRoleModal;
