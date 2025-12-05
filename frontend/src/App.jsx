import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VolunteerForm from "./pages/VolunteerForm.jsx";

import ProtectedRoute from "./ProtectRoute.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
// import "../firebase/firebase.js";

// prettier-ignore
function App() {
  return (
    <Routes>
      {/* Page Routing */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/volunteer-form" element={<ProtectedRoute><VolunteerForm /></ProtectedRoute>} />
      {/* undefined url */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
