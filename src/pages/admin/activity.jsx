import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import subjectIcon from "../../assets/admin/subject.svg";
import dateIcon from "../../assets/admin/date.svg";
import languageIcon from "../../assets/admin/language.svg";
import uploadIcon from "../../assets/admin/upload.svg";
import fileIcon from "../../assets/admin/file.svg";
import dropdownIcon from "../../assets/admin/dropdown.svg";
import searchIcon from "../../assets/admin/search.svg";
import QuizBuilder from "../../components/admin/quiz_maker";

export default function ActivityResources() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    details: {
      activityTitle: "",
      selectedTags: [],
      selectedActivities: [],
    },
    activities: {}, // Store quiz data for each activity type
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagOptions] = useState(["Science", "Math", "English", "History"]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const filteredTags = tagOptions.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadClick = () => {
    setIsModalOpen(true);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPage(1);
    setFormData({
      details: {
        activityTitle: "",
        selectedTags: [],
        selectedActivities: [],
      },
      activities: {},
    });
    setErrorMessage("");
    setCompletedSteps([]);
    setFieldErrors({});
  };

  const handleNext = () => {
    const totalPages =
      formData.details.selectedActivities.length > 0
        ? 2 + formData.details.selectedActivities.length
        : 2;

    // Validation for page 1
    if (currentPage === 1) {
      const newErrors = {};
      if (!formData.details.activityTitle.trim())
        newErrors.title = "Activity Title is required.";
      if (formData.details.selectedTags.length === 0)
        newErrors.tags = "Please select at least one tag.";
      if (formData.details.selectedActivities.length === 0)
        newErrors.activities = "Please select at least one activity type.";

      setFieldErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;
    }

    if (currentPage < totalPages) {
      setCompletedSteps((prev) =>
        prev.includes(currentPage) ? prev : [...prev, currentPage]
      );
      setCurrentPage(currentPage + 1);
    }
    setErrorMessage("");
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => {
      const updated = [...completedSteps];
      const idx = updated.indexOf(prev);
      if (idx !== -1) updated.splice(idx, 1);
      setCompletedSteps(updated);
      return prev - 1;
    });
    setErrorMessage("");
  };

  const handleCreateActivity = () => {
    console.log(formData);
    handleCloseModal();
  };

  const toggleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        selectedTags: prev.details.selectedTags.includes(tag)
          ? prev.details.selectedTags.filter((t) => t !== tag)
          : [...prev.details.selectedTags, tag],
      },
    }));
  };

  const toggleSelectAllTags = () => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        selectedTags:
          prev.details.selectedTags.length === filteredTags.length
            ? []
            : [...filteredTags],
      },
    }));
  };

  const toggleActivity = (activity) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        selectedActivities: prev.details.selectedActivities.includes(activity)
          ? prev.details.selectedActivities.filter((a) => a !== activity)
          : [...prev.details.selectedActivities, activity],
      },
    }));
  };

  const updateActivityContent = (activityType, content) => {
    setFormData((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activityType]: content,
      },
    }));
  };

  return (
    <div className="min-h-screen p-10 text-black">
      {/* MAIN CONTENT */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Manage Activity Resources
      </h2>

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

      {/* FILES */}
      <div className="rounded-xl py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center text-xs h-38 justify-center"
            >
              <img src={fileIcon} alt="File" className="w-22 h-22 mb-2" />
              <p className="text-black">Activity / IV · 4 hours ago</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative flex flex-col h-[95vh]">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold text-gray-800 max-w-[80%] truncate">
                {currentPage === 1
                  ? "Create Activity"
                  : formData.details.activityTitle || "Activity/Test"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <hr className="border-gray-300 mb-4" />

            {/* PROGRESS BAR */}
            <div className="w-full max-w-2xl mx-auto mb-6">
              <div className="flex justify-between relative">
                {(() => {
                  const steps = ["Details"];
                  if (formData.details.selectedActivities.length === 0) {
                    steps.push("..");
                  } else {
                    steps.push(...formData.details.selectedActivities, "Preview");
                  }

                  return steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentPage === stepNumber;
                    const isCompleted = completedSteps.includes(stepNumber);

                    return (
                      <div
                        key={label}
                        className="flex flex-col items-center flex-1 relative"
                      >
                        <span
                          className={`text-sm mb-2 ${
                            isActive
                              ? "text-blue-600 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full z-10 flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? "bg-blue-500"
                              : isActive
                              ? "bg-blue-600 scale-110"
                              : "bg-gray-400"
                          }`}
                        >
                          {isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`absolute top-[80%] left-1/2 w-full h-[2px] -translate-y-1/2 ${
                              currentPage > stepNumber
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto mt-2 flex flex-col pb-10 px-4">
              <div className="w-full max-w-3xl mx-auto">
                {/* DETAILS PAGE */}
                {currentPage === 1 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Details</h2>
                    {/* ACTIVITY TITLE */}
                    <div className="w-full">
                      <label className="block text-gray-800 text-base mb-1">
                        Activity Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.details.activityTitle}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            details: { ...prev.details, activityTitle: e.target.value },
                          }))
                        }
                        placeholder="Add a title that describes your activity"
                        className={`w-full px-5 py-2 border rounded-xl text-base text-gray-700 focus:outline-none ${
                          fieldErrors.title
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-300"
                        }`}
                      />
                      {fieldErrors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.title}
                        </p>
                      )}
                    </div>

                    {/* SELECT ACTIVITY */}
                    <div className="w-full">
                      <label className="block text-gray-800 text-base mb-1">
                        Select Activity <span className="text-red-500">*</span>
                      </label>
                      {["Pre-Test", "Activity", "Post-Test"].map((type) => (
                        <div key={type} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            value={type}
                            checked={formData.details.selectedActivities.includes(type)}
                            onChange={() => toggleActivity(type)}
                            className="mr-2 accent-blue-500"
                          />
                          {type}
                        </div>
                      ))}
                      {fieldErrors.activities && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.activities}
                        </p>
                      )}
                    </div>

                    {/* TAGS */}
                    <div className="w-full">
                      <label className="block text-gray-800 text-base mb-1">
                        Tags <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div
                          onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                          className={`flex flex-wrap items-center gap-2 bg-white border rounded-xl px-3 py-2 cursor-pointer ${
                            fieldErrors.tags ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          {formData.details.selectedTags.length > 0 ? (
                            formData.details.selectedTags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Select tags...
                            </span>
                          )}
                          <img src={dropdownIcon} alt="Dropdown" className="w-3 h-3 ml-auto" />
                        </div>

                        {showTagsDropdown && (
                          <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-xl mt-1 shadow-md">
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none"
                              />
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                              {filteredTags.map((tag) => (
                                <div
                                  key={tag}
                                  onClick={() => toggleTag(tag)}
                                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.details.selectedTags.includes(tag)}
                                    readOnly
                                    className="mr-2 accent-blue-500"
                                  />
                                  <span className="text-sm">{tag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {fieldErrors.tags && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.tags}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* QUIZ BUILDER FOR EACH ACTIVITY TYPE */}
                {formData.details.selectedActivities.map((type, index) => {
                  const pageNumber = 2 + index;
                  if (currentPage !== pageNumber) return null;

                  return (
                    <div key={type} className="flex flex-col gap-4">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">{type}</h2>
                      <QuizBuilder
                        quizTypeLabel={type}
                        quizData={formData.activities[type] || { activityName: "", questions: [] }}
                        updateQuizData={(content) => updateActivityContent(type, content)}
                      />
                    </div>
                  );
                })}

                {/* PREVIEW PAGE */}
                {currentPage === 2 + formData.details.selectedActivities.length && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Preview</h2>
                    <p className="text-sm text-gray-500">
                      Review your activity before publishing.
                    </p>
                    <div className="border border-gray-300 rounded-xl p-4 bg-white">
                      <h3 className="text-base font-semibold mb-2">Details</h3>
                      <p><strong>Title:</strong> {formData.details.activityTitle || "N/A"}</p>
                      <p><strong>Tags:</strong> {formData.details.selectedTags.join(", ") || "None"}</p>
                      <p><strong>Activities:</strong> {formData.details.selectedActivities.join(", ") || "None"}</p>
                    </div>
                    {formData.details.selectedActivities.map((type) => (
                      <div key={type} className="border border-gray-300 rounded-xl p-4 bg-white mt-4">
                        <h3 className="text-base font-semibold mb-2">{type}</h3>
                        <p><strong>Name:</strong> {formData.activities[type]?.activityName || "N/A"}</p>
                        <div className="mt-2">
                          <strong>Questions:</strong>
                          {formData.activities[type]?.questions?.length > 0 ? (
                            <ul className="list-disc pl-5">
                              {formData.activities[type].questions.map((q, idx) => (
                                <li key={idx} className="mt-2">
                                  <p><strong>Question {idx + 1} ({q.type}):</strong> {q.text}</p>
                                  {q.image && (
                                    <img
                                      src={q.image}
                                      alt="Question image"
                                      className="mt-2 max-w-xs"
                                    />
                                  )}
                                  {q.type === "Multiple Choice" && (
                                    <div>
                                      <p><strong>Options:</strong></p>
                                      <ul className="list-circle pl-5">
                                        {q.options.map((opt, oIdx) => (
                                          <li key={oIdx}>
                                            {opt.text} {q.correctIndex === oIdx ? "(Correct)" : ""}
                                            {opt.image && (
                                              <img
                                                src={opt.image}
                                                alt={`Option ${oIdx + 1} image`}
                                                className="mt-1 max-w-[100px]"
                                              />
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                      <p><strong>Points:</strong> {q.points}</p>
                                    </div>
                                  )}
                                  {q.type === "Answer" && (
                                    <div>
                                      <p><strong>Expected Answer:</strong> {q.expectedAnswer}</p>
                                      <p><strong>Points:</strong> {q.points}</p>
                                    </div>
                                  )}
                                  {(q.type === "File Upload" || q.type === "Write") && (
                                    <p><strong>Points:</strong> {q.points}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No questions added.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-auto bg-white border-t border-gray-300 p-2">
              <div className="flex justify-end gap-3 max-w-3xl mx-auto">
                {currentPage > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-1 bg-gray-200 rounded-xl text-base text-gray-800 hover:bg-gray-300"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={
                    currentPage ===
                    (formData.details.selectedActivities.length > 0
                      ? 2 + formData.details.selectedActivities.length
                      : 2)
                      ? handleCreateActivity
                      : handleNext
                  }
                  className="px-4 py-1 bg-blue-300 rounded-xl text-base text-white hover:bg-blue-400"
                >
                  {currentPage ===
                  (formData.details.selectedActivities.length > 0
                    ? 2 + formData.details.selectedActivities.length
                    : 2)
                    ? "Publish"
                    : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}