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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setResourceTitle("");
    setResourceDescription("");
    setTagsInput("");
    setTags([]);
    setSelectedFiles([]);
    setErrorMessage("");
  };

  const handleUpload = () => {
    // Handle upload logic here
    handleCloseModal();
  };

  const handleTagsInputChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);

    if (value.endsWith(",")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagsInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validExtensions = ['pdf', 'png', 'jpeg', 'jpg', 'mp4'];
    const invalidFiles = files.filter(file => !validExtensions.some(ext => file.name.toLowerCase().endsWith(`.${ext}`)));

    if (invalidFiles.length > 0) {
      setErrorMessage("Only .pdf, .png, .jpeg, .jpg, and .mp4 files are allowed.");
      return;
    }

    setErrorMessage("");
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const truncateFilename = (name) => {
    if (name.length <= 20) return name;
    const parts = name.split('.');
    const ext = parts.pop();
    const base = parts.join('.');
    const truncatedBase = base.slice(0, 17) + '...';
    return `${truncatedBase}.${ext}`;
  };

  const handleViewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000 * 60); // revoke after 1 min
  };

  return (
    <div className="min-h-screen p-10 text-black">
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
            <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center text-xs h-38 justify-center">
              <img src={fileIcon} alt="File" className="w-22 h-22 mb-2" />
              <p className="text-black">Literacy / IV · 4 hours ago</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Resources Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-gray-800">Upload Resources</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <hr className="border-gray-300 mb-5" />

            {/* Body */}
            <div className="flex flex-col items-center gap-5">
              {!selectedFiles.length ? (
                <>
                  <img src={uploadIcon} alt="Upload" className="w-14 h-14" />
                  <h4 className="text-lg font-medium text-gray-800">Upload files here</h4>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpeg,.jpg,.mp4"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-300 file:text-white hover:file:bg-blue-400"
                  />
                  {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                </>
              ) : (
                <div className="w-full">
                  <div className="flex flex-wrap gap-3 mb-3 -mx-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-800">
                        <span 
                          className="truncate cursor-pointer hover:underline" 
                          onClick={() => handleViewFile(file)}
                        >
                          {truncateFilename(file.name)} ({formatFileSize(file.size)})
                        </span>
                        <button
                          onClick={() => {
                            const newFiles = selectedFiles.filter((_, i) => i !== index);
                            setSelectedFiles(newFiles);
                          }}
                          className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpeg,.jpg,.mp4"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-300 file:text-white hover:file:bg-blue-400"
                  />
                  {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                </div>
              )}
              <div className="w-full">
                <label className="block text-red-500 text-sm mb-1">Title (required) <span className="text-gray-500">ⓘ</span></label>
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="Add a title that describes your resources"
                  className="w-full px-5 py-2 border border-gray-300 rounded-xl text-sm text-gray-500 focus:outline-none focus:border-blue-300"
                />
              </div>
              <div className="w-full">
                <label className="block text-red-500 text-sm mb-1">Description <span className="text-gray-500">ⓘ</span></label>
                <textarea
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
                  placeholder="Add description for your resources"
                  className="w-full px-5 py-2 border border-gray-300 rounded-xl text-sm text-gray-500 focus:outline-none focus:border-blue-300 resize-y"
                  rows="4"
                />
              </div>
              <div className="w-full">
                <div className="flex flex-wrap gap-2 mb-1">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-800">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsInputChange}
                  placeholder="Tags"
                  className="w-full px-5 py-2 border border-gray-300 rounded-xl text-sm text-gray-500 focus:outline-none focus:border-blue-300"
                />
                <p className="text-sm text-gray-500 mt-0">Enter a comma after each tag</p>
              </div>
            </div>

            {/* Footer */}
            <hr className="border-gray-300 my-5" />
            <div className="flex justify-end gap-3">
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
    </div>
  );
}