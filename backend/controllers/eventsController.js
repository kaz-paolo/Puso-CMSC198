import { sql } from "../config/db.js";

export async function getAllEvents(req, res) {
  try {
    const events = await sql`
      SELECT e.*,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', r.id,
                'role_name', r.role_name,
                'capacity', r.capacity,
                'current_count', (
                  SELECT COUNT(*) FROM event_volunteers ev 
                  WHERE ev.event_id = e.id AND ev.role_id = r.id
                )
              )
            )
            FROM event_volunteer_roles r 
            WHERE r.event_id = e.id
          ),
          '[]'::json
        ) as volunteer_roles,
        (
          SELECT COUNT(*) FROM event_volunteers ev 
          WHERE ev.event_id = e.id
        ) as current_volunteers
      FROM events e
      ORDER BY e.start_date DESC
    `;
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Fetch events error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
}

export async function createEvent(req, res) {
  try {
    const {
      event_title,
      description,
      event_type,
      location,
      start_date,
      start_time,
      end_date,
      end_time,
      registration_allowed,
      publish_event,
      volunteer_capacity,
      volunteer_roles,
    } = req.body;

    // Create event
    const newEvent = await sql`
      INSERT INTO events
        (event_title, description, event_type, location, start_date, start_time, end_date, end_time, registration_allowed, publish_event, volunteer_capacity)
      VALUES
        (${event_title}, ${description}, ${event_type}, ${location}, ${start_date}, ${start_time}, ${end_date}, ${end_time}, ${registration_allowed}, ${publish_event}, ${volunteer_capacity})
      RETURNING *;
    `;

    // Insert volunteer roles if provided
    if (volunteer_roles && volunteer_roles.length > 0) {
      const eventId = newEvent[0].id;
      for (const role of volunteer_roles) {
        await sql`
          INSERT INTO event_volunteer_roles
            (event_id, role_name, capacity)
          VALUES
            (${eventId}, ${role.role}, ${role.capacity});
        `;
      }
    }

    res.status(200).json({ success: true, data: newEvent[0] });
  } catch (error) {
    console.log("Create event error: ", error);
    res.status(500).json({ error: "Failed to create event" });
  }
}

export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const events = await sql`
      SELECT 
        e.*,
        COUNT(DISTINCT ev.user_id) as current_volunteers
      FROM events e
      LEFT JOIN event_volunteers ev ON e.id = ev.event_id
      WHERE e.id = ${id}
      GROUP BY e.id
    `;

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Fetch volunteer roles for this event
    const roles = await sql`
      SELECT 
        evr.id,
        evr.role_name,
        evr.capacity,
        COUNT(ev.user_id) as current_count
      FROM event_volunteer_roles evr
      LEFT JOIN event_volunteers ev ON evr.id = ev.role_id
      WHERE evr.event_id = ${id}
      GROUP BY evr.id, evr.role_name, evr.capacity
    `;

    const eventData = {
      ...events[0],
      volunteer_roles: roles,
    };

    console.log("Event fetched:", eventData);
    res.status(200).json({ success: true, data: eventData });
  } catch (error) {
    console.error("Fetch event error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch event",
    });
  }
}

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

    let users = await sql`
      SELECT id FROM user_info WHERE auth_user_id = ${authUserId}
    `;

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const userId = users[0].id;

    // Check if event has roles and roleId is provided
    if (roleId) {
      // Verify the role exists and has capacity
      const [role] = await sql`
        SELECT * FROM event_volunteer_roles 
        WHERE id = ${roleId} AND event_id = ${eventId}
      `;

      if (!role) {
        return res.status(404).json({
          success: false,
          error: "Role not found",
        });
      }

      // Check current count for role
      const [countResult] = await sql`
        SELECT COUNT(*) as count 
        FROM event_volunteers 
        WHERE event_id = ${eventId} AND role_id = ${roleId}
      `;

      if (parseInt(countResult.count) >= role.capacity) {
        return res.status(409).json({
          success: false,
          error: "This role is already full",
        });
      }
    }

    // Insert volunteer with role
    const registration = await sql`
      INSERT INTO event_volunteers (user_id, event_id, role_id, volunteer_status)
      VALUES (${userId}, ${eventId}, ${roleId || null}, 'joined')
      ON CONFLICT (user_id, event_id)
      DO NOTHING
      RETURNING *;
    `;

    if (registration.length === 0) {
      return res.status(409).json({
        success: true,
        message: "User already joined this event",
      });
    }

    res.status(201).json({
      success: true,
      data: registration[0],
    });
  } catch (error) {
    console.error("Join event error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to join event",
    });
  }
}

export async function getEventVolunteers(req, res) {
  try {
    const { eventId } = req.params;

    const volunteers = await sql`
      SELECT 
        ui.id, 
        ui.first_name, 
        ui.last_name, 
        ui.student_number, 
        ui.degree,
        ui.mobile,
        evr.role_name,
        ev.volunteer_status,
        ev.role_id
      FROM event_volunteers ev
      JOIN user_info ui ON ev.user_id = ui.id
      LEFT JOIN event_volunteer_roles evr ON ev.role_id = evr.id
      WHERE ev.event_id = ${eventId}
      ORDER BY ui.first_name, ui.last_name
    `;

    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    console.error("Fetch volunteers error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch volunteers" });
  }
}

//////////////////////////////////////
// TODO: Seperate resources to a different controller(?)
export async function getEventResources(req, res) {
  try {
    const { eventId } = req.params;

    const resources = await sql`
      SELECT 
        r.id,
        r.title,
        r.url,
        r.description,
        r.parent_resource_id,
        r.created_at,
        r.updated_at,
        u.first_name,
        u.last_name
      FROM event_resources r
      LEFT JOIN user_info u ON r.uploaded_by = u.id
      WHERE r.event_id = ${eventId}
      ORDER BY r.parent_resource_id NULLS FIRST, r.created_at DESC
    `;

    // resources parent-child structure
    const organized = [];
    const resourceMap = {};

    resources.forEach((resource) => {
      resourceMap[resource.id] = {
        ...resource,
        uploader: `${resource.first_name} ${resource.last_name}`,
        sublinks: [],
      };
    });

    resources.forEach((resource) => {
      if (resource.parent_resource_id) {
        if (resourceMap[resource.parent_resource_id]) {
          resourceMap[resource.parent_resource_id].sublinks.push(
            resourceMap[resource.id],
          );
        }
      } else {
        organized.push(resourceMap[resource.id]);
      }
    });

    res.status(200).json({
      success: true,
      data: organized,
    });
  } catch (error) {
    console.error("Get event resources error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch resources",
    });
  }
}

export async function createEventResource(req, res) {
  try {
    const { eventId } = req.params;
    const { title, url, description, parentResourceId, uploadedBy } = req.body;

    const newResource = await sql`
      INSERT INTO event_resources
        (event_id, title, url, description, parent_resource_id, uploaded_by)
      VALUES
        (${eventId}, ${title}, ${url}, ${description}, ${parentResourceId || null}, ${uploadedBy})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newResource[0],
    });
  } catch (error) {
    console.error("Create resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create resource",
    });
  }
}

export async function updateEventResource(req, res) {
  try {
    const { resourceId } = req.params;
    const { title, url, description } = req.body;

    const updated = await sql`
      UPDATE event_resources
      SET 
        title = ${title},
        url = ${url},
        description = ${description},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${resourceId}
      RETURNING *
    `;

    res.status(200).json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error("Update resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update resource",
    });
  }
}

export async function deleteEventResource(req, res) {
  try {
    const { resourceId } = req.params;

    await sql`
      DELETE FROM event_resources
      WHERE id = ${resourceId}
    `;

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete resource",
    });
  }
}
