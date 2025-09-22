import { useNavigate } from "react-router-dom";
import { useState } from "react";



import backIcon from "../../../assets/admin/user_management/arrow-left.svg";
import searchIcon from "../../../assets/admin/user_management/search.svg";
import editIcon from "../../../assets/admin/user_management/edit.svg";
import addIcon from "../../../assets/admin/user_management/add.svg";
import exportIcon from "../../../assets/admin/user_management/export.svg";
import arrowLeft from "../../../assets/admin/user_management/arrow-left.svg";
import arrowRight from "../../../assets/admin/user_management/arrow-right.svg";


const SectionDetails = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [students] = useState([
    {
      lrn: "12513957651223",
      name: "Reyes, Jose Dela Cruz",
      literacy: "Can Read Well",
      numeracy: "Can Solve easily",
      performance: "75%",
    },
    {
      lrn: "12513957651223",
      name: "Reyes, Jose Dela Cruz",
      literacy: "Can Read Well",
      numeracy: "Can Solve easily",
      performance: "75%",
    },
    {
      lrn: "12513957651223",
      name: "Reyes, Jose Dela Cruz",
      literacy: "Can Read Well",
      numeracy: "Can Solve easily",
      performance: "75%",
    },
    {
      lrn: "12513957651223",
      name: "Reyes, Jose Dela Cruz",
      literacy: "Can Read Well",
      numeracy: "Can Solve easily",
      performance: "75%",
    },
    // Add more entries as needed...
  ]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 lg:p-10 mx-10 mt-10">
      {/* Header */}
      <div className="bg-white flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <img src={backIcon} alt="Back" className="w-5 h-5" />
          </button>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Kinder - Joy</h2>
          <button className="ml-auto flex items-center gap-2 text-sm text-blue-700 hover:underline">
            <img src={editIcon} alt="Edit" className="w-4 h-4" />
            Edit Section & Adviser
          </button>
      </div>

      <div className="ml-10 text-gray-700 text-sm mb-6">
        <p>Adviser: Ms. Jane A. De Leon</p>
      </div>

      {/* Table Card */}
      <div className="bg-white overflow-hidden">
        {/* Search and Buttons */}
        <div className="flex flex-wrap justify-between items-center py-5 gap-4">
          <div className="relative w-full md:w-64">
             <div className="flex items-center border border-blue-300 rounded-2xl px-3 py-1 focus-within:ring focus-within:ring-blue-200 bg-white">
              <input
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-black text-sm py-1 pr-2 bg-transparent focus:outline-none"
              />
              <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-2 ml-auto">
            <button className="flex items-center gap-2 text-sm px-4 py-1 bg-white text-black border border-blue-300 font-medium rounded-2xl hover:bg-blue-100">
              <img src={addIcon} alt="Add" className="w-7 h-7" />
              Add New Learner
            </button>
            <button className="flex items-center gap-2 text-sm px-4 py-1 bg-white text-black border border-blue-300 font-medium rounded-2xl hover:bg-blue-100">
              <img src={exportIcon} alt="Export" className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-blue-300 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-300 text-black uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-medium">No.</th>
                <th className="px-4 py-3 text-left font-medium">Learner’s Name</th>
                <th className="px-4 py-3 text-left font-medium">LRN</th>
                <th className="px-4 py-3 text-left font-medium">Literacy Remarks</th>
                <th className="px-4 py-3 text-left font-medium">Numeracy Remarks</th>
                <th className="px-4 py-3 text-center font-medium">Overall Performance</th>
                <th className="px-4 py-3 text-center font-medium">Action</th>
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
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.lrn}</td>
                  <td className="px-4 py-3">{student.literacy}</td>
                  <td className="px-4 py-3">{student.numeracy}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {student.performance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-700 hover:underline text-sm">view</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-end items-center gap-5 px-4 py-3 text-xs text-gray-600 bg-white mt-2">
          <div className="flex items-center gap-4">
            <p className="text-xs">Rows per page:</p>
            <select
              className="text-xs font-semibold border border-blue-300 rounded-lg px-2 py-1 focus:outline-none"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="text-xs">1–10 of {filteredStudents.length}</div>

            {/* Arrows */}
            <div className="flex items-center gap-1 ml-4">
              <button className="p-1 rounded hover:bg-gray-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1 rounded hover:bg-gray-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SectionDetails;
