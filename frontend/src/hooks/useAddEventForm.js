import { useState, useEffect } from "react";
import { authClient } from "../auth.js";

export function useAddEventForm({ onEventCreated, onClose }) {
  const [session, setSession] = useState(null);
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

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      setSession(data);
    };
    fetchSession();
  }, []);

  const handleAddRole = () => {
    setFormData((prev) => ({
      ...prev,
      volunteer_roles: [
        ...prev.volunteer_roles,
        { role_name: "", capacity: "" },
      ],
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
      if (!session?.user?.id) {
        throw new Error("User session not found.");
      }

      // ID from auth user id
      const userRes = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${
          session.user.id
        }/basic-info`,
      );
      const userData = await userRes.json();

      if (!userData.success || !userData.data?.id) {
        throw new Error("Failed to get user information for event creation.");
      }

      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const finalRoles =
        capacityType === "roles" ? formData.volunteer_roles : [];
      const finalCapacity =
        capacityType === "simple" ? formData.volunteer_capacity : 0;

      const formDataToSend = new FormData();
      formDataToSend.append("event_title", formData.event_title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("event_type", formData.event_type);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("start_date", formatDate(formData.start_date));
      formDataToSend.append("start_time", formData.start_time);
      formDataToSend.append("end_date", formatDate(formData.end_date));
      formDataToSend.append("end_time", formData.end_time);
      formDataToSend.append(
        "registration_allowed",
        formData.registration_allowed,
      );
      formDataToSend.append("approval_required", formData.approval_required);
      formDataToSend.append("publish_event", formData.publish_event);
      formDataToSend.append("volunteer_capacity", finalCapacity);
      formDataToSend.append("volunteer_roles", JSON.stringify(finalRoles));
      formDataToSend.append("created_by", userData.data.id);

      // if (formData.image) {
      //   formDataToSend.append("image", formData.image);
      // }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events`,
        {
          method: "POST",
          body: formDataToSend,
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
