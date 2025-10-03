import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Spinner from "../context/spinner";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const currentPath = window.location.pathname;

  console.log("PrivateRoute - Entered component", {
    user,
    userType: user?.userType || "Not available",
    isEmailVerified: user?.isEmailVerified || "Not available",
    allowedRoles,
    currentPath,
    loading,
  });

  if (loading) {
    console.log("PrivateRoute - Still loading, showing Spinner");
    return <Spinner />;
  }

  if (!user) {
    console.log("PrivateRoute - No user, redirecting to /");
    return <Navigate to="/" replace />;
  }

  // Special handling for /verification-page
  if (currentPath === '/verification-page') {
    if (user.isEmailVerified) {
      console.log("PrivateRoute - Email verified, redirecting to dashboard");
      switch (user.userType.toLowerCase()) {
        case 'learner':
          return <Navigate to="/learner-dashboard" replace />;
        case 'teacher':
          return <Navigate to="/teacher-dashboard" replace />;
        case 'admin':
          return <Navigate to="/admin-dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
    console.log("PrivateRoute - Access granted to verification-page");
    return children;
  }

  // Redirect to /verification-page if email is not verified
  if (!user.isEmailVerified) {
    console.log("PrivateRoute - Email not verified, redirecting to /verification-page");
    return <Navigate to="/verification-page" replace />;
  }

  // Check if userType is allowed for the route
  if (!allowedRoles.includes(user.userType.toLowerCase())) {
    console.log(
      `PrivateRoute - Access denied, userType "${user.userType.toLowerCase()}" not in allowedRoles`,
      allowedRoles
    );
    return <Navigate to="/" replace />;
  }

  console.log("PrivateRoute - Access granted, rendering children");
  return children;
};

export default PrivateRoute;