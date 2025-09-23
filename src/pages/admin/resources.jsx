import { useState } from "react";
import subjectIcon from "../../assets/admin/subject.svg";
import dateIcon from "../../assets/admin/date.svg";
import languageIcon from "../../assets/admin/language.svg";
import uploadIcon from "../../assets/admin/upload.svg";
import getIcon from "../../assets/admin/get.svg";
import fileIcon from "../../assets/admin/file.svg"; 
import dropdownIcon from "../../assets/admin/dropdown.svg"; 
import searchIcon from "../../assets/admin/search.svg"; 

export default function LearningMaterials() {
  const [search, setSearch] = useState("");

  return (
    <div className=" min-h-screen p-10 text-black">
         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Materials</h2>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex flex-1 gap-2 flex-wrap">
          <div className="flex items-center bg-white rounded-xl px-4 py-2 border border-blue-300 w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Here..."
              className="flex-1 text-sm text-black focus:outline-none"
            />
            <img src={searchIcon} alt="Search" className="w-5 h-5" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-xl shadow text-sm">
              <img src={subjectIcon} alt="Subject" className="w-6 h-6" /> Subject
              <img src={dropdownIcon} alt="Dropdown" className="w-2 h-2" />
            </button>
            <button className="flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-xl shadow text-sm">
              <img src={dateIcon} alt="Date" className="w-6 h-6" /> Date Uploaded
              <img src={dropdownIcon} alt="Dropdown" className="w-2 h-2" />
            </button>
            <button className="flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-xl shadow text-sm">
              <img src={languageIcon} alt="Language" className="w-6 h-6" /> Language
              <img src={dropdownIcon} alt="Dropdown" className="w-2 h-2" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1 bg-white border border-blue-300 px-4 py-2 rounded-xl text-sm">
            <img src={uploadIcon} alt="Upload" className="w-6 h-6" /> Upload Resources
          </button>
        </div>
      </div>

      {/* File Cards */}
      <div className=" rounded-xl py-4">
        <div className="text-sm mb-4">
          <span className="font-semibold">Subject Contents:</span> Advisory Grade Level and Section: <strong>IV - Santan</strong>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center text-xs h-38 justify-center">
              <img src={fileIcon} alt="File" className="w-22 h-22 mb-2" />
              <p className="text-black">Literacy / IV · 4 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
