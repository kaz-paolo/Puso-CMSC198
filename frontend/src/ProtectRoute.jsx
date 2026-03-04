import { Navigate } from "react-router-dom";
import { useAuth } from "better-auth";
import { Center, Loader } from "@mantine/core";

// Use to authenticate protected routes
// If user is not logged in when accessing pages, redirect to /auth

function ProtectRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectRoute;
