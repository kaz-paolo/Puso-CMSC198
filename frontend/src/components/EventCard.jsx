import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Button,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconClock,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import EventDetailsModal from "../components/modal/ViewEventDetailModal";
import { useUser } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const user = useUser();
  const theme = useMantineTheme();
  const [userProfile, setUserProfile] = useState();
  const navigate = useNavigate();

  const {
    id,
    event_name,
    description,
    date,
    time,
    venue,
    volunteer_count,
    status,
  } = event;
  const [detailsOpened, setDetailsOpened] = useState(false);

  const statusColors = {
    upcoming: "blue",
    ongoing: "green",
    completed: "gray",
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const res = await fetch(
          `http://localhost:3000/api/users/basic-info/${user.id}`
        );
        const data = await res.json();

        if (data.success) setUserProfile(data.data);
      } catch (err) {
        console.error("Network error:", err);
      }
    }

    fetchProfile();
  }, [user]);

  // cut characters to show
  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600} size="lg">
              {event_name}
            </Text>
            <Badge color={statusColors[status]} variant="light">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={2} align="left">
            {truncateDescription(description)}
          </Text>

          <Stack gap="xs">
            <Group gap="xs">
              <IconCalendar size={16} color={theme.colors.gray[6]} />
              <Text size="sm">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </Group>

            <Group gap="xs">
              <IconClock size={16} color={theme.colors.gray[6]} />
              <Text size="sm">{time}</Text>
            </Group>

            <Group gap="xs">
              <IconMapPin size={16} color={theme.colors.gray[6]} />
              <Text size="sm">{venue}</Text>
            </Group>

            <Group gap="xs">
              <IconUsers size={16} color={theme.colors.gray[6]} />
              <Text size="sm">
                {volunteer_count}{" "}
                {volunteer_count === 1 ? "Volunteer" : "Volunteers"}
              </Text>
            </Group>
          </Stack>

          <Group gap="xs" mt="md">
            <Button
              variant="light"
              fullWidth
              onClick={() => setDetailsOpened(true)}
            >
              View Details
            </Button>
            {status === "upcoming" && userProfile?.role !== "admin" && (
              <Button
                fullWidth
                onClick={() => navigate(`/eventdashboard/${id}`)}
              >
                Volunteer
              </Button>
            )}
          </Group>
        </Stack>
      </Card>

      <EventDetailsModal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        eventId={id}
      />
    </>
  );
}

export default EventCard;
