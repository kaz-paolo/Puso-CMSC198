import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  TextInput,
  Select,
  FileInput,
  Checkbox,
  Alert,
  Grid,
  Textarea,
  Card,
  RingProgress,
  SimpleGrid,
  Anchor,
} from "@mantine/core";
import {
  IconUser,
  IconHome,
  IconBriefcase,
  IconListCheck,
  IconShieldCheck,
  IconExclamationCircle,
  IconCheck,
  IconSchool,
  IconHeartHandshake,
  IconTools,
  IconHealthRecognition,
} from "@tabler/icons-react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useVolunteerForm } from "../hooks/useVolunteerForm.js";

const SECTIONS = [
  {
    key: "personal",
    title: "Personal Details",
    description: "Basic information about you.",
    icon: IconUser,
    required: ["firstName", "lastName", "sex", "birthDate"],
    fields: [
      {
        span: 4,
        name: "firstName",
        label: "First Name",
        component: TextInput,
        required: true,
      },
      {
        span: 4,
        name: "middleName",
        label: "Middle Name",
        component: TextInput,
      },
      {
        span: 4,
        name: "lastName",
        label: "Last Name",
        component: TextInput,
        required: true,
      },
      { span: 4, name: "nickname", label: "Nickname", component: TextInput },
      {
        span: 4,
        name: "sex",
        label: "Sex Assigned at Birth",
        component: Select,
        data: ["Male", "Female", "Other"],
        required: true,
      },
      {
        span: 4,
        name: "civilStatus",
        label: "Civil Status",
        component: Select,
        data: ["Single", "Married", "Divorced", "Widowed"],
      },
      {
        span: 4,
        name: "birthDate",
        label: "Date of Birth",
        component: TextInput,
        type: "date",
        required: true,
      },
      {
        span: 8,
        name: "birthPlace",
        label: "Place of Birth",
        component: TextInput,
      },
      { span: 4, name: "height", label: "Height (cm)", component: TextInput },
      { span: 4, name: "weight", label: "Weight (kg)", component: TextInput },
      { span: 4, name: "bloodType", label: "Blood Type", component: TextInput },
      {
        span: 12,
        name: "idPicture",
        label: "ID Picture (Optional)",
        component: FileInput,
      },
    ],
  },
  {
    key: "contact",
    title: "Contact & Address",
    description: "How to reach you.",
    icon: IconHome,
    required: ["mobile", "presentAddress"],
    fields: [
      {
        span: 6,
        name: "mobile",
        label: "Mobile Number",
        component: TextInput,
        required: true,
      },
      {
        span: 6,
        name: "email",
        label: "Email",
        component: TextInput,
        isStatic: true,
      },
      {
        span: 12,
        name: "hometown",
        label: "Hometown/Permanent Address",
        component: Textarea,
      },
      {
        span: 12,
        name: "presentAddress",
        label: "Present Address",
        component: Textarea,
        required: true,
      },
      {
        span: 12,
        name: "facebook",
        label: "Facebook Account Name (Optional)",
        component: TextInput,
      },
    ],
  },
  {
    key: "academics",
    title: "Academic Information",
    description: "Your UPV affiliation.",
    icon: IconSchool,
    required: ["classification", "degree"],
    fields: [
      {
        span: 6,
        name: "classification",
        label: "Classification",
        component: Select,
        data: [
          "Student",
          "Staff",
          "Faculty",
          "Alumni",
          "Kaibigan ng Pahinungod (non UPV)",
        ],
        required: true,
      },
      {
        span: 6,
        name: "studentNumber",
        label: "Student Number (if applicable)",
        component: TextInput,
      },
      {
        span: 6,
        name: "campus",
        label: "Campus Affiliated",
        component: Select,
        data: ["Miagao", "Iloilo City"],
      },
      {
        span: 6,
        name: "college",
        label: "College",
        component: Select,
        data: ["CAS", "CFOS", "CM", "SoTech", "SHS"],
      },
      {
        span: 6,
        name: "degree",
        label: "Degree Program",
        component: Select,
        data: degreeOptions(),
        searchable: true,
        required: true,
      },
      { span: 6, name: "yearLevel", label: "Year Level", component: TextInput },
      {
        span: 6,
        name: "yearGraduated",
        label: "Year Graduated (if alumni)",
        component: TextInput,
      },
    ],
  },
  {
    key: "experience",
    title: "Affiliations & Experience",
    description: "Your work and organizations.",
    icon: IconBriefcase,
    required: [], //
    fields: [
      {
        span: 6,
        name: "designation",
        label: "Designation (Work)",
        component: TextInput,
      },
      {
        span: 6,
        name: "organization",
        label: "Office/Company",
        component: TextInput,
      },
      {
        span: 12,
        name: "organizations",
        label: "Other Organization Memberships",
        component: Textarea,
        description: "List all other organizations you are a member of.",
      },
    ],
  },
  {
    key: "skills",
    title: "Skills & Interests",
    description: "What you're good at and enjoy.",
    icon: IconTools,
    required: [], //
    fields: [
      {
        span: 12,
        name: "languages",
        label: "Languages/Dialects Spoken",
        component: Textarea,
      },
      {
        span: 12,
        name: "hobbies",
        label: "Talents or Hobbies",
        component: Textarea,
      },
      {
        span: 12,
        name: "skills",
        label: "Technical and Digital Skills",
        component: Textarea,
      },
      {
        span: 12,
        name: "expertise",
        label: "Areas of Expertise",
        component: Textarea,
      },
      {
        span: 12,
        name: "software",
        label: "Software or Tools",
        component: Textarea,
      },
    ],
  },
  {
    key: "committees",
    title: "Committee Preferences",
    description: "Where you'd like to contribute.",
    icon: IconHeartHandshake,
    required: [], //
    fields: [
      {
        span: 6,
        name: "committee1",
        label: "1st Committee Choice",
        component: Select,
        data: [],
        searchable: true,
      },
      {
        span: 6,
        name: "whyCommittee1",
        label: "Reason for 1st choice",
        component: Textarea,
      },
      {
        span: 6,
        name: "committee2",
        label: "2nd Committee Choice",
        component: Select,
        data: [],
        searchable: true,
      },
      {
        span: 6,
        name: "whyCommittee2",
        label: "Reason for 2nd choice",
        component: Textarea,
      },
      {
        span: 6,
        name: "committee3",
        label: "3rd Committee Choice",
        component: Select,
        data: [],
        searchable: true,
      },
      {
        span: 6,
        name: "whyCommittee3",
        label: "Reason for 3rd choice",
        component: Textarea,
      },
      {
        span: 12,
        name: "strengths",
        label: "What are your strengths as a volunteer?",
        component: Textarea,
      },
    ],
  },
  {
    key: "health",
    title: "Health Information",
    description: "Private medical information.",
    icon: IconHealthRecognition,
    required: [],
    fields: [
      {
        span: 12,
        name: "illness",
        label: "Physical/Psychological Illness or Disability",
        component: Textarea,
        description:
          "This information is confidential and for emergency purposes. If none, leave blank.",
      },
    ],
  },
];

function degreeOptions() {
  return [
    "BA (Communication & Media Studies)",
    "BA (Community Development)",
    "BA (History)",
    "BA (Sociology)",
    "BA in Communication and Media Studies",
    "BA in Literature",
    "BA in Political Science",
    "BA in Psychology",
    "BS (Biology)",
    "BS Accountancy (4.5 yrs)",
    "BS Applied Mathematics",
    "BS Business Administration (Marketing)",
    "BS Chemical Engineering",
    "BS Chemistry",
    "BS Computer Science",
    "BS Economics",
    "BS Fisheries",
    "BS Food Technology",
    "BS Management",
    "BS Public Health",
    "BS Statistics",
    "SHS - HUMSS",
    "SHS - GAS",
    "SHS - ABM",
    "SHS - STEM",
  ];
}
const consentText = `I hereby consent to participate in UP Visayas Ugnayan ng Pahinungód/Oblation Corps (UPV UP/OC) activities as a volunteer. I understand that volunteering entails service which may be physically and mentally demanding. I also acknowledge the inherent risks, including but not limited to, physical injury, illness, and emotional distress. I voluntarily assume these risks. I release and hold harmless UPV UP/OC, its officers, and affiliates from any liability, claims, and demands arising from my participation. I grant permission for the use of my name, likeness, and photographic images for official purposes. Thus, I hereby declare the information provided as true and correct.`;

function VolunteerForm() {
  const location = useLocation();
  const {
    form,
    setForm,
    loading,
    error,
    setError,
    sectionProgress,
    handleSubmit,
  } = useVolunteerForm(SECTIONS);

  return (
    <Container size="lg" my="xl">
      <Outlet context={{ sections: SECTIONS, form, setForm }} />

      {location.pathname === "/volunteer-form" && (
        <Stack>
          <Title order={2} ta="center">
            Volunteer Information Sheet
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb="xl">
            Complete each section to finalize your application. Your progress is
            saved as you go.
          </Text>

          {error && (
            <Alert
              title="Error"
              color="red"
              icon={<IconExclamationCircle />}
              withCloseButton
              onClose={() => setError("")}
              mb="md"
            >
              {error}
            </Alert>
          )}

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            {SECTIONS.map((section) => (
              <SectionCard
                key={section.key}
                section={section}
                progress={sectionProgress[section.key]}
                isRequired={section.required.length > 0}
              />
            ))}
          </SimpleGrid>

          <Paper withBorder p="xl" mt="xl" radius="md" shadow="sm">
            <Stack>
              <Title order={4}>Consent and Finalization</Title>
              <Text size="sm" c="dimmed">
                {consentText}
              </Text>
              <Checkbox
                name="consent"
                checked={form.consent}
                onChange={(e) =>
                  setForm((f) => ({ ...f, consent: e.target.checked }))
                }
                label="I have read, understood, and agree to the terms and conditions stated above."
                required
              />
              <Group justify="flex-end" mt="md">
                <Button
                  size="lg"
                  color="green"
                  disabled={!sectionProgress.all || !form.consent}
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Submit Full Application
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      )}
    </Container>
  );
}

function SectionCard({ section, progress, isRequired }) {
  const isComplete = progress === 100;
  const navigate = useNavigate();

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      component={Link}
      to={`/volunteer-form/${section.key}`}
      td="none"
    >
      <Stack align="center" gap="md">
        <RingProgress
          size={80}
          thickness={6}
          roundCaps
          sections={[
            { value: progress, color: isComplete ? "teal" : "primary" },
          ]}
          label={
            isComplete ? (
              <IconCheck
                style={{ width: 20, height: 20 }}
                stroke={2.5}
                color="var(--mantine-color-teal-7)"
              />
            ) : (
              <Text c="dimmed" size="xs" ta="center" fw={700}>
                {Math.round(progress)}%
              </Text>
            )
          }
        />
        <Stack align="center" gap={4} mt="xs">
          <Text fw={600} ta="center">
            {section.title}
          </Text>
          <Text size="xs" c="dimmed" ta="center" h={32}>
            {section.description}
            {isRequired && (
              <Text span c="red" inherit>
                {" "}
                *Required
              </Text>
            )}
          </Text>
        </Stack>
        <Button
          variant="light"
          fullWidth
          mt="sm"
          color={isComplete ? "gray" : "primary"}
        >
          {isComplete ? "View / Edit" : "Start"}
        </Button>
      </Stack>
    </Card>
  );
}

export default VolunteerForm;
