import { useState } from "react";

export function useAddResourceForm({
  eventId,
  onResourceCreated,
  uploadedBy,
  onClose,
}) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    parentResourceId: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/events/${eventId}/resources`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            uploadedBy,
          }),
        },
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: text || `Server error: ${response.status}` };
      }
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // reset form
      setFormData({
        title: "",
        url: "",
        description: "",
        parentResourceId: null,
      });

      if (onResourceCreated) onResourceCreated();
      onClose();
    } catch (error) {
      console.error("Error creating resource:", error);
      setError(error.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    setError,
    loading,
    handleSubmit,
  };
}
