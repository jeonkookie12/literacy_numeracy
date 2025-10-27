import { useState, useRef, useEffect } from "react";
import copyIcon from "../../assets/admin/copy.svg";
import deleteIcon from "../../assets/admin/delete.svg";
import upIcon from "../../assets/admin/arrow-up.svg";
import downIcon from "../../assets/admin/arrow-down.svg";
import imageIcon from "../../assets/admin/image.svg";
import multipleChoiceIcon from "../../assets/admin/radio_button.svg";
import answerIcon from "../../assets/admin/text.svg";
import fileUploadIcon from "../../assets/admin/docu_up.svg";
import writeIcon from "../../assets/admin/write.svg";
import moreOptionsIcon from "../../assets/admin/more_options_vertical.svg";
import warningIcon from "../../assets/admin/warning.svg";

export default function QuizBuilder({ quizTypeLabel, quizData, updateQuizData, onValidate, validate }) {
  const [activityName, setActivityName] = useState(quizData.activityName || "");
  const [questions, setQuestions] = useState(quizData.questions || []);
  const [showSelector, setShowSelector] = useState(quizData.questions?.length === 0);
  const [openQuestionSettings, setOpenQuestionSettings] = useState(new Set());
  const [showImageModal, setShowImageModal] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageTarget, setImageTarget] = useState(null);
  const [activeResizeIndex, setActiveResizeIndex] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [questionValidationStatus, setQuestionValidationStatus] = useState({});
  const textareaRefs = useRef({});
  const imageContainerRefs = useRef({});
  const fileInputRef = useRef(null);
  const selectorRef = useRef(null);

  useEffect(() => {
    if (showSelector && selectorRef.current && questions.length > 0) {
      selectorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showSelector, questions.length]);

  useEffect(() => {
    const hasChanged =
      activityName !== (quizData.activityName || "") ||
      JSON.stringify(questions) !== JSON.stringify(quizData.questions || []);

    if (hasChanged) {
      updateQuizData({ activityName, questions });
    }
  }, [activityName, questions, updateQuizData]);

  useEffect(() => {
    Object.values(textareaRefs.current).forEach(autoResize);
  }, [questions]);

  useEffect(() => {
    const observers = [];
    questions.forEach((_, qIndex) => {
      const el = imageContainerRefs.current[qIndex];
      if (el) {
        const observer = new ResizeObserver(() => {
          const containerWidth = el.parentElement.clientWidth;
          setQuestions((prev) => {
            const newQuestions = [...prev];
            if (newQuestions[qIndex].imageDimensions) {
              newQuestions[qIndex].imageDimensions = {
                width: Math.min(newQuestions[qIndex].imageDimensions.width, containerWidth),
                height: Math.min(newQuestions[qIndex].imageDimensions.height, containerWidth * 0.75),
              };
            }
            return newQuestions;
          });
        });
        observer.observe(el);
        observers.push(observer);
      }
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [questions]);

  useEffect(() => {
    const { globalErrors, questionErrors, isValid } = computeValidation();
    onValidate(isValid, { ...globalErrors, questionErrors });
  }, [activityName, questions, onValidate, quizTypeLabel]);

  useEffect(() => {
    if (validate) {
      handleValidation();
    }
  }, [validate]);

  const autoResize = (element) => {
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  const computeValidation = () => {
    const globalErrors = {};
    const questionErrors = {};
    if (!activityName.trim()) {
      globalErrors.activityName = `${quizTypeLabel} Name is required.`;
    }
    if (questions.length === 0) {
      globalErrors.questions = `At least one question is required for ${quizTypeLabel}.`;
    }
    questions.forEach((q, index) => {
      const qErrors = {};
      if (!q.text.trim()) {
        qErrors.text = `Question ${index + 1} text is required.`;
      }
      if (!q.points || q.points === "" || isNaN(q.points) || Number(q.points) < 0) {
        qErrors.points = `Points are required for Question ${index + 1}.`;
      }
      if (q.type === "Multiple Choice" && (q.correctIndex === null || q.correctIndex === undefined)) {
        qErrors.correctAnswer = `A correct answer is required for Question ${index + 1}.`;
      }
      if (q.type === "Answer" && !q.expectedAnswer?.trim()) {
        qErrors.correctAnswer = `An expected answer is required for Question ${index + 1}.`;
      }
      if (Object.keys(qErrors).length > 0) {
        questionErrors[index] = qErrors;
      }
    });
    const isValid = Object.keys(globalErrors).length === 0 && Object.keys(questionErrors).length === 0;
    return { globalErrors, questionErrors, isValid };
  };

  const handleValidation = () => {
    const { globalErrors, questionErrors, isValid } = computeValidation();
    setValidationErrors({ ...globalErrors, questionErrors });
    Object.entries(questionErrors).forEach(([index, qErrors]) => {
      if (qErrors.points || qErrors.correctAnswer) {
        setQuestionValidationStatus((prev) => ({ ...prev, [index]: true }));
      }
    });
    onValidate(isValid, { ...globalErrors, questionErrors });
  };

  const toggleSettings = (qIndex) => {
    const key = `${qIndex}`;
    setOpenQuestionSettings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
    setQuestionValidationStatus((prev) => ({
      ...prev,
      [qIndex]: false,
    }));
  };

  const openImageModal = (qIndex, type, oIndex) => {
    setShowImageModal(`${qIndex}-${type}${oIndex !== undefined ? `-${oIndex}` : ''}`);
    setImageTarget({ qIndex, type, oIndex });
    setIsUploading(false);
  };

  const closeImageModal = () => {
    setShowImageModal(null);
    setImageTarget(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors((prev) => ({
          ...prev,
          imageError: 'Only JPG, JPEG, PNG, or GIF files are allowed.',
        }));
        setTimeout(() => {
          setValidationErrors((prev) => ({ ...prev, imageError: null }));
        }, 3000);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          imageError: 'Image size must not exceed 10MB.',
        }));
        setTimeout(() => {
          setValidationErrors((prev) => ({ ...prev, imageError: null }));
        }, 3000);
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          let width, height;
          if (imageTarget.type === 'question') {
            width = img.width;
            height = img.height;
            const maxWidth = 600;
            if (width > maxWidth) {
              const scale = maxWidth / width;
              width *= scale;
              height *= scale;
            }
          } else if (imageTarget.type === 'option') {
            width = 100;
            height = 100;
          }
          setQuestions((prev) => {
            const newQuestions = [...prev];
            if (imageTarget.type === 'question') {
              newQuestions[imageTarget.qIndex].image = reader.result;
              newQuestions[imageTarget.qIndex].imageDimensions = { width, height };
            } else if (imageTarget.type === 'option' && imageTarget.oIndex !== undefined) {
              newQuestions[imageTarget.qIndex].options[imageTarget.oIndex].image = reader.result;
              newQuestions[imageTarget.qIndex].options[imageTarget.oIndex].imageDimensions = { width, height };
            }
            return newQuestions;
          });
          setTimeout(() => {
            closeImageModal();
          }, 1000);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddQuestion = (type) => {
    let newQuestion = { orderIndex: questions.length };
    if (type === "Multiple Choice") {
      newQuestion = { ...newQuestion, type, text: "", options: [{ text: "" }], correctIndex: null, points: "" };
    } else if (type === "Answer") {
      newQuestion = { ...newQuestion, type, text: "", expectedAnswer: "", points: "" };
    } else if (type === "File Upload") {
      newQuestion = { ...newQuestion, type, text: "", points: "" };
    } else if (type === "Write") {
      newQuestion = { ...newQuestion, type, text: "", points: "" };
    }
    setQuestions([...questions, newQuestion]);
    setShowSelector(false);
  };

  const handleCopyQuestion = (qIndex) => {
    const newQuestions = [...questions];
    const copied = JSON.parse(JSON.stringify(newQuestions[qIndex]));
    copied.orderIndex = qIndex + 1;
    newQuestions.forEach((q, i) => {
      if (i >= qIndex + 1) q.orderIndex += 1;
    });
    newQuestions.splice(qIndex + 1, 0, copied);
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(qIndex, 1);
    newQuestions.forEach((q, i) => {
      q.orderIndex = i;
    });
    setQuestions(newQuestions);
    if (newQuestions.length === 0) {
      setShowSelector(true);
      handleValidation(); 
    }
  };

  const handleMoveQuestion = (qIndex, direction) => {
    const newQuestions = [...questions];
    const newIndex = qIndex + direction;
    if (newIndex < 0 || newIndex >= newQuestions.length) return;
    [newQuestions[qIndex], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[qIndex]];
    newQuestions[qIndex].orderIndex = qIndex;
    newQuestions[newIndex].orderIndex = newIndex;
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[qIndex];
    if (question.type !== "Multiple Choice") return;
    question.options.push({ text: "" });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[qIndex];
    if (question.type !== "Multiple Choice") return;
    question.options.splice(oIndex, 1);
    if (question.correctIndex >= oIndex) {
      question.correctIndex = question.options.length > 0 ? 0 : null;
    }
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].text = value;
    setQuestions(newQuestions);
    autoResize(textareaRefs.current[`question-${qIndex}`]);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    const question = newQuestions[qIndex];
    if (question.type !== "Multiple Choice") return;
    question.options[oIndex].text = value;
    setQuestions(newQuestions);
    autoResize(textareaRefs.current[`option-${qIndex}-${oIndex}`]);
  };

  const handleExpectedAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    const question = newQuestions[qIndex];
    if (question.type !== "Answer") return;
    question.expectedAnswer = value;
    setQuestions(newQuestions);
    autoResize(textareaRefs.current[`answer-correct-${qIndex}`]);
  };

  const handleClearActivityName = () => {
    setActivityName("");
    handleValidation(); 
  };

  const handleClearExpectedAnswer = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].expectedAnswer = "";
    setQuestions(newQuestions);
    handleValidation(); 
  };

  const handlePointsChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].points = value;
    setQuestions(newQuestions);
  };

  const handleCorrectIndexChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctIndex = oIndex;
    setQuestions(newQuestions);
  };

  const removeQuestionImage = (qIndex) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIndex].image = null;
      newQuestions[qIndex].imageDimensions = null;
      return newQuestions;
    });
    setOpenDropdownIndex(null);
  };

  const changeQuestionImage = (qIndex) => {
    openImageModal(qIndex, 'question');
    setOpenDropdownIndex(null);
  };

  const removeOptionImage = (qIndex, oIndex) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIndex].options[oIndex].image = null;
      newQuestions[qIndex].options[oIndex].imageDimensions = null;
      return newQuestions;
    });
  };

  const toggleDropdown = (qIndex) => {
    setOpenDropdownIndex((prev) => (prev === qIndex ? null : qIndex));
  };

  const toggleResize = (qIndex) => {
    setActiveResizeIndex((prev) => (prev === qIndex ? null : qIndex));
  };

  const handleValidateQuestionSettings = (qIndex) => {
    const question = questions[qIndex];
    const errors = {};
    if (!question.points || question.points === "" || isNaN(question.points) || Number(question.points) < 0) {
      errors.points = `Points are required for Question ${qIndex + 1}.`;
    }
    if (question.type === "Multiple Choice" && (question.correctIndex === null || question.correctIndex === undefined)) {
      errors.correctAnswer = `A correct answer is required for Question ${qIndex + 1}.`;
    }
    if (question.type === "Answer" && !question.expectedAnswer?.trim()) {
      errors.correctAnswer = `An expected answer is required for Question ${qIndex + 1}.`;
    }
    setQuestionValidationStatus((prev) => ({
      ...prev,
      [qIndex]: Object.keys(errors).length > 0,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      questionErrors: {
        ...prev.questionErrors,
        [qIndex]: errors,
      },
    }));
    return Object.keys(errors).length > 0;
  };

  const renderQuestionBuilder = (question, qIndex) => {
    const hasValidationError = questionValidationStatus[qIndex] && (validationErrors.questionErrors?.[qIndex]?.correctAnswer || validationErrors.questionErrors?.[qIndex]?.points);

    if (question.type === "Multiple Choice") {
      return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 px-4">
          <div className="w-full border border-gray-300 p-4 rounded-xl shadow-sm bg-white relative">
            {!openQuestionSettings.has(`${qIndex}`) && (
              <>
                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    onClick={() => handleCopyQuestion(qIndex)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Duplicate Question"
                  >
                    <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, -1)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Move Up"
                  >
                    <img src={upIcon} alt="Up" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, 1)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Move Down"
                  >
                    <img src={downIcon} alt="Down" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="text-red-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Delete Question"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>

                <label className="block text-sm text-gray-500 mb-1">
                  Question {qIndex + 1} (Multiple Choice)
                </label>
                <div className="flex items-start gap-2">
                  <textarea
                    ref={(el) => (textareaRefs.current[`question-${qIndex}`] = el)}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Question"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:border-blue-300 mb-3 resize-none overflow-hidden ${
                      validationErrors.questionErrors?.[qIndex]?.text ? "border-red-500" : "border-gray-300"
                    }`}
                    rows="1"
                    onInput={(e) => autoResize(e.target)}
                  />
                  <button
                    onClick={() => openImageModal(qIndex, 'question')}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer mt-2"
                    title="Add Image"
                  >
                    <img src={imageIcon} alt="Add Image" className="w-6 h-6" />
                  </button>
                </div>
                {validationErrors.questionErrors?.[qIndex]?.text && (
                  <p className="text-red-500 text-sm mb-2">{validationErrors.questionErrors[qIndex].text}</p>
                )}
                {question.image && (
                  <div
                    className={`mt-4 mb-6 relative group ${activeResizeIndex === qIndex ? 'border-2 border-blue-500' : ''}`}
                    ref={(el) => (imageContainerRefs.current[qIndex] = el)}
                    style={{
                      width: question.imageDimensions?.width ? `${question.imageDimensions.width}px` : '100%',
                      height: question.imageDimensions?.height ? `${question.imageDimensions.height}px` : 'auto',
                      maxWidth: '100%',
                      maxHeight: '450px',
                      minWidth: '50px',
                      minHeight: '50px',
                      resize: activeResizeIndex === qIndex ? 'both' : 'none',
                      overflow: 'hidden',
                    }}
                    onClick={() => toggleResize(qIndex)}
                  >
                    <img
                      src={question.image}
                      alt="Question image"
                      className="w-full h-full object-contain cursor-pointer"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(qIndex);
                      }}
                      className="absolute top-0 right-0 p-1 hidden group-hover:block"
                    >
                      <img src={moreOptionsIcon} alt="More options" className="w-5 h-5" />
                    </button>
                    {openDropdownIndex === qIndex && (
                      <div className="absolute top-0 right-0 mt-8 bg-white shadow-lg rounded-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeQuestionImage(qIndex);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Change Image
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestionImage(qIndex);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="group flex items-center gap-2 mb-2">
                    <input type="radio" disabled className="accent-blue-500" />
                    <div className="flex-1 relative">
                      <textarea
                        ref={(el) => (textareaRefs.current[`option-${qIndex}-${oIndex}`] = el)}
                        value={option.text}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:border-blue-300 resize-none overflow-hidden"
                        rows="1"
                        onInput={(e) => autoResize(e.target)}
                      />
                      <button
                        onClick={() => openImageModal(qIndex, 'option', oIndex)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:opacity-70 transition-opacity cursor-pointer hidden group-hover:block"
                        title="Add Image"
                      >
                        <img src={imageIcon} alt="Add Image" className="w-5 h-5" />
                      </button>
                    </div>
                    {question.options.length > 1 && (
                      <button
                        onClick={() => handleRemoveOption(qIndex, oIndex)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                    {option.image && (
                      <div className="relative ml-2 group">
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            border: '1px solid #d1d5db',
                            padding: '4px',
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            borderRadius: '4px',
                          }}
                        >
                          <img
                            src={option.image}
                            alt={`Option ${oIndex + 1} image`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          onClick={() => removeOptionImage(qIndex, oIndex)}
                          className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500 hidden group-hover:block shadow"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => handleAddOption(qIndex)}
                  className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                >
                  + Add Option
                </button>

                <hr className="mt-4 border-gray-300" />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSettings(qIndex)}
                    className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                  >
                    Set Correct Answer and Points
                  </button>
                  {hasValidationError && (
                    <img src={warningIcon} alt="Validation Error" className="w-4 h-4 text-red-500" />
                  )}
                </div>
                {validationErrors.questionErrors?.[qIndex]?.points && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].points}</p>
                )}
              </>
            )}

            {openQuestionSettings.has(`${qIndex}`) && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">Settings</h4>
                <p className="mb-4">
                  <strong>Question:</strong>{" "}
                  <span className="inline-block">{question.text || "No question text entered"}</span>
                </p>
                {question.image && (
                  <img src={question.image} alt="Question image" className="mt-2 max-w-xs mb-4" />
                )}

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1">Correct Answer</label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        checked={question.correctIndex === oIndex}
                        onChange={() => handleCorrectIndexChange(qIndex, oIndex)}
                        className="accent-blue-500"
                      />
                      <span className="text-sm">{option.text || `Option ${oIndex + 1}`}</span>
                      {option.image && (
                        <img src={option.image} alt={`Option ${oIndex + 1} image`} className="ml-2 w-16 h-16 object-contain" />
                      )}
                    </div>
                  ))}
                  {validationErrors.questionErrors?.[qIndex]?.correctAnswer && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].correctAnswer}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1">Points</label>
                  <input
                    type="number"
                    min="0"
                    value={question.points}
                    onChange={(e) => handlePointsChange(qIndex, e.target.value)}
                    placeholder="Points"
                    className={`w-24 px-3 py-2 border rounded-lg focus:border-blue-300 ${
                      validationErrors.questionErrors?.[qIndex]?.points ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {validationErrors.questionErrors?.[qIndex]?.points && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].points}</p>
                  )}
                </div>

                <hr className="mt-4 border-gray-300" />

                <button
                  onClick={() => {
                    const hasError = handleValidateQuestionSettings(qIndex);
                    if (!hasError) {
                      toggleSettings(qIndex);
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      );
    } else if (question.type === "Answer") {
      return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 px-4">
          <div className="w-full border border-gray-300 p-4 rounded-xl shadow-sm bg-white relative">
            {!openQuestionSettings.has(`${qIndex}`) && (
              <>
                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    onClick={() => handleCopyQuestion(qIndex)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Duplicate Question"
                  >
                    <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, -1)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Move Up"
                  >
                    <img src={upIcon} alt="Up" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, 1)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Move Down"
                  >
                    <img src={downIcon} alt="Down" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="text-red-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Delete Question"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>

                <label className="block text-sm text-gray-500 mb-1">
                  Question {qIndex + 1} (Answer)
                </label>
                <div className="flex items-start gap-2">
                  <textarea
                    ref={(el) => (textareaRefs.current[`question-${qIndex}`] = el)}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Question"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:border-blue-300 mb-3 resize-none overflow-hidden ${
                      validationErrors.questionErrors?.[qIndex]?.text ? "border-red-500" : "border-gray-300"
                    }`}
                    rows="1"
                    onInput={(e) => autoResize(e.target)}
                  />
                  <button
                    onClick={() => openImageModal(qIndex, 'question')}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer mt-2"
                    title="Add Image"
                  >
                    <img src={imageIcon} alt="Add Image" className="w-6 h-6" />
                  </button>
                </div>
                {validationErrors.questionErrors?.[qIndex]?.text && (
                  <p className="text-red-500 text-sm mb-2">{validationErrors.questionErrors[qIndex].text}</p>
                )}
                {question.image && (
                  <div
                    className={`mt-4 mb-6 relative group ${activeResizeIndex === qIndex ? 'border-2 border-blue-500' : ''}`}
                    ref={(el) => (imageContainerRefs.current[qIndex] = el)}
                    style={{
                      width: question.imageDimensions?.width ? `${question.imageDimensions.width}px` : '100%',
                      height: question.imageDimensions?.height ? `${question.imageDimensions.height}px` : 'auto',
                      maxWidth: '100%',
                      maxHeight: '450px',
                      minWidth: '50px',
                      minHeight: '50px',
                      resize: activeResizeIndex === qIndex ? 'both' : 'none',
                      overflow: 'hidden',
                    }}
                    onClick={() => toggleResize(qIndex)}
                  >
                    <img
                      src={question.image}
                      alt="Question image"
                      className="w-full h-full object-contain cursor-pointer"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(qIndex);
                      }}
                      className="absolute top-0 right-0 p-1 hidden group-hover:block"
                    >
                      <img src={moreOptionsIcon} alt="More options" className="w-5 h-5" />
                    </button>
                    {openDropdownIndex === qIndex && (
                      <div className="absolute top-0 right-0 mt-8 bg-white shadow-lg rounded-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeQuestionImage(qIndex);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Change Image
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestionImage(qIndex);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <hr className="mt-4 border-gray-300" />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSettings(qIndex)}
                    className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                  >
                    Set Expected Answer and Points
                  </button>
                  {hasValidationError && (
                    <img src={warningIcon} alt="Validation Error" className="w-4 h-4 text-red-500" />
                  )}
                </div>
                {validationErrors.questionErrors?.[qIndex]?.points && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].points}</p>
                )}
              </>
            )}

            {openQuestionSettings.has(`${qIndex}`) && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">Settings</h4>
                <p className="mb-4">
                  <strong>Question:</strong>{" "}
                  <span className="inline-block">{question.text || "No question text entered"}</span>
                </p>
                {question.image && (
                  <img src={question.image} alt="Question image" className="mt-2 max-w-xs mb-4" />
                )}

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1">Expected Answer</label>
                  <div className="relative">
                    <textarea
                      ref={(el) => (textareaRefs.current[`answer-correct-${qIndex}`] = el)}
                      value={question.expectedAnswer}
                      onChange={(e) => handleExpectedAnswerChange(qIndex, e.target.value)}
                      placeholder="Enter expected answer"
                      className={`w-full px-3 py-2 border rounded-lg focus:border-blue-300 resize-none overflow-hidden ${
                        validationErrors.questionErrors?.[qIndex]?.correctAnswer ? "border-red-500" : "border-gray-300"
                      }`}
                      rows="1"
                      onInput={(e) => autoResize(e.target)}
                    />
                    <button
                      onClick={() => handleClearExpectedAnswer(qIndex)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  {validationErrors.questionErrors?.[qIndex]?.correctAnswer && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].correctAnswer}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1">Points</label>
                  <input
                    type="number"
                    min="0"
                    value={question.points}
                    onChange={(e) => handlePointsChange(qIndex, e.target.value)}
                    placeholder="Points"
                    className={`w-24 px-3 py-2 border rounded-lg focus:border-blue-300 ${
                      validationErrors.questionErrors?.[qIndex]?.points ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {validationErrors.questionErrors?.[qIndex]?.points && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].points}</p>
                  )}
                </div>

                <hr className="mt-4 border-gray-300" />

                <button
                  onClick={() => {
                    const hasError = handleValidateQuestionSettings(qIndex);
                    if (!hasError) {
                      toggleSettings(qIndex);
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      );
    } else if (question.type === "File Upload") {
      return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 px-4">
          <div className="w-full border border-gray-300 p-4 rounded-xl shadow-sm bg-white relative">
            {!openQuestionSettings.has(`${qIndex}`) && (
              <>
                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    onClick={() => handleCopyQuestion(qIndex)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Duplicate Question"
                  >
                    <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, -1)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Move Up"
                  >
                    <img src={upIcon} alt="Up" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, 1)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Move Down"
                  >
                    <img src={downIcon} alt="Down" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="text-red-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Delete Question"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>

                <label className="block text-sm text-gray-500 mb-1">
                  Upload Prompt {qIndex + 1} (File Upload)
                </label>
                <div className="flex items-start gap-2">
                  <textarea
                    ref={(el) => (textareaRefs.current[`question-${qIndex}`] = el)}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Enter upload instructions or question"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:border-blue-300 mb-3 resize-none overflow-hidden ${
                      validationErrors.questionErrors?.[qIndex]?.text ? "border-red-500" : "border-gray-300"
                    }`}
                    rows="1"
                    onInput={(e) => autoResize(e.target)}
                  />
                  <button
                    onClick={() => openImageModal(qIndex, 'question')}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer mt-2"
                    title="Add Image"
                  >
                    <img src={imageIcon} alt="Add Image" className="w-6 h-6" />
                  </button>
                </div>
                {validationErrors.questionErrors?.[qIndex]?.text && (
                  <p className="text-red-500 text-sm mb-2">{validationErrors.questionErrors[qIndex].text}</p>
                )}
                {question.image && (
                  <div
                    className={`mt-4 mb-6 relative group ${activeResizeIndex === qIndex ? 'border-2 border-blue-500' : ''}`}
                    ref={(el) => (imageContainerRefs.current[qIndex] = el)}
                    style={{
                      width: question.imageDimensions?.width ? `${question.imageDimensions.width}px` : '100%',
                      height: question.imageDimensions?.height ? `${question.imageDimensions.height}px` : 'auto',
                      maxWidth: '100%',
                      maxHeight: '450px',
                      minWidth: '50px',
                      minHeight: '50px',
                      resize: activeResizeIndex === qIndex ? 'both' : 'none',
                      overflow: 'hidden',
                    }}
                    onClick={() => toggleResize(qIndex)}
                  >
                    <img
                      src={question.image}
                      alt="Question image"
                      className="w-full h-full object-contain cursor-pointer"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(qIndex);
                      }}
                      className="absolute top-0 right-0 p-1 hidden group-hover:block"
                    >
                      <img src={moreOptionsIcon} alt="More options" className="w-5 h-5" />
                    </button>
                    {openDropdownIndex === qIndex && (
                      <div className="absolute top-0 right-0 mt-8 bg-white shadow-lg rounded-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeQuestionImage(qIndex);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Change Image
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestionImage(qIndex);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <hr className="mt-4 border-gray-300" />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSettings(qIndex)}
                    className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                  >
                    Set Points
                  </button>
                  {hasValidationError && (
                    <img src={warningIcon} alt="Validation Error" className="w-4 h-4 text-red-500" />
                  )}
                </div>
                {validationErrors.questionErrors?.[qIndex]?.points && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].points}</p>
                )}
              </>
            )}

            {openQuestionSettings.has(`${qIndex}`) && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">Settings</h4>
                <p className="mb-4">
                  <strong>Question:</strong>{" "}
                  <span className="inline-block">{question.text || "No question text entered"}</span>
                </p>
                {question.image && (
                  <img src={question.image} alt="Question image" className="mt-2 max-w-xs mb-4" />
                )}

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1">Points</label>
                  <input
                    type="number"
                    min="0"
                    value={question.points}
                    onChange={(e) => handlePointsChange(qIndex, e.target.value)}
                    placeholder="Points"
                    className={`w-24 px-3 py-2 border rounded-lg focus:border-blue-300 ${
                      validationErrors.questionErrors?.[qIndex]?.points ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {validationErrors.questionErrors?.[qIndex]?.points && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].points}</p>
                  )}
                </div>

                <hr className="mt-4 border-gray-300" />

                <button
                  onClick={() => {
                    const hasError = handleValidateQuestionSettings(qIndex);
                    if (!hasError) {
                      toggleSettings(qIndex);
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      );
    } else if (question.type === "Write") {
      return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 px-4">
          <div className="w-full border border-gray-300 p-4 rounded-xl shadow-sm bg-white relative">
            {!openQuestionSettings.has(`${qIndex}`) && (
              <>
                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    onClick={() => handleCopyQuestion(qIndex)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Duplicate Question"
                  >
                    <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, -1)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Move Up"
                  >
                    <img src={upIcon} alt="Up" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, 1)}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Move Down"
                  >
                    <img src={downIcon} alt="Down" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="text-red-500 hover:opacity-70 transition-opacity cursor-pointer"
                    title="Delete Question"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>

                <label className="block text-sm text-gray-500 mb-1">
                  Question {qIndex + 1} (Write)
                </label>
                <div className="flex items-start gap-2">
                  <textarea
                    ref={(el) => (textareaRefs.current[`question-${qIndex}`] = el)}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Enter question"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:border-blue-300 mb-3 resize-none overflow-hidden ${
                      validationErrors.questionErrors?.[qIndex]?.text ? "border-red-500" : "border-gray-300"
                    }`}
                    rows="1"
                    onInput={(e) => autoResize(e.target)}
                  />
                  <button
                    onClick={() => openImageModal(qIndex, 'question')}
                    className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer mt-2"
                    title="Add Image"
                  >
                    <img src={imageIcon} alt="Add Image" className="w-6 h-6" />
                  </button>
                </div>
                {validationErrors.questionErrors?.[qIndex]?.text && (
                  <p className="text-red-500 text-sm mb-2">{validationErrors.questionErrors[qIndex].text}</p>
                )}
                {question.image && (
                  <div
                    className={`mt-4 mb-6 relative group ${activeResizeIndex === qIndex ? 'border-2 border-blue-500' : ''}`}
                    ref={(el) => (imageContainerRefs.current[qIndex] = el)}
                    style={{
                      width: question.imageDimensions?.width ? `${question.imageDimensions.width}px` : '100%',
                      height: question.imageDimensions?.height ? `${question.imageDimensions.height}px` : 'auto',
                      maxWidth: '100%',
                      maxHeight: '450px',
                      minWidth: '50px',
                      minHeight: '50px',
                      resize: activeResizeIndex === qIndex ? 'both' : 'none',
                      overflow: 'hidden',
                    }}
                    onClick={() => toggleResize(qIndex)}
                  >
                    <img
                      src={question.image}
                      alt="Question image"
                      className="w-full h-full object-contain cursor-pointer"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(qIndex);
                      }}
                      className="absolute top-0 right-0 p-1 hidden group-hover:block"
                    >
                      <img src={moreOptionsIcon} alt="More options" className="w-5 h-5" />
                    </button>
                    {openDropdownIndex === qIndex && (
                      <div className="absolute top-0 right-0 mt-8 bg-white shadow-lg rounded-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeQuestionImage(qIndex);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Change Image
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestionImage(qIndex);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <hr className="mt-4 border-gray-300" />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSettings(qIndex)}
                    className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                  >
                    Set Points
                  </button>
                  {hasValidationError && (
                    <img src={warningIcon} alt="Validation Error" className="w-4 h-4 text-red-500" />
                  )}
                </div>
                {validationErrors.questionErrors?.[qIndex]?.points && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].points}</p>
                )}
              </>
            )}

            {openQuestionSettings.has(`${qIndex}`) && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">Settings</h4>
                <p className="mb-4">
                  <strong>Question:</strong>{" "}
                  <span className="inline-block">{question.text || "No question text entered"}</span>
                </p>
                {question.image && (
                  <img src={question.image} alt="Question image" className="mt-2 max-w-xs mb-4" />
                )}

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1">Points</label>
                  <input
                    type="number"
                    min="0"
                    value={question.points}
                    onChange={(e) => handlePointsChange(qIndex, e.target.value)}
                    placeholder="Points"
                    className={`w-24 px-3 py-2 border rounded-lg focus:border-blue-300 ${
                      validationErrors.questionErrors?.[qIndex]?.points ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {validationErrors.questionErrors?.[qIndex]?.points && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.questionErrors[qIndex].points}</p>
                  )}
                </div>

                <hr className="mt-4 border-gray-300" />

                <button
                  onClick={() => {
                    const hasError = handleValidateQuestionSettings(qIndex);
                    if (!hasError) {
                      toggleSettings(qIndex);
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-gray-800 px-4">
      <style>
        {`
          .progress-line {
            width: 100%;
            height: 4px;
            background: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
            position: relative;
          }
          .progress-line::before {
            content: '';
            position: absolute;
            width: 50%;
            height: 100%;
            background: #3b82f6;
            animation: moveProgress 1.5s linear infinite;
          }
          @keyframes moveProgress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>

      <div className="w-full max-w-3xl mx-auto mb-4 px-4">
        <label className="block text-gray-700 text-base mb-1">{quizTypeLabel} Name</label>
        <div className="relative">
          <textarea
            ref={(el) => (textareaRefs.current[`activity-name`] = el)}
            value={activityName}
            onChange={(e) => {
              setActivityName(e.target.value);
              autoResize(e.target);
            }}
            placeholder={`Enter your ${quizTypeLabel.toLowerCase()} name...`}
            className={`w-full px-4 py-2 pr-8 border rounded-xl focus:border-blue-300 focus:outline-none resize-none overflow-hidden ${
              validationErrors.activityName ? "border-red-500" : "border-gray-300"
            }`}
            rows="1"
            onInput={(e) => autoResize(e.target)}
          />
          <button
            onClick={handleClearActivityName}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
        {validationErrors.activityName && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.activityName}</p>
        )}
      </div>

      {validationErrors.questions && (
        <p className="text-red-500 text-sm mb-4">{validationErrors.questions}</p>
      )}

      {questions.map((question, qIndex) => (
        <div key={qIndex} className="w-full max-w-3xl mx-auto mb-8 px-4">
          {renderQuestionBuilder(question, qIndex)}
        </div>
      ))}

      {!showSelector && questions.length > 0 && (
        <div className="relative flex items-center mx-auto">
          <button
            onClick={() => setShowSelector(true)}
            className="px-4 py-2 mt-4 text-blue-500 hover:underline cursor-pointer"
          >
            Add Another Question Type
          </button>
        </div>
      )}
      {showSelector && (
        <div ref={selectorRef} className="w-full max-w-3xl mx-auto mb-6 px-4">
          <div className="relative flex items-center justify-center mb-1">
            <label className="block text-gray-700 text-base text-center">
              {questions.length === 0 ? "Select" : "Add"} Question Type
            </label>
            {questions.length > 0 && (
              <button
                onClick={() => setShowSelector(false)}
                className="absolute right-0 text-red-500 hover:text-red-700 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { type: "Multiple Choice", icon: multipleChoiceIcon },
              { type: "Answer", icon: answerIcon },
              { type: "File Upload", icon: fileUploadIcon },
              { type: "Write", icon: writeIcon },
            ].map(({ type, icon }) => (
              <div
                key={type}
                onClick={() => handleAddQuestion(type)}
                className="cursor-pointer border border-gray-300 rounded-xl py-4 text-center transition bg-white hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <img src={icon} alt={type} className="w-5 h-5" />
                {type}
              </div>
            ))}
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 flex flex-col">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Insert Image</h3>
              <button
                onClick={closeImageModal}
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
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              {isUploading ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Uploading...</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: '50%' }}
                    ></div>
                  </div>
                  <p className="text-gray-600">50% uploaded</p>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-6 py-2 bg-blue-300 text-white rounded-xl hover:bg-blue-400"
                  >
                    Browse
                  </button>
                </>
              )}
              {validationErrors.imageError && (
                <p className="text-red-500 text-sm mt-4">{validationErrors.imageError}</p>
              )}
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={closeImageModal}
                className="px-5 py-2 bg-gray-200 rounded-xl text-sm text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}