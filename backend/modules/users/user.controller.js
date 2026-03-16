import { userService } from "./user.service.js";

export const getAllUsers = async (req, res) => {
  res.send("Get all users");
};

export const getBasicInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getBasicInfo(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("getBasicInfo error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { authUserId, ...profileData } = req.body;

    if (!authUserId) {
      return res.status(400).json({ error: "authUserId is required" });
    }

    // Verify user exists
    const userExists = await userService.verifyAuthUser(authUserId);
    if (!userExists) {
      console.error("User not found in neon_auth.user:", authUserId);
      return res.status(404).json({ error: "User not found in Neon Auth" });
    }

    try {
      const result = await userService.completeProfile(authUserId, profileData);
      console.log("Profile completed successfully for user:", authUserId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (validationError) {
      return res.status(400).json({
        error: validationError.message || "Invalid Data",
        details: "Missing required fields",
      });
    }
  } catch (error) {
    console.error("completeProfile error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

export const getCompleteInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getCompleteInfo(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("getCompleteInfo error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export async function getUserJoinedEvents(req, res) {
  try {
    const { id } = req.params;
    const events = await userService.getUserJoinedEvents(id);
    res.json({ success: true, data: events });
  } catch (error) {
    console.error("getUserJoinedEvents error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch joined events",
    });
  }
}

export async function checkExistingMember(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const exists = await userService.checkExistingMember(email);

    return res.status(200).json({
      success: true,
      exists: exists,
    });
  } catch (error) {
    console.error("checkExistingMember error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check existing members",
    });
  }
}
