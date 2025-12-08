export const getAllUsers = async (req, res) => {
  res.send("Get all users");
};

export const createUser = async (req, res) => {
  res.send("Create new user");
};

export const updateDisplayName = async (req, res) => {
  const { userId, displayName } = req.body;
  res.send("update name");

  if (!userId || !displayName) {
    return res.status(400).json({ error: "Missing userId or displayName" });
  }

  try {
    const response = await fetch(
      `${process.env.NEON_AUTH_URL}/admin/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEON_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ display_name: displayName }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update display name");
    }

    res.json({ success: true, user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
