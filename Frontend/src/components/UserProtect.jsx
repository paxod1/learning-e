// UserProtect.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function UserProtect() {
  const loginInfo = useSelector((state) => state.userlogin?.LoginInfo?.[0]);
  const token = loginInfo?.token;

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />; // render the protected child routes
}

export default UserProtect;
