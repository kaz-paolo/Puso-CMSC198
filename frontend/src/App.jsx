import { Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import "./App.css";

import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VolunteerForm from "./pages/VolunteerForm.jsx";
import FormSectionPage from "./pages/FormSectionPage.jsx";
import Profile from "./pages/Profile.jsx";
import Events from "./pages/Events.jsx";
import EventDashboard from "./pages/EventDashboard";
import Resources from "./pages/Resources.jsx";
import Evaluation from "./pages/Evaluation.jsx";
import Settings from "./pages/Settings.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import VolunteerApplication from "./pages/VolunteerApplication.jsx";
import PublicSurveyPage from "./pages/PublicSurveyPage.jsx";
import PublicSurveySuccessPage from "./pages/PublicSurveySuccessPage.jsx";
import VolunteerDirectory from "./pages/admin/VolunteerDirectory.jsx";
import EvaluationManagement from "./pages/admin/EvaluationManagement.jsx";
import EventFeedbackResults from "./pages/admin/EventFeedbackResults.jsx";
import AttendanceHub from "./pages/AttendanceHub.jsx";

import { AuthProvider } from "./contexts/AuthContext.jsx";

function AppContent() {
  const navigate = useNavigate();

  return (
    <>
      <AuthProvider>
        <Notifications />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/volunteer-application"
              element={<VolunteerApplication />}
            />
            <Route
              path="/events/:eventId/register"
              element={<PublicSurveyPage />}
            />
            <Route
              path="/events/:eventId/success/:registrationId"
              element={<PublicSurveySuccessPage />}
            />

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/volunteer-form" element={<VolunteerForm />}>
                <Route path=":sectionKey" element={<FormSectionPage />} />
              </Route>
              <Route path="/events" element={<Events />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/events/:eventId" element={<EventDashboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/evaluation" element={<Evaluation />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/volunteerdirectory"
                element={<VolunteerDirectory />}
              />
              <Route
                path="/evaluation-management"
                element={<EvaluationManagement />}
              />
              <Route
                path="/evaluation-management/:eventId/results"
                element={<EventFeedbackResults />}
              />
              <Route path="/attendancehub" element={<AttendanceHub />} />
            </Route>

            {/* Invalid URL Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
