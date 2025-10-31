import { useState, useEffect, useMemo, useRef } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import subjectIcon from "../../assets/admin/subject.svg";
import dateIcon from "../../assets/admin/date.svg";
import languageIcon from "../../assets/admin/language.svg";
import uploadIcon from "../../assets/admin/upload.svg";
import fileIcon from "../../assets/admin/file.svg";
import dropdownIcon from "../../assets/admin/dropdown.svg";
import searchIcon from "../../assets/admin/search.svg";
import moreOptionsIcon from "../../assets/admin/more_options_vertical.svg";
import QuizBuilder from "../../components/admin/quiz_maker";

export default function ActivityResources() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  const [formData, setFormData] = useState({
    details: {
      activityTitle: "",
      selectedTags: [],
      selectedActivities: [],
    },
    activities: {},
    validation: {},
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagOptions, setTagOptions] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [triggerValidation, setTriggerValidation] = useState({});

  // Fixed filter states
  const [sortType, setSortType] = useState("title_asc"); 
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedDateLabel, setSelectedDateLabel] = useState("Date Uploaded");
  
  // Activity Type filter (multi-select)
  const [isActivityTypeOpen, setIsActivityTypeOpen] = useState(false);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState([]);
  const activityTypes = ["Pre-Test", "Activity", "Post-Test"];
  
  // Question Type filter (multi-select)
  const [isQuestionTypeOpen, setIsQuestionTypeOpen] = useState(false);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
  const questionTypes = ["Multiple Choice", "Answer", "File Upload", "Write"];

  // Refs for dropdowns
  const dateDropdownRef = useRef(null);
  const activityTypeDropdownRef = useRef(null);
  const questionTypeDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false);
      }
      if (activityTypeDropdownRef.current && !activityTypeDropdownRef.current.contains(event.target)) {
        setIsActivityTypeOpen(false);
      }
      if (questionTypeDropdownRef.current && !questionTypeDropdownRef.current.contains(event.target)) {
        setIsQuestionTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    // Fetch tags
  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost/literacynumeracy/admin/get_tags.php', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (isMounted && data.success) {
          setTagOptions(data.tags.map(t => ({ ...t, id: Number(t.id) })));
        }
      })
      .catch(console.error);
    return () => { isMounted = false; };
  }, []);

  // Fetch activities list
  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost/literacynumeracy/admin/get_activities_list.php', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (isMounted && data.success) {
          setActivities(data.activities);
        }
      })
      .catch(console.error);
    return () => { isMounted = false; };
  }, []);

  const filteredTags = useMemo(() => {
    return tagOptions.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tagOptions, searchTerm]);

  // Activity Type filter handlers
  const toggleActivityType = (type) => {
    setSelectedActivityTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Question Type filter handlers
  const toggleQuestionType = (type) => {
    setSelectedQuestionTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Reset field errors when input becomes valid
  useEffect(() => {
    if (formData.details.activityTitle.trim() && fieldErrors.title) {
      setFieldErrors(prev => ({ ...prev, title: "" }));
    }
    if (formData.details.selectedTags.length > 0 && fieldErrors.tags) {
      setFieldErrors(prev => ({ ...prev, tags: "" }));
    }
    if (formData.details.selectedActivities.length > 0 && fieldErrors.activities) {
      setFieldErrors(prev => ({ ...prev, activities: "" }));
    }
  }, [formData.details.activityTitle, formData.details.selectedTags, formData.details.selectedActivities, fieldErrors]);

  // Fetch activity for View/Edit
  const fetchActivity = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost/literacynumeracy/admin/get_activity.php?id=${id}`, {
        credentials: 'include',
      });
      const json = await res.json();
      if (json.success) {
        const fullData = json.data;
        fullData.activityId = fullData.activityId || id;  // Fallback
        return fullData;
      } else {
        alert(json.message || 'Failed to load activity');
        return null;
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const openViewModal = async (id) => {
    try {
      const tagsRes = await fetch('http://localhost/literacynumeracy/admin/get_tags.php', { credentials: 'include' });
      const tagsJson = await tagsRes.json();
      if (tagsJson.success) setTagOptions(tagsJson.tags);
    } catch (e) { console.error('Tags refresh failed:', e); }

    const data = await fetchActivity(id);
    if (data) {
      setViewData(data);
      setIsViewModalOpen(true);
    }
  };

  const openEditFromView = () => {
    setEditData(viewData);
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
    // Initialize formData for edit
    setFormData({
      details: {
        activityTitle: viewData.details.activityTitle,
        selectedTags: viewData.details.selectedTags,
        selectedActivities: viewData.details.selectedActivities,
      },
      activities: viewData.activities,
      validation: {},
    });
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewData(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setFormData({
      details: {
        activityTitle: "",
        selectedTags: [],
        selectedActivities: [],
      },
      activities: {},
      validation: {},
    });
    setCurrentPage(1);
    setErrorMessage("");
    setCompletedSteps([]);
    setFieldErrors({});
    setTriggerValidation({});
  };

  const handleUploadClick = () => {
    setIsCreateModalOpen(true);
    resetCreateForm();
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    resetCreateForm();
  };

  const handleNext = () => {
    const totalPages = formData.details.selectedActivities.length > 0
      ? 2 + formData.details.selectedActivities.length
      : 2;

    if (currentPage === 1) {
      const newErrors = {};
      if (!formData.details.activityTitle.trim()) newErrors.title = "Activity Title is required.";
      if (formData.details.selectedTags.length === 0) newErrors.tags = "Please select at least one tag.";
      if (formData.details.selectedActivities.length === 0) newErrors.activities = "Please select at least one activity type.";
      setFieldErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setErrorMessage("Please complete all required fields on this step.");
        return;
      }
    }

    if (currentPage > 1 && currentPage <= formData.details.selectedActivities.length + 1) {
      const activityType = formData.details.selectedActivities[currentPage - 2];
      setTriggerValidation(prev => ({ ...prev, [activityType]: true }));
      const isValid = formData.validation[activityType]?.isValid;
      if (!isValid) {
        setErrorMessage(`Please complete all required fields for ${activityType}.`);
        return;
      }
    }

    if (currentPage < totalPages) {
      setCompletedSteps(prev => prev.includes(currentPage) ? prev : [...prev, currentPage]);
      setCurrentPage(currentPage + 1);
      setTriggerValidation(prev => {
        const newTriggers = { ...prev };
        delete newTriggers[formData.details.selectedActivities[currentPage - 2]];
        return newTriggers;
      });
    }
    setErrorMessage("");
  };

  const handlePrevious = () => {
    setCurrentPage(prev => {
      const updated = [...completedSteps];
      const idx = updated.indexOf(prev);
      if (idx !== -1) updated.splice(idx, 1);
      setCompletedSteps(updated);
      return prev - 1;
    });
    setErrorMessage("");
  };

  const handleCreateActivity = async () => {
    setTriggerValidation(prev => {
      const newTriggers = {};
      formData.details.selectedActivities.forEach(type => {
        newTriggers[type] = true;
      });
      return newTriggers;
    });

    const allValid = formData.details.selectedActivities.every(
      type => formData.validation[type]?.isValid
    );
    if (!allValid) {
      setErrorMessage("Please complete all required fields for all activities before publishing.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('activityTitle', formData.details.activityTitle);
    formDataToSend.append('selectedTags', JSON.stringify(formData.details.selectedTags));
    formDataToSend.append('selectedActivities', JSON.stringify(formData.details.selectedActivities));
    formDataToSend.append('activities', JSON.stringify(formData.activities));

    formData.details.selectedActivities.forEach((activityType, activityIndex) => {
      const activity = formData.activities[activityType];
      if (activity?.questions) {
        activity.questions.forEach((question, questionIndex) => {
          if (question.imageFile) {
            formDataToSend.append(
              `questions_${activityIndex}_${questionIndex}_image`,
              question.imageFile
            );
          }
          if (question.type === "Multiple Choice" && question.options) {
            question.options.forEach((option, optionIndex) => {
              if (option.imageFile) {
                formDataToSend.append(
                  `questions_${activityIndex}_${questionIndex}_option_${optionIndex}_image`,
                  option.imageFile
                );
              }
            });
          }
        });
      }
    });

    const endpoint = isEditModalOpen
      ? `http://localhost/literacynumeracy/admin/update_activity.php?id=${editData.activityId || ''}`
      : 'http://localhost/literacynumeracy/admin/create_activity.php';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        if (isEditModalOpen) {
          closeEditModal();
        } else {
          handleCloseCreateModal();
        }
        // Refresh activities list
        fetch('http://localhost/literacynumeracy/admin/get_activities_list.php', {
          credentials: 'include',
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              setActivities(data.activities);
            }
          })
          .catch(console.error);
      } else {
        setErrorMessage(data.message || 'Failed to save activity');
      }
    } catch (err) {
      setErrorMessage('Network error');
    }
  };

  const toggleTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        selectedTags: prev.details.selectedTags.includes(tagId)
          ? prev.details.selectedTags.filter(t => t !== tagId)
          : [...prev.details.selectedTags, tagId],
      },
    }));
    setFieldErrors(prev => ({ ...prev, tags: prev.details.selectedTags.length > 0 ? "" : prev.tags }));
  };

  const toggleActivity = (activity) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        selectedActivities: prev.details.selectedActivities.includes(activity)
          ? prev.details.selectedActivities.filter(a => a !== activity)
          : [...prev.details.selectedActivities, activity],
      },
    }));
    setFieldErrors(prev => ({ ...prev, activities: prev.details.selectedActivities.length > 0 ? "" : prev.activities }));
  };

  const updateActivityContent = (activityType, content) => {
    setFormData(prev => ({
      ...prev,
      activities: { ...prev.activities, [activityType]: content },
    }));
  };

  const handleActivityValidation = (activityType, isValid, errors) => {
    setFormData(prev => ({
      ...prev,
      validation: { ...prev.validation, [activityType]: { isValid, errors } },
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";

    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredActivities = activities
    .filter((act) => {
      if (search && !act.title.toLowerCase().includes(search.toLowerCase())) return false;

      // Activity Type filter
      if (selectedActivityTypes.length > 0 && !selectedActivityTypes.some(type => 
        act.selectedActivities?.includes(type)
      )) return false;

      // Question Type filter
      if (selectedQuestionTypes.length > 0 && !selectedQuestionTypes.some(type => 
        act.questionTypes?.includes(type)
      )) return false;

      // Date filter (same as resources.jsx)
      const uploadDate = new Date(act.created_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDateRange === "today") {
        const resDay = new Date(uploadDate);
        resDay.setHours(0, 0, 0, 0);
        return resDay.getTime() === today.getTime();
      }

      if (selectedDateRange === "last7") {
        const sevenAgo = new Date(today);
        sevenAgo.setDate(today.getDate() - 7);
        return uploadDate >= sevenAgo;
      }

      if (selectedDateRange === "last30") {
        const thirtyAgo = new Date(today);
        thirtyAgo.setDate(today.getDate() - 30);
        return uploadDate >= thirtyAgo;
      }

      if (selectedDateRange === "custom" && customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        const resDay = new Date(uploadDate);
        resDay.setHours(0, 0, 0, 0);
        return resDay >= start && resDay <= end;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortType === "title_asc") return a.title.localeCompare(b.title);
      if (sortType === "title_desc") return b.title.localeCompare(a.title);
      if (sortType === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
      if (sortType === "date_asc") return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });

    const resetFilters = () => {
    setSearch("");
    setSortType("title_asc");
    setSelectedDateRange("all");
    setSelectedDateLabel("Date Uploaded");
    setShowCustomRange(false);  
    setCustomStartDate("");
    setCustomEndDate("");
    setSelectedActivityTypes([]);
    setSelectedQuestionTypes([]);
  };

  return (
        <div className="min-h-screen p-10 text-black">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Activity Resources</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex flex-1 gap-2 flex-wrap">
          {/* Search */}
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

          <button
            onClick={() => {
              const newOrder = sortType === "title_asc" ? "title_desc" : "title_asc";
              setSortType(newOrder);
            }}
            className="flex items-center justify-center bg-blue-300 px-4 py-2 rounded-xl shadow text-sm whitespace-nowrap h-9"
          >
            {sortType === "title_asc" ? "A-Z" : "Z-A"}
          </button>

          {/* Date Uploaded Dropdown */}
          <div className="relative" ref={dateDropdownRef}>
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-xl shadow text-sm whitespace-nowrap h-9"
            >
              <img src={dateIcon} alt="Date" className="w-6 h-6" /> {selectedDateLabel}
              <img src={dropdownIcon} alt="Dropdown" className="w-2 h-2" />
            </button>
            {isDateDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20 p-3">
                {[
                  { label: "Today", value: "today" },
                  { label: "Last 7 days", value: "last7" },
                  { label: "Last 30 days", value: "last30" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedDateRange(opt.value);
                      setSelectedDateLabel(opt.label);
                      setShowCustomRange(false);
                      setCustomStartDate("");
                      setCustomEndDate("");
                      setSortType("date_desc"); 
                      setIsDateDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded"
                  >
                    {opt.label}
                  </button>
                ))}

                {/* Custom range toggle */}
                <div className="border-t mt-2 pt-2">
                  <button
                    onClick={() => setShowCustomRange(!showCustomRange)}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded flex justify-between items-center"
                  >
                    Custom date range
                    <span className="text-xs">{showCustomRange ? '▲' : '▼'}</span>
                  </button>

                  {showCustomRange && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 py-1 text-sm border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">End Date</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          min={customStartDate}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 py-1 text-sm border rounded"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (customStartDate && customEndDate) {
                            const start = new Date(customStartDate);
                            const end = new Date(customEndDate);
                            const fmt = (d) =>
                              d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                            setSelectedDateRange("custom");
                            setSelectedDateLabel(`${fmt(start)} - ${fmt(end)}`);
                            setIsDateDropdownOpen(false);
                          }
                        }}
                        disabled={!customStartDate || !customEndDate}
                        className="w-full bg-blue-600 text-white text-xs py-1.5 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Apply Range
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Activity Type Dropdown */}
          <div className="relative" ref={activityTypeDropdownRef}>
            <button
              onClick={() => setIsActivityTypeOpen(!isActivityTypeOpen)}
              className="flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-xl shadow text-sm whitespace-nowrap h-9"
            >
              <img src={subjectIcon} alt="Activity Type" className="w-6 h-6" />
              {selectedActivityTypes.length === 0 ? "Activity Types" : `${selectedActivityTypes.length} selected`}
              <img src={dropdownIcon} alt="Dropdown" className="w-2 h-2" />
            </button>
            {isActivityTypeOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 p-2">
                {activityTypes.map((type) => (
                  <label key={type} className="flex items-center px-3 py-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedActivityTypes.includes(type)}
                      onChange={() => toggleActivityType(type)}
                      className="mr-2 accent-blue-500"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Question Type Dropdown */}
          <div className="relative" ref={questionTypeDropdownRef}>
            <button
              onClick={() => setIsQuestionTypeOpen(!isQuestionTypeOpen)}
              className="flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-xl shadow text-sm whitespace-nowrap h-9"
            >
              <img src={languageIcon} alt="Question Type" className="w-6 h-6" />
              {selectedQuestionTypes.length === 0 ? "Question Types" : `${selectedQuestionTypes.length} selected`}
              <img src={dropdownIcon} alt="Dropdown" className="w-2 h-2" />
            </button>
            {isQuestionTypeOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 p-2">
                {questionTypes.map((type) => (
                  <label key={type} className="flex items-center px-3 py-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedQuestionTypes.includes(type)}
                      onChange={() => toggleQuestionType(type)}
                      className="mr-2 accent-blue-500"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {(
            sortType !== "title_asc" ||
            selectedDateLabel !== "Date Uploaded" ||
            selectedActivityTypes.length > 0 ||
            selectedQuestionTypes.length > 0
          ) && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl shadow text-sm whitespace-nowrap h-9 transition-colors"
            >
              Reset Filters
            </button>
          )}
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
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="relative bg-white rounded-xl shadow p-4 flex flex-col text-xs h-38 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
              onClick={(e) => {
                if (!e.target.closest('.more-options')) {
                  openViewModal(act.id);
                }
              }}
            >
              <div className="flex-1 flex justify-center items-center">
                <img src={fileIcon} alt="File" className="w-22 h-22" />
              </div>
              <div className="flex justify-between items-end w-full mt-2">
                <div className="text-left">
                  <p className="text-black font-medium">{act.title}</p>
                  <p className="text-gray-500">{formatDate(act.created_at)}</p>
                </div>
                <div className="more-options">
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === act.id ? null : act.id);
                    }}
                  >
                    <img src={moreOptionsIcon} alt="More Options" className="w-5 h-5" />
                  </button>
                  {openDropdownId === act.id && (
                    <div className="absolute right-0 bottom-10 mt-1 w-32 bg-white rounded-lg shadow-lg z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewModal(act.id);
                          setOpenDropdownId(null);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this activity?")) {
                            // TODO: delete endpoint
                          }
                          setOpenDropdownId(null);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2.2 2.2 0 0116.138 21H7.862a2.2 2.2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1 " />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW MODAL */}
      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 max-w-[80%] truncate">
                {viewData.details.activityTitle}
              </h3>
              <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <hr className="border-gray-300" />

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Details</h2>
                <p><strong>Title:</strong> {viewData.details.activityTitle || "N/A"}</p>
                <p>
                  <strong>Tags:</strong>...
                </p>
                <p>
                  <strong>Activities:</strong> {viewData.details.selectedActivities.join(", ") || "None"}
                </p>
              </div>
              {viewData.details.selectedActivities.map((type) => (
                <div key={type} className="flex flex-col gap-4 mt-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{type}</h2>
                  <p><strong>Name:</strong> {viewData.activities[type]?.activityName || "N/A"}</p>
                  <div className="mt-2">
                    <strong>Questions:</strong>
                    {viewData.activities[type]?.questions?.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {viewData.activities[type].questions.map((q, idx) => (
                          <li key={idx} className="mt-2">
                            <p><strong>Question {idx + 1} ({q.type}):</strong> {q.text}</p>
                            {q.image && (
                              <img
                                src={`http://localhost/literacynumeracy/admin/${q.image}`}
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
                                          src={`http://localhost/literacynumeracy/admin/${opt.image}`}
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

            <hr className="border-gray-300" />
            <div className="flex justify-end gap-3 p-6 pt-4">
              <button
                onClick={openEditFromView}
                className="px-5 py-2 bg-blue-300 rounded-xl text-sm text-white hover:bg-blue-400"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {isEditModalOpen ? "Edit Activity" : "Create Activity"}
              </h3>
              <button
                onClick={isEditModalOpen ? closeEditModal : handleCloseCreateModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <hr className="border-gray-300" />

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="w-full max-w-2xl mx-auto mb-6">
                <div className="flex justify-between relative">
                  {(() => {
                    const steps = ["Details", ...formData.details.selectedActivities, "Preview"];
                    return steps.map((label, idx) => {
                      const stepNo = idx + 1;
                      const isActive = currentPage === stepNo;
                      const isCompleted = completedSteps.includes(stepNo);
                      return (
                        <div key={label} className="flex flex-col items-center flex-1 relative">
                          <span className={`text-sm mb-2 ${isActive ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                            {label}
                          </span>
                          <div className={`w-5 h-5 rounded-full z-10 flex items-center justify-center ${isCompleted || isActive ? "bg-blue-500" : "bg-gray-400"}`}>
                            {isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                          </div>
                          {idx < steps.length - 1 && <div className="absolute top-[80%] left-1/2 w-full h-[2px] -translate-y-1/2 bg-blue-600" />}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}

              <div className="flex flex-col gap-4">
                {currentPage === 1 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Details</h2>
                    <div className="w-full">
                      <label className="block text-gray-800 text-base mb-1">
                        Activity Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.details.activityTitle}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            details: { ...prev.details, activityTitle: e.target.value },
                          }));
                          if (e.target.value.trim()) setFieldErrors(prev => ({ ...prev, title: "" }));
                        }}
                        placeholder="Add a title"
                        className={`w-full px-5 py-2 border rounded-xl text-base text-gray-700 focus:outline-none ${
                          fieldErrors.title ? "border-red-500" : "border-gray-300 focus:border-blue-300"
                        }`}
                      />
                      {fieldErrors.title && <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-gray-800 text-base mb-1">
                        Select Activity <span className="text-red-500">*</span>
                      </label>
                      {["Pre-Test", "Activity", "Post-Test"].map((type) => (
                        <div key={type} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={formData.details.selectedActivities.includes(type)}
                            onChange={() => toggleActivity(type)}
                            className="mr-2 accent-blue-500"
                          />
                          {type}
                        </div>
                      ))}
                      {fieldErrors.activities && <p className="text-red-500 text-sm mt-1">{fieldErrors.activities}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-gray-800 text-base mb-1">
                        Tags <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        {/* Selected Tags Container */}
                        <div
                          onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                          className={`min-h-10 flex flex-wrap gap-2 items-center bg-white border rounded-xl px-3 py-2 cursor-pointer ${
                            fieldErrors.tags ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          {formData.details.selectedTags.length > 0 ? (
                            formData.details.selectedTags.map((tagId) => {
                              const tag = tagOptions.find(t => t.id == tagId);
                              return (
                                <span
                                  key={tagId}
                                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                                >
                                  {tag ? tag.name : `Unknown (${tagId})`}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTag(tagId);
                                    }}
                                    className="ml-1 text-blue-700 hover:text-blue-900"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-gray-400 text-sm">Select tags...</span>
                          )}
                          <img src={dropdownIcon} alt="Dropdown" className="w-3 h-3 ml-auto" />
                        </div>

                        {/* Dropdown */}
                        {showTagsDropdown && (
                          <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-xl mt-1 shadow-md">
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none"
                              />
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                              {filteredTags.map((tag) => (
                                <div
                                  key={tag.id}
                                  onClick={() => toggleTag(tag.id)}
                                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.details.selectedTags.includes(tag.id)}
                                    readOnly
                                    className="mr-2 accent-blue-500"
                                  />
                                  <span className="text-sm">{tag.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {fieldErrors.tags && <p className="text-red-500 text-sm mt-1">{fieldErrors.tags}</p>}
                    </div>
                  </div>
                )}

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
                        onValidate={(isValid, errors) => handleActivityValidation(type, isValid, errors)}
                        validate={triggerValidation[type] || false}
                      />
                    </div>
                  );
                })}

                {currentPage === 2 + formData.details.selectedActivities.length && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Preview</h2>
                    <p className="text-sm text-gray-500">
                      Review your activity before publishing.
                    </p>
                    <div className="border border-gray-300 rounded-xl p-4 bg-white">
                      <h3 className="text-base font-semibold mb-2">Details</h3>
                      <p><strong>Title:</strong> {formData.details.activityTitle || "N/A"}</p>
                      <p>
                        <strong>Tags:</strong>{" "}
                        {formData.details.selectedTags
                          .map(tagId => tagOptions.find(t => t.id == tagId)?.name || 'Unknown')
                          .join(", ") || "None"}
                      </p>
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

            <hr className="border-gray-300" />
            <div className="flex justify-end gap-3 p-6 pt-4">
              {currentPage > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-5 py-2 bg-gray-200 rounded-xl text-sm text-gray-800 hover:bg-gray-300"
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
                className="px-5 py-2 bg-blue-300 rounded-xl text-sm text-white hover:bg-blue-400"
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
      )}
    </div>
  );
}