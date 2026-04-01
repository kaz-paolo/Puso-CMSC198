import { eventsService } from "./events.service.js";

export const eventsController = {
  async getAllEvents(req, res) {
    try {
      const data = await eventsService.getAllEvents();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Fetch events error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch events" });
    }
  },
  async createEvent(req, res) {
    try {
      const data = await eventsService.createEvent(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      console.log("Create event error: ", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  },
  async getEventById(req, res) {
    try {
      const data = await eventsService.getEventById(req.params.id);
      if (!data) {
        return res
          .status(404)
          .json({ success: false, error: "Event not found" });
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Fetch event error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch event" });
    }
  },
  async getDashboardStats(req, res) {
    try {
      const data = await eventsService.getDashboardStats();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Fetch dashboard stats error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch dashboard stats" });
    }
  },

  async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      const { deletedBy } = req.body;

      const data = await eventsService.deleteEvent(eventId, deletedBy);

      if (!data) {
        return res
          .status(404)
          .json({ success: false, error: "Event not deleted" });
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ success: false, error: "Failed to delete event" });
    }
  },
  async archiveEvent(req, res) {
    try {
      const { eventId } = req.params;

      const data = await eventsService.archiveEvent(eventId);

      if (!data) {
        return res
          .status(404)
          .json({ success: false, error: "Event not archived" });
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Archive event error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to archive event" });
    }
  },
};
