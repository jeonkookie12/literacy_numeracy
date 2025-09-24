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

  // Special handling for /verify-email
  if (currentPath === '/verify-email') {
    if (user.isEmailVerified) {
      console.log("PrivateRoute - Email already verified, redirecting to dashboard");
      // Redirect to appropriate dashboard based on userType
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
    // Allow access to /verify-email if email is not verified
    console.log("PrivateRoute - Access granted to /verify-email (email not verified)");
    return children;
  }

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