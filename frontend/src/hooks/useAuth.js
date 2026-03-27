import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { authClient } from "../auth";

export function useAuth() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [view]);

  const handleArukahikSignup = () => {
    const arukahikAvailable = false;
    if (arukahikAvailable) {
      navigate("/volunteerapplication");
    } else {
      notifications.show({
        title: "Coming Soon!",
        message: "There are currently no available Arukahik trainings.",
        color: "yellow",
      });
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      if (view === "login") {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) throw error;

        localStorage.removeItem("justSignedUp");
        localStorage.setItem("justLoggedIn", "true");
        navigate("/dashboard");
      } else {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
        });

        if (error) throw error;

        localStorage.setItem("justSignedUp", "true");
        navigate("/volunteer-form");
      }
    } catch (err) {
      const errorMessage = err.message || err.error?.message;
      if (errorMessage) {
        if (
          errorMessage.includes("Invalid credentials") ||
          errorMessage.includes("password")
        ) {
          setError("Incorrect email or password. Please try again.");
        } else if (errorMessage.includes("email")) {
          setError("Please enter a valid email address.");
        } else if (errorMessage.includes("already exists")) {
          setError("An account with this email already exists. Please log in.");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Authentication failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL_BASE_URL}/api/users/check-existing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        },
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      if (!data.exists) {
        setError("Email not found in existing members list.");
        return;
      }

      setVerifiedEmail(normalizedEmail);
      setEmail(normalizedEmail);
      setView("signup");
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return {
    view,
    setView,
    email,
    setEmail,
    name,
    setName,
    password,
    setPassword,
    error,
    setError,
    loading,
    verifiedEmail,
    handleArukahikSignup,
    handleEmailAuth,
    handleVerify,
  };
}
