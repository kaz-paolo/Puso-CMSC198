import { Group, Text, TextInput } from "@mantine/core";

export function InfoItem({ icon: Icon, label, value, name, isEditing, setProfileData, profileData }) {
  return (
    <Group wrap="nowrap" align="center" gap={8} style={{ width: "100%" }}>
      <Icon size={20} style={{ opacity: 0.7 }} />
      <Text
        size="xs"
        c="dimmed"
        tt="uppercase"
        fw={700}
        style={{ minWidth: 90 }}
      >
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          value={profileData[name]}
          onChange={(e) =>
            setProfileData({ ...profileData, [name]: e.target.value })
          }
          size="xs"
          style={{ flex: 1 }}
        />
      ) : (
        <Text size="sm" style={{ flex: 1 }}>
          {value || "Not set"}
        </Text>
      )}
    </Group>
  );
}
