import { useState, useMemo } from "react";
// filtering logic (volunteerstable.jsx)

export function useVolunteerFilters(volunteers) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesSearch =
        search === "" ||
        `${v.first_name} ${v.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesRole = roleFilter === null || v.role_name === roleFilter;
      const matchesStatus =
        statusFilter === null || v.volunteer_status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [volunteers, search, roleFilter, statusFilter]);

  const uniqueRoles = useMemo(
    () => [...new Set(volunteers.map((v) => v.role_name))].filter(Boolean),
    [volunteers],
  );

  const uniqueStatuses = useMemo(
    () =>
      [...new Set(volunteers.map((v) => v.volunteer_status))].filter(Boolean),
    [volunteers],
  );

  return {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    filteredVolunteers,
    uniqueRoles,
    uniqueStatuses,
  };
}
