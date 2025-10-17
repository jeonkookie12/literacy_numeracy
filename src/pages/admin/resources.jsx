import { useState, useRef } from "react";
import subjectIcon from "../../assets/admin/subject.svg";
import dateIcon from "../../assets/admin/date.svg";
import languageIcon from "../../assets/admin/language.svg";
import uploadIcon from "../../assets/admin/upload.svg";
import fileIcon from "../../assets/admin/file.svg";
import dropdownIcon from "../../assets/admin/dropdown.svg";
import searchIcon from "../../assets/admin/search.svg";

export default function LearningMaterials() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef(null);

  const handleUploadClick = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    if (resourceTitle.trim() || resourceDescription.trim() || tags.length > 0 || selectedFiles.length > 0) {
      setIsCancelModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleCancelModalConfirm = () => {
    resetForm();
    setIsCancelModalOpen(false);
    setIsModalOpen(false);
  };

  const handleCancelModalCancel = () => {
    setIsCancelModalOpen(false);
  };

  const resetForm = () => {
    setResourceTitle("");
    setResourceDescription("");
    setTagsInput("");
    setTags([]);
    setSelectedFiles([]);
    setErrorMessage("");
    setTitleError("");
    setTagsError("");
  };

  const handleUpload = () => {
    let valid = true;

    if (!resourceTitle.trim()) {
      setTitleError("Title is required.");
      valid = false;
    } else {
      setTitleError("");
    }

    if (tags.length === 0) {
      setTagsError("At least one tag is required.");
      valid = false;
    } else {
      setTagsError("");
    }

    if (selectedFiles.length === 0) {
      setErrorMessage("At least one file is required.");
      valid = false;
    } else {
      setErrorMessage("");
    }

    if (!valid) return;

    setIsUploadModalOpen(true);
    setUploadError("");
    simulateUpload();
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploadModalOpen(false);
          window.location.reload();
        }, 2000);
      }
    }, 200);
  };

  const handleTagsInputChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);

    if (value.endsWith(",")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagsError("");
      }
      setTagsInput("");
    }
  };

  const removeTag = (tagToRemove) =>
    setTags(tags.filter((tag) => tag !== tagToRemove));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    const validExtensions = ["pdf", "png", "jpeg", "jpg", "mp4"];
    const invalidFiles = files.filter(
      (file) =>
        !validExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(`.${ext}`)
        )
    );

    if (invalidFiles.length > 0) {
      setErrorMessage(
        "Only .pdf, .png, .jpeg, .jpg, and .mp4 files are allowed."
      );
      return;
    }

    setErrorMessage("");
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const truncateFilename = (name) => {
    if (name.length <= 20) return name;
    const parts = name.split(".");
    const ext = parts.pop();
    const base = parts.join(".");
    return `${base.slice(0, 17)}....${ext}`;
  };

  const handleViewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <div className="min-h-screen p-10 text-black">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Manage Materials
      </h2>

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
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-1 bg-white border border-blue-300 px-4 py-2 rounded-xl text-sm"
          >
            <img src={uploadIcon} alt="Upload" className="w-6 h-6" /> Upload Resources
          </button>
        </div>
      </div>

      {/* File Cards */}
      <div className="rounded-xl py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center text-xs h-38 justify-center"
            >
              <img src={fileIcon} alt="File" className="w-22 h-22 mb-2" />
              <p className="text-black">Literacy / IV · 4 hours ago</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Resources Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Upload Resources
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
            <hr className="border-gray-300" />

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-[15px]">
              {errorMessage && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                  {errorMessage}
                </div>
              )}
              {/* File Upload */}
              {!selectedFiles.length ? (
                <div
                  className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 p-6 rounded-xl"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <img src={uploadIcon} alt="Upload" className="w-14 h-14" />
                  <h4 className="text-lg font-medium text-gray-800">
                    Drag and drop your files here or select files
                  </h4>
                  <p className="text-gray-500 text-sm">Supported files: pdf, png, jpeg, jpg, mp4. </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpeg,.jpg,.mp4"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-300 file:text-white hover:file:bg-blue-400 hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-blue-300 text-white rounded-xl hover:bg-blue-400"
                  >
                    Select Files
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center bg-gray-200 rounded-full px-3 py-2 text-sm text-gray-800 break-words"
                      >
                        <span
                          className="cursor-pointer hover:underline break-all"
                          onClick={() => handleViewFile(file)}
                        >
                          {truncateFilename(file.name)} ({formatFileSize(file.size)})
                        </span>
                        <button
                          onClick={() =>
                            setSelectedFiles(
                              selectedFiles.filter((_, i) => i !== index)
                            )
                          }
                          className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
                        >
                          <svg
                            className="w-4 h-4"
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
                    ))}
                  </div>
                  <div
                    className="border-2 border-dashed border-gray-300 p-6 rounded-xl"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpeg,.jpg,.mp4"
                      onChange={handleFileChange}
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-300 file:text-white hover:file:bg-blue-400 hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 bg-blue-300 text-white rounded-xl hover:bg-blue-400"
                    >
                      Add More Files
                    </button>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-red-500 text-sm mb-1">
                  Title (required) <span className="text-gray-500">ⓘ</span>
                </label>
                <textarea
                  value={resourceTitle}
                  onChange={(e) => {
                    setResourceTitle(e.target.value);
                    setTitleError("");
                  }}
                  placeholder="Add a title that describes your resources"
                  rows={1}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  className={`w-full px-5 py-2 border ${
                    titleError ? "border-red-500" : "border-gray-300"
                  } rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-300 resize-none overflow-hidden`}
                />
                {titleError && (
                  <p className="text-red-500 text-sm mt-1">{titleError}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-red-500 text-sm mb-1">
                  Description <span className="text-gray-500">ⓘ</span>
                </label>
                <textarea
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
                  placeholder="Add description for your resources"
                  className="w-full px-5 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-300 resize-y"
                  rows="4"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-red-500 text-sm mb-1">
                  Tags (required) <span className="text-gray-500">ⓘ</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex flex-wrap items-center bg-gray-200 rounded-full px-3 py-2 text-sm text-gray-800 break-words max-w-full"
                    >
                      <span className="break-all">{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
                      >
                        <svg
                          className="w-4 h-4"
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
                  ))}
                </div>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsInputChange}
                  placeholder="Enter tag"
                  className={`w-full px-5 py-2 border ${
                    tagsError ? "border-red-500" : "border-gray-300"
                  } rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-300`}
                />
                <p className="text-gray-500 text-sm mt-1">Enter a comma after each tag</p>
                {tagsError && (
                  <p className="text-red-500 text-sm mt-1">{tagsError}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <hr className="border-gray-300" />
            <div className="flex justify-end gap-3 p-6 pt-4">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 bg-gray-200 rounded-xl text-sm text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-5 py-2 bg-blue-300 rounded-xl text-sm text-white hover:bg-blue-400"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <polygon points="12 2 22 20 2 20" strokeWidth="2" stroke="currentColor" fill="none" />
                <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">!</text>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cancel</h3>
            <p className="text-gray-600 mb-6">Your changes will be lost if you choose to confirm.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelModalCancel}
                className="px-5 py-2 bg-gray-200 rounded-xl text-sm text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelModalConfirm}
                className="px-5 py-2 bg-red-500 rounded-xl text-sm text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 text-center">
            {uploadProgress < 100 ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Uploading...</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-600">{uploadProgress}% uploaded</p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Completed</h3>
              </>
            )}
            {uploadError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-4">
                {uploadError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}