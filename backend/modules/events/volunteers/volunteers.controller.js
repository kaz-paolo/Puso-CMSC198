import { volunteersService } from "./volunteers.service.js";

export async function joinEvent(req, res) {
  try {
    const { eventId } = req.params;
    const { userId: authUserId, roleId } = req.body;

    if (!authUserId || !eventId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId or eventId",
      });
    }

    const userId = await volunteersService.getUserIdByAuthId(authUserId);

    if (!userId) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check event and approval requirement
    const event = await volunteersService.getEventValues(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    const volunteerStatus = event.approval_required ? "PENDING" : "CONFIRMED";

    // Role capacity check
    if (roleId) {
      const role = await volunteersService.getRole(roleId, eventId);
      if (!role) {
        return res
          .status(404)
          .json({ success: false, error: "Role not found" });
      }

      const currentCount = await volunteersService.getRoleCount(
        eventId,
        roleId,
      );
      if (currentCount >= role.capacity) {
        return res.status(409).json({
          success: false,
          error: "This role is already full",
        });
      }
    }

    const registration = await volunteersService.joinEvent(
      userId,
      eventId,
      roleId,
      volunteerStatus,
    );

    if (!registration) {
      return res.status(409).json({
        success: false,
        message: "Failed to join event",
      });
    }

    res.status(201).json({
      success: true,
      data: registration,
      message: event.approval_required
        ? "Join request submitted. Awaiting admin approval."
        : "Successfully joined the event!",
    });
  } catch (error) {
    console.error("Join event error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to join event",
    });
  }
}

export async function updateVolunteerStatus(req, res) {
  try {
    const { eventId, userId } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "CONFIRMED", "DECLINED", "REMOVED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const updated = await volunteersService.updateStatus(
      eventId,
      userId,
      status,
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Update volunteer status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update volunteer status",
    });
  }
}

export async function removeVolunteer(req, res) {
  try {
    const { eventId, userId } = req.params;
    const { deletedBy } = req.body;

    if (!deletedBy) {
      return res.status(400).json({
        success: false,
        error: "deletedBy is required",
      });
    }

    const softDeleted = await volunteersService.removeVolunteer(
      eventId,
      userId,
      deletedBy,
    );

    if (!softDeleted) {
      return res.status(404).json({
        success: false,
        error: "Volunteer not found or already removed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer removed successfully",
      data: softDeleted,
    });
  } catch (error) {
    console.error("Remove volunteer error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove volunteer",
    });
  }
}

export async function getEventStats(req, res) {
  try {
    const { eventId } = req.params;
    const stats = await volunteersService.getStats(eventId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get event stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get event statistics",
    });
  }
}

export async function getEventVolunteers(req, res) {
  try {
    const { eventId } = req.params;
    const volunteers = await volunteersService.getVolunteers(eventId);

    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    console.error("Fetch volunteers error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch volunteers",
      details: error.message,
    });
  }
}
