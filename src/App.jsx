// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth'; // Import useAuth

// Layouts
import MainLayout from './layouts/MainLayout'; // Tạo file này
import AuthLayout from './layouts/AuthLayout'; // Tạo file này
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage'; // Tạo file này
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Tạo file này
// import EventListPage from './pages/EventListPage'; // Tạo file này
import StudentLayout from './layouts/StudentLayout';
import StudentDashboardPage from './pages/StudentDashboardPage';
import EventDetailsPage from './pages/EventDetailsPage'; // Tạo file này
import CreateEventPage from './pages/CreateEventPage';
// import MyEventsPage from './pages/MyEventsPage'; // Tạo file này
// import RegisteredEventsPage from './pages/RegisteredEventsPage'; // Tạo file này
import StatisticsPage from './pages/StatisticsPage'; // Tạo file này
import MyEventsPage from './pages/MyEventPage';
import RegisteredEventsPage from './pages/RegisteredEventPage';
// import AchievementsPage from './pages/AchievementsPage'; // Tạo file này
//  import AttendancePage from './pages/AttendancePage'; // Tạo file này
// import ProfilePage from './pages/ProfilePage'; // Tạo file này
// import NotFoundPage from './pages/NotFoundPage'; // Tạo file này

// Component Protected Route (Ví dụ)
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: window.location }} replace />;
  }

  // Check if the user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // User is logged in but doesn't have the right role
    // Redirect to a "not authorized" page or home page
    console.warn(`User role ${user?.role} not authorized for this route.`);
    return <Navigate to="/" replace />; // Redirect to home for simplicity
  }

  return children;
}


function App() {
  return (
    
    <AuthProvider>
      <Routes>
        {/* Routes không cần đăng nhập (AuthLayout) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Thêm các route khác như forgot password... */}
        </Route>

        {/* Routes cho người dùng đã đăng nhập (MainLayout - Student View) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/events" element={<EventListPage />} /> */}
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}>
<StudentDashboardPage /></ProtectedRoute> }/>
          {/* Routes cần đăng nhập (Sinh viên) */}
          <Route path="/registered-events" element={
              <ProtectedRoute allowedRoles={['student']}>
                  <RegisteredEventsPage/>
              </ProtectedRoute>
          } />
          <Route path="/achievements" element={
              <ProtectedRoute allowedRoles={['student']}>
                 {/* <AchievementsPage /> */}
              </ProtectedRoute>
          } />
          <Route path="/attendance" element={
              <ProtectedRoute allowedRoles={['student']}>
                  {/* <AttendancePage /> */}
              </ProtectedRoute>
          } />
           <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['student', 'event_creator', 'union']}>
                  {/* <ProfilePage /> */}
              </ProtectedRoute>
           } />
           {/* Thêm các route chung khác */}
        </Route>

        {/* Routes cho Admin/Người tạo sự kiện (AdminLayout) */}
        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['event_creator', 'union']}>
               <AdminLayout />
            </ProtectedRoute>
        }>
           {/* Redirect /admin to a default admin page */}
           <Route index element={<Navigate to="my-events" replace />} />
           {/* <Route path="events" element={<EventListPage isAdminView={true}/>} /> Có thể tái sử dụng EventListPage với prop */}
           <Route path="my-events" element={<MyEventsPage />} />
           <Route path="create-event" element={<CreateEventPage />} />
           {/* Route thống kê chỉ cho Union */}
           <Route path="statistics" element={
               <ProtectedRoute allowedRoles={['union']}>
                   <StatisticsPage />
                </ProtectedRoute>
           }/>
           {/* Thêm các route admin khác: edit event, manage users... */}
           {/* <Route path="*" element={<NotFoundPage />} /> Bắt các route admin không tồn tại */}
        </Route>

        {/* Route không tìm thấy (404) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;