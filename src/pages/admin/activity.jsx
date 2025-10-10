import { useState, useEffect } from "react";
import subjectIcon from "../../assets/admin/subject.svg";
import dateIcon from "../../assets/admin/date.svg";
import languageIcon from "../../assets/admin/language.svg";
import uploadIcon from "../../assets/admin/upload.svg";
import getIcon from "../../assets/admin/get.svg";
import fileIcon from "../../assets/admin/file.svg"; 
import dropdownIcon from "../../assets/admin/dropdown.svg"; 
import searchIcon from "../../assets/admin/search.svg"; 

export default function ActivityResources() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activityTitle, setActivityTitle] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagOptions, setTagOptions] = useState(["Science", "Math", "English", "History"]); // example tags

  // Activity creation state (customizable per activity type)
  const [activityContent, setActivityContent] = useState({});

  const handleUploadClick = () => {
    setIsModalOpen(true);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPage(1);
    setActivityTitle("");
    setSelectedActivities([]);
    setSelectedTags([]);
    setActivityContent({});
    setErrorMessage("");
  };

  const handleNext = () => {
    if (currentPage === 1 && selectedActivities.length === 0) {
      setErrorMessage("Please select at least one activity type.");
      return;
    }
    setCurrentPage(currentPage + 1);
    setErrorMessage("");
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
    setErrorMessage("");
  };

  const handleCreateActivity = () => {
    // Customizable logic for each activity type
    console.log({
      title: activityTitle,
      activities: selectedActivities,
      tags: selectedTags,
      content: activityContent,
    });
    handleCloseModal();
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleSelectAllTags = () => {
    if (selectedTags.length === tagOptions.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags([...tagOptions]);
    }
  };

  const handleTagSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setTagOptions(
      ["Science", "Math", "English", "History"].filter(tag =>
        tag.toLowerCase().includes(value)
      )
    );
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev =>
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  };

  return (
    <div className="min-h-screen p-10 text-black">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Manage Activity Resources</h2>
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
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-1 bg-white border border-blue-300 px-4 py-2 rounded-xl text-sm"
          >
            <img src={uploadIcon} alt="Upload" className="w-6 h-6" /> Create Activity
          </button>
        </div>
      </div>

      <div className="rounded-xl py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center text-xs h-38 justify-center">
              <img src={fileIcon} alt="File" className="w-22 h-22 mb-2" />
              <p className="text-black">Activity / IV · 4 hours ago</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative flex flex-col h-[95vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentPage === 1 ? "Create Activity" : activityTitle || "Activity/Test"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <hr className="border-gray-300 mb-4" />

            {/* Progress Bar */}
            <div className="w-full mb-6">
              <div className="flex justify-between relative">
                {["Details", "Video elements", "Checks", "Visibility"].map((label, index) => (
                  <div key={label} className="flex flex-col items-center flex-1 relative">
                    {/* Label */}
                    <span
                      className={`text-sm mb-2 ${
                        currentPage === index + 1 ? "text-blue-600 font-medium" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>

                    {/* Dot */}
                    <div
                      className={`w-4 h-4 rounded-full z-10 ${
                        currentPage === index + 1 ? "bg-blue-600 scale-110" : "bg-gray-400"
                      } transition-all duration-300`}
                    />

                    {/* Line Connector */}
                    {index < 3 && (
                      <div
                        className={`absolute top-[80%] left-1/2 w-full h-[2px] -translate-y-1/2 ${
                          currentPage > index + 1 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Body - Scrollable with adjusted spacing */}
            <div className="flex-1 overflow-y-auto mt-2 flex flex-col items-center justify-start pb-20">
              <div className="w-full">
                {currentPage === 1 && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full">
                      <label className="block text-red-500 text-base mb-1">Activity Title (required) <span className="text-gray-500">ⓘ</span></label>
                      <input
                        type="text"
                        value={activityTitle}
                        onChange={(e) => setActivityTitle(e.target.value)}
                        placeholder="Add a title that describes your activity"
                        className="w-full px-5 py-2 border border-gray-300 rounded-xl text-base text-gray-500 focus:outline-none focus:border-blue-300"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-gray-800 text-base mb-1">Select Activity</label>
                      {["Pre-Test", "Activity", "Post-Test"].map(type => (
                        <div key={type} className="flex items-center mb-2">
                          <label className="relative inline-flex items-center cursor-pointer mr-2">
                            <input
                              type="checkbox"
                              value={type}
                              checked={selectedActivities.includes(type)}
                              onChange={() => toggleActivity(type)}
                              className="sr-only peer"
                            />
                            <div className="peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-500 w-8 h-8 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-6 after:w-6 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-hover:after:scale-75 peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0">
                            </div>
                          </label>
                          {type}
                        </div>
                      ))}
                    </div>
                    <div className="w-full">
                      {/* Tags */}
                      <div>
                        <label className="block text-gray-800 text-base mb-1">Tags</label>
                        <div className="relative">
                          {/* Selected tags input */}
                          <div
                            onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                            className="flex flex-wrap items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2 cursor-pointer"
                          >
                            {selectedTags.length > 0 ? (
                              selectedTags.map(tag => (
                                <span
                                  key={tag}
                                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">Select tags...</span>
                            )}
                            <img src={dropdownIcon} alt="Dropdown" className="w-3 h-3 ml-auto" />
                          </div>

                          {/* Dropdown panel */}
                          {showTagsDropdown && (
                            <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-xl mt-1 shadow-md">
                              {/* 🔍 Search bar */}
                              <div className="p-2 border-b border-gray-100">
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  onChange={handleTagSearch}
                                  className="w-full px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none"
                                />
                              </div>

                              {/* Scrollable list */}
                              <div className="max-h-40 overflow-y-auto">
                                <div className="flex items-center px-4 py-2 border-b  border-gray-300">
                                  <input
                                    type="checkbox"
                                    onChange={toggleSelectAllTags}
                                    checked={selectedTags.length === tagOptions.length}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">Select all</span>
                                </div>

                                {tagOptions.map(tag => (
                                  <div
                                    key={tag}
                                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedTags.includes(tag)}
                                      onChange={() => toggleTag(tag)}
                                      className="mr-2"
                                    />
                                    <span className="text-sm">{tag}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {errorMessage && <p className="text-red-500 text-base">{errorMessage}</p>}
                  </div>
                )}
                {currentPage === 2 && selectedActivities.includes("Pre-Test") && (
                  <div className="flex flex-col items-center gap-4">
                    <h4 className="text-xl font-medium">Create Pre-Test</h4>
                    <textarea
                      value={activityContent.preTest || ""}
                      onChange={(e) => setActivityContent({ ...activityContent, preTest: e.target.value })}
                      placeholder="Add questions or content for Pre-Test"
                      className="w-full px-3 py-1 border border-gray-300 rounded-xl text-base text-gray-500 focus:outline-none focus:border-blue-300 resize-y"
                      rows="6"
                    />
                  </div>
                )}
                {currentPage === 2 && selectedActivities.includes("Activity") && (
                  <div className="flex flex-col items-center gap-4">
                    <h4 className="text-xl font-medium">Create Activity</h4>
                    <textarea
                      value={activityContent.activity || ""}
                      onChange={(e) => setActivityContent({ ...activityContent, activity: e.target.value })}
                      placeholder="Add tasks or content for Activity"
                      className="w-full px-3 py-1 border border-gray-300 rounded-xl text-base text-gray-500 focus:outline-none focus:border-blue-300 resize-y"
                      rows="6"
                    />
                  </div>
                )}
                {currentPage === 2 && selectedActivities.includes("Post-Test") && (
                  <div className="flex flex-col items-center gap-4">
                    <h4 className="text-xl font-medium">Create Post-Test</h4>
                    <textarea
                      value={activityContent.postTest || ""}
                      onChange={(e) => setActivityContent({ ...activityContent, postTest: e.target.value })}
                      placeholder="Add questions or content for Post-Test"
                      className="w-full px-3 py-1 border border-gray-300 rounded-xl text-base text-gray-500 focus:outline-none focus:border-blue-300 resize-y"
                      rows="6"
                    />
                  </div>
                )}
                {currentPage === 3 && (
                  <div className="flex flex-col items-center gap-4">
                    <h4 className="text-xl font-medium">Preview Activities</h4>
                    <div className="w-full">
                      <p><strong>Title:</strong> {activityTitle}</p>
                      {selectedActivities.map(act => (
                        <div key={act} className="mt-2">
                          <p><strong>{act}:</strong></p>
                          <p>{activityContent[act.toLowerCase().replace("-", "")] || "No content added"}</p>
                        </div>
                      ))}
                      <p><strong>Tags:</strong> {selectedTags.join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Fixed at the bottom */}
            <div className="mt-auto p-4 bg-white border-t border-gray-300">
              <div className="flex justify-end gap-3">
                {currentPage > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-1 bg-gray-200 rounded-xl text-base text-gray-800 hover:bg-gray-300"
                  >
                    Previous
                  </button>
                )}
                {currentPage < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-4 py-1 bg-blue-300 rounded-xl text-base text-white hover:bg-blue-400"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleCreateActivity}
                    className="px-4 py-1 bg-blue-300 rounded-xl text-base text-white hover:bg-blue-400"
                  >
                    Create
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-1 bg-gray-200 rounded-xl text-base text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}