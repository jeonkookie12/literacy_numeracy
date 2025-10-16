import { useNavigate } from "react-router-dom";
import instructorIcon from "../../../assets/admin/user_management/instructor.svg";
import returnIcon from "../../../assets/admin/user_management/previous.svg";
import addIcon from "../../../assets/admin/user_management/add.svg";
import searchIcon from "../../../assets/admin/user_management/search.svg";
import dropdownIcon from "../../../assets/admin/dropdown.svg";
import { useAuth } from "../../../context/authContext";
import { useState } from "react";

const advisersData = [
  { id: 1, name: "Ms. Jane De Leon", subject: "English" },
  { id: 2, name: "Mr. Alex Cruz", subject: "Mathematics" },
  { id: 3, name: "Ms. Ana Santos", subject: "Science" },
  { id: 4, name: "Ms. Maria Lopez", subject: "Filipino" },
  { id: 5, name: "Mr. John Tan", subject: "Araling Panlipunan" },
  { id: 6, name: "Ms. Carol Lim", subject: "Music" },
];

const ManageTeachers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortNameAsc, setSortNameAsc] = useState(true);
  const [sortBySubject, setSortBySubject] = useState(false);

  const goToAdviser = () => {
    navigate("/manage-users/learners/section-details");
  };

  // Filter + Sort logic
  let advisers = advisersData.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBySubject) {
    advisers = advisers.sort((a, b) => a.subject.localeCompare(b.subject));
  } else {
    advisers = advisers.sort((a, b) =>
      sortNameAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 text-black">
      {/* Header Title */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-gray-200 transition"
        >
          <img src={returnIcon} alt="Back" className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">Manage Teachers</h2>
      </div>
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-6">
        {/* Left Side: Search + Sort */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Search */}
          <div className="flex items-center bg-white rounded-xl px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 border border-blue-300 flex-1 min-w-[90px] max-w-[180px] sm:max-w-[220px] lg:max-w-[300px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-xs sm:text-sm lg:text-base text-black focus:outline-none"
            />
            <img
              src={searchIcon}
              alt="Search"
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
            />
          </div>
          {/* Sort Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {/* A–Z Sort */}
            <button
              onClick={() => {
                setSortBySubject(false);
                setSortNameAsc(!sortNameAsc);
              }}
              className="flex items-center gap-1 bg-blue-300 px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg shadow text-xs sm:text-sm lg:text-base whitespace-nowrap"
            >
              Name A–Z
              <img
                src={dropdownIcon}
                alt="Sort"
                className={`w-3 h-3  transform transition-transform ${
                  sortNameAsc ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Subject Sort */}
            <button
              onClick={() => setSortBySubject(!sortBySubject)}
              className={`flex items-center gap-1 px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg shadow text-xs sm:text-sm lg:text-base whitespace-nowrap ${
                sortBySubject ? "bg-blue-400" : "bg-blue-300"
              }`}
            >
              Subject
              <img
                src={dropdownIcon}
                alt="Dropdown"
                className="w-3 h-3"
              />
            </button>
          </div>
        </div>

        {/* Right Side: Add Teacher */}
        <div className="flex flex-shrink-0">
          <button className="flex items-center gap-1 bg-white border border-blue-300 px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs sm:text-sm lg:text-base hover:bg-blue-100 whitespace-nowrap">
            <img
              src={addIcon}
              alt="Add"
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
            />
            Add Teacher
          </button>
        </div>
      </div>


      {/* Adviser Cards */}
      <div className="rounded-xl py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {advisers.map((adviser, idx) => (
            <div
              key={idx}
              onClick={goToAdviser}   // no adviser data passed
              className="cursor-pointer bg-white rounded-xl shadow p-4 flex flex-col items-center text-center text-sm hover:shadow-lg transition"
            >
              <img
                src={instructorIcon}
                alt="Instructor"
                className="w-16 h-16 mb-3"
              />
              <p className="font-semibold text-gray-800">{adviser.name}</p>
              <p className="text-gray-600 text-xs mt-1">{adviser.subject}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTeachers;
