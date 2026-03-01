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
import { useEffect, useState, useMemo } from "react";
import EventDetailsModal from "../components/modal/ViewEventDetailModal";
import SelectRoleModal from "../components/modal/SelectRoleModal";
import { useUser } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import eventImage from "../assets/hero-image.png";

function EventCard({ event }) {
  const user = useUser();
  const theme = useMantineTheme();
  const [userProfile, setUserProfile] = useState();
  const navigate = useNavigate();
  const [hasJoined, setHasJoined] = useState(false);
  const [checkingJoinStatus, setCheckingJoinStatus] = useState(true);

  const {
    id,
    event_title,
    description,
    start_date,
    time,
    location,
    volunteer_capacity,
    volunteer_roles,
    status,
  } = event;
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [roleSelectOpened, setRoleSelectOpened] = useState(false);

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

  // if user has already joined this event
  useEffect(() => {
    async function checkJoinStatus() {
      if (!user || !userProfile) return;

      setCheckingJoinStatus(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${userProfile.id}/joined-events`,
        );
        const data = await res.json();

        if (data.success) {
          const joined = data.data.some((e) => e.id === id);
          setHasJoined(joined);
        }
      } catch (err) {
        console.error("Failed to check join status:", err);
      } finally {
        setCheckingJoinStatus(false);
      }
    }

    checkJoinStatus();
  }, [user, userProfile, id]);

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // total capacity and remaining slots
  const { totalCapacity, remainingSlots, hasRoles, isFull } = useMemo(() => {
    if (volunteer_roles && volunteer_roles.length > 0) {
      // sum all role capacities
      const total = volunteer_roles.reduce(
        (sum, role) => sum + (parseInt(role.capacity) || 0),
        0,
      );
      const filled = volunteer_roles.reduce(
        (sum, role) => sum + (parseInt(role.current_count) || 0),
        0,
      );
      const remaining = total - filled;
      return {
        totalCapacity: total,
        remainingSlots: remaining,
        hasRoles: true,
        isFull: remaining <= 0,
      };
    }
    const capacity = parseInt(volunteer_capacity) || 0;
    const filled = parseInt(event.current_volunteers) || 0;
    const remaining = capacity - filled;
    return {
      totalCapacity: capacity,
      remainingSlots: remaining,
      hasRoles: false,
      isFull: remaining <= 0,
    };
  }, [volunteer_roles, volunteer_capacity, event.current_volunteers]);

  const handleVolunteerClick = () => {
    if (hasRoles) {
      // role selection modal
      setRoleSelectOpened(true);
    } else {
      // direct join, to add pending/accept confirm by admin etc
      handleJoinEvent(null);
    }
  };

  const handleJoinEvent = async (selectedRole) => {
    try {
      const res = await fetch(`http://localhost:3000/api/events/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          roleId: selectedRole?.id || null,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to join event");
        return;
      }
      setRoleSelectOpened(false);
      navigate(`/events/${id}`);
      alert(
        selectedRole
          ? `Successfully joined as ${selectedRole.role_name}!`
          : "Successfully joined the event!",
      );
    } catch (err) {
      console.error("Join event failed:", err);
      alert("Failed to join event");
    }
  };

  const getVolunteerButtonText = () => {
    if (hasJoined) return "Already Joined";
    if (isFull) return "Event Full";
    return "Volunteer";
  };

  return (
    <>
      <Card shadow="sm" p={0} radius="md" withBorder style={{ height: 300 }}>
        <Card.Section>
          <Image
            src={event.image || eventImage}
            height={130}
            alt={event_title}
          />
        </Card.Section>

        <Stack p="xs" gap={4} style={{ height: 170 }}>
          <Text fw={700} size="lg" lineClamp={1} ta="left">
            {event_title}
          </Text>
          <Text c="dimmed" size="xs" lineClamp={2} h={32} ta="left">
            {truncateDescription(description)}
          </Text>

          <Group gap="md" mt="sm" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <IconCalendar size={14} color={theme.colors.gray[6]} />
              <Text size="sm" c="dimmed">
                {new Date(start_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <IconMapPin size={14} color={theme.colors.gray[6]} />
              <Text size="sm" c="dimmed" lineClamp={1}>
                {location}
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
              <Text
                c={isFull ? "red" : hasJoined ? "green" : "orange"}
                size="sm"
                fs="italic"
              >
                {isFull
                  ? "Full"
                  : hasJoined
                    ? "Joined"
                    : `${remainingSlots} ${remainingSlots === 1 ? "slot" : "slots"} remaining`}
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
                  color={hasJoined ? "green" : "primary"}
                  onClick={handleVolunteerClick}
                  disabled={isFull || hasJoined || checkingJoinStatus}
                >
                  {getVolunteerButtonText()}
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

      {hasRoles && (
        <SelectRoleModal
          opened={roleSelectOpened}
          onClose={() => setRoleSelectOpened(false)}
          roles={volunteer_roles}
          onSelectRole={handleJoinEvent}
        />
      )}
    </>
  );
}

export default EventCard;
