import { useNavigate } from "react-router-dom";
import { useState } from "react";

import backIcon from "../../../assets/admin/user_management/arrow-left.svg";
import searchIcon from "../../../assets/admin/user_management/search.svg";
import addIcon from "../../../assets/admin/user_management/add.svg";
import importIcon from "../../../assets/admin/user_management/import.svg";
import exportIcon from "../../../assets/admin/user_management/export.svg";
import dropdownIcon from "../../../assets/admin/dropdown.svg";

const Learner = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortNameAsc, setSortNameAsc] = useState(true);
  const [sortByGrade, setSortByGrade] = useState(false);

  const [students] = useState([
    {
      lrn: "12513957651223",
      name: "Reyes, Jose Dela Cruz",
      literacy: "Can Read Well",
      numeracy: "Can Solve easily",
      performance: "75%",
      grade: "Grade 1",
    },
    {
      lrn: "12513957651224",
      name: "Santos, Maria Clara",
      literacy: "Can Read",
      numeracy: "Needs Help",
      performance: "68%",
      grade: "Grade 2",
    },
    {
      lrn: "12513957651225",
      name: "Lopez, Juan Miguel",
      literacy: "Can Read Well",
      numeracy: "Can Solve Easily",
      performance: "82%",
      grade: "Grade 3",
    },
  ]);

  // Filter + Sort
  let filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sortByGrade) {
    filteredStudents = filteredStudents.sort((a, b) =>
      a.grade.localeCompare(b.grade)
    );
  } else {
    filteredStudents = filteredStudents.sort((a, b) =>
      sortNameAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }

  return (
    <div className="rounded-lg w-screen sm:w-screen xs:w-screen md:w-full lg:w-full box-border p-2 sm:p-4 md:p-6 lg:p-10 mx-auto mt-6 sm:mt-10 ">
      {/* Header */}
      <div className="bg-white lg:p-10 p-5 rounded-xl">
      <div className="flex flex-wrap items-center gap-3 mb-3 ">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <img src={backIcon} alt="Back" className="w-5 h-5" />
        </button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          Class Masterlist
        </h2>

        <button className="ml-auto flex items-center gap-2 text-xs sm:text-sm text-blue-700 hover:underline whitespace-nowrap">
          <img src={exportIcon} alt="Export" className="w-4 h-4" />
          Export Students List
        </button>
      </div>
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-4">
          {/* Search */}
          <div className="flex items-center border border-blue-300 rounded-2xl px-2 sm:px-3 py-1 bg-white flex-1 min-w-[150px] max-w-[320px]">
            <input
              type="text"
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-xs sm:text-sm md:text-base text-black bg-transparent focus:outline-none min-w-0"
            />
            <img src={searchIcon} alt="Search" className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Sort Buttons */}
          <button
            onClick={() => {
              setSortByGrade(false);
              setSortNameAsc(!sortNameAsc);
            }}
            className="flex items-center gap-1 bg-blue-300 px-2 sm:px-3 py-1.5 rounded-lg shadow text-xs sm:text-sm whitespace-nowrap"
          >
            A–Z
            <img
              src={dropdownIcon}
              alt="Sort"
              className={`w-3 h-3 transform transition-transform ${
                sortNameAsc ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setSortByGrade(!sortByGrade)}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg shadow text-xs sm:text-sm whitespace-nowrap ${
              sortByGrade ? "bg-blue-400" : "bg-blue-300"
            }`}
          >
            Grade
            <img src={dropdownIcon} alt="Sort" className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <div className="flex-1" />

          {/* Add + Import Buttons */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-1 sm:gap-2 bg-white border border-blue-300 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-blue-100 whitespace-nowrap"
          >
            <img src={addIcon} alt="Add" className="w-4 h-4 sm:w-5 sm:h-5" />
            {/* 👇 Hide text on small screens */}
            <span className="hidden sm:inline">Add Learner</span>
          </button>

          <button className="flex items-center justify-center gap-1 sm:gap-2 bg-white border border-blue-300 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-blue-100 whitespace-nowrap">
            <img src={importIcon} alt="Import" className="w-4 h-4 sm:w-5 sm:h-5" />
            {/* 👇 Hide text on small screens */}
            <span className="hidden sm:inline">Import</span>
          </button>
        </div>
      <div className="w-full max-w-full overflow-x-auto border border-blue-300 rounded-xl">
        <div className="min-w-[500px]">
          <table className="w-full text-xs sm:text-sm table-auto">
            <thead className="bg-blue-300 text-black uppercase text-xs">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">No.</th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                  Learner’s Name
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">LRN</th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">Grade</th>
                <th className="px-2 sm:px-4 py-3 text-left font-medium">Literacy</th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium">Performance</th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.slice(0, rowsPerPage).map((student, index) => (
                <tr
                  key={student.lrn + index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                  } text-gray-800`}
                >
                  <td className="px-2 sm:px-4 py-3">{index + 1}</td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap">{student.name}</td>
                  <td className="px-2 sm:px-4 py-3">{student.lrn}</td>
                  <td className="px-2 sm:px-4 py-3">{student.grade}</td>
                  <td className="px-2 sm:px-4 py-3">{student.literacy}</td>
                  <td className="px-2 sm:px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {student.performance}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center">
                    <button className="text-blue-700 hover:underline text-xs sm:text-sm">
                      view
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-end items-center gap-3 sm:gap-5 px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 bg-white mt-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <p className="text-xs">Rows per page:</p>
          <select
            className="text-xs sm:text-sm font-semibold border border-blue-300 rounded-lg px-2 py-1 focus:outline-none"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="text-xs sm:text-sm">
          1–{rowsPerPage} of {filteredStudents.length}
        </div>
      </div>

      {/* Floating Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden  px-6">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800">Add New Learner</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Search (floating style, fixed + left side) */}
            <div className="sticky top-0 z-40 flex items-center bg-white/90 backdrop-blur-md px-6 pb-2 pt-6">
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Search Student Here..."
                  className="w-full pl-4 pr-9 py-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <img
                  src={searchIcon}
                  alt="Search"
                  className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="px-6 pt-6 pb-12 max-h-[55vh] overflow-y-auto">
              <div className="overflow-x-auto border border-blue-300 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-blue-300 text-black uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">
                        <input type="checkbox" className="mr-2" />
                        Select All
                      </th>
                      <th className="px-4 py-3 font-medium">No.</th>
                      <th className="px-4 py-3 font-medium">Learners Name</th>
                      <th className="px-4 py-3 font-medium">LRN</th>
                      <th className="px-4 py-3 font-medium">Grade Level</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty state */}
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-10 text-gray-400 text-sm"
                      >
                        No data available
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Learner;
