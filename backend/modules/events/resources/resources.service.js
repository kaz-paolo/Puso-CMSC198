import { sql } from "../../../config/db.js";

export const resourcesService = {
  async getResources(eventId) {
    const resources = await sql`
        SELECT 
          r.id,
          r.title,
          r.url,
          r.description,
          r.parent_resource_id,
          r.created_at,
          r.updated_at,
          r.deleted_at,
          r.deleted_by,
          u.first_name,
          u.last_name
        FROM event_resources r
        LEFT JOIN user_info u ON r.uploaded_by = u.id
        WHERE r.event_id = ${eventId}
          AND r.deleted_at IS NULL
        ORDER BY r.parent_resource_id NULLS FIRST, r.created_at DESC
      `;

    // resources parent-child structure
    const organizedResource = [];
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
        organizedResource.push(resourceMap[resource.id]);
      }
    });

    return organizedResource;
  },

  async createResource(
    eventId,
    { title, url, description, parentResourceId, uploadedBy },
  ) {
    const newResource = await sql`
        INSERT INTO event_resources
          (event_id, title, url, description, parent_resource_id, uploaded_by)
        VALUES
          (${eventId}, ${title}, ${url}, ${description}, ${parentResourceId || null}, ${uploadedBy})
        RETURNING *
      `;
    return newResource[0];
  },

  async updateResource(resourceId, { title, url, description }) {
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
    return updated[0];
  },
  async deleteResource(resourceId, deletedBy) {
    // Soft delete resource and all its sublinks (if any)
    const softDeleted = await sql`
          UPDATE event_resources
          SET 
            deleted_at = CURRENT_TIMESTAMP,
            deleted_by = ${deletedBy}
          WHERE (id = ${resourceId} OR parent_resource_id = ${resourceId})
            AND deleted_at IS NULL
          RETURNING *;
        `;
    return softDeleted;
  },
};
