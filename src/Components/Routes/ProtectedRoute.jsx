import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // redirect to login or default
  }
  return children;
};

export default ProtectedRoute;
