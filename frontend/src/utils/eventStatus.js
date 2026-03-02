export function getEventStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // compare dates only
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (now < start) {
    return "upcoming";
  } else if (now >= start && now <= end) {
    return "ongoing";
  } else {
    return "completed";
  }
}

export function getStatusColor(status) {
  const colors = {
    upcoming: "blue",
    ongoing: "green",
    completed: "gray",
  };
  return colors[status] || "gray";
}

export function getStatusLabel(status) {
  const labels = {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed",
  };
  return labels[status] || status;
}
