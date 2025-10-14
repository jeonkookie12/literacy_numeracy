import { useState, useRef, useEffect } from "react";
import copyIcon from "../../assets/admin/copy.svg";
import deleteIcon from "../../assets/admin/delete.svg";
import upIcon from "../../assets/admin/arrow-up.svg";
import downIcon from "../../assets/admin/arrow-down.svg";
import imageIcon from "../../assets/admin/image.svg"; // Replace with your image icon path

export default function QuizBuilder({ quizTypeLabel }) {
  const [activityName, setActivityName] = useState("");
  const [sections, setSections] = useState([]);
  const [showSelector, setShowSelector] = useState(true);
  const [openQuestionSettings, setOpenQuestionSettings] = useState(new Set());
  const [showImageModal, setShowImageModal] = useState(null); // Tracks which question's modal is open (sIndex-qIndex)
  const textareaRefs = useRef({});
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  const autoResize = (element) => {
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  // Handle textarea resize on mount and update
  useEffect(() => {
    Object.values(textareaRefs.current).forEach(autoResize);
  }, [sections]);

  const toggleSettings = (sIndex, qIndex) => {
    const key = `${sIndex}-${qIndex}`;
    setOpenQuestionSettings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const openImageModal = (sIndex, qIndex) => {
    setShowImageModal(`${sIndex}-${qIndex}`);
  };

  const closeImageModal = () => {
    setShowImageModal(null);
  };

  const handleImageSelect = () => {
    // Simulate image selection handling (no storage/display as per requirement)
    setTimeout(() => {
      closeImageModal();
    }, 2000); // Close modal after 2 seconds
  };

  // Add New Section
  const handleAddSection = (type) => {
    let newQuestion = {};
    if (type === "Multiple Choice") {
      newQuestion = { text: "", options: [{ text: "" }], correctIndex: null, points: "" };
    } else if (type === "Answer") {
      newQuestion = { text: "", expectedAnswer: "", points: "" };
    } else if (type === "File Upload") {
      newQuestion = { text: "", points: "" };
    }
    setSections([...sections, { type, questions: [newQuestion] }]);
    setShowSelector(false);
  };

  // Add Question to Section
  const handleAddQuestion = (sIndex) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    let newQuestion = {};
    if (section.type === "Multiple Choice") {
      newQuestion = { text: "", options: [{ text: "" }], correctIndex: null, points: "" };
    } else if (section.type === "Answer") {
      newQuestion = { text: "", expectedAnswer: "", points: "" };
    } else if (section.type === "File Upload") {
      newQuestion = { text: "", points: "" };
    }
    section.questions.push(newQuestion);
    setSections(newSections);
  };

  // Copy Question in Section
  const handleCopyQuestion = (sIndex, qIndex) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    const copied = JSON.parse(JSON.stringify(section.questions[qIndex]));
    section.questions.splice(qIndex + 1, 0, copied);
    setSections(newSections);
  };

  // Delete Question in Section
  const handleDeleteQuestion = (sIndex, qIndex) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    section.questions.splice(qIndex, 1);
    if (section.questions.length === 0) {
      newSections.splice(sIndex, 1);
      if (newSections.length === 0) {
        setShowSelector(true);
      }
    }
    setSections(newSections);
  };

  // Move Question in Section
  const handleMoveQuestion = (sIndex, qIndex, direction) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    const newIndex = qIndex + direction;
    if (newIndex < 0 || newIndex >= section.questions.length) return;
    const [moved] = section.questions.splice(qIndex, 1);
    section.questions.splice(newIndex, 0, moved);
    setSections(newSections);
  };

  // Option Handling for MC
  const handleAddOption = (sIndex, qIndex) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    if (section.type !== "Multiple Choice") return;
    section.questions[qIndex].options.push({ text: "" });
    setSections(newSections);
  };

  const handleRemoveOption = (sIndex, qIndex, oIndex) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    if (section.type !== "Multiple Choice") return;
    section.questions[qIndex].options.splice(oIndex, 1);
    setSections(newSections);
  };

  // Clear Handlers
  const handleClearOption = (sIndex, qIndex, oIndex) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    if (section.type !== "Multiple Choice") return;
    section.questions[qIndex].options[oIndex].text = "";
    setSections(newSections);
  };

  const handleClearExpectedAnswer = (sIndex, qIndex) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    if (section.type !== "Answer") return;
    section.questions[qIndex].expectedAnswer = "";
    setSections(newSections);
  };

  // Change Handlers
  const handleQuestionChange = (sIndex, qIndex, value) => {
    const newSections = [...sections];
    newSections[sIndex].questions[qIndex].text = value;
    setSections(newSections);
    autoResize(textareaRefs.current[`question-${sIndex}-${qIndex}`]);
  };

  const handleOptionChange = (sIndex, qIndex, oIndex, value) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    if (section.type !== "Multiple Choice") return;
    section.questions[qIndex].options[oIndex].text = value;
    setSections(newSections);
    autoResize(textareaRefs.current[`option-${sIndex}-${qIndex}-${oIndex}`]);
  };

  const handleExpectedAnswerChange = (sIndex, qIndex, value) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    if (section.type !== "Answer") return;
    section.questions[qIndex].expectedAnswer = value;
    setSections(newSections);
    autoResize(textareaRefs.current[`answer-${sIndex}-${qIndex}`]);
  };

  const handlePointsChange = (sIndex, qIndex, value) => {
    const newSections = [...sections];
    newSections[sIndex].questions[qIndex].points = value;
    setSections(newSections);
  };

  const handleCorrectIndexChange = (sIndex, qIndex, oIndex) => {
    const newSections = [...sections];
    newSections[sIndex].questions[qIndex].correctIndex = oIndex;
    setSections(newSections);
  };

  // Render Builder for Section
  const renderSectionBuilder = (section, sIndex) => {
    if (section.type === "Multiple Choice") {
      return (
        <div className="w-full flex flex-col gap-4 items-center">
          {section.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="w-full max-w-lg border p-4 rounded-xl shadow-sm bg-white relative"
            >
              {!openQuestionSettings.has(`${sIndex}-${qIndex}`) && (
                <>
                  <div className="absolute right-3 top-3 flex gap-2">
                    <button
                      onClick={() => openImageModal(sIndex, qIndex)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Add Image"
                    >
                      <img src={imageIcon} alt="Add Image" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCopyQuestion(sIndex, qIndex)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Duplicate Question"
                    >
                      <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(sIndex, qIndex, -1)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Move Up"
                    >
                      <img src={upIcon} alt="Up" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(sIndex, qIndex, 1)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Move Down"
                    >
                      <img src={downIcon} alt="Down" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(sIndex, qIndex)}
                      className="text-red-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Delete Question"
                    >
                      <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                    </button>
                  </div>

                  <label className="block text-sm text-gray-500 mb-1">
                    Question {qIndex + 1}
                  </label>
                  <textarea
                    ref={(el) => (textareaRefs.current[`question-${sIndex}-${qIndex}`] = el)}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(sIndex, qIndex, e.target.value)}
                    placeholder="Question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300 mb-3 resize-none overflow-hidden"
                    rows="1"
                    onInput={(e) => autoResize(e.target)}
                  />

                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2 mb-2 relative">
                      <input type="radio" disabled className="accent-blue-500" />
                      <div className="flex-1 relative">
                        <textarea
                          ref={(el) => (textareaRefs.current[`option-${sIndex}-${qIndex}-${oIndex}`] = el)}
                          value={option.text}
                          onChange={(e) => handleOptionChange(sIndex, qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="w-full px-3 py-1 pr-8 border border-gray-300 rounded-lg focus:border-blue-300 resize-none overflow-hidden"
                          rows="1"
                          onInput={(e) => autoResize(e.target)}
                        />
                        <button
                          onClick={() => handleClearOption(sIndex, qIndex, oIndex)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      {question.options.length > 1 && (
                        <button
                          onClick={() => handleRemoveOption(sIndex, qIndex, oIndex)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddOption(sIndex, qIndex)}
                    className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                  >
                    + Add Option
                  </button>

                  <hr className="mt-4 border-gray-300" />

                  <button
                    onClick={() => toggleSettings(sIndex, qIndex)}
                    className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                  >
                    Set Correct Answer and Points
                  </button>
                </>
              )}

              {openQuestionSettings.has(`${sIndex}-${qIndex}`) && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-2">Correct Answer</h4>
                  <p className="mb-4">
                    <strong>Question:</strong>{" "}
                    <span className="inline-block">{question.text || "No question text entered"}</span>
                  </p>

                  {section.type === "Multiple Choice" && (
                    <div className="mb-4">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center mb-2">
                          <input
                            type="radio"
                            id={`correct-${sIndex}-${qIndex}-${oIndex}`}
                            name={`correct-${sIndex}-${qIndex}`}
                            checked={question.correctIndex === oIndex}
                            onChange={() => handleCorrectIndexChange(sIndex, qIndex, oIndex)}
                            className="accent-blue-500 mr-2"
                          />
                          <label
                            htmlFor={`correct-${sIndex}-${qIndex}-${oIndex}`}
                            className="flex-1"
                          >
                            <textarea
                              ref={(el) =>
                                (textareaRefs.current[`option-correct-${sIndex}-${qIndex}-${oIndex}`] = el)
                              }
                              value={option.text || `Option ${oIndex + 1}`}
                              readOnly
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg bg-gray-100 resize-none overflow-hidden"
                              rows="1"
                              onInput={(e) => autoResize(e.target)}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm text-gray-500 mb-1">Points</label>
                    <input
                      type="number"
                      min="0"
                      value={question.points}
                      onChange={(e) => handlePointsChange(sIndex, qIndex, e.target.value)}
                      placeholder="Points"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300"
                    />
                  </div>

                  <hr className="mt-4 border-gray-300" />

                  <button
                    onClick={() => toggleSettings(sIndex, qIndex)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => handleAddQuestion(sIndex)}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            + Add Question
          </button>
        </div>
      );
    } else if (section.type === "Answer") {
      return (
        <div className="w-full flex flex-col gap-4 items-center">
          {section.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="w-full max-w-lg border p-4 rounded-xl shadow-sm bg-white relative"
            >
              {!openQuestionSettings.has(`${sIndex}-${qIndex}`) && (
                <>
                  <div className="absolute right-3 top-3 flex gap-2">
                    <button
                      onClick={() => openImageModal(sIndex, qIndex)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Add Image"
                    >
                      <img src={imageIcon} alt="Add Image" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCopyQuestion(sIndex, qIndex)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Duplicate Question"
                    >
                      <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(sIndex, qIndex, -1)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Move Up"
                    >
                      <img src={upIcon} alt="Up" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(sIndex, qIndex, 1)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Move Down"
                    >
                      <img src={downIcon} alt="Down" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(sIndex, qIndex)}
                      className="text-red-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Delete Question"
                    >
                      <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                    </button>
                  </div>

                  <label className="block text-sm text-gray-500 mb-1">
                    Question {qIndex + 1}
                  </label>
                  <textarea
                    ref={(el) => (textareaRefs.current[`question-${sIndex}-${qIndex}`] = el)}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(sIndex, qIndex, e.target.value)}
                    placeholder="Question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300 mb-3 resize-none overflow-hidden"
                    rows="1"
                    onInput={(e) => autoResize(e.target)}
                  />

                  <label className="block text-sm text-gray-500 mb-1">
                    Expected Answer (optional)
                  </label>
                  <div className="relative">
                    <textarea
                      ref={(el) => (textareaRefs.current[`answer-${sIndex}-${qIndex}`] = el)}
                      value={question.expectedAnswer}
                      onChange={(e) => handleExpectedAnswerChange(sIndex, qIndex, e.target.value)}
                      placeholder="Expected Answer"
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:border-blue-300 mb-3 resize-none overflow-hidden"
                      rows="1"
                      onInput={(e) => autoResize(e.target)}
                    />
                    <button
                      onClick={() => handleClearExpectedAnswer(sIndex, qIndex)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <hr className="mt-4 border-gray-300" />

                  <button
                    onClick={() => toggleSettings(sIndex, qIndex)}
                    className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                  >
                    Set Correct Answer and Points
                  </button>
                </>
              )}

              {openQuestionSettings.has(`${sIndex}-${qIndex}`) && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-2">Correct Answer</h4>
                  <p className="mb-4">
                    <strong>Question:</strong>{" "}
                    <span className="inline-block">{question.text || "No question text entered"}</span>
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-500 mb-1">Correct Answer</label>
                    <div className="relative">
                      <textarea
                        ref={(el) => (textareaRefs.current[`answer-correct-${sIndex}-${qIndex}`] = el)}
                        value={question.expectedAnswer}
                        onChange={(e) => handleExpectedAnswerChange(sIndex, qIndex, e.target.value)}
                        placeholder="Expected Answer"
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:border-blue-300 resize-none overflow-hidden"
                        rows="1"
                        onInput={(e) => autoResize(e.target)}
                      />
                      <button
                        onClick={() => handleClearExpectedAnswer(sIndex, qIndex)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-500 mb-1">Points</label>
                    <input
                      type="number"
                      min="0"
                      value={question.points}
                      onChange={(e) => handlePointsChange(sIndex, qIndex, e.target.value)}
                      placeholder="Points"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300"
                    />
                  </div>

                  <hr className="mt-4 border-gray-300" />

                  <button
                    onClick={() => toggleSettings(sIndex, qIndex)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => handleAddQuestion(sIndex)}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            + Add Question
          </button>
        </div>
      );
    } else if (section.type === "File Upload") {
      return (
        <div className="w-full flex flex-col gap-4 items-center">
          {section.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="w-full max-w-lg border p-4 rounded-xl shadow-sm bg-white relative"
            >
              {!openQuestionSettings.has(`${sIndex}-${qIndex}`) && (
                <>
                  <div className="absolute right-3 top-3 flex gap-2">
                    <button
                      onClick={() => openImageModal(sIndex, qIndex)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Add Image"
                    >
                      <img src={imageIcon} alt="Add Image" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCopyQuestion(sIndex, qIndex)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Duplicate Question"
                    >
                      <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(sIndex, qIndex, -1)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Move Up"
                    >
                      <img src={upIcon} alt="Up" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(sIndex, qIndex, 1)}
                      className="text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Move Down"
                    >
                      <img src={downIcon} alt="Down" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(sIndex, qIndex)}
                      className="text-red-500 hover:opacity-70 transition-opacity cursor-pointer"
                      title="Delete Question"
                    >
                      <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                    </button>
                  </div>

                  <label className="block text-sm text-gray-500 mb-1">
                    Upload Prompt {qIndex + 1}
                  </label>
                  <textarea
                    ref={(el) => (textareaRefs.current[`question-${sIndex}-${qIndex}`] = el)}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(sIndex, qIndex, e.target.value)}
                    placeholder="Enter upload instructions or question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300 mb-3 resize-none overflow-hidden"
                    rows="1"
                    onInput={(e) => autoResize(e.target)}
                  />

                  <hr className="mt-4 border-gray-300" />

                  <button
                    onClick={() => toggleSettings(sIndex, qIndex)}
                    className="mt-2 text-blue-500 text-sm hover:underline cursor-pointer"
                  >
                    Set Correct Answer and Points
                  </button>
                </>
              )}

              {openQuestionSettings.has(`${sIndex}-${qIndex}`) && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-2">Correct Answer</h4>
                  <p className="mb-4">
                    <strong>Question:</strong>{" "}
                    <span className="inline-block">{question.text || "No question text entered"}</span>
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-500 mb-1">Points</label>
                    <input
                      type="number"
                      min="0"
                      value={question.points}
                      onChange={(e) => handlePointsChange(sIndex, qIndex, e.target.value)}
                      placeholder="Points"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300"
                    />
                  </div>

                  <hr className="mt-4 border-gray-300" />

                  <button
                    onClick={() => toggleSettings(sIndex, qIndex)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => handleAddQuestion(sIndex)}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            + Add Upload Prompt
          </button>
        </div>
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-gray-800">
      <h2 className="text-lg font-semibold mb-3">{quizTypeLabel}</h2>

      {/* ACTIVITY NAME */}
      <div className="w-full mb-4">
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
            className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-xl focus:border-blue-300 focus:outline-none resize-none overflow-hidden"
            rows="1"
            onInput={(e) => autoResize(e.target)}
          />
          <button
            onClick={() => setActivityName("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* QUIZ TYPE SELECTION */}
      {showSelector && (
        <div className="w-full mb-6">
          <label className="block text-gray-700 text-base mb-1">
            {sections.length === 0 ? "Select" : "Add"} Question Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Multiple Choice", "Answer", "File Upload"].map((type) => (
              <div
                key={type}
                onClick={() => handleAddSection(type)}
                className="cursor-pointer border rounded-xl py-4 text-center transition bg-white hover:bg-gray-100 border-gray-300"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTIONS */}
      {sections.map((section, sIndex) => (
        <div key={sIndex} className="w-full mb-8">
          <h3 className="text-md font-semibold mb-2">{section.type} Section</h3>
          {renderSectionBuilder(section, sIndex)}
        </div>
      ))}

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Insert Image</h3>
              <button
                onClick={closeImageModal}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <hr className="mb-4 border-gray-300" />
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageSelect}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
              >
                Browse
              </button>
            </div>
          </div>
        </div>
      )}

      {!showSelector && sections.length > 0 && (
        <button
          onClick={() => setShowSelector(true)}
          className="px-4 py-2 mt-4 text-blue-500 hover:underline cursor-pointer"
        >
          + Add Another Question Type
        </button>
      )}
    </div>
  );
}