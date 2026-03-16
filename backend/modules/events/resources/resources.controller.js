import { resourcesService } from "./resources.service.js";

export const getEventResources = async (req, res) => {
  try {
    const { eventId } = req.params;
    const resources = await resourcesService.getResources(eventId);

    res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch resources",
    });
  }
  ``;
};

export const createEventResource = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, url, description, parentResourceId, uploadedBy } = req.body;

    const newResource = await resourcesService.createResource(eventId, {
      title,
      url,
      description,
      parentResourceId,
      uploadedBy,
    });

    res.status(201).json({
      success: true,
      data: newResource,
    });
  } catch (error) {
    console.error("Create resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create resource",
    });
  }
};

export const updateEventResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { title, url, description } = req.body;

    const updatedResource = await resourcesService.updateResource(resourceId, {
      title,
      url,
      description,
    });

    res.status(200).json({
      success: true,
      data: updatedResource,
    });
  } catch (error) {
    console.error("Update resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update resource",
    });
  }
};

export const deleteEventResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { deletedBy } = req.body;

    if (!deletedBy) {
      return res.status(400).json({
        success: false,
        error: "deletedBy is required",
      });
    }

    const softDeleted = await resourcesService.deleteResource(
      resourceId,
      deletedBy,
    );

    if (softDeleted.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Resource not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
      data: softDeleted,
    });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete resource",
    });
  }
};
