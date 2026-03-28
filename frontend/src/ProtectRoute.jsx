import { Navigate } from "react-router-dom";
import { useSession } from "./hooks/useSession";
import { Center, Loader } from "@mantine/core";

// Use to authenticate protected routes
// If user is not logged in when accessing pages, redirect to /auth

function ProtectRoute({ children }) {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!session?.user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectRoute;
