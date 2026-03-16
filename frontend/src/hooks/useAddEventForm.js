import { useState } from "react";

export function useAddEventForm({ onEventCreated, onClose }) {
  const [formData, setFormData] = useState({
    event_title: "",
    description: "",
    event_type: "",
    location: "",
    start_date: null,
    start_time: "",
    end_date: null,
    end_time: "",
    registration_allowed: false,
    approval_required: true,
    publish_event: false,
    volunteer_capacity: 0,
    volunteer_roles: [],
  });
  const [capacityType, setCapacityType] = useState("simple");
  const [error, setError] = useState(null);

  const handleAddRole = () => {
    setFormData((prev) => ({
      ...prev,
      volunteer_roles: [...prev.volunteer_roles, { role: "", capacity: "" }],
    }));
  };

  const handleRemoveRole = (index) => {
    setFormData((prev) => ({
      ...prev,
      volunteer_roles: prev.volunteer_roles.filter((_, i) => i !== index),
    }));
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = [...formData.volunteer_roles];
    newRoles[index][field] = value;
    setFormData({ ...formData, volunteer_roles: newRoles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const submissionData = {
        ...formData,
        start_date: formatDate(formData.start_date),
        end_date: formatDate(formData.end_date),
        volunteer_capacity:
          capacityType === "simple" ? formData.volunteer_capacity : 0,
        volunteer_roles:
          capacityType === "roles" ? formData.volunteer_roles : [],
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create event");

      // Reset form
      setFormData({
        event_title: "",
        description: "",
        event_type: "",
        location: "",
        start_date: null,
        start_time: "",
        end_date: null,
        end_time: "",
        registration_allowed: false,
        approval_required: true,
        publish_event: false,
        volunteer_capacity: 0,
        volunteer_roles: [],
      });
      setCapacityType("simple");

      if (onEventCreated) onEventCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      setError(error.message || "Failed to create event");
    }
  };

  return {
    formData,
    setFormData,
    capacityType,
    setCapacityType,
    error,
    setError,
    handleAddRole,
    handleRemoveRole,
    handleRoleChange,
    handleSubmit,
  };
}
