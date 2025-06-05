import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { authService } from './services/api';

// Layouts
import MainLayout from './layouts/MainLayout'; 
import AuthLayout from './layouts/AuthLayout'; 
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import EventDetailsPage from './pages/EventDetailsPage'; 
import CreateEventPage from './pages/CreateEventPage';
import StatisticsPage from './pages/StatisticsPage'; 
import MyEventsPage from './pages/MyEventPage';
import RegisteredEventsPage from './pages/RegisteredEventPage';
import AdminAllEventsPage from './pages/AllEventPage';
import AttendancePage from './pages/AttendancePage';
import MyProfile from './pages/MyProfile';
// Uncomment as needed
// import AchievementsPage from './pages/AchievementsPage'; 
// import ProfilePage from './pages/ProfilePage'; 
// import NotFoundPage from './pages/NotFoundPage'; 
// import EventCreatorDashboardPage from './pages/EventCreatorDashboardPage';

// Đảm bảo RoleGate được import, hoặc tạo mới nếu chưa có
// import { RoleGate } from './components/common/RoleGate';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes - Auth layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Main layout routes */}
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />

          {/* Student routes - Vai trò sinh viên */}
          
          
          <Route path="/registered-events" element={
            <ProtectedRoute allowedRoles={['User']}>
              <RegisteredEventsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard-student" element={
            <ProtectedRoute allowedRoles={['User']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/achievements" element={
            <ProtectedRoute allowedRoles={['User']}>
              {/* <AchievementsPage /> */}
              <div>Chức năng đang phát triển</div>
            </ProtectedRoute>
          } />
          
          <Route path="/attendance" element={
            <ProtectedRoute allowedRoles={['student', 'Student','User']}>
              <AttendancePage />
            </ProtectedRoute>
          } />
          
          {/* Profile - Nhiều vai trò có thể truy cập */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['student','User', 'Student', 'event_creator', 'EventCreator', 'union', 'Union', 'Admin', 'Organizer']}>
              <MyProfile />
            </ProtectedRoute>
          } />

          {/* Admin routes - Vai trò admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Organizer','event_creator', 'EventCreator', 'union', 'Union', 'Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Default route cho admin */}
            <Route index element={<Navigate to="my-events" replace />} />
            
            {/* Danh sách tất cả sự kiện - Cho cả event creator và union */}
            <Route path="events" element={
              <ProtectedRoute allowedRoles={['Organizer','event_creator', 'EventCreator', 'union', 'Union', 'Admin']}>
                <AdminAllEventsPage />
              </ProtectedRoute>
            } />
            
            {/* Sự kiện của tôi - Cho cả event creator và union */}
            <Route path="my-events" element={
              <ProtectedRoute allowedRoles={['Organizer','event_creator', 'EventCreator', 'union', 'Union', 'Admin']}>
                <MyEventsPage />
              </ProtectedRoute>
            } />
            
            {/* Tạo sự kiện - Cho cả event creator và union */}
            <Route path="create-event" element={
              <ProtectedRoute allowedRoles={['Organizer','event_creator', 'EventCreator', 'union', 'Union', 'Admin']}>
                <CreateEventPage />
              </ProtectedRoute>
            } />
            
            {/* Dashboard cho người tạo sự kiện - Chỉ cho event_creator */}
            <Route path="creator-dashboard" element={
              <ProtectedRoute allowedRoles={['event_creator', 'EventCreator']}>
                {/* <EventCreatorDashboardPage /> */}
                <div>Chức năng đang phát triển</div>
              </ProtectedRoute>
            } />
            
            {/* Thống kê - Chỉ cho union */}
            <Route path="statistics" element={
              <ProtectedRoute allowedRoles={['union', 'Union', 'Admin']}>
                <StatisticsPage />
              </ProtectedRoute>
            } />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;