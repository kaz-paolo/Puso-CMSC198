import { useNavigate, useOutletContext, useParams } from "react-router-dom";
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
  Grid,
  Textarea,
  Anchor,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

function FormSectionPage() {
  const { sectionKey } = useParams();
  const { sections, form, setForm } = useOutletContext();
  const navigate = useNavigate();

  const section = sections.find((s) => s.key === sectionKey);

  if (!section) {
    return (
      <Container>
        <Text color="red">Section not found!</Text>
        <Button onClick={() => navigate("/volunteer-form")}>Go Back</Button>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (name, file) => {
    setForm((prev) => ({ ...prev, [name]: file }));
  };

  return (
    <Paper withBorder shadow="md" p="xl" radius="md">
      <Stack>
        <Group>
          <Anchor onClick={() => navigate("/volunteer-form")} underline="never">
            <Group gap="xs">
              <IconArrowLeft size={16} />
              <Text size="sm">Back to Overview</Text>
            </Group>
          </Anchor>
        </Group>
        <Title order={3}>{section.title}</Title>
        <Text c="dimmed" size="sm" mb="md">
          {section.description}
        </Text>

        <Grid>
          {section.fields.map((field) => {
            const { component: Component, span, name, ...props } = field;

            if (name === "email") {
              return (
                <Grid.Col span={span || 12} key="email">
                  <TextInput label="Email" value={form.email} disabled />
                </Grid.Col>
              );
            }

            const commonProps = {
              name: name,
              label: props.label,
              description: props.description,
              required: props.required,
            };

            if (Component === TextInput) {
              return (
                <Grid.Col span={span || 12} key={name}>
                  <Component
                    {...commonProps}
                    value={form[name] || ""}
                    onChange={handleChange}
                    type={props.type}
                  />
                </Grid.Col>
              );
            }
            if (Component === Textarea) {
              return (
                <Grid.Col span={span || 12} key={name}>
                  <Component
                    {...commonProps}
                    value={form[name] || ""}
                    onChange={handleChange}
                    minRows={3}
                  />
                </Grid.Col>
              );
            }
            if (Component === Select) {
              return (
                <Grid.Col span={span || 12} key={name}>
                  <Component
                    {...commonProps}
                    data={props.data}
                    value={form[name]}
                    onChange={(v) => handleSelectChange(name, v)}
                    searchable={props.searchable}
                  />
                </Grid.Col>
              );
            }
            if (Component === FileInput) {
              return (
                <Grid.Col span={span || 12} key={name}>
                  <Component
                    {...commonProps}
                    value={form[name]}
                    onChange={(f) => handleFileChange(name, f)}
                  />
                </Grid.Col>
              );
            }

            return null;
          })}
        </Grid>

        <Group justify="flex-end" mt="xl">
          <Button
            onClick={() => navigate("/volunteer-form")}
            variant="gradient"
            gradient={{ from: "primary", to: "teal" }}
          >
            Done
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

export default FormSectionPage;
