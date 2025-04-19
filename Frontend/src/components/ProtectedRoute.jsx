import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ProtectedRoute = ({ children }) => {

  const {isAuthenticated, userRole} =useSelector((state)=>state.auth);

  if (!isAuthenticated ) {
    return (
      <div>
        <Navigate to="/login" />
      </div>
    )
  }

  if(userRole === "ADMIN")
  {
    return <Navigate to="/usersLists"/>;
  }

  return children;
};

export default ProtectedRoute;