// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth'; // Import useAuth


import MainLayout from './layouts/MainLayout'; 
import AuthLayout from './layouts/AuthLayout'; 
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import EventListPage from './pages/EventListPage';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboardPage from './pages/StudentDashboardPage';
import EventDetailsPage from './pages/EventDetailsPage'; 
import CreateEventPage from './pages/CreateEventPage';
// import RegisteredEventsPage from './pages/RegisteredEventsPage';
import StatisticsPage from './pages/StatisticsPage'; 
import MyEventsPage from './pages/MyEventPage';
import RegisteredEventsPage from './pages/RegisteredEventPage';
import AdminAllEventsPage from './pages/AllEventPage';
import AttendancePage from './pages/AttendancePage';
// import AchievementsPage from './pages/AchievementsPage'; 
//  import AttendancePage from './pages/AttendancePage'; 
// import ProfilePage from './pages/ProfilePage'; 
// import NotFoundPage from './pages/NotFoundPage'; 


function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location }} replace />;
  }
 
  // Check if the user's role is allowed
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

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        // Route cho lần đầu truy cập, không cần đăng nhập
        <Route element={<MainLayout />}>

            <Route path="/" element={<HomePage />} />  //
            <Route path="/events/:eventId" element={<EventDetailsPage />} />

            //Route cho sinh viên đã đăng nhập
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboardPage />
              </ProtectedRoute> }/>
            <Route path="/registered-events" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <RegisteredEventsPage/>
                </ProtectedRoute>}/>
            <Route path="/achievements" element={
                <ProtectedRoute allowedRoles={['student']}>
                  {/* <AchievementsPage /> Bảng thành tích - Hồng Trang phát triển*/}   
                </ProtectedRoute>}/>
            <Route path="/attendance" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <AttendancePage/>
                </ProtectedRoute>}/>
            
            <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['student', 'event_creator', 'union']}>
                     {/* <ProfilePage />   Trang để điền các thông tin cá nhân và xác thực outlook - Thiên Phú phát triển */}
                </ProtectedRoute>}/>
           

            // Route cho người tạo sự kiện đăng nhập
          <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['event_creator', 'union']}> 
                  <AdminLayout />
              </ProtectedRoute>}>
              <Route index element={<Navigate to="my-events" replace />} />
              <Route path="events" element={<AdminAllEventsPage />} />
              <Route path="my-events" element={<MyEventsPage />} />
              <Route path="create-event" element={<CreateEventPage />} />
              <Route path= "creator-dashboard" element={
                  <ProtectedRoute allowedRoles={['event_creator']}>
                       {/* <EventCreatorDashboardPage />   Trang thống kê cho Liên chi, Thiên Phú phát triển */}
                  </ProtectedRoute>}/>
              <Route path="statistics" element={
                  <ProtectedRoute allowedRoles={['union']}> 
                      <StatisticsPage />
                  </ProtectedRoute>}/>
          </Route>
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;