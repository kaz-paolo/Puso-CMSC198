import { Container, Title, Text, Paper } from "@mantine/core";

function VolunteerApplication() {
  return (
    <Container size="xl" py="xl">
      <Paper withBorder shadow="sm" p="xl">
        <Title order={2} ta="center">
          Arukahik Training Application
        </Title>
        <Text c="dimmed" ta="center" mt="sm">
          insert application form
        </Text>
      </Paper>
    </Container>
  );
}

export default VolunteerApplication;
