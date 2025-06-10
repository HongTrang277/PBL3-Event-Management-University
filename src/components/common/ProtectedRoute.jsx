import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Lấy đúng các biến từ context
  const { isAuthenticated, user, userRoles, hasAnyRole, loading } = useAuth();
  const location = useLocation();

   console.log("Protected Route Detail Check:", { 
    isAuthenticated, 
    userDetail: user,
    userRolesDetail: userRoles,
    allowedRolesDetail: allowedRoles,
    hasRequiredRole: allowedRoles.length > 0 ? hasAnyRole(allowedRoles) : true,
    roleCheckResult: allowedRoles.map(role => ({
      role,
      match: userRoles.some(r => r.toLowerCase() === role.toLowerCase())
    }))
  });
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    console.warn(`User does not have any required roles: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;