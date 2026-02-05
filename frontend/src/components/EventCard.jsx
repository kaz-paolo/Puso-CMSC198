import {
  Card,
  Text,
  Group,
  Stack,
  Button,
  useMantineTheme,
  Image,
  Divider,
  Avatar,
  Box,
} from "@mantine/core";
import { IconCalendar, IconMapPin } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import EventDetailsModal from "../components/modal/ViewEventDetailModal";
import { useUser } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import eventImage from "../assets/hero-image.png";

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

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${user.id}/basic-info`,
        );
        const data = await res.json();
        if (data.success) setUserProfile(data.data);
      } catch (err) {
        console.error("Network error:", err);
      }
    }

    fetchProfile();
  }, [user]);

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const remainingSlots = volunteer_count > 0 ? volunteer_count : 0; // placeholder

  return (
    <>
      <Card shadow="sm" p={0} radius="md" withBorder style={{ height: 300 }}>
        <Card.Section>
          <Image
            src={event.image || eventImage}
            height={130}
            alt={event_name}
          />
        </Card.Section>

        <Stack p="xs" gap={4} style={{ height: 170 }}>
          <Text fw={700} size="lg" lineClamp={1} ta="left">
            {event_name}
          </Text>
          <Text c="dimmed" size="xs" lineClamp={2} h={32} ta="left">
            {truncateDescription(description)}
          </Text>

          <Group gap="md" mt="sm" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <IconCalendar size={14} color={theme.colors.gray[6]} />
              <Text size="sm" c="dimmed">
                {new Date(date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <IconMapPin size={14} color={theme.colors.gray[6]} />
              <Text size="sm" c="dimmed" lineClamp={1}>
                {venue}
              </Text>
            </Group>
          </Group>

          <Box style={{ flexGrow: 1 }} />

          <Divider my={4} />

          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap={4} align="center">
              <Avatar.Group spacing="sm">
                <Avatar size="sm" radius="xl" />
                <Avatar size="sm" radius="xl" />
                <Avatar size="sm" radius="xl">
                  +6
                </Avatar>
              </Avatar.Group>
              <Text c="orange" size="sm" fs="italic">
                {remainingSlots} slots remaining
              </Text>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <Button
                variant="transparent"
                size="xs"
                color="primary"
                onClick={() => setDetailsOpened(true)}
                p={0}
                h="auto"
              >
                Details
              </Button>
              {status === "upcoming" && userProfile?.role !== "admin" && (
                <Button
                  variant="filled"
                  size="xs"
                  color="primary"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `http://localhost:3000/api/events/${id}/join`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: user.id }),
                        },
                      );
                      const data = await res.json();
                      if (!data.success) {
                        alert(data.error);
                        return;
                      }
                      navigate(`/events/${id}`);
                      alert("Successfully joined the event!");
                    } catch (err) {
                      console.error("Join event failed:", err);
                      alert("Failed to join event");
                    }
                  }}
                >
                  Volunteer
                </Button>
              )}
            </Group>
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
