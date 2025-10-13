import { useState } from "react";
// import copyIcon from "../../assets/icons/copy.svg";
// import deleteIcon from "../../assets/icons/delete.svg";
// import upIcon from "../../assets/icons/up.svg";
// import downIcon from "../../assets/icons/down.svg"

export default function QuizBuilder({ quizTypeLabel }) {
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedQuizType, setSelectedQuizType] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: [{ text: "" }] },
  ]);

  // Add Question
  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", options: [{ text: "" }] }]);
  };

  // Copy Question
  const handleCopyQuestion = (qIndex) => {
    const newQuestions = [...questions];
    const copied = JSON.parse(JSON.stringify(newQuestions[qIndex]));
    newQuestions.splice(qIndex + 1, 0, copied);
    setQuestions(newQuestions);
  };

  // Delete Question
  const handleDeleteQuestion = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(qIndex, 1);
    setQuestions(newQuestions.length ? newQuestions : [{ text: "", options: [{ text: "" }] }]);
  };

  // Move Up / Down
  const handleMoveQuestion = (qIndex, direction) => {
    const newQuestions = [...questions];
    const newIndex = qIndex + direction;
    if (newIndex < 0 || newIndex >= newQuestions.length) return;
    const [moved] = newQuestions.splice(qIndex, 1);
    newQuestions.splice(newIndex, 0, moved);
    setQuestions(newQuestions);
  };

  // Option Handling
  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: "" });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="w-full flex flex-col items-center text-gray-800">
      <h2 className="text-lg font-semibold mb-3">{quizTypeLabel}</h2>

      {/* QUIZ TITLE */}
      {!selectedQuizType && (
        <div className="w-full mb-4">
          <label className="block text-gray-700 text-base mb-1">Quiz Title</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter your quiz title..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-300 focus:outline-none"
          />
        </div>
      )}

      {/* QUIZ TYPE SELECTION */}
      {!selectedQuizType && (
        <div className="grid grid-cols-3 gap-3 mb-6 w-full">
          {["Multiple Choice", "Answer", "File Upload"].map((type) => (
            <div
              key={type}
              onClick={() => setSelectedQuizType(type)}
              className={`cursor-pointer border rounded-xl py-4 text-center transition ${
                selectedQuizType === type
                  ? "bg-blue-100 border-blue-400 text-blue-600"
                  : "bg-white hover:bg-gray-100 border-gray-300"
              }`}
            >
              {type}
            </div>
          ))}
        </div>
      )}

      {/* MULTIPLE CHOICE BUILDER */}
      {selectedQuizType === "Multiple Choice" && (
        <div className="w-full flex flex-col gap-4 items-center">
          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="w-full max-w-lg border p-4 rounded-xl shadow-sm bg-white relative"
            >
              {/* Question header controls */}
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  onClick={() => handleCopyQuestion(qIndex)}
                  className="text-gray-500 hover:text-blue-600"
                  title="Copy Question"
                >
                  📄
                  {/* <img src={copyIcon} alt="Copy" className="w-5 h-5" /> */}
                </button>
                <button
                  onClick={() => handleMoveQuestion(qIndex, -1)}
                  className="text-gray-500 hover:text-blue-600"
                  title="Move Up"
                >
                  🔼
                  {/* <img src={upIcon} alt="Up" className="w-5 h-5" /> */}
                </button>
                <button
                  onClick={() => handleMoveQuestion(qIndex, 1)}
                  className="text-gray-500 hover:text-blue-600"
                  title="Move Down"
                >
                  🔽
                  {/* <img src={downIcon} alt="Down" className="w-5 h-5" /> */}
                </button>
                <button
                  onClick={() => handleDeleteQuestion(qIndex)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Question"
                >
                  🗑
                  {/* <img src={deleteIcon} alt="Delete" className="w-5 h-5" /> */}
                </button>
              </div>

              {/* Question Text */}
              <label className="block text-sm text-gray-500 mb-1">
                Question {qIndex + 1}
              </label>
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                placeholder="Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-300 mb-3"
              />

              {/* Options */}
              {question.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className="flex items-center gap-2 mb-2 relative"
                >
                  <input type="radio" disabled className="accent-blue-500" />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:border-blue-300"
                  />
                  {question.options.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption(qIndex, oIndex)}
                      className="text-red-500 absolute right-2 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => handleAddOption(qIndex)}
                className="mt-2 text-blue-500 text-sm hover:underline"
              >
                + Add Option
              </button>

              {/* Line Separator */}
              <hr className="mt-4 border-gray-300" />
            </div>
          ))}

          {/* Add Question Button */}
          <button
            onClick={handleAddQuestion}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            + Add Question
          </button>
        </div>
      )}
    </div>
  );
}
