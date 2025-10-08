import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import SchoolLogo from "../assets/a1es.svg";
import DashboardIcon from "../assets/global/sidebar/dashboard.svg";
import UsersIcon from "../assets/global/sidebar/status.svg";
import ResourcesIcon from "../assets/global/sidebar/materials.svg";
import LogoutIcon from "../assets/global/sidebar/logout.svg";
import SidebarCloseIcon from "../assets/global/sidebar/close.svg";
import InterventionIcon from "../assets/teacher/intervention_sched.svg";
import AnalyticsIcon from "../assets/teacher/analytics.svg";
import ChevronDownIcon from '../assets/global/navbar/dropdown.svg';
import PrivacyPolicyIcon from "../assets/global/sidebar/privacy_policy.svg";

function Sidebar({ open, setOpen, setTitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const userType = user?.userType?.toLowerCase() || "admin";
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(true);

  if (location.pathname === "/" || !user) {
    console.log("Sidebar - Skipped rendering: on login page or no user");
    return null;
  }

  const sidebarWidth = open ? "w-60" : "w-18";

  // Log user details
  useEffect(() => {
    console.log("Sidebar - Current User Details:", {
      userType: user.userType || "Not available",
      userId: user.id || "Not available",
      lrn: user.lrn || "Not available",
    });
  }, [user]);

  // Menu items based on user type
  const menuItems = (() => {
    switch (userType) {
      case "learner":
        return [
          { label: "Dashboard", path: "/learner-dashboard", icon: DashboardIcon },
          { label: "Learner's Status", path: "/learner-status", icon: UsersIcon }, 
          { label: "Learning Materials", path: "/learner-materials", icon: ResourcesIcon, separator: true },
          { label: "Privacy Policy", path: "/privacy-policy", icon: PrivacyPolicyIcon },
        ];
      case "teacher":
        return [
          { label: "Dashboard", path: "/teacher-dashboard", icon: DashboardIcon },
          { label: "Class Masterlist", path: "/class-masterlist", icon: UsersIcon },
          { label: "Learning Resources", path: "/teacher-materials", icon: ResourcesIcon },
          { label: "Intervention Schedule", path: "/intervention-schedule", icon: InterventionIcon },
          { label: "Analytics", path: "/student-analytics", icon: AnalyticsIcon },
        ];
      case "admin":
      default:
        return [
          { label: "Dashboard", path: "/admin-dashboard", icon: DashboardIcon },
          {
            label: "Manage Users",
            path: "/manage-users",
            icon: UsersIcon,
            subItems: [
              { label: "Learners", path: "/manage-users/learners" },
              { label: "Teachers", path: "/manage-users/teachers" },
              { label: "Admins", path: "/manage-users/admins" },
            ],
          },
          { label: "Learning Resources", path: "/admin-resources", icon: ResourcesIcon },
          { label: "Analytics", path: "/admin-analytics", icon: AnalyticsIcon },
        ];
    }
  })();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(true);
        setIsManageUsersOpen(true);
      } else {
        setOpen(false);
        setIsManageUsersOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [setOpen]);

  useEffect(() => {
    const active = menuItems.find((m) => m.path === location.pathname || (m.subItems && m.subItems.some((sub) => sub.path === location.pathname)));
    if (active) {
      setTitle(active.label);
    } else {
      const isValidSubRoute = menuItems.some((m) => location.pathname.startsWith(m.path) || (m.subItems && m.subItems.some((sub) => location.pathname.startsWith(sub.path))));
      if (isValidSubRoute) {
        if (location.pathname.startsWith("/manage-users")) {
          setTitle("Manage Users");
        }
      } else {
        const dashboard = menuItems.find((m) => m.label === "Dashboard" || m.label === "Home");
        if (dashboard) {
          setTitle(dashboard.label);
          navigate(dashboard.path);
        }
      }
    }
  }, [location.pathname, setTitle, menuItems, navigate]);

  const go = (e, path, label) => {
    e.preventDefault(); // Prevent default link navigation
    setTitle(label);
    if (window.innerWidth < 1024) setOpen(false);
    navigate(path);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent triggering the parent navigation
    setIsManageUsersOpen(!isManageUsersOpen);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 px-3.5 py-3.5 transition-transform duration-300 ease-in-out
      lg:static ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div
        className={`h-full rounded-2xl bg-[#96C5F7] shadow-lg flex flex-col overflow-hidden
        transition-[width] duration-300 ease-in-out relative ${sidebarWidth}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 pt-5 pb-3.5">
          <div className="flex items-center gap-2">
            <img src={SchoolLogo} alt="Logo" className="w-11 h-11 rounded-full" />
            <div
              className={`text-sm font-medium leading-tight text-white whitespace-nowrap
              transition-all duration-300 origin-left
              ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
              Alapan 1<br />Elementary School
            </div>
          </div>

          {open && (
            <div
              onClick={() => setOpen(false)}
              className="cursor-pointer p-2 rounded hover:bg-white/20 transition"
              title="Collapse sidebar"
            >
              <img src={SidebarCloseIcon} alt="Close Sidebar" className="w-4.5 h-4.5" />
            </div>
          )}
        </div>

        <div className="h-3 mb-1.8" />
        <div className="border-t border-blue-200 mb-2.5 mx-3.5" />

        {/* Menu */}
        <div className="flex flex-col flex-1 px-2.5 justify-between">
          <nav className="space-y-1.5">
            {menuItems.map(({ label, path, icon, subItems, separator }) => {
              const active = location.pathname === path || (subItems && subItems.some((sub) => sub.path === location.pathname));
              return (
                <div key={label}>
                  <a
                    href={path}
                    onClick={(e) => go(e, path, label)}
                    className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium cursor-pointer
                      ${active ? "bg-white text-black" : "text-black hover:bg-white/30"}
                      transition-all duration-200 ease-in-out`}
                  >
                    <div className="flex justify-center items-center w-7 h-7 mr-2.5 shrink-0">
                      <img src={icon} alt={`${label} icon`} className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex items-center flex-1">
                      <span
                        className={`transition-all duration-300 origin-left
                          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
                          whitespace-nowrap`}
                      >
                        {label}
                      </span>
                      {subItems && open && (
                        <div
                          onClick={toggleDropdown}
                          className="ml-auto p-2"
                          title={isManageUsersOpen ? "Collapse dropdown" : "Expand dropdown"}
                        >
                          <img
                            src={ChevronDownIcon}
                            alt="Toggle Dropdown"
                            className={`w-4.5 h-4.5 transition-transform duration-300 ${isManageUsersOpen ? "rotate-180" : "rotate-0"}`}
                          />
                        </div>
                      )}
                    </div>
                  </a>
                  {subItems && open && isManageUsersOpen && (
                    <div className="ml-10 space-y-1.5 mt-1.5">
                      {subItems.map(({ label: subLabel, path: subPath }) => {
                        const subActive = location.pathname === subPath;
                        return (
                          <a
                            key={subLabel}
                            href={subPath}
                            onClick={(e) => go(e, subPath, subLabel)}
                            className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-medium cursor-pointer
                              ${subActive ? "bg-white text-black" : "text-black hover:bg-white/30"}
                              transition-all duration-200 ease-in-out`}
                          >
                            <span className="mr-2">•</span>
                            <span
                              className={`transition-all duration-300 origin-left
                                ${open ? "opacity-100 visible" : "opacity-0 invisible"}
                                whitespace-nowrap`}
                            >
                              {subLabel}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                  {separator && (
                    <div className="border-t border-blue-200 my-2.5 mx-3.5" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-2 mb-3.5">
            <div
              onClick={async () => {
                if (window.innerWidth < 1024) setOpen(false);
                await logout();
              }}
              className="flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium text-black cursor-pointer
              hover:bg-white/30 transition-colors duration-200"
            >
              <div className="flex justify-center items-center w-7 h-7 mr-2.5 shrink-0">
                <img src={LogoutIcon} alt="Logout icon" className="w-5.5 h-5.5" />
              </div>
              <span
                className={`transition-all duration-300 origin-left
                  ${open ? "opacity-100 visible" : "opacity-0 invisible"}
                  whitespace-nowrap`}
              >
                Log out
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;