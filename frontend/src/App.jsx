import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { stackClientApp } from "./stack/stack.js";

import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VolunteerForm from "./pages/VolunteerForm.jsx";
import Profile from "./pages/Profile.jsx";
import "@mantine/dates/styles.css";
import "./App.css";
import Events from "./pages/Events.jsx";
import EventDashboard from "./pages/EventDashboard";
import AppLayout from "./layouts/AppLayout.jsx";

function HandlerRoutes() {
  const location = useLocation();
  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />

              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/volunteer-form" element={<VolunteerForm />} />
                <Route path="/events" element={<Events />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/events/:eventId" element={<EventDashboard />} />
              </Route>

              {/* Invalid URL Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </StackTheme>
        </StackProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
