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

import "./App.css";
import Events from "./pages/Events.jsx";
import EventDashboard from "./pages/EventDashboard";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/volunteer-form" element={<VolunteerForm />} />
            <Route path="/events" element={<Events />} />

                          {/* Replace with events/eventid */}
            <Route path="/eventdashboard" element={<EventDashboard />} />
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
