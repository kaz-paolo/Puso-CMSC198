import { useState, useEffect } from "react";
import { authClient } from "../auth.js";

export function useAddTaskForm({ opened, eventId, onTaskCreated, onClose }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    task_title: "",
    category: "",
    status: "To Do",
    priority: "",
    deadline_date: null,
    deadline_time: "",
    task_details: "",
    relevant_links: [""],
    assignees: [],
  });

  // Fetch session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      setSession(data);
    };
    fetchSession();
  }, []);

  // Fetch volunteers and roles when modal opens or eventId changes
  useEffect(() => {
    if (opened && eventId) {
      fetchVolunteersAndRoles();
    }
  }, [opened, eventId]);

  const fetchVolunteersAndRoles = async () => {
    try {
      // get volunteers from event to be assigned
      const volRes = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/volunteers`,
      );
      const volData = await volRes.json();

      if (volData.success) {
        setVolunteers(
          volData.data.map((v) => ({
            value: `user-${v.id}`,
            label: `${v.first_name} ${v.last_name}`,
            type: "user",
            id: v.id,
          })),
        );
      }

      // get event details for roles to be assigned
      const eventRes = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}`,
      );
      const eventData = await eventRes.json();

      if (eventData.success && eventData.data.volunteer_roles) {
        setRoles(
          eventData.data.volunteer_roles.map((r) => ({
            value: `role-${r.id}`,
            label: r.role_name,
            type: "role",
            id: r.id,
          })),
        );
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load volunteers or roles.");
    }
  };

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      relevant_links: [...prev.relevant_links, ""],
    }));
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      relevant_links: prev.relevant_links.filter((_, i) => i !== index),
    }));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.relevant_links];
    newLinks[index] = value;
    setFormData((prev) => ({ ...prev, relevant_links: newLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!session || !session.user || !session.user.id) {
        throw new Error("User session not found. Please log in.");
      }

      // fetch user database ID
      const userRes = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${session.user.id}/basic-info`,
      );
      const userData = await userRes.json();

      if (!userData.success) {
        throw new Error("Failed to get user information");
      }

      // format assignees
      const assignees = formData.assignees.map((a) => {
        const [type, id] = a.split("-");
        return { type, id: parseInt(id) };
      });

      // filter empty links
      const relevant_links = formData.relevant_links.filter((link) => link);

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
        deadline_date: formatDate(formData.deadline_date),
        relevant_links,
        assignees,
        created_by: userData.data.id,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create task");

      // reset form data after successful submission
      setFormData({
        task_title: "",
        category: "",
        status: "To Do",
        priority: "",
        deadline_date: null,
        deadline_time: "",
        task_details: "",
        relevant_links: [""],
        assignees: [],
      });

      if (onTaskCreated) onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      setError(error.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const assigneeOptions = [...volunteers, ...roles];

  return {
    formData,
    setFormData,
    loading,
    error,
    setError,
    assigneeOptions,
    handleAddLink,
    handleRemoveLink,
    handleLinkChange,
    handleSubmit,
  };
}
