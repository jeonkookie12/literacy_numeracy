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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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
            enrollmentStatus: data.enrollmentStatus || { isEnrolled: false, enrollmentYear: 'pending' },
          };
          if (!user || user.id !== userData.id) {
            setUser(userData);
          }
          console.log("Session Check - Current User Details:", {
            userType: userData.userType || "Not available",
            userId: userData.id || "Not available",
            lrn: userData.lrn || "Not available",
            firstName: userData.firstName || "Not available",
            isEmailVerified: userData.isEmailVerified,
            enrollmentStatus: userData.enrollmentStatus,
          });

          // Allow verification page to handle its own logic
          if (location.pathname === '/verification-page') {
            console.log("AuthProvider - On verification-page, skipping redirect");
            return;
          }

          if (userData.userType.toLowerCase() === 'learner') {
            if (!userData.isEmailVerified || !userData.enrollmentStatus.isEnrolled) {
              console.log("Redirecting learner to /verification-page: isEmailVerified=", userData.isEmailVerified, "isEnrolled=", userData.enrollmentStatus.isEnrolled);
              navigate('/verification-page');
              return;
            }
          } else if (!userData.isEmailVerified) {
            localStorage.setItem('userEmail', userData.email);
            console.log("Redirecting non-learner to /verification-page: isEmailVerified=", userData.isEmailVerified);
            navigate('/verification-page');
            return;
          }

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

          if (!isCurrentPathValid) {
            console.log("Redirecting to default dashboard: userType=", userData.userType);
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
  }, [navigate, location.pathname, user?.id]); 

  const login = async (login, password, recaptchaToken) => {
    try {
      const response = await fetch("http://localhost/literacynumeracy/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login, password, recaptchaToken }),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Login - HTTP error:", response.status, text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        const userData = {
          id: data.user_id,
          lrn: data.lrn,
          userType: data.user_type,
          firstName: data.first_name,
          isEmailVerified: data.is_email_verified === 'yes',
          email: data.email,
          enrollmentStatus: data.enrollmentStatus || { isEnrolled: false, enrollmentYear: 'pending' },
        };
        setUser(userData);
        console.log("Login - Current User Details:", {
          userType: userData.userType || "Not available",
          userId: userData.id || "Not available",
          lrn: userData.lrn || "Not available",
          firstName: userData.firstName || "Not available",
          isEmailVerified: userData.isEmailVerified,
          enrollmentStatus: userData.enrollmentStatus,
        });
        if (!userData.isEmailVerified || (userData.userType.toLowerCase() === 'learner' && !userData.enrollmentStatus.isEnrolled)) {
          localStorage.setItem('userEmail', userData.email);
          navigate('/verification-page');
          return { success: true, redirect: '/verification-page' };
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
          return { success: true, redirect: `/${data.user_type.toLowerCase()}-dashboard` };
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
      console.log("Signup - Attempting with:", { firstName, lastName, lrn, email, recaptchaToken: recaptchaToken ? 'valid' : 'missing' });
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
      if (!response.ok) {
        const text = await response.text();
        console.error("Signup - HTTP error:", response.status, text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Signup - Raw Backend Response:", data);
      if (data.success) {
        const userData = {
          id: data.user_id,
          lrn: data.lrn,
          userType: data.user_type,
          firstName: data.first_name || firstName,
          isEmailVerified: data.is_email_verified === 'yes',
          email: data.email,
          enrollmentStatus: data.enrollmentStatus || { isEnrolled: false, enrollmentYear: 'pending' },
        };
        setUser(userData);
        console.log("Signup - Success:", {
          message: data.message || "Signup successful",
          userId: data.user_id || "Not provided",
          lrn: data.lrn,
          firstName: userData.firstName,
          enrollmentStatus: data.enrollmentStatus,
        });
        localStorage.setItem('userEmail', email);
        navigate('/verification-page');
        return { success: true, message: data.message || "Signup successful" };
      } else {
        console.log("Signup - Failed:", data.message || "Unknown error");
        return { success: false, message: data.message || "Signup failed" };
      }
    } catch (error) {
      console.error("Error signing up:", error);
      console.log("Signup - Error, no user data available");
      return { success: false, message: error.message || "An error occurred during signup" };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost/literacynumeracy/logout.php", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Logout - HTTP error:", response.status, text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setUser(null);
      localStorage.removeItem('userEmail');
      console.log("Logout - User cleared");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      console.log("Logout - Error occurred");
      return { success: false, message: error.message || "An error occurred during logout" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
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