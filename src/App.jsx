import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateEventPage from "./pages/CreateEventPage";
import StatisticsPage from "./pages/StatisticsPage";
import MyEventsPage from "./pages/MyEventPage";
import RegisteredEventsPage from "./pages/RegisteredEventPage";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.warn(`User role ${user?.role} not authorized for this route.`);
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Student Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registered-events"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <RegisteredEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                {/* <AchievementsPage /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                {/* <AttendancePage /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["student", "event_creator", "union"]}
              >
                {/* <ProfilePage /> */}
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["event_creator", "union"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="my-events" replace />} />
          <Route path="my-events" element={<MyEventsPage />} />
          <Route path="create-event" element={<CreateEventPage />} />
          <Route
            path="statistics"
            element={
              <ProtectedRoute allowedRoles={["union"]}>
                <StatisticsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 fallback */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
