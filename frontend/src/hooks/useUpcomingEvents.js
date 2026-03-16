import { useState, useEffect } from "react";
import { useEvents } from "./useEvents";

export function useUpcomingEvents(user) {
  const { events, loading, error } = useEvents(user);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (events) {
      const now = new Date();
      const upcoming = events
        .filter((e) => {
          const startDate = new Date(e.start_date);
          return startDate >= now;
        })
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 7);
      setUpcomingEvents(upcoming);
    }
  }, [events]);

  return { upcomingEvents, loading, error };
}
