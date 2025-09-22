import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Spinner from "../context/spinner";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  console.log("PrivateRoute - Entered component", {
    user,
    userType: user?.userType || "Not available",
    allowedRoles,
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