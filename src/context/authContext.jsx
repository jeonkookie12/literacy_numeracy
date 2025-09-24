import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./spinner"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost/literacynumeracy/check_session.php", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("Session Check - Raw Backend Response:", data);
        if (data.isLoggedIn) {
          const userData = {
            id: data.user_id,
            lrn: data.lrn,
            userType: data.user_type,
            firstName: data.first_name,
          };
          setUser(userData);
          console.log("Session Check - Current User Details:", {
            userType: userData.userType || "Not available",
            userId: userData.id || "Not available",
            lrn: userData.lrn || "Not available",
            firstName: userData.firstName || "Not available",
          });
        } else {
          console.log("Session Check - No user logged in");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        console.log("Session Check - Error, no user data available");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    checkAuth();
  }, []);

  const login = async (login, password, recaptchaToken) => {
    try {
      const response = await fetch("http://localhost/literacynumeracy/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login, password, recaptchaToken }),
      });
      const data = await response.json();
      if (data.success) {
        const userData = {
          id: data.user_id,
          lrn: data.lrn,
          userType: data.user_type,
          firstName: data.first_name,
        };
        setUser(userData);
        console.log("Login - Current User Details:", {
          userType: userData.userType || "Not available",
          userId: userData.id || "Not available",
          lrn: userData.lrn || "Not available",
          firstName: userData.firstName || "Not available",
        });
        switch (data.user_type.toLowerCase()) {
          case "learner":
            navigate("/learner-dashboard");
            break;
          case "teacher":
            navigate("/teacher-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/");
        }
        return { success: true };
      } else {
        console.log("Login - Failed:", data.message || "Unknown error");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      console.log("Login - Error, no user data available");
      return { success: false, message: "An error occurred during login" };
    }
  };

  const signup = async (firstName, lastName, lrn, email, password, recaptchaToken) => {
    try {
      const response = await fetch("http://localhost/literacynumeracy/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          lrn,
          email,
          password,
          recaptchaToken,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Signup - Success:", {
          message: data.message || "Signup successful",
          userId: data.user_id || "Not provided",
          lrn: lrn,
          firstName: firstName,
        });
        return { success: true, message: data.message || "Signup successful" };
      } else {
        console.log("Signup - Failed:", data.message || "Unknown error");
        return { success: false, message: data.message || "Signup failed" };
      }
    } catch (error) {
      console.error("Error signing up:", error);
      console.log("Signup - Error, no user data available");
      return { success: false, message: "An error occurred during signup" };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost/literacynumeracy/logout.php", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      console.log("Logout - User cleared");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      console.log("Logout - Error occurred");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};