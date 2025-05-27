
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
export const RoleGate = ({ children, role, fallback = null }) => {
  const { hasRole } = useAuth();
  return hasRole(role) ? children : fallback;
};

// Sử dụngm
<RoleGate role="union">
  <AdminPanel />
</RoleGate>