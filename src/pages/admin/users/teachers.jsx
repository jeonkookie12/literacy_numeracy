import { useState } from "react";
import searchIcon from "../../../assets/admin/user_management/search.svg";
import addIcon from "../../../assets/admin/user_management/add.svg";
import exportIcon from "../../../assets/admin/user_management/export.svg";
import editIcon from "../../../assets/admin/user_management/edit.svg";

const ManageTeachers = () => {
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const teachers = [
    {
      id: 1,
      name: "Corpuz, John Lazaro",
      email: "sampleaddress@gmail.com",
      role: "Teacher",
      section: "6 - Faith",
    },
    {
      id: 2,
      name: "Corpuz, John Lazaro",
      email: "sampleaddress@gmail.com",
      role: "Teacher",
      section: "6 - Faith",
    },
    {
      id: 3,
      name: "Corpuz, John Lazaro",
      email: "sampleaddress@gmail.com",
      role: "Teacher",
      section: "6 - Faith",
    },
  ];

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg p-10 mx-10 mt-8"> {/* Changed p-12 to p-6, removed max-w-full */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Manage Teachers</h2>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div className="relative w-full md:w-64">
          <div className="flex items-center border border-blue-300 rounded-2xl px-3 py-1 focus-within:ring focus-within:ring-blue-200 bg-white">
            <input
              type="text"
              placeholder="Search Here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-black text-sm py-2 pr-2 bg-transparent focus:outline-none"
            />
            <img src={searchIcon} alt="Search" className="w-5 h-5" />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 text-sm px-4 py-2 bg-white text-black border border-blue-300 font-medium rounded-2xl hover:bg-blue-100">
            <img src={addIcon} alt="Add" className="w-7 h-7" />
            Add New Teacher
          </button>
          <button className="flex items-center gap-2 text-sm px-4 py-2 bg-white text-black border border-blue-300 font-medium rounded-2xl hover:bg-blue-100">
            <img src={exportIcon} alt="Export" className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-blue-300 rounded-xl">
        <table className="w-full text-sm table-auto">
          <thead className="bg-blue-300 text-black text-xs">
            <tr>
              <th className="px-4 py-3 text-left font-medium">No.</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email Address</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Section Handle</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.slice(0, rowsPerPage).map((teacher, index) => (
              <tr
                key={teacher.id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"} text-gray-800`}
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{teacher.name}</td>
                <td className="px-4 py-3">{teacher.email}</td>
                <td className="px-4 py-3">{teacher.role}</td>
                <td className="px-4 py-3">{teacher.section}</td>
                <td className="px-4 py-3 text-center">
                  <button className="flex items-center gap-1 text-blue-700 text-sm hover:underline mx-auto">
                    <img src={editIcon} alt="Edit" className="w-4 h-4" />
                    edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 px-4 py-3 text-xs text-gray-600 bg-white mt-2">
        <div className="flex items-center gap-2">
          <p>Rows per page:</p>
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

        <div className="flex items-center gap-2">
          <span>
            1–{Math.min(rowsPerPage, filteredTeachers.length)} of {filteredTeachers.length}
          </span>
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
  );
};

export default ManageTeachers;