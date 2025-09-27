import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "./spinner"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("AuthProvider - Running session check for path:", location.pathname);
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
            isEmailVerified: data.is_email_verified === 'yes',
            email: data.email,
          };
          // Only update user if different to avoid loops
          if (!user || user.id !== userData.id) {
            setUser(userData);
          }
          console.log("Session Check - Current User Details:", {
            userType: userData.userType || "Not available",
            userId: userData.id || "Not available",
            lrn: userData.lrn || "Not available",
            firstName: userData.first_name || "Not available",
            isEmailVerified: userData.isEmailVerified,
          });

          // Handle email verification
          if (!userData.isEmailVerified) {
            localStorage.setItem('userEmail', userData.email);
            if (location.pathname !== '/verify-email') {
              navigate('/verify-email');
            }
            return;
          }

          // Define valid paths per user type (expand as needed)
          const getValidPaths = (userType) => {
            const lowers = userType.toLowerCase();
            if (lowers === 'admin') {
              return [
                '/admin-dashboard', '/manage-users', '/admin-resources', '/admin-analytics',
                '/manage-users/learners', '/manage-users/teachers', '/manage-users/admins',
                '/manage-users/learners/section-details'
              ];
            } else if (lowers === 'teacher') {
              return ['/teacher-dashboard', '/class-masterlist', '/teacher-materials', '/intervention-schedule'];
            } else if (lowers === 'learner') {
              return ['/learner-dashboard'];
            }
            return [];
          };

          const validPaths = getValidPaths(userData.userType);
          const isCurrentPathValid = validPaths.some(path => 
            location.pathname === path || location.pathname.startsWith(path)
          );

          // Only redirect if on invalid path (e.g., / or unauthorized)
          if (!isCurrentPathValid) {
            switch (userData.userType.toLowerCase()) {
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
          }
        } else {
          console.log("Session Check - No user logged in");
          if (location.pathname !== '/') {
            navigate('/');
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        console.log("Session Check - Error, no user data available");
        navigate('/');
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    checkAuth();
  }, [navigate, location.pathname, user?.id]); // Add location.pathname and user?.id to deps; re-run only if path changes or user ID differs

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
          isEmailVerified: data.is_email_verified === 'yes',
          email: data.email,
        };
        setUser(userData);
        console.log("Login - Current User Details:", {
          userType: userData.userType || "Not available",
          userId: userData.id || "Not available",
          lrn: userData.lrn || "Not available",
          firstName: userData.firstName || "Not available",
          isEmailVerified: userData.isEmailVerified,
        });
        if (!userData.isEmailVerified) {
          localStorage.setItem('userEmail', userData.email);
          navigate('/verify-email');
          return { success: true, redirect: '/verify-email' };
        } else {
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
        }
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
        localStorage.setItem('userEmail', email);
        navigate('/verify-email');
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

  const verifyEmail = async (verificationCode) => {
    try {
      const response = await fetch("http://localhost/literacynumeracy/verify_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ verificationCode }),
      });
      const data = await response.json();
      if (data.success) {
        setUser((prev) => ({ ...prev, isEmailVerified: true }));
        const redirect = prev => {
          switch (prev.userType.toLowerCase()) {
            case "learner":
              return "/learner-dashboard";
            case "teacher":
              return "/teacher-dashboard";
            case "admin":
              return "/admin-dashboard";
            default:
              return "/";
          }
        };
        return { success: true, redirect: redirect(user) };
      } else {
        return { success: false, message: data.message || "Invalid verification code" };
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      return { success: false, message: "An error occurred during verification" };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost/literacynumeracy/logout.php", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      localStorage.removeItem('userEmail');
      console.log("Logout - User cleared");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      console.log("Logout - Error occurred");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyEmail, logout, loading }}>
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