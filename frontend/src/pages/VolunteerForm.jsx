import { useState } from "react";
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
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import data from "../assets/philippine_provinces_cities_municipalities_and_barangays_2019v2.json";
import { useUser } from "@stackframe/react";

const degreeOptions = [
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
  "HUMSS",
  "GAS",
  "ABM",
  "STEM",
  "TVL",
  "BA (CommDev-Psych)",
];

const collegeOptions = ["CAS", "SOTCH", "CFOS", "CM"];
const campusOptions = ["Miagao", "City"];
const participantTypes = [
  "Student",
  "Staff",
  "Faculty",
  "Alumni",
  "Kaibigan ng Pahinungod (non UPV)",
];
const sexOptions = ["Male", "Female", "Other"];
const civilStatusOptions = ["Single", "Married", "Divorced", "Widowed"];

const consentText = `I hereby consent to participate in UP Visayas Ugnayan ng Pahinungód/Oblation Corps (UPV UP/OC) activities as a volunteer. ... [full text as provided above] ... Thus, I hereby declare the information provided as true and correct.`;

function VolunteerForm() {
  const user = useUser();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    studentNumber: "",
    idPicture: null,
    nickname: "",
    sex: "",
    civilStatus: "",
    birthDate: "",
    birthPlace: "",
    height: "",
    weight: "",
    bloodType: "",
    languages: "",
    mobile: "",
    hometown: "",
    presentAddress: "",
    classification: "",
    college: "",
    degree: "",
    yearLevel: "",
    yearGraduated: "",
    campus: "",
    designation: "",
    organization: "",
    organizations: "",
    illness: "",
    arukahikJoinDate: "",
    hobbies: "",
    skills: "",
    expertise: "",
    software: "",
    committee1: "",
    whyCommittee1: "",
    committee2: "",
    whyCommittee2: "",
    committee3: "",
    whyCommittee3: "",
    strengths: "",
    committeeCount: "",
    facebook: "",
    consent: false,
  });

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  // Options for Address
  const regionOptions = Object.entries(data).map(([key, value]) => ({
    value: key,
    label: value.region_name,
  }));

  const provinceOptions = selectedRegion
    ? Object.keys(data[selectedRegion].province_list).map((prov) => ({
        value: prov,
        label: prov,
      }))
    : [];

  const municipalityOptions =
    selectedRegion && selectedProvince
      ? Object.keys(
          data[selectedRegion].province_list[selectedProvince].municipality_list
        ).map((mun) => ({
          value: mun,
          label: mun,
        }))
      : [];

  const barangayOptions =
    selectedRegion && selectedProvince && selectedMunicipality
      ? data[selectedRegion].province_list[selectedProvince].municipality_list[
          selectedMunicipality
        ].barangay_list.map((brgy) => ({
          value: brgy,
          label: brgy,
        }))
      : [];

  const steps = [
    {
      label: "Personal Info",
      content: (
        <Stack gap="md">
          <TextInput label="Email" value={user.primaryEmail} disabled />
          <Group grow>
            <TextInput
              label="First Name"
              required
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
            />
            <TextInput
              label="Middle Name"
              value={form.middleName}
              onChange={(e) =>
                setForm((f) => ({ ...f, middleName: e.target.value }))
              }
            />
            <TextInput
              label="Last Name"
              required
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
            />
          </Group>
          <TextInput
            label="Student Number"
            required
            value={form.studentNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, studentNumber: e.target.value }))
            }
          />
          <FileInput
            label="ID Picture"
            required
            value={form.idPicture}
            onChange={(file) => setForm((f) => ({ ...f, idPicture: file }))}
          />
          <TextInput
            label="Nickname"
            value={form.nickname}
            onChange={(e) =>
              setForm((f) => ({ ...f, nickname: e.target.value }))
            }
          />
          <Select
            label="Sex Assigned at Birth"
            data={sexOptions}
            required
            value={form.sex}
            onChange={(v) => setForm((f) => ({ ...f, sex: v }))}
          />
          <Select
            label="Civil Status"
            data={civilStatusOptions}
            value={form.civilStatus}
            onChange={(v) => setForm((f) => ({ ...f, civilStatus: v }))}
          />
          <TextInput
            label="Date of Birth"
            type="date"
            required
            value={form.birthDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, birthDate: e.target.value }))
            }
          />
          <TextInput
            label="Place of Birth"
            value={form.birthPlace}
            onChange={(e) =>
              setForm((f) => ({ ...f, birthPlace: e.target.value }))
            }
          />
          <Group grow>
            <TextInput
              label="Height"
              value={form.height}
              onChange={(e) =>
                setForm((f) => ({ ...f, height: e.target.value }))
              }
            />
            <TextInput
              label="Weight"
              value={form.weight}
              onChange={(e) =>
                setForm((f) => ({ ...f, weight: e.target.value }))
              }
            />
            <TextInput
              label="Blood Type"
              value={form.bloodType}
              onChange={(e) =>
                setForm((f) => ({ ...f, bloodType: e.target.value }))
              }
            />
          </Group>
          <TextInput
            label="Languages/Dialect Spoken"
            value={form.languages}
            onChange={(e) =>
              setForm((f) => ({ ...f, languages: e.target.value }))
            }
          />
        </Stack>
      ),
    },
    {
      label: "Contact & Academic",
      content: (
        <Stack gap="md">
          <TextInput
            label="Mobile Number"
            required
            value={form.mobile}
            onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
          />
          <TextInput
            label="Hometown/Permanent Address"
            value={form.hometown}
            onChange={(e) =>
              setForm((f) => ({ ...f, hometown: e.target.value }))
            }
          />
          <TextInput
            label="Present Address"
            value={form.presentAddress}
            onChange={(e) =>
              setForm((f) => ({ ...f, presentAddress: e.target.value }))
            }
          />
          <Select
            label="Classification"
            data={participantTypes}
            required
            value={form.classification}
            onChange={(v) => setForm((f) => ({ ...f, classification: v }))}
          />
          <Select
            label="College"
            data={collegeOptions}
            value={form.college}
            onChange={(v) => setForm((f) => ({ ...f, college: v }))}
          />
          <Select
            label="Degree Program"
            data={degreeOptions}
            required
            value={form.degree}
            onChange={(v) => setForm((f) => ({ ...f, degree: v }))}
          />
          <TextInput
            label="Year Level"
            value={form.yearLevel}
            onChange={(e) =>
              setForm((f) => ({ ...f, yearLevel: e.target.value }))
            }
          />
          <TextInput
            label="Year Graduated"
            value={form.yearGraduated}
            onChange={(e) =>
              setForm((f) => ({ ...f, yearGraduated: e.target.value }))
            }
          />
          <Select
            label="Campus Affiliated"
            data={campusOptions}
            value={form.campus}
            onChange={(v) => setForm((f) => ({ ...f, campus: v }))}
          />
        </Stack>
      ),
    },
    {
      label: "Work & Health",
      content: (
        <Stack gap="md">
          <TextInput
            label="Designation"
            value={form.designation}
            onChange={(e) =>
              setForm((f) => ({ ...f, designation: e.target.value }))
            }
          />
          <TextInput
            label="Organization/Office/Company/Unit/Department"
            value={form.organization}
            onChange={(e) =>
              setForm((f) => ({ ...f, organization: e.target.value }))
            }
          />
          <TextInput
            label="Organization(s)"
            value={form.organizations}
            onChange={(e) =>
              setForm((f) => ({ ...f, organizations: e.target.value }))
            }
          />
          <TextInput
            label="Physical/Psychological Illness/Disability"
            value={form.illness}
            onChange={(e) =>
              setForm((f) => ({ ...f, illness: e.target.value }))
            }
          />
          <TextInput
            label="When did you join the Arukahík?"
            value={form.arukahikJoinDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, arukahikJoinDate: e.target.value }))
            }
          />
        </Stack>
      ),
    },
    {
      label: "Skills & Committees",
      content: (
        <Stack gap="md">
          <TextInput
            label="Talent or Hobbies"
            value={form.hobbies}
            onChange={(e) =>
              setForm((f) => ({ ...f, hobbies: e.target.value }))
            }
          />
          <TextInput
            label="Technical and Digital Skills"
            value={form.skills}
            onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
          />
          <TextInput
            label="Areas of Expertise"
            value={form.expertise}
            onChange={(e) =>
              setForm((f) => ({ ...f, expertise: e.target.value }))
            }
          />
          <TextInput
            label="Software or Tools"
            value={form.software}
            onChange={(e) =>
              setForm((f) => ({ ...f, software: e.target.value }))
            }
          />
          <TextInput
            label="1st Committee Choice"
            value={form.committee1}
            onChange={(e) =>
              setForm((f) => ({ ...f, committee1: e.target.value }))
            }
          />
          <TextInput
            label="Why is it your first choice?"
            value={form.whyCommittee1}
            onChange={(e) =>
              setForm((f) => ({ ...f, whyCommittee1: e.target.value }))
            }
          />
          <TextInput
            label="2nd Committee Choice"
            value={form.committee2}
            onChange={(e) =>
              setForm((f) => ({ ...f, committee2: e.target.value }))
            }
          />
          <TextInput
            label="Why is it your second choice?"
            value={form.whyCommittee2}
            onChange={(e) =>
              setForm((f) => ({ ...f, whyCommittee2: e.target.value }))
            }
          />
          <TextInput
            label="3rd Committee Choice"
            value={form.committee3}
            onChange={(e) =>
              setForm((f) => ({ ...f, committee3: e.target.value }))
            }
          />
          <TextInput
            label="Why is it your third choice?"
            value={form.whyCommittee3}
            onChange={(e) =>
              setForm((f) => ({ ...f, whyCommittee3: e.target.value }))
            }
          />
          <TextInput
            label="Strengths as a Volunteer"
            value={form.strengths}
            onChange={(e) =>
              setForm((f) => ({ ...f, strengths: e.target.value }))
            }
          />
          <TextInput
            label="How many committees would you like to be a part of?"
            value={form.committeeCount}
            onChange={(e) =>
              setForm((f) => ({ ...f, committeeCount: e.target.value }))
            }
          />
          <TextInput
            label="Facebook Account Name"
            value={form.facebook}
            onChange={(e) =>
              setForm((f) => ({ ...f, facebook: e.target.value }))
            }
          />
        </Stack>
      ),
    },
    {
      label: "Consent & Preview",
      content: (
        <Stack gap="md">
          <Alert color="yellow">{consentText}</Alert>
          <Checkbox
            label="I agree to the terms and consent above"
            checked={form.consent}
            onChange={(e) =>
              setForm((f) => ({ ...f, consent: e.target.checked }))
            }
            required
          />
          <Title order={4}>Preview</Title>
          <Paper p="md" shadow="xs">
            <Text size="sm">
              <strong>Name:</strong>{" "}
              {`${form.lastName.toUpperCase()}, ${form.firstName} ${
                form.middleName
              }`}
              <br />
              <strong>Email:</strong> {user.primaryEmail}
              <br />
              <strong>Degree:</strong> {form.degree}
              <br />
            </Text>
          </Paper>
        </Stack>
      ),
    },
  ];

  function validateStep() {
    switch (step) {
      case 0:
        if (
          !form.firstName ||
          !form.lastName ||
          !form.studentNumber ||
          !form.sex ||
          !form.idPicture ||
          !form.birthDate
        )
          return false;
        break;
      case 1:
        if (!form.mobile || !form.classification || !form.degree) return false;
        break;
      // Add more cases for other steps
      default:
        return true;
    }
    return true;
  }

  function handleNext() {
    if (!validateStep()) {
      alert("Please fill all required fields before continuing.");
      return;
    }
    setStep(step + 1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/complete-profile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authUserId: user.id,
            firstName: form.firstName,
            middleName: form.middleName,
            lastName: form.lastName,
            studentNumber: form.studentNumber,
            nickname: form.nickname,
            sex: form.sex,
            civilStatus: form.civilStatus,
            birthDate: form.birthDate,
            birthPlace: form.birthPlace,
            height: form.height,
            weight: form.weight,
            bloodType: form.bloodType,
            languages: form.languages,
            mobile: form.mobile,
            hometown: form.hometown,
            presentAddress: form.presentAddress,
            classification: form.classification,
            college: form.college,
            degree: form.degree,
            yearLevel: form.yearLevel,
            yearGraduated: form.yearGraduated,
            campus: form.campus,
            designation: form.designation,
            organization: form.organization,
            organizations: form.organizations,
            illness: form.illness,
            arukahikJoinDate: form.arukahikJoinDate,
            hobbies: form.hobbies,
            skills: form.skills,
            expertise: form.expertise,
            software: form.software,
            committee1: form.committee1,
            whyCommittee1: form.whyCommittee1,
            committee2: form.committee2,
            whyCommittee2: form.whyCommittee2,
            committee3: form.committee3,
            whyCommittee3: form.whyCommittee3,
            strengths: form.strengths,
            facebook: form.facebook,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error("Backend error:", data);
        alert("Failed to save profile: " + data.error);
        return;
      }

      console.log("Profile saved successfully:", data.data);
      alert("Profile saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update information");
    }
  };

  return (
    <Container
      size="sm"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      }}
    >
      <Paper shadow="md" p="xl" radius="md" style={{ width: "100%" }}>
        <Stack gap="xl">
          <Title order={2} ta="center">
            UPV UP/OC Volunteer Form
          </Title>
          <Text size="sm" ta="center">
            {steps[step].label}
          </Text>
          {steps[step].content}
          <Group justify="apart" mt="md">
            <Button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                color="green"
                disabled={!form.consent}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}

export default VolunteerForm;
