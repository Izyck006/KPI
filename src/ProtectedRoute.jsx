import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('kpi_token');
  const userString = localStorage.getItem('kpi_user');
  
  // Parse the user object safely
  let user = {};
  try {
    if (userString) user = JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user data", error);
  }

  // 1. If there is no secure token, boot them to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the route requires a specific role and they don't match, reroute them
  if (allowedRole && user.role !== allowedRole) {
    // Send them to their respective designated dashboard
    return <Navigate to={user.role === 'CEO' ? '/ceo' : '/staff'} replace />;
  }

  // 3. If everything checks out, render the requested dashboard
  return children;
};

export default ProtectedRoute;