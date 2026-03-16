import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "./useSession.js";

export function useVolunteerForm(sections) {
  const { session } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    consent: false,
  });

  // Update email when session is loaded
  useEffect(() => {
    if (session?.user?.email) {
      setForm((prev) => ({ ...prev, email: session.user.email }));
    }
  }, [session]);

  const sectionProgress = useMemo(() => {
    const progress = {};
    let allRequiredComplete = true;

    for (const section of sections) {
      const requiredFields = section.required;
      // If there are no required fields, progress is not tracked
      //  show progress based on any field being filled.
      if (requiredFields.length === 0) {
        const totalFields = section.fields.length;
        const filledCount = section.fields.filter((f) => form[f.name]).length;
        progress[section.key] = (filledCount / totalFields) * 100;
      } else {
        const filledCount = requiredFields.filter(
          (field) => form[field],
        ).length;
        const sectionP = (filledCount / requiredFields.length) * 100;
        progress[section.key] = sectionP;
        if (sectionP < 100) allRequiredComplete = false;
      }
    }
    progress.all = allRequiredComplete;
    return progress;
  }, [form, sections]);

  const handleSubmit = async () => {
    if (!sectionProgress.all || !form.consent) {
      setError(
        "Please complete all required sections and agree to the consent form before submitting.",
      );
      return;
    }

    if (!session?.user?.id) {
      setError("Session not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { email, consent, ...formData } = form;

      // Log the data being sent
      console.log("Submitting profile data:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        authUserId: session.user.id,
      });

      const response = await fetch(
        "${import.meta.env.VITE_API_URL_BASE_URL}/api/users/complete-profile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            authUserId: session.user.id,
          }),
        },
      );
      const data = await response.json();

      console.log("Server response:", data);

      if (!response.ok)
        throw new Error(data.error || "Failed to save profile.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    error,
    setError,
    sectionProgress,
    handleSubmit,
  };
}
