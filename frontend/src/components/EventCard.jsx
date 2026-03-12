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
  Badge,
} from "@mantine/core";
import { IconCalendar, IconMapPin } from "@tabler/icons-react";
import { useEffect, useState, useMemo } from "react";
import EventDetailsModal from "../components/modal/ViewEventDetailModal";
import SelectRoleModal from "../components/modal/SelectRoleModal";
import { useNavigate } from "react-router-dom";
import eventImage from "../assets/hero-image.png";
import {
  getEventStatus,
  getStatusColor,
  getStatusLabel,
} from "../utils/eventStatus";
import { useUserProfile } from "../hooks/useUserProfile";
import { authClient } from "../auth.js";

function EventCard({ event }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const theme = useMantineTheme();
  const { userProfile } = useUserProfile();
  const navigate = useNavigate();
  const [hasJoined, setHasJoined] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState(null); // Track volunteer status
  const [checkingJoinStatus, setCheckingJoinStatus] = useState(true);

  const {
    id,
    event_title,
    description,
    start_date,
    end_date,
    time,
    location,
    volunteer_capacity,
    volunteer_roles,
  } = event;

  const dynamicStatus = getEventStatus(start_date, end_date);
  const statusColor = getStatusColor(dynamicStatus);
  const statusLabel = getStatusLabel(dynamicStatus);

  const [detailsOpened, setDetailsOpened] = useState(false);
  const [roleSelectOpened, setRoleSelectOpened] = useState(false);

  // check if user has already joined this event
  useEffect(() => {
    async function checkJoinStatus() {
      if (!user || !userProfile) {
        setCheckingJoinStatus(false);
        return;
      }

      setCheckingJoinStatus(true);

      try {
        // Check if user has joined using auth_user_id
        const res = await fetch(
          `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${user.id}/joined-events`,
        );
        const data = await res.json();

        if (data.success) {
          const joinedEvent = data.data.find((e) => e.id === parseInt(id));
          if (joinedEvent) {
            setHasJoined(true);
            setVolunteerStatus(joinedEvent.volunteer_status);
          } else {
            setHasJoined(false);
            setVolunteerStatus(null);
          }
        }
      } catch (err) {
        console.error("Failed to check join status:", err);
      } finally {
        setCheckingJoinStatus(false);
      }
    }

    checkJoinStatus();
  }, [user, id]); // Add 'id' to dependencies

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${id}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            roleId: selectedRole?.id || null,
          }),
        },
      );
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to join event");
        return;
      }

      // Update join status based on response
      setHasJoined(true);
      setVolunteerStatus(data.data.volunteer_status);
      setRoleSelectOpened(false);

      alert(data.message);

      // Only navigate if confirmed (no approval needed)
      if (data.data.volunteer_status === "CONFIRMED") {
        navigate(`/events/${id}`);
      }
    } catch (err) {
      console.error("Join event failed:", err);
      alert("Failed to join event");
    }
  };

  const getVolunteerButtonText = () => {
    if (volunteerStatus === "PENDING") return "Pending Approval";
    if (volunteerStatus === "CONFIRMED") return "Joined";
    if (isFull) return "Event Full";
    return "Volunteer";
  };

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (result.data?.session && result.data?.user) {
        setSession(result.data.session);
        setUser(result.data.user);
      }
    });
  }, []);

  return (
    <>
      <Card shadow="sm" p={0} radius="md" withBorder style={{ height: 300 }}>
        <Card.Section>
          <Image
            src={event.image || eventImage}
            height={130}
            alt={event_title}
          />
          <Badge
            color={statusColor}
            variant="filled"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            {statusLabel}
          </Badge>
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
              {dynamicStatus === "upcoming" && user?.role !== "admin" && (
                <Button
                  variant="filled"
                  size="xs"
                  color={
                    volunteerStatus === "CONFIRMED"
                      ? "green"
                      : volunteerStatus === "PENDING"
                        ? "yellow"
                        : "primary"
                  }
                  onClick={handleVolunteerClick}
                  disabled={
                    isFull ||
                    volunteerStatus === "CONFIRMED" ||
                    checkingJoinStatus
                  }
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
