import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ResetProtectedRoute = ({ children }) => {

  const {resetLink} =useSelector((state)=>state.auth);

  if (!resetLink ) {
    return (
      <div>
        <Navigate to="/forgot-password" />
      </div>
    )
  }

  return children;
};

export default ResetProtectedRoute;