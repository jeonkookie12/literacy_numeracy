import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookIcon from "../../../assets/admin/user_management/section.jpg";
import chevronLeftIcon from "../../../assets/admin/user_management/arrow-left.svg";
import chevronRightIcon from "../../../assets/admin/user_management/arrow-right.svg";
import returnIcon from "../../../assets/admin/user_management/previous.svg";
import verifyIcon from "../../../assets/admin/user_management/verify-users.svg";
import placeIcon from "../../../assets/admin/user_management/place.svg";
import addSectionIcon from "../../../assets/admin/add.svg";
import searchIcon from "../../../assets/admin/search.svg";
import { useAuth } from "../../../context/authContext";

const grades = [
  {
    level: "Kindergarten",
    sections: [
      { name: "Kinder - Joy", students: 14, adviser: "Ms. Jane De Leon" },
      { name: "Kinder - Hope", students: 12, adviser: "Mr. Alex Cruz" },
      { name: "Kinder - Love", students: 15, adviser: "Ms. Ana Santos" },
      { name: "Kinder - Peace", students: 13, adviser: "Ms. Maria Lopez" },
      { name: "Kinder - Faith", students: 14, adviser: "Mr. John Tan" },
      { name: "Kinder - Grace", students: 16, adviser: "Ms. Carol Lim" },
    ],
  },
  {
    level: "Grade I",
    sections: [
      { name: "1 - Joy", students: 14, adviser: "Ms. Jane De Leon" },
      { name: "1 - Hope", students: 14, adviser: "Ms. Jane De Leon" },
      { name: "1 - Love", students: 14, adviser: "Ms. Jane De Leon" },
      { name: "1 - Peace", students: 14, adviser: "Ms. Jane De Leon" },
      { name: "1 - Grace", students: 14, adviser: "Ms. Jane De Leon" },
      { name: "1 - Faith", students: 14, adviser: "Ms. Jane De Leon" },
    ],
  },
];

const ManageLearners = () => {
  const { user } = useAuth();
  console.log("ManageLearners - Rendering, user:", JSON.stringify(user || {}));
  const containerRefs = useRef([]);
  const navigate = useNavigate();
  const [canScrollLeft, setCanScrollLeft] = useState([]);
  const [canScrollRight, setCanScrollRight] = useState([]);

  // Calculate card width based on screen size
  const getCardWidth = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) return Math.min(screenWidth * 0.45, 160); // Mobile: 45% of viewport or 160px
    if (screenWidth < 1024) return 180; // Tablet: smaller cards
    return 220; // Desktop: slightly smaller than 260px to fit with Sidebar
  };

  const CARD_GAP = 12; // Further reduced gap

  const updateScrollState = () => {
    console.log("ManageLearners - Updating scroll state");
    const left = [];
    const right = [];

    containerRefs.current.forEach((container, index) => {
      if (!container) {
        left[index] = false;
        right[index] = false;
        return;
      }
      left[index] = container.scrollLeft > 0;
      right[index] = container.scrollLeft + container.offsetWidth < container.scrollWidth;
    });

    setCanScrollLeft(left);
    setCanScrollRight(right);
  };

  const scrollCards = (index, direction) => {
    console.log("ManageLearners - Scrolling cards:", { index, direction });
    const container = containerRefs.current[index];
    if (!container) return;

    const scrollAmount = getCardWidth() + CARD_GAP;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    setTimeout(updateScrollState, 0);
  };

  const goToSection = (section) => {
    console.log("ManageLearners - Navigating to section:", section.name);
    navigate(`/manage-users/learners/section-details/${encodeURIComponent(section.name)}`, {
      state: { section },
    });
  };

  useEffect(() => {
    console.log("ManageLearners - useEffect for scroll state");
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };

    const handleResize = debounce(() => {
      console.log("ManageLearners - Window resized, updating scroll state");
      updateScrollState();
    }, 100);

    updateScrollState();
    const listeners = containerRefs.current.map((container) => {
      if (!container) return;
      const handler = () => updateScrollState();
      container.addEventListener("scroll", handler);
      return { container, handler };
    });

    window.addEventListener("resize", handleResize);

    return () => {
      console.log("ManageLearners - Cleaning up scroll listeners");
      listeners.forEach((item) => {
        if (item?.container && item?.handler) {
          item.container.removeEventListener("scroll", item.handler);
        }
      });
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-10 w-full max-w-[calc(100vw-280px)] sm:max-w-[calc(120vw-10px)] md:max-w-[calc(100vw)] lg:max-w-[calc(100vw-280px)] overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        {/* Left Side: Return + Label */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("ManageLearners - Go Back clicked");
              navigate(-1);
            }}
            className="p-1 sm:p-1.5 rounded-full hover:bg-gray-200 transition"
            aria-label="Go Back"
          >
            <img
              src={returnIcon}
              alt="Back"
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
            />
          </button>
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800">
            Manage Learners
          </h2>
        </div>

        {/* Right Side: Search + Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Search Field */}
          <div className="relative w-full sm:w-auto sm:min-w-[100px] md:min-w-[120px] lg:min-w-[160px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-3 pr-8 py-1 text-xs sm:text-sm bg-white border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B8BD1]"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500">
              <img
                src={searchIcon}
                alt="Search"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </button>
          </div>

          {/* Buttons with icons */}
          <button className="flex items-center gap-1 px-1.5 py-1 text-xs sm:text-sm text-black bg-white border border-blue-300 rounded-md hover:bg-gray-100 transition whitespace-nowrap">
            <img src={verifyIcon} alt="Verify" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Verify</span>
          </button>
          <button className="flex items-center gap-1 px-1.5 py-1 text-xs sm:text-sm text-black bg-white border border-blue-300 rounded-md hover:bg-gray-100 transition whitespace-nowrap">
            <img src={placeIcon} alt="Place" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Place</span>
          </button>
          <button className="flex items-center gap-1 px-1.5 py-1 text-xs sm:text-sm text-black bg-white border border-blue-300 rounded-md hover:bg-gray-100 transition whitespace-nowrap">
            <img src={addSectionIcon} alt="Add Section" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {grades.map((grade, index) => (
        <div key={grade.level} className="mb-8 relative">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-3">
            {grade.level}
          </h3>

          {/* Scroll Buttons */}
          {canScrollLeft[index] && (
            <button
              onClick={() => scrollCards(index, "left")}
              className="absolute z-10 -left-2 sm:-left-3 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-1.5 sm:p-2 hover:bg-gray-300 transition"
            >
              <img src={chevronLeftIcon} alt="Left" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          {canScrollRight[index] && (
            <button
              onClick={() => scrollCards(index, "right")}
              className="absolute z-10 -right-2 sm:-right-3 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-1.5 sm:p-2 hover:bg-gray-300 transition"
            >
              <img src={chevronRightIcon} alt="Right" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <div
            ref={(el) => (containerRefs.current[index] = el)}
            className="overflow-x-auto no-scrollbar scroll-smooth px-3 sm:px-4"
          >
            <div className="flex gap-3 sm:gap-4">
              {grade.sections.map((section, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("ManageLearners - Section card clicked:", section.name);
                    goToSection(section);
                  }}
                  className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition shrink-0"
                  style={{ width: `${getCardWidth()}px`, height: "240px" }}
                >
                  <div className="p-2 sm:p-3 flex flex-col h-full">
                    <div className="bg-white rounded-md mb-2 overflow-hidden">
                      <img
                        src={bookIcon}
                        alt="Section Icon"
                        className="w-full h-28 sm:h-32 object-contain p-1"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">
                      {section.name}
                    </p>
                    <p className="text-xs mt-1 text-white bg-[#8B8BD1] rounded px-1.5 py-0.5 w-fit">
                      {section.students} Students
                    </p>
                    <p className="text-xs mt-auto text-gray-500 truncate">
                      Adviser: {section.adviser}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageLearners;