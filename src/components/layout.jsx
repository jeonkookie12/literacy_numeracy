import React, { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { useAuth } from "../context/authContext";

import SearchIcon from '../assets/global/navbar/search.svg';
import MoonIcon from '../assets/global/navbar/mode.svg';
import CalendarIcon from '../assets/global/navbar/calendar.svg';
import GlobeIcon from '../assets/global/navbar/language.svg';
import ChevronDownIcon from '../assets/global/navbar/dropdown.svg';
import HamburgerIcon from '../assets/global/navbar/tabs.svg';
import ProfileIcon from '../assets/global/navbar/profile.svg';
import ProfileOptionIcon from '../assets/global/navbar/profile.svg'; 
import LogoutIcon from '../assets/global/navbar/logout.svg';
import BackIcon from '../assets/global/navbar/back.svg';

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .tooltip {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-out 1s, visibility 0s linear 1s, transform 0.3s ease-out 1s;
  }
  .group:hover .tooltip {
    opacity: 1;
    visibility: visible;
    animation: fadeIn 0.3s ease-out;
  }
`;

export function Layout() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [title, setTitle] = useState("Dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isMediumSmall, setIsMediumSmall] = useState(window.innerWidth < 900 && window.innerWidth >= 640);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userFirstName = user?.first_name || "User"; 
  const profileButtonWidth = Math.max(80, Math.min(300, userFirstName.length * 10 + 60)); 

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle resize for isMobile and isMediumSmall
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsMediumSmall(window.innerWidth < 900 && window.innerWidth >= 640);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CSS for animation
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Format date
  const formatDateTime = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    if (isMobile) {
      return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
    }
    return `${dayName}, ${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Toggle search bar in mobile and medium-small view
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  // Handle dropdown item clicks   
  const handleProfileClick = () => {
    console.log("Profile clicked");
    setIsDropdownOpen(false);
    // Add navigation or profile logic here
  };

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false); 
  };

  const handleDarkModeClick = () => {
    console.log("Toggle dark mode");
    setIsDropdownOpen(false);
    // Add dark mode toggle logic here
  };

  const handleLanguageClick = () => {
    console.log("Toggle language");
    setIsDropdownOpen(false);
    // Add language toggle logic here
  };

  // Don't render layout on login page or if no user
  if (location.pathname === "/" || location.pathname === "/authpage" || !user) {
    console.log("Layout - Skipped rendering: on login page or no user");
    return <Outlet />;
  }

  return (
    <div className="bg-[#EEF1FF] flex h-screen w-screen overflow-hidden">
      {/* ───── Sidebar ───── */}
      <Sidebar
        open={open}
        hover={hover}
        setOpen={setOpen}
        setHover={setHover}
        setTitle={setTitle}
      />

      {/* ───── Main Area ───── */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Navbar */}
        <header className="w-full bg-[#EEF1FF] lg:px-10 md:px-8 sm:px-6 px-4 pt-4 z-30">
          <div className="w-full flex items-center justify-between gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-4 py-2 flex-nowrap overflow-visible h-14">
            
            {/* Left Section: Menu and Search */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-4">
              {/* Sidebar Toggle */}
              {!open && (
                <div
                  className="flex items-center justify-center bg-white shadow rounded-xl px-3 h-12 min-w-[48px] flex-shrink-0 cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  <img src={HamburgerIcon} alt="Menu" className="w-7 h-7 sm:w-6 md:w-6 lg:w-6 sm:h-6 md:h-6 lg:h-6 object-contain" />
                </div>
              )}

              {/* Mobile Search (sm:hidden) */}
              <div className={`sm:hidden group relative ${isSearchOpen ? 'flex-grow max-w-[300px]' : ''}`}>
                {!isSearchOpen ? (
                  <button
                    className="flex items-center justify-center bg-white shadow rounded-xl px-3 h-12 min-w-[48px] flex-shrink-0 "
                    onClick={toggleSearch}
                  >
                    <img src={SearchIcon} alt="Search" className="w-6 h-6" />
                  </button>
                ) : (
                  <div className="flex items-center h-12 bg-white shadow rounded-xl px-3 overflow-hidden w-full">
                    <button
                      className="flex items-center justify-center flex-shrink-0 mr-2 hover:bg-gray-100 transition-colors"
                      onClick={toggleSearch}
                    >
                      <img src={BackIcon} alt="Back" className="w-6 h-6" />
                    </button>
                    <input
                      type="text"
                      placeholder="Search here..."
                      className="text-black flex-1 min-w-0 bg-transparent outline-none text-sm hover:bg-gray-100 transition-colors"
                    />
                    <div className="flex-shrink-0 w-6 h-6 ml-2">
                      <img src={SearchIcon} alt="Search" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>

              {/* Medium Search (hidden sm:block md:block lg:hidden) */}
              <div className={`hidden sm:block md:block lg:hidden group relative ${isSearchOpen ? 'flex-grow max-w-[300px]' : ''}`}>
                {!isMediumSmall || isSearchOpen ? (
                  <div className="flex items-center h-12 bg-white shadow rounded-xl px-3 overflow-hidden w-full">
                    {isSearchOpen && (
                      <button
                        className="flex items-center justify-center flex-shrink-0 mr-2 hover:bg-gray-100 transition-colors"
                        onClick={toggleSearch}
                      >
                        <img src={BackIcon} alt="Back" className="w-6 h-6" />
                      </button>
                    )}
                    <input
                      type="text"
                      placeholder="Search here..."
                      className="text-black flex-1 min-w-0 bg-transparent outline-none text-sm md:text-sm"
                    />
                    <div className="flex-shrink-0 w-5 h-5 ml-2">
                      <img src={SearchIcon} alt="Search" className="w-full h-full object-contain" />
                    </div>
                  </div>
                ) : (
                  <button
                    className="flex items-center justify-center bg-white shadow rounded-xl px-3 h-12 min-w-[48px] flex-shrink-0 hover:bg-gray-100 transition-colors"
                    onClick={toggleSearch}
                  >
                    <img src={SearchIcon} alt="Search" className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Desktop Search (lg:block) */}
              <div className="hidden lg:flex flex-grow max-w-[1090px] group relative items-center h-12 bg-white shadow rounded-xl px-5 overflow-hidden hover:bg-gray-100 transition-colors">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="text-black flex-1 min-w-0 bg-transparent outline-none text-base"
                />
                <div className="flex-shrink-0 w-6 h-6 ml-2">
                  <img src={SearchIcon} alt="Search" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Right-side Pills */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-3 flex-shrink-0 overflow-visible">
              {/* Date Pill (Hidden below lg) */}
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 bg-white shadow rounded-xl px-4 h-12 flex-shrink-0">
                <img src={CalendarIcon} alt="Calendar" className="w-6 h-6 flex-shrink-0" />
                <span className="whitespace-nowrap">{formatDateTime(currentTime)}</span>
              </div>

              {/* Dark Mode (Hidden below lg) */}
              <button
                className="hidden lg:flex items-center justify-center bg-white shadow rounded-xl px-4 h-12 min-w-[44px] flex-shrink-0 hover:bg-gray-100 transition-colors"
                onClick={handleDarkModeClick}
              >
                <img src={MoonIcon} alt="Dark Mode" className="w-6 h-6" />
              </button>

              {/* Language (Hidden below lg) */}
              <button
                className="hidden lg:flex items-center justify-center bg-white shadow rounded-xl px-4 h-12 min-w-[44px] flex-shrink-0 hover:bg-gray-100 transition-colors"
                onClick={handleLanguageClick}
              >
                <img src={GlobeIcon} alt="Language" className="w-6 h-6" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  className="flex items-center gap-1 sm:gap-2 md:gap-2 bg-white shadow rounded-xl px-3 sm:px-3 md:px-3 lg:px-4 h-12 sm:h-12 md:h-12 lg:h-12 hover:bg-gray-100 transition-colors"
                  style={{ minWidth: `${profileButtonWidth}px` }}
                  onClick={toggleDropdown}
                >
                  <img src={ProfileIcon} alt="User" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  <span className="text-gray-800 font-medium text-sm sm:text-sm md:text-base lg:text-[16px] truncate">{user.firstName}</span>
                  <img src={ChevronDownIcon} alt="Dropdown" className="w-5 h-5 sm:w-5 md:w-5 lg:w-4 sm:h-5 md:h-5 lg:h-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-40">
                    {/* Include Dark Mode and Language below lg */}
                    <div className="lg:hidden">
                      <button
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleDarkModeClick}
                      >
                        <img src={MoonIcon} alt="Dark Mode" className="w-6 h-6" />
                        Dark Mode
                      </button>
                      <button
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLanguageClick}
                      >
                        <img src={GlobeIcon} alt="Language" className="w-6 h-6" />
                        Language
                      </button>
                    </div>
                    {/* Profile and Logout (All Views) */}
                    <button
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleProfileClick}
                    >
                      <img src={ProfileOptionIcon} alt="Profile" className="w-6 h-6" />
                      Profile
                    </button>
                    <button
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogoutClick}
                    >
                      <img src={LogoutIcon} alt="Logout" className="w-6 h-6" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;