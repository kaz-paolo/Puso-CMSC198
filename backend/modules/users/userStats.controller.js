import { userStatsService } from "./userStats.service.js";

export const userStatsController = {
  async getUserStats(req, res) {
    try {
      const { userId } = req.params;
      const stats = await userStatsService.getUserStats(userId);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      console.error("getUserStats error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch user stats" });
    }
  },

  async refreshUserStats(req, res) {
    try {
      const { userId } = req.params;
      await userStatsService.updateAllUserStats(userId);
      const stats = await userStatsService.getUserStats(userId);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      console.error("refreshUserStats error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to refresh user stats" });
    }
  },
};
