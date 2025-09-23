import React from 'react';


function MasterList() {


  return (
    
    <div className="flex h-screen font-sans">


      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-5 overflow-auto">

        {/* Master list */}
        <div className="bg-white p-5 rounded-lg shadow">
          {/* Header with title and export button */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Class Masterlist</h3>
            <button className="bg-gray-100 text-black px-2 py-2 rounded hover:bg-blue-300 transition">
              📤 Export
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-4">
            <form className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search here..."
                className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-0 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 text-xl"
              >
                🔍
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-300 text-left">
                  <th className="p-2">No.</th>
                  <th className="p-2">Learner's Name</th>
                  <th className="p-2">LRN</th>
                  <th className="p-2">Literacy Remarks</th>
                  <th className="p-2">Numeracy Remarks</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 transition">
                    <td className="p-2 align-top">{index + 1}</td>
                    <td className="p-2 align-top">Reyes Jose Dela Cruz</td>
                    <td className="p-2 align-top">12513957651223</td>
                    <td className="p-2 align-top">Can Sound B</td>
                    <td className="p-2 align-top">Can Add Two Digits</td>
                    <td className="p-2 align-top">
                      <button className="text-black px-3 py-1 rounded hover:bg-blue-300 transition">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center mt-4 space-x-4 text-sm text-gray-700">
            {/* Rows per page */}
            <div className="flex items-center space-x-2">
              <span>Rows per page</span>
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>

            {/* Page count */}
            <span>1–10 of 20</span>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded hover:bg-gray-200" title="First page">⏮️</button>
              <button className="p-1 rounded hover:bg-gray-200" title="Previous page">◀️</button>
              <button className="p-1 rounded hover:bg-gray-200" title="Next page">▶️</button>
              <button className="p-1 rounded hover:bg-gray-200" title="Last page">⏭️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasterList;
