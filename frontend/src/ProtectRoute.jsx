import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { auth } from '../firebase/firebase';
import { Center, Loader } from "@mantine/core";

// Use to authenticate protected routes
// If user is not logged in when accessing pages, redirect to /auth

function ProtectRoute({ children }) {
  const [user, setUser] = useState(true);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setUser(user);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // if (loading) {
  //   return (
  //     <Center style={{ minHeight: "100vh" }}>
  //       <Loader size="lg" />
  //     </Center>
  //   );
  // }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectRoute;
