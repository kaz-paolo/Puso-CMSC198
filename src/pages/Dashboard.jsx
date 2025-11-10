import { Container, Title, Text, Button, Paper, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';

// Main home page dashboard
function Dashboard() {
  const navigate = useNavigate();
  const userEmail = auth.currentUser?.email || '';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        <Stack align="center" gap="xl">
          <Title order={1}>Welcome!</Title>
          <Text size="lg" c="dimmed" ta="center">
            {userEmail}
          </Text>
          
          <Button onClick={handleLogout} color="red" variant="outline">
            Logout
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Dashboard;