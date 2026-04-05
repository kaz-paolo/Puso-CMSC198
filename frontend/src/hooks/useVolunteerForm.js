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

  useEffect(() => {
    let isMounted = true;

    if (session?.user?.email) {
      setForm((prev) => ({ ...prev, email: session.user.email }));
    }

    const fetchExistingProfile = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/${session.user.id}/complete-info`,
        );

        if (response.ok && isMounted) {
          const data = await response.json();
          if (data.success && data.data) {
            const dbUser = data.data;

            setForm((prev) => {
              const updatedForm = { ...prev };

              const fieldMapping = {
                first_name: "firstName",
                middle_name: "middleName",
                last_name: "lastName",
                student_number: "studentNumber",
                nickname: "nickname",
                sex: "sex",
                civil_status: "civilStatus",
                dob: "birthDate",
                birth_place: "birthPlace",
                height: "height",
                weight: "weight",
                blood_type: "bloodType",
                languages: "languages",
                mobile: "mobile",
                hometown: "hometown",
                present_address: "presentAddress",
                classification: "classification",
                college: "college",
                degree: "degree",
                year_level: "yearLevel",
                year_graduated: "yearGraduated",
                campus: "campus",
                designation: "designation",
                organization: "organization",
                organizations: "organizations",
                illness: "illness",
                arukahik_join_date: "arukahikJoinDate",
                hobbies: "hobbies",
                skills: "skills",
                expertise: "expertise",
                software: "software",
                committee1: "committee1",
                why_committee1: "whyCommittee1",
                committee2: "committee2",
                why_committee2: "whyCommittee2",
                committee3: "committee3",
                why_committee3: "whyCommittee3",
                strengths: "strengths",
                facebook: "facebook",
              };

              for (const [dbKey, formKey] of Object.entries(fieldMapping)) {
                if (dbUser[dbKey] !== null && dbUser[dbKey] !== undefined) {
                  updatedForm[formKey] = dbUser[dbKey];
                }
              }

              // Ensure birthDate is properly formatted for HTML <input type="date">
              if (dbUser.dob) {
                const d = new Date(dbUser.dob);
                if (!isNaN(d.getTime())) {
                  updatedForm.birthDate = d.toISOString().split("T")[0];
                }
              }

              return updatedForm;
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch existing profile data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExistingProfile();

    return () => {
      isMounted = false;
    };
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
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/complete-profile`,
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
