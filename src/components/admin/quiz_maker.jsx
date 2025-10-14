import { useState } from "react";
import copyIcon from "../../assets/admin/copy.svg";
import deleteIcon from "../../assets/admin/delete.svg";
import upIcon from "../../assets/admin/arrow-up.svg";
import downIcon from "../../assets/admin/arrow-down.svg";

export default function QuizBuilder({ quizTypeLabel }) {
  const [activityName, setActivityName] = useState("");
  const [sections, setSections] = useState([]);

  // Add New Section
  const handleAddSection = (type) => {
    let newQuestions = [];
    if (type === "Multiple Choice") {
      newQuestions = [{ text: "", options: [{ text: "" }] }];
    } else if (type === "Answer") {
      newQuestions = [{ text: "", expectedAnswer: "" }];
    } else if (type === "File Upload") {
      newQuestions = [{ text: "" }];
    }
    setSections([...sections, { type, questions: newQuestions }]);
  };

  // Add Question to Section
  const handleAddQuestion = (sIndex) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    let newQuestion = {};
    if (section.type === "Multiple Choice") {
      newQuestion = { text: "", options: [{ text: "" }] };
    } else if (section.type === "Answer") {
      newQuestion = { text: "", expectedAnswer: "" };
    } else if (section.type === "File Upload") {
      newQuestion = { text: "" };
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
      // Optionally remove section if no questions, but keep for now
      let emptyQuestion = {};
      if (section.type === "Multiple Choice") {
        emptyQuestion = { text: "", options: [{ text: "" }] };
      } else if (section.type === "Answer") {
        emptyQuestion = { text: "", expectedAnswer: "" };
      } else if (section.type === "File Upload") {
        emptyQuestion = { text: "" };
      }
      section.questions = [emptyQuestion];
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

  // Change Handlers
  const handleQuestionChange = (sIndex, qIndex, value) => {
    const newSections = [...sections];
    newSections[sIndex].questions[qIndex].text = value;
    setSections(newSections);
  };

  const handleOptionChange = (sIndex, qIndex, oIndex, value) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    if (section.type !== "Multiple Choice") return;
    section.questions[qIndex].options[oIndex].text = value;
    setSections(newSections);
  };

  const handleExpectedAnswerChange = (sIndex, qIndex, value) => {
    const newSections = [...sections];
    const section = newSections[sIndex];
    if (section.type !== "Answer") return;
    section.questions[qIndex].expectedAnswer = value;
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
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  onClick={() => handleCopyQuestion(sIndex, qIndex)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Duplicate Question"
                >
                  <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveQuestion(sIndex, qIndex, -1)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Move Up"
                >
                  <img src={upIcon} alt="Up" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveQuestion(sIndex, qIndex, 1)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Move Down"
                >
                  <img src={downIcon} alt="Down" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(sIndex, qIndex)}
                  className="text-red-500 hover:opacity-70 transition-opacity"
                  title="Delete Question"
                >
                  <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                </button>
              </div>

              <label className="block text-sm text-gray-500 mb-1">
                Question {qIndex + 1}
              </label>
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(sIndex, qIndex, e.target.value)}
                placeholder="Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300 mb-3"
              />

              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 mb-2 relative">
                  <input type="radio" disabled className="accent-blue-500" />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(sIndex, qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:border-blue-300"
                  />
                  {question.options.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption(sIndex, qIndex, oIndex)}
                      className="text-red-500 absolute right-2 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => handleAddOption(sIndex, qIndex)}
                className="mt-2 text-blue-500 text-sm hover:underline"
              >
                + Add Option
              </button>

              <hr className="mt-4 border-gray-300" />
            </div>
          ))}

          <button
            onClick={() => handleAddQuestion(sIndex)}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  onClick={() => handleCopyQuestion(sIndex, qIndex)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Duplicate Question"
                >
                  <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveQuestion(sIndex, qIndex, -1)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Move Up"
                >
                  <img src={upIcon} alt="Up" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveQuestion(sIndex, qIndex, 1)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Move Down"
                >
                  <img src={downIcon} alt="Down" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(sIndex, qIndex)}
                  className="text-red-500 hover:opacity-70 transition-opacity"
                  title="Delete Question"
                >
                  <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                </button>
              </div>

              <label className="block text-sm text-gray-500 mb-1">
                Question {qIndex + 1}
              </label>
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(sIndex, qIndex, e.target.value)}
                placeholder="Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300 mb-3"
              />

              <label className="block text-sm text-gray-500 mb-1">
                Expected Answer (optional)
              </label>
              <input
                type="text"
                value={question.expectedAnswer}
                onChange={(e) => handleExpectedAnswerChange(sIndex, qIndex, e.target.value)}
                placeholder="Expected Answer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300 mb-3"
              />

              <hr className="mt-4 border-gray-300" />
            </div>
          ))}

          <button
            onClick={() => handleAddQuestion(sIndex)}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  onClick={() => handleCopyQuestion(sIndex, qIndex)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Duplicate Question"
                >
                  <img src={copyIcon} alt="Copy" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveQuestion(sIndex, qIndex, -1)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Move Up"
                >
                  <img src={upIcon} alt="Up" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveQuestion(sIndex, qIndex, 1)}
                  className="text-gray-500 hover:opacity-70 transition-opacity"
                  title="Move Down"
                >
                  <img src={downIcon} alt="Down" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(sIndex, qIndex)}
                  className="text-red-500 hover:opacity-70 transition-opacity"
                  title="Delete Question"
                >
                  <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                </button>
              </div>

              <label className="block text-sm text-gray-500 mb-1">
                Upload Prompt {qIndex + 1}
              </label>
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(sIndex, qIndex, e.target.value)}
                placeholder="Enter upload instructions or question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300 mb-3"
              />

              <hr className="mt-4 border-gray-300" />
            </div>
          ))}

          <button
            onClick={() => handleAddQuestion(sIndex)}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
        <input
          type="text"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          placeholder={`Enter your ${quizTypeLabel.toLowerCase()} name...`}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-300 focus:outline-none"
        />
      </div>

      {/* QUIZ TYPE SELECTION */}
      <div className="w-full mb-6">
        <label className="block text-gray-700 text-base mb-1">Add Question Type</label>
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

      {/* SECTIONS */}
      {sections.map((section, sIndex) => (
        <div key={sIndex} className="w-full mb-8">
          <h3 className="text-md font-semibold mb-2">{section.type} Section</h3>
          {renderSectionBuilder(section, sIndex)}
        </div>
      ))}
    </div>
  );
}