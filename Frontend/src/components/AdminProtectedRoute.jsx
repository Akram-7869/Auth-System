import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div>
          <Navigate to="/login" />;
      </div>

    )
  }

  // Check if user exists and has admin role
  if (!userRole || userRole !== 'ADMIN') {
    return (
      <div>
          <Navigate to="/me" />;
      </div>
    )
  }

  return children;
};

export default AdminProtectedRoute;