const API_URL = import.meta.env.VITE_API_URL_BASE_URL;

// get jwt token from storage and format to http header
const getHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    // add bearer token
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// client object, fetches requests
export const authClient = {
  signIn: {
    // authenticate user and store returned jwt token to localstorage
    email: async ({ email, password }) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) return { error: { message: data.error } };

      // storage in localstorage, user stays logged between reloads
      localStorage.setItem("auth_token", data.token);
      return { data };
    },
  },
  signUp: {
    //register new user
    email: async (formData) => {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) return { error: { message: data.error } };
      return { data };
    },
  },
  emailOtp: {
    // submit otp
    verifyEmail: async ({ email, otp }) => {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) return { error: { message: data.error } };
      return { data: true };
    },
  },
  // validate local token
  getSession: async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return { data: null }; // no token = no active session

    const res = await fetch(`${API_URL}/api/auth/session`, {
      method: "GET",
      // attach stored token to request header
      headers: getHeaders(),
    });

    if (!res.ok) return { data: null };

    const data = await res.json();
    return { data: { session: true, user: data.user } };
  },
  // clear storage when log out
  signOut: async () => {
    localStorage.removeItem("auth_token");
    return { success: true };
  },
};
