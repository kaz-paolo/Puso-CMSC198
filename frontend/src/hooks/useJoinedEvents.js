// navbar.jsx
async function fetchJoinedEvents() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${userProfile.id}/joined-events`,
    );
    const data = await res.json();
    if (data.success) {
      setJoinedEvents(data.data);
    }
  } catch (err) {
    console.error("Failed to fetch joined events:", err);
  }
}
