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
    enrollmentStatus: user?.enrollmentStatus || "Not available",
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
  if (currentPath === '/verification-page') {
    if (user.userType.toLowerCase() === 'learner' && user.isEmailVerified && user.enrollmentStatus?.isEnrolled) {
      console.log("PrivateRoute - Learner enrolled, redirecting to /learner-dashboard");
      return <Navigate to="/learner-dashboard" replace />;
    }
    if (user.userType.toLowerCase() !== 'learner' && user.isEmailVerified) {
      console.log("PrivateRoute - Non-learner email verified, redirecting to dashboard");
      switch (user.userType.toLowerCase()) {
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

  // Prevent learners from accessing /learner-dashboard if not enrolled
  if (
    user.userType.toLowerCase() === 'learner' &&
    currentPath.includes('learner-dashboard') &&
    !user.enrollmentStatus?.isEnrolled
  ) {
    console.log("PrivateRoute - Learner not enrolled, redirecting to /verification-page");
    return <Navigate to="/verification-page" replace />;
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