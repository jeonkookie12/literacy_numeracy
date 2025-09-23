import React from "react";
import Export from "../../assets/teacher/export.svg";
import FirstPageIcon from "../../assets/teacher/first-page.svg";
import PreviousPageIcon from "../../assets/teacher/previous-page.svg";
import NextPageIcon from "../../assets/teacher/next-page.svg";
import LastPageIcon from "../../assets/teacher/last-page.svg";
import SearchIcon from "../../assets/global/navbar/search.svg";
import AddNewLearnerIcon from "../../assets/teacher/add.svg";
import EditIcon from "../../assets/teacher/edit.svg";

function ClassMasterlist() {
  // Placeholder click handlers
  const handleExportClick = () => {
    console.log("Export clicked");
    // Add export logic here
  };

  const handleAddNewLearnerClick = () => {
    console.log("Add New Learner clicked");
    // Add logic for adding new learner here
  };

  const handleFirstPageClick = () => {
    console.log("First page clicked");
    // Add navigation logic here
  };

  const handlePreviousPageClick = () => {
    console.log("Previous page clicked");
    // Add navigation logic here
  };

  const handleNextPageClick = () => {
    console.log("Next page clicked");
    // Add navigation logic here
  };

  const handleLastPageClick = () => {
    console.log("Last page clicked");
    // Add navigation logic here
  };

  const handleRowClick = (rowNumber) => {
    console.log(`Row ${rowNumber} clicked`);
    // Add row click logic here
  };

  return (
    <div className="p-3 sm:p-4 lg:p-10 overflow-y-auto scrollable-container">
      {/* Class Masterlist Section */}
      <section className="bg-white rounded-xl p-3 sm:p-6 shadow-md">
        <h2 className="text-gray-800 text-2xl font-semibold mb-6 rounded-lg">Class Masterlist</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <div className="relative w-full sm:w-1/4">
            <input
              type="text"
              placeholder="Search here..."
              className="border border-[#82B9F9] p-1.5 rounded-xl w-full pr-8"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
          </div>
          <div className="flex gap-3">
            <button
              className="border border-[#82B9F9] bg-transparent p-1.5 rounded-xl flex items-center hover:bg-[#82B9F9] hover:text-white hover:cursor-pointer transition-colors"
              onClick={handleAddNewLearnerClick}
            >
              <img src={AddNewLearnerIcon} alt="Add New Learner" className="mr-1.5 w-4 h-4" /> Add New Learner
            </button>
            <button
              className="border border-[#82B9F9] bg-transparent p-1.5 rounded-xl flex items-center hover:bg-[#82B9F9] hover:text-white hover:cursor-pointer transition-colors"
              onClick={handleExportClick}
            >
              <img src={Export} alt="Download" className="mr-1.5 w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto border border-blue-300 rounded-xl">
          <table className="w-full rounded-xl">
            <thead className="bg-[#82B9F9]">
              <tr>
                <th className="p-1.5 text-center text-xs sm:text-sm rounded-tl-xl">No.</th>
                <th className="p-1.5 text-left text-xs sm:text-sm">Learner's Name</th>
                <th className="p-1.5 text-center text-xs sm:text-sm">LRN</th>
                <th className="p-1.5 text-left text-xs sm:text-sm">Literacy Remarks</th>
                <th className="p-1.5 text-left text-xs sm:text-sm">Numeracy Remarks</th>
                <th className="p-1.5 text-center text-xs sm:text-sm rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(1)}>
                <td className="p-1.5 text-center text-xs sm:text-sm">1</td>
                <td className="p-1.5 text-left text-xs sm:text-sm">Reyes, Jose Dela Cruz</td>
                <td className="p-1.5 text-center text-xs sm:text-sm">1251395765123</td>
                <td className="p-1.5 text-left text-xs sm:text-sm">Can Sound B</td>
                <td className="p-1.5 text-left text-xs sm:text-sm">Can Add Two Digits</td>
                <td className="p-1.5 text-center text-xs sm:text-sm">
                  <button
                    className="bg-[#82B9F9] rounded-lg p-1 shadow-sm hover:shadow-md hover:bg-blue-600 focus:outline-none transition-colors"
                    onClick={() => handleRowClick(1)}
                  >
                    <img
                      src={EditIcon}
                      alt="Edit"
                      className="w-4 h-4 text-white"
                    />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(2)}>
                <td className="p-1.5 text-center text-xs sm:text-sm">2</td>
                <td className="p-1.5 text-left text-xs sm:text-sm">Reyes, Jose Dela Cruz</td>
                <td className="p-1.5 text-center text-xs sm:text-sm">1251395765123</td>
                <td className="p-1.5 text-left text-xs sm:text-sm">Can Sound B</td>
                <td className="p-1.5 text-left text-xs sm:text-sm">Can Add Two Digits</td>
                <td className="p-1.5 text-center text-xs sm:text-sm">
                  <button
                    className="bg-[#82B9F9] rounded-lg p-1 shadow-sm hover:shadow-md hover:bg-blue-600 focus:outline-none transition-colors"
                    onClick={() => handleRowClick(2)}
                  >
                    <img
                      src={EditIcon}
                      alt="Edit"
                      className="w-4 h-4 text-white"
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-end items-center mt-3 gap-3">
          <div className="flex items-center">
            <span className="mr-2 text-xs sm:text-sm">Rows per page:</span>
            <select className="border border-[#82B9F9] rounded-xl p-1 text-xs sm:text-sm">
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <span className="text-xs sm:text-sm">1-10 of 20</span>
          <div className="flex gap-2">
            <button
              className="p-1 hover:bg-gray-200 hover:rounded-full hover:cursor-pointer"
              onClick={handleFirstPageClick}
            >
              <img src={FirstPageIcon} alt="First Page" className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-200 hover:rounded-full hover:cursor-pointer"
              onClick={handlePreviousPageClick}
            >
              <img src={PreviousPageIcon} alt="Previous Page" className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-200 hover:rounded-full hover:cursor-pointer"
              onClick={handleNextPageClick}
            >
              <img src={NextPageIcon} alt="Next Page" className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-200 hover:rounded-full hover:cursor-pointer"
              onClick={handleLastPageClick}
            >
              <img src={LastPageIcon} alt="Last Page" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ClassMasterlist;