import { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import subjectIcon from "../../assets/admin/subject.svg";
import dateIcon from "../../assets/admin/date.svg";
import languageIcon from "../../assets/admin/language.svg";
import uploadIcon from "../../assets/admin/upload.svg";
import fileIcon from "../../assets/admin/file.svg";
import dropdownIcon from "../../assets/admin/dropdown.svg";
import searchIcon from "../../assets/admin/search.svg";
import moreOptionsIcon from "../../assets/admin/more_options_vertical.svg";
import openInNewTabIcon from "../../assets/admin/open-in-new-tab.svg";
import editIcon from "../../assets/admin/edit.svg";
import downloadIcon from "../../assets/admin/download.svg";

export default function LearningMaterials() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editResource, setEditResource] = useState(null);
  const [editFiles, setEditFiles] = useState([]);
  const [editTags, setEditTags] = useState([]);
  const [editingTagIndex, setEditingTagIndex] = useState(null);
  const [editTagValue, setEditTagValue] = useState("");

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const BASE_URL = "http://localhost/literacynumeracy/";

  const normalizeFilePath = (filePath) => {
    if (filePath.startsWith(BASE_URL)) {
      return filePath.replace(BASE_URL, "");
    }
    return filePath; 
  };

  useEffect(() => {
    fetch("http://localhost/literacynumeracy/admin/fetch_resources.php")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched resources:", data);
        if (data.success) {
          const normalizedResources = data.resources.map((resource) => ({
            ...resource,
            files: resource.files.map((file) => ({
              ...file,
              file_path: normalizeFilePath(file.file_path),
            })),
          }));
          setResources(normalizedResources || []);
        } else {
          console.error("Fetch failed:", data.message);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && previewFile) {
        setPreviewFile(null);
      } else if (e.key === "Escape" && isViewModalOpen) {
        setIsViewModalOpen(false);
      } else if (e.key === "Escape" && isEditModalOpen) {
        handleEditCloseModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [previewFile, isViewModalOpen, isEditModalOpen]);


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
    setIsEditModalOpen(false);
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

  const handleUpload = async () => {
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

    const formData = new FormData();
    formData.append("resourceTitle", resourceTitle.trim());
    formData.append("resourceDescription", resourceDescription.trim());
    formData.append("tags", JSON.stringify(tags));

    selectedFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      const response = await fetch("http://localhost/literacynumeracy/admin/upload_resources.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();
      console.log("Upload response:", result);

      if (result.success) {
        setTimeout(() => {
          setIsUploadModalOpen(false);
          resetForm();
          setIsModalOpen(false);
          fetch("http://localhost/literacynumeracy/admin/fetch_resources.php")
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                const normalizedResources = data.resources.map((resource) => ({
                  ...resource,
                  files: resource.files.map((file) => ({
                    ...file,
                    file_path: normalizeFilePath(file.file_path),
                  })),
                }));
                setResources(normalizedResources);
              }
            })
            .catch((err) => console.error("Fetch error:", err));
        }, 2000);
      } else {
        setUploadError(result.message || "Upload failed");
        setTimeout(() => setIsUploadModalOpen(false), 2000);
      }
    } catch (error) {
      setUploadError("An error occurred during upload");
      setTimeout(() => setIsUploadModalOpen(false), 2000);
      console.error("Upload error:", error);
    }
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
    console.log("Selected files:", files);
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

  const truncateTitle = (title) => {
    if (title.length <= 20) return title;
    return `${title.slice(0, 17)}...`;
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours > 24) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "just now";
    }
  };

  window.onbeforeunload = (event) => {
    if (
      resourceTitle.trim() ||
      resourceDescription.trim() ||
      tagsInput.trim() ||
      tags.length > 0 ||
      selectedFiles.length > 0 ||
      editFiles.length > 0 ||
      editTags.length > 0
    ) {
      const confirmationMessage = "You have unsaved changes. Are you sure you want to refresh?";
      (event || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    }
    return null;
  };

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewResource = (resource) => {
    if (!resource || !resource.id) {
      console.error("Invalid resource or ID:", resource);
      return;
    }
    console.log("Viewing resource ID:", resource.id);
    setSelectedResource(resource);
    setIsViewModalOpen(true);

    fetch(`http://localhost/literacynumeracy/admin/fetch_resources.php?id=${parseInt(resource.id, 10)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("View resource data:", data);
        if (data.success) {
          const normalizedResource = {
            ...data.resource,
            files: data.resource.files.map((file) => ({
              ...file,
              file_path: normalizeFilePath(file.file_path),
            })),
          };
          setSelectedResource(normalizedResource);
        } else {
          console.error("View fetch failed:", data.message);
        }
      })
      .catch((err) => console.error("View fetch error:", err));
  };

  const handleOpenInNewTab = (file) => {
    const relativePath = normalizeFilePath(file.file_path);
    const url = `http://localhost/literacynumeracy/admin/fetch_file.php?file_path=${encodeURIComponent(relativePath)}`;
    try {
      window.open(url, "_blank");
    } catch (err) {
      console.error("Open in new tab error:", err);
      setErrorMessage("Failed to open file. Please try again.");
    }
  };

  const handleEditResource = (resource) => {
    const normalizedResource = {
      ...resource,
      files: resource.files.map((file) => ({
        ...file,
        file_path: normalizeFilePath(file.file_path),
      })),
    };
    setEditResource(normalizedResource);
    setResourceTitle(normalizedResource.title);
    setResourceDescription(normalizedResource.description || "");
    setEditTags(normalizedResource.tags || []);
    setEditFiles(normalizedResource.files || []);
    setIsEditModalOpen(true);
    setIsViewModalOpen(false);
    setOpenDropdownId(null);
  };

  const handleEditCloseModal = () => {
    if (
      resourceTitle.trim() !== editResource.title ||
      resourceDescription.trim() !== (editResource.description || "") ||
      JSON.stringify(editTags) !== JSON.stringify(editResource.tags || []) ||
      editFiles.length !== editResource.files.length
    ) {
      setIsCancelModalOpen(true);
    } else {
      setIsEditModalOpen(false);
      resetEditForm();
    }
  };

  const resetEditForm = () => {
    setResourceTitle("");
    setResourceDescription("");
    setEditTags([]);
    setEditFiles([]);
    setErrorMessage("");
    setTitleError("");
    setTagsError("");
    setEditResource(null);
    setEditingTagIndex(null);
    setEditTagValue("");
  };

  const handleEditTagsInputChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);

    if (value.endsWith(",")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !editTags.includes(newTag)) {
        setEditTags([...editTags, newTag]);
        setTagsError("");
      }
      setTagsInput("");
    }
  };

  const handleEditTagClick = (index, tag) => {
    setEditingTagIndex(index);
    setEditTagValue(tag);
  };

  const handleEditTagChange = (e) => {
    setEditTagValue(e.target.value);
  };

  const handleEditTagSubmit = (index) => {
    const newTag = editTagValue.trim();
    if (newTag && !editTags.includes(newTag)) {
      setEditTags((prev) => {
        const newTags = [...prev];
        newTags[index] = newTag;
        return newTags;
      });
      setTagsError("");
    } else if (!newTag) {
      setEditTags((prev) => prev.filter((_, i) => i !== index));
    }
    setEditingTagIndex(null);
    setEditTagValue("");
  };

  const handleEditFileChange = (e) => {
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
            `Invalid files: ${invalidFiles.map(f => f.name).join(", ")}. Only .pdf, .png, .jpeg, .jpg, .mp4 files are allowed.`
        );
        return;
    }

      setErrorMessage("");
      setEditFiles([...editFiles, ...files]);
  };

  const handleEditFileRemove = (index) => {
    setEditFiles(editFiles.filter((_, i) => i !== index));
  };

 const handleEditSubmit = async () => {
      let valid = true;

      if (!resourceTitle.trim()) {
          setTitleError("Title is required.");
          valid = false;
      } else {
          setTitleError("");
      }

      if (editTags.length === 0) {
          setTagsError("At least one tag is required.");
          valid = false;
      } else {
          setTagsError("");
      }

      if (editFiles.length === 0) {
          setErrorMessage("At least one file is required.");
          valid = false;
      } else {
          setErrorMessage("");
      }

      if (!valid) return;

      setIsUploadModalOpen(true);
      setUploadError("");

      const formData = new FormData();
      formData.append("resourceId", editResource.id);
      formData.append("resourceTitle", resourceTitle.trim());
      formData.append("resourceDescription", resourceDescription.trim());
      formData.append("tags", JSON.stringify(editTags));

      editFiles.forEach((file, index) => {
          if (file.file_path) {
              const filePath = normalizeFilePath(file.file_path).replace(/^learning_resources\//, '');
              formData.append(`existingFiles[${index}]`, filePath);
          } else {
              formData.append(`newFiles[${index}]`, file);
          }
      });

      // Debug FormData
      for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }

      try {
          const response = await fetch("http://localhost/literacynumeracy/admin/update_resources.php", {
              method: "POST",
              credentials: "include",
              body: formData,
          });

          const result = await response.json();
          console.log("Edit response:", result);

          if (result.success) {
              setTimeout(() => {
                  setIsUploadModalOpen(false);
                  resetEditForm();
                  setIsEditModalOpen(false);
                  fetch("http://localhost/literacynumeracy/admin/fetch_resources.php")
                      .then((res) => res.json())
                      .then((data) => {
                          if (data.success) {
                              const normalizedResources = data.resources.map((resource) => ({
                                  ...resource,
                                  files: resource.files.map((file) => ({
                                      ...file,
                                      file_path: normalizeFilePath(file.file_path),
                                  })),
                              }));
                              setResources(normalizedResources);
                          }
                      })
                      .catch((err) => console.error("Fetch error:", err));
              }, 2000);
          } else {
              setUploadError(result.message || "Update failed");
              setTimeout(() => setIsUploadModalOpen(false), 2000);
          }
      } catch (error) {
          setUploadError("An error occurred during update");
          setTimeout(() => setIsUploadModalOpen(false), 2000);
          console.error("Update error:", error);
      }
  };

  const handleDownloadResource = async (resource) => {
    if (!resource || !resource.id) {
      console.error("Invalid resource or ID:", resource);
      setErrorMessage("Invalid resource. Please try again.");
      return;
    }

    try {
      // Fetch resource details to ensure we have the latest file data
      const response = await fetch(`http://localhost/literacynumeracy/admin/fetch_resources.php?id=${resource.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched resource for download:", data);

      if (!data.success || !data.resource || !data.resource.files) {
        throw new Error(data.message || "Failed to fetch resource files.");
      }

      const files = data.resource.files.map((file) => ({
        ...file,
        file_path: normalizeFilePath(file.file_path),
      }));

      if (files.length === 1) {
        // Single file download
        const file = files[0];
        const fileResponse = await fetch(`http://localhost/literacynumeracy/admin/fetch_file.php?file_path=${encodeURIComponent(file.file_path)}&download=true`, {
          method: "GET",
          credentials: "include",
        });

        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch file: ${file.file_name}`);
        }

        const blob = await fileResponse.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (files.length > 1) {
        // Multiple files: create a ZIP
        if (!window.JSZip) {
          console.error("JSZip is not loaded.");
          setErrorMessage("JSZip library is not loaded. Please try again later.");
          return;
        }

        const zip = new JSZip();
        for (const file of files) {
          const fileResponse = await fetch(`http://localhost/literacynumeracy/admin/fetch_file.php?file_path=${encodeURIComponent(file.file_path)}&download=true`, {
            method: "GET",
            credentials: "include",
          });

          if (!fileResponse.ok) {
            throw new Error(`Failed to fetch file: ${file.file_name}`);
          }

          const blob = await fileResponse.blob();
          zip.file(file.file_name, blob);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.resource.title}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download error:", error);
      setErrorMessage("Failed to download resource. Please try again.");
    }
  };

  const renderFilePreview = (filePath, fileType) => {
    const relativePath = normalizeFilePath(filePath);
    const url = `http://localhost/literacynumeracy/admin/fetch_file.php?file_path=${encodeURIComponent(relativePath)}`;
    if (fileType === "pdf") {
      return <embed src={url} type="application/pdf" width="100%" height="100%" />;
    } else if (fileType === "mp4") {
      return <video controls width="100%" height="100%"><source src={url} type="video/mp4" /></video>;
    } else if (["png", "jpeg", "jpg"].includes(fileType)) {
      return <img src={url} alt="Preview" className="w-full h-full object-contain" />;
    }
    return <p>Preview not available</p>;
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
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="relative bg-white rounded-xl shadow p-4 flex flex-col text-xs h-38 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
              onClick={(e) => {
                if (!e.target.closest('.more-options')) {
                  handleViewResource(resource);
                }
              }}
            >
              <div className="flex-1 flex justify-center items-center">
                <img src={fileIcon} alt="File" className="w-22 h-22" />
              </div>
              <div className="flex justify-between items-end w-full mt-2">
                <div className="text-left">
                  <p className="text-black font-medium">
                    {truncateTitle(resource.title)}
                  </p>
                  <p className="text-gray-500">
                    {formatTime(resource.date_uploaded)}
                  </p>
                </div>
                <div className="more-options" ref={dropdownRef}>
                  <button
                    type="button"
                    aria-label="Open more options"
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === resource.id ? null : resource.id);
                    }}
                  >
                    <img src={moreOptionsIcon} alt="More Options" className="w-5 h-5" />
                  </button>
                  {openDropdownId === resource.id && (
                    <div className="absolute right-0 bottom-10 mt-1 w-32 bg-white rounded-lg shadow-lg z-20">
                      <button
                        type="button"
                        aria-label={`Edit resource ${resource.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditResource(resource);
                          setOpenDropdownId(null);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 focus:outline-none"
                      >
                        <img src={editIcon} alt="Edit" className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        aria-label={`Download resource ${resource.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadResource(resource);
                          setOpenDropdownId(null);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 focus:outline-none"
                      >
                        <img src={downloadIcon} alt="Download" className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Resources Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[90vh] flex flex-col">
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
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-[15px]">
              {errorMessage && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                  {errorMessage}
                </div>
              )}
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
                  <p className="text-gray-500 text-sm">Supported files: pdf, png, jpeg, jpg, mp4.</p>
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
            <hr className="border-gray-300" />
            <div className="flex justify-end gap-3 p-6 pt-4">
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

      {/* Edit Resources Modal */}
      {isEditModalOpen && editResource && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit Resource
              </h3>
              <button
                onClick={handleEditCloseModal}
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
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-[15px]">
              {errorMessage && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                  {errorMessage}
                </div>
              )}
              {!editFiles.length ? (
                <div
                  className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 p-6 rounded-xl"
                  onDragOver={handleDragOver}
                  onDrop={handleEditFileChange}
                >
                  <img src={uploadIcon} alt="Upload" className="w-14 h-14" />
                  <h4 className="text-lg font-medium text-gray-800">
                    Drag and drop your files here or select files
                  </h4>
                  <p className="text-gray-500 text-sm">Supported files: pdf, png, jpeg, jpg, mp4.</p>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpeg,.jpg,.mp4"
                    onChange={handleEditFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-300 file:text-white hover:file:bg-blue-400 hidden"
                  />
                  <button
                    onClick={() => editFileInputRef.current.click()}
                    className="px-4 py-2 bg-blue-300 text-white rounded-xl hover:bg-blue-400"
                  >
                    Select Files
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {editFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center bg-gray-200 rounded-full px-3 py-2 text-sm text-gray-800 break-words"
                      >
                        <span
                          className="cursor-pointer hover:underline break-all"
                          onClick={() => handleOpenInNewTab(file)}
                        >
                          {truncateFilename(file.file_name || file.name)} ({formatFileSize(file.size || file.file_size)})
                        </span>
                        <button
                          onClick={() => handleEditFileRemove(index)}
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
                    onDrop={handleEditFileChange}
                  >
                    <input
                      ref={editFileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpeg,.jpg,.mp4"
                      onChange={handleEditFileChange}
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-300 file:text-white hover:file:bg-blue-400 hidden"
                    />
                    <button
                      onClick={() => editFileInputRef.current.click()}
                      className="px-4 py-2 bg-blue-300 text-white rounded-xl hover:bg-blue-400"
                    >
                      Add More Files
                    </button>
                  </div>
                </div>
              )}

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

              <div>
                <label className="block text-red-500 text-sm mb-1">
                  Tags (required) <span className="text-gray-500">ⓘ</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editTags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center bg-gray-200 rounded-full px-3 py-2 text-sm text-gray-800 break-words max-w-full"
                    >
                      {editingTagIndex === index ? (
                        <input
                          type="text"
                          value={editTagValue}
                          onChange={handleEditTagChange}
                          onBlur={() => handleEditTagSubmit(index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              handleEditTagSubmit(index);
                            }
                          }}
                          className="bg-transparent text-sm text-gray-800 focus:outline-none w-auto max-w-[150px]"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span
                            className="break-all cursor-pointer"
                            onClick={() => handleEditTagClick(index, tag)}
                          >
                            {tag}
                          </span>
                          <button
                            onClick={() => setEditTags(editTags.filter((_, i) => i !== index))}
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
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleEditTagsInputChange}
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
            <hr className="border-gray-300" />
            <div className="flex justify-end gap-3 p-6 pt-4">
              <button
                onClick={handleEditSubmit}
                className="px-5 py-2 bg-blue-300 rounded-xl text-sm text-white hover:bg-blue-400"
              >
                Save Changes
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

      {/* View Resource Modal */}
      {isViewModalOpen && selectedResource && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedResource.title}
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
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
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-[15px]">
              <h4 className="text-lg font-medium text-gray-800">Description</h4>
              {selectedResource.description ? (
                <p className="text-black whitespace-pre-line break-words">{selectedResource.description}</p>
              ) : (
                <p className="text-black italic">No description added</p>
              )}
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Tags</h4>
                {selectedResource.tags && selectedResource.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-blue-100 rounded-full px-3 py-2 text-sm text-blue-800 break-words max-w-full"
                      >
                        <span className="break-all">{tag}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-black italic">No tags added</p>
                )}
              </div>
              <h4 className="text-lg font-medium text-gray-800">Resources</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedResource.files && selectedResource.files.map((file, index) => {
                  const isImage = ["png", "jpeg", "jpg"].includes(file.file_type);
                  const isVideo = file.file_type === "mp4";
                  const isPDF = file.file_type === "pdf";

                  let thumb;
                  if (isImage) {
                    thumb = <img src={`http://localhost/literacynumeracy/admin/fetch_file.php?file_path=${encodeURIComponent(normalizeFilePath(file.file_path))}`} alt={file.file_name} className="w-full h-32 object-cover rounded-lg" />;
                  } else if (isVideo) {
                    thumb = (
                      <video className="w-full h-32 object-cover rounded-lg" muted>
                        <source src={`http://localhost/literacynumeracy/admin/fetch_file.php?file_path=${encodeURIComponent(normalizeFilePath(file.file_path))}`} type="video/mp4" />
                      </video>
                    );
                  } else if (isPDF) {
                    thumb = (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                        <img src={fileIcon} alt="PDF" className="w-10 h-10" />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className="cursor-pointer group"
                      onClick={() => setPreviewFile(file)}
                    >
                      {thumb}
                      <p className="text-sm text-gray-700 mt-2 text-center truncate group-hover:underline">
                        {file.file_name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-end gap-3 p-6 pt-4">
              <button
                onClick={() => handleEditResource(selectedResource)}
                className="px-5 py-2 bg-blue-300 rounded-xl text-sm text-white hover:bg-blue-400"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Preview Overlay */}
          {previewFile && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60">
              <div className="bg-white rounded-xl w-full max-w-5xl h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                  <span className="text-sm text-gray-700 truncate">{previewFile.file_name}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleOpenInNewTab(previewFile)}
                      className="flex items-center gap-1 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-full px-2 py-1 transition-colors duration-200"
                    >
                      <img src={openInNewTabIcon} alt="Open in new tab" className="w-5 h-5" />
                      Open in new tab
                    </button>
                    <button
                      onClick={() => setPreviewFile(null)}
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
                </div>
                <div className="flex-1 p-4 overflow-auto">
                  {renderFilePreview(previewFile.file_path, previewFile.file_type)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}