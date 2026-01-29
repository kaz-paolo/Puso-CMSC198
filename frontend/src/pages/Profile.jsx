import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Avatar,
  Button,
  Tabs,
  Grid,
  TextInput,
  Select,
  Badge,
  ActionIcon,
  Divider,
  Switch,
  Loader,
  useMantineTheme,
  useMantineColorScheme,
  rem,
} from "@mantine/core";
import {
  IconUser,
  IconHistory,
  IconSettings,
  IconPencil,
  IconCheck,
  IconX,
  IconMapPin,
  IconPhone,
  IconSchool,
  IconBriefcase,
} from "@tabler/icons-react";
import { useUser } from "@stackframe/react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { ThemeSettings } from "../components/ThemeSettings";

// PLACEHOLDER DATA
const PLACEHOLDER_HISTORY = [
  {
    id: 1,
    event: "Community Outreach 2024",
    role: "Logistics",
    date: "2024-02-15",
    status: "Completed",
    hours: 8,
  },
  {
    id: 2,
    event: "Tree Planting Activity",
    role: "Volunteer",
    date: "2024-01-30",
    status: "Completed",
    hours: 4,
  },
  {
    id: 3,
    event: "Coastal Cleanup",
    role: "Documentation",
    date: "2023-11-20",
    status: "Completed",
    hours: 6,
  },
];

function Profile() {
  const user = useUser();
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [themeOpened, setThemeOpened] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // profiledata state
  const [profileData, setProfileData] = useState({
    firstName: "Firstname",
    lastName: "Lastname",
    mobile: "09XXXXXXXXX",
    dob: "XX-XX-XXXX",
    studentNumber: "XXXX-XXXXX",
    college: "XXX",
    degree: "XXX XXXXX XXXXX",
    address: "XXXX, XXXXX",
    classification: "XXXXXX",
  });

  // Fetch data
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${user.id}/basic-info`,
        );
        const data = await res.json();
        console.log("profile.jsx: fetch basic info");

        if (data.success) setProfileData(data.data);
      } catch (err) {
        console.error("Error:", err);
      }
      setLoading(false);
    }
    if (user) fetchProfile();
  }, [user]);

  const handleSave = async () => {
    // TODO: Save
    setIsEditing(false);
  };

  function formatDate(dateString) {
    if (!dateString) return "Not set";

    return new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(dateString));
  }

  const InfoItem = ({ icon: Icon, label, value, name }) => (
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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader type="dots" />
      </div>
    );
  }

  return (
    <Container size="lg">
      {/* Header Card */}
      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        mb="lg"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            background: `linear-gradient(45deg, ${theme.colors.primary[6]}, ${theme.colors.primary[4]})`,
            zIndex: 0,
          }}
        />

        <Group
          align="center"
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 20,
            marginLeft: 20,
            gap: 24,
          }}
        >
          <Avatar
            size={100}
            radius={100}
            src={null}
            color="primary"
            style={{
              border: `4px solid ${
                colorScheme === "dark" ? theme.colors.dark[7] : theme.white
              }`,
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            {`${profileData.first_name || ""} ${profileData.last_name || ""}`
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Title order={2} style={{ textAlign: "left", marginBottom: 4 }}>
              {profileData.first_name} {profileData.last_name}
            </Title>
            <Text c="dimmed" style={{ textAlign: "left" }}>
              {user?.primaryEmail}
            </Text>
          </div>
        </Group>
      </Paper>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="sm" radius="md" p="md" style={{ minHeight: 400 }}>
            <Tabs value={activeTab} onChange={setActiveTab} color="primary">
              <Tabs.List mb="md">
                <Tabs.Tab value="details" leftSection={<IconUser size={18} />}>
                  Details
                </Tabs.Tab>
                <Tabs.Tab
                  value="history"
                  leftSection={<IconHistory size={18} />}
                >
                  History
                </Tabs.Tab>
                <Tabs.Tab
                  value="settings"
                  leftSection={<IconSettings size={18} />}
                >
                  Settings
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="details">
                <Stack gap="xl" p="sm">
                  <div>
                    <Text fz="sm" fw={700} c="dimmed" mb="md">
                      PERSONAL INFORMATION
                    </Text>
                    <Grid>
                      <Grid.Col span={6}>
                        <InfoItem
                          icon={IconUser}
                          label="First Name"
                          value={profileData.first_name}
                          name="firstName"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <InfoItem
                          icon={IconUser}
                          label="Last Name"
                          value={profileData.last_name}
                          name="lastName"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <InfoItem
                          icon={IconUser}
                          label="Date of Birth"
                          value={formatDate(profileData.dob)}
                          name="dob"
                        />
                      </Grid.Col>
                    </Grid>
                  </div>

                  <Divider />

                  <div>
                    <Text fz="sm" fw={700} c="dimmed" mb="md">
                      CONTACT & ADDRESS
                    </Text>
                    <Grid>
                      <Grid.Col span={6}>
                        <InfoItem
                          icon={IconPhone}
                          label="Mobile Number"
                          value={profileData.mobile}
                          name="mobile"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <InfoItem
                          icon={IconMapPin}
                          label="Address"
                          value={profileData.present_address}
                          name="address"
                        />
                      </Grid.Col>
                    </Grid>
                  </div>

                  <Divider />

                  <div>
                    <Text fz="sm" fw={700} c="dimmed" mb="md">
                      ACADEMIC
                    </Text>
                    <Grid>
                      <Grid.Col span={6}>
                        <InfoItem
                          icon={IconSchool}
                          label="Student Number"
                          value={profileData.student_number}
                          name="studentNumber"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <InfoItem
                          icon={IconBriefcase}
                          label="Degree Program"
                          value={profileData.degree}
                          name="degree"
                        />
                      </Grid.Col>
                    </Grid>
                  </div>

                  <Group mt="md">
                    <Button
                      variant={isEditing ? "filled" : "light"}
                      color={isEditing ? "green" : "primary"}
                      leftSection={
                        isEditing ? (
                          <IconCheck size={18} />
                        ) : (
                          <IconPencil size={18} />
                        )
                      }
                      onClick={
                        isEditing ? handleSave : () => setIsEditing(true)
                      }
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                    {isEditing && (
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="lg"
                        onClick={() => setIsEditing(false)}
                      >
                        <IconX size={24} />
                      </ActionIcon>
                    )}
                  </Group>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="history">
                <Stack p="sm">
                  {PLACEHOLDER_HISTORY.map((item) => (
                    <Paper key={item.id} withBorder p="sm" radius="md">
                      <Group justify="space-between">
                        <div>
                          <Text fw={600}>{item.event}</Text>
                          <Text size="xs" c="dimmed">
                            {item.role} • {item.date}
                          </Text>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Badge color="green" variant="light">
                            {item.status}
                          </Badge>
                          <Text size="xs" mt={4}>
                            {item.hours} Hours
                          </Text>
                        </div>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="settings">
                <Stack p="sm" gap="lg">
                  <Group justify="space-between"></Group>
                  <Divider />
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Email Notifications</Text>
                      <Text size="xs" c="dimmed">
                        Receive updates about upcoming events
                      </Text>
                    </div>
                    <Switch defaultChecked color="primary" />
                  </Group>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Profile Visibility</Text>
                      <Text size="xs" c="dimmed">
                        Allow other committee members to see your profile
                      </Text>
                    </div>
                    <Switch defaultChecked color="primary" />
                  </Group>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Grid.Col>

        {/* Sidebar Stats / Summary */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <Paper shadow="sm" radius="md" p="md">
              <Text fz="sm" fw={700} c="dimmed" mb="md" tt="uppercase">
                Contribution Summary
              </Text>
              <Grid>
                <Grid.Col span={6}>
                  <Stack gap={0} align="center">
                    <Text fz="xl" fw={700} c="primary">
                      18
                    </Text>
                    <Text size="xs" c="dimmed">
                      Total Hours
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack gap={0} align="center">
                    <Text fz="xl" fw={700} c="primary">
                      3
                    </Text>
                    <Text size="xs" c="dimmed">
                      Events
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper shadow="sm" radius="md" p="md">
              <Text fz="sm" fw={700} c="dimmed" mb="md" tt="uppercase">
                Committee
              </Text>
              <Group mb="sm">
                <Avatar color="orange" radius="xl">
                  L
                </Avatar>
                <div>
                  <Text size="sm" fw={500}>
                    Logistics
                  </Text>
                  <Text size="xs" c="dimmed">
                    Member
                  </Text>
                </div>
              </Group>
              <Button variant="light" fullWidth size="xs">
                View Committee
              </Button>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default Profile;
