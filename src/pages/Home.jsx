import { Container, Title, Text, Button, Stack, Group, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        <Stack align="center" gap="xl">
          <Title order={1}>Landing Page</Title>
          <Text size="lg" c="dimmed" ta="center">
            Get started by logging in or creating a new account
          </Text>
          
          <Group gap="md" mt="xl">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Home;