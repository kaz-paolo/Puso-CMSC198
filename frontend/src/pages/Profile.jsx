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
  rem
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
  IconBriefcase
} from "@tabler/icons-react";
import { useUser } from "@stackframe/react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { ThemeSettings } from "../components/ThemeSettings";

// PLACEHOLDER DATA
const PLACEHOLDER_HISTORY = [
  { id: 1, event: "Community Outreach 2024", role: "Logistics", date: "2024-02-15", status: "Completed", hours: 8 },
  { id: 2, event: "Tree Planting Activity", role: "Volunteer", date: "2024-01-30", status: "Completed", hours: 4 },
  { id: 3, event: "Coastal Cleanup", role: "Documentation", date: "2023-11-20", status: "Completed", hours: 6 },
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
    classification: "XXXXXX"
  });

  // Fetch data
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        // TODO: 
      } catch (err) {
        // fallback
      }
      setLoading(false);
    }
    if (user) fetchProfile();
  }, [user]);

  const handleSave = async () => {
    // TODO: Save
    setIsEditing(false);
  };

  const InfoItem = ({ icon: Icon, label, value, name }) => (
    <Group wrap="nowrap" align="flex-start">
      <Icon size={20} style={{ marginTop: 4, opacity: 0.7 }} />
      <div style={{ flex: 1 }}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {label}
        </Text>
        {isEditing ? (
          <TextInput 
            value={profileData[name]} 
            onChange={(e) => setProfileData({ ...profileData, [name]: e.target.value })}
            size="xs"
            mt={4}
          />
        ) : (
          <Text size="sm" mt={2}>{value || "Not set"}</Text>
        )}
      </div>
    </Group>
  );

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Loader type="dots" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Header onThemeClick={() => setThemeOpened(true)} />
      
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <NavBar />
        
        <div style={{ 
          flex: 1, 
          overflow: "auto", 
          padding: "2rem",
          backgroundColor: colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] 
        }}>
          <ThemeSettings opened={themeOpened} onClose={() => setThemeOpened(false)} />

          <Container size="lg">
            {/* Header Card */}
            <Paper shadow="sm" radius="md" p="xl" mb="lg" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, height: 120, 
                background: `linear-gradient(45deg, ${theme.colors.brand[6]}, ${theme.colors.brand[4]})`,
                zIndex: 0
              }} />
              
              <Group align="flex-end" style={{ position: 'relative', zIndex: 1, marginTop: 40 }}>
                <Avatar 
                  size={120} 
                  radius={120} 
                  src={null} 
                  color="brand" 
                  style={{ border: `4px solid ${colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}` }}
                >
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </Avatar>
                <div style={{ paddingBottom: 10, flex: 1 }}>
                  <Title order={2}>{profileData.firstName} {profileData.lastName}</Title>
                  <Text c="dimmed">{user?.primaryEmail}</Text>
                  <Group mt={8}>
                    <Badge variant="light" color="blue">{profileData.classification}</Badge>
                    <Badge variant="outline" color="gray">{profileData.college}</Badge>
                  </Group>
                </div>
              </Group>
            </Paper>

            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper shadow="sm" radius="md" p="md" style={{ minHeight: 400 }}>
                  <Tabs value={activeTab} onChange={setActiveTab} color="brand">
                    <Tabs.List mb="md">
                      <Tabs.Tab value="details" leftSection={<IconUser size={18} />}>Details</Tabs.Tab>
                      <Tabs.Tab value="history" leftSection={<IconHistory size={18} />}>History</Tabs.Tab>
                      <Tabs.Tab value="settings" leftSection={<IconSettings size={18} />}>Settings</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="details">
                      <Stack gap="xl" p="sm">
                        <div>
                          <Text fz="sm" fw={700} c="dimmed" mb="md">PERSONAL INFORMATION</Text>
                          <Grid>
                            <Grid.Col span={6}>
                              <InfoItem icon={IconUser} label="First Name" value={profileData.firstName} name="firstName" />
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <InfoItem icon={IconUser} label="Last Name" value={profileData.lastName} name="lastName" />
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <InfoItem icon={IconUser} label="Date of Birth" value={profileData.dob} name="dob" />
                            </Grid.Col>
                          </Grid>
                        </div>
                        
                        <Divider />

                        <div>
                          <Text fz="sm" fw={700} c="dimmed" mb="md">CONTACT & ADDRESS</Text>
                          <Grid>
                            <Grid.Col span={6}>
                              <InfoItem icon={IconPhone} label="Mobile Number" value={profileData.mobile} name="mobile" />
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <InfoItem icon={IconMapPin} label="Address" value={profileData.address} name="address" />
                            </Grid.Col>
                          </Grid>
                        </div>

                        <Divider />

                        <div>
                          <Text fz="sm" fw={700} c="dimmed" mb="md">ACADEMIC</Text>
                          <Grid>
                            <Grid.Col span={6}>
                              <InfoItem icon={IconSchool} label="Student Number" value={profileData.studentNumber} name="studentNumber" />
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <InfoItem icon={IconBriefcase} label="Degree Program" value={profileData.degree} name="degree" />
                            </Grid.Col>
                          </Grid>
                        </div>

                        <Group mt="md">
                          <Button 
                            variant={isEditing ? "filled" : "light"} 
                            color={isEditing ? "green" : "brand"}
                            leftSection={isEditing ? <IconCheck size={18} /> : <IconPencil size={18} />}
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
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
                                <Text size="xs" c="dimmed">{item.role} • {item.date}</Text>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <Badge color="green" variant="light">{item.status}</Badge>
                                <Text size="xs" mt={4}>{item.hours} Hours</Text>
                              </div>
                            </Group>
                          </Paper>
                        ))}
                      </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="settings">
                      <Stack p="sm" gap="lg">
                        <Group justify="space-between">
                          <Switch 
                            checked={colorScheme === 'dark'} 
                            onChange={() => toggleColorScheme()} 
                            color="brand"
                          />
                        </Group>
                        <Divider />
                        <Group justify="space-between">
                          <div>
                            <Text fw={500}>Email Notifications</Text>
                            <Text size="xs" c="dimmed">Receive updates about upcoming events</Text>
                          </div>
                          <Switch defaultChecked color="brand" />
                        </Group>
                        <Group justify="space-between">
                          <div>
                            <Text fw={500}>Profile Visibility</Text>
                            <Text size="xs" c="dimmed">Allow other committee members to see your profile</Text>
                          </div>
                          <Switch defaultChecked color="brand" />
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
                    <Text fz="sm" fw={700} c="dimmed" mb="md" tt="uppercase">Contribution Summary</Text>
                    <Grid>
                      <Grid.Col span={6}>
                        <Stack gap={0} align="center">
                          <Text fz="xl" fw={700} c="brand">18</Text>
                          <Text size="xs" c="dimmed">Total Hours</Text>
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Stack gap={0} align="center">
                          <Text fz="xl" fw={700} c="brand">3</Text>
                          <Text size="xs" c="dimmed">Events</Text>
                        </Stack>
                      </Grid.Col>
                    </Grid>
                  </Paper>

                  <Paper shadow="sm" radius="md" p="md">
                     <Text fz="sm" fw={700} c="dimmed" mb="md" tt="uppercase">Committee</Text>
                     <Group mb="sm">
                        <Avatar color="orange" radius="xl">L</Avatar>
                        <div>
                            {/* HARDCODED */}
                          <Text size="sm" fw={500}>Logistics</Text>
                          <Text size="xs" c="dimmed">Member</Text>
                        </div>
                     </Group>
                     <Button variant="light" fullWidth size="xs">View Committee</Button>
                  </Paper>
                </Stack>
              </Grid.Col>
            </Grid>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Profile;