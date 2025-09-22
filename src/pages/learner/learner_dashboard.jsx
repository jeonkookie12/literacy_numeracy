import React from "react";
import { useAuth } from "../../context/authContext";
import StudentBanner from "../../assets/learner/search.svg";
import Banner from "../../assets/learner/dashboard_banner.svg";

function LearnerDashboard() {
  const { user } = useAuth();

  console.log("LearnerDashboard - Rendering, user:", user);

  if (!user || user.userType.toLowerCase() !== "learner") {
    console.log("LearnerDashboard - No user or not a learner, redirecting...");
    return null;
  }

  return (
    <div className="p-4 sm:p-10 min-h-screen overflow-y-auto scrollable-container">
      {/* Welcome banner */}
      <section className="bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="text-white text-2xl font-semibold mb-4 sm:mb-0 mx-4">
          Hello,<br />
          <span className="text-3xl">Student {user.firstName || "FName"}!</span>
        </div>
        <img src={Banner} alt="Dashboard Banner" className="w-full max-w-xs h-auto mr-4 sm:mr-20" />
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
        {["Current School Year", "Learning Status", "Literacy Score", "Numeracy Score"].map(
          (label) => (
            <div
              key={label}
              className="text-black bg-white rounded-lg p-6 flex items-center justify-center text-center font-semibold min-h-[120px]"
            >
              {label}
            </div>
          )
        )}
      </section>

      {/* Learning materials */}
      <section className="w-full">
        <h2 className="text-gray-800 py-4 px-2 text-xl font-semibold mb-4">Learning Materials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-blue-300 text-white rounded-lg p-6 flex flex-col items-center shadow-lg"
            >
              <div className="w-14 h-14 bg-white rounded mb-4" />
              <p className="text-sm mb-3">Literacy (English)</p>
              <button
                className="bg-white text-gray-500 font-medium px-6 py-2 rounded-full text-sm shadow"
                style={{ backgroundColor: "#ffffff" }}
              >
                View Guide
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LearnerDashboard;