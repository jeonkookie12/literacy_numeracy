import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import BackIcon from "../../assets/teacher/previous-page.svg";

const EditLearnerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const learner = location.state?.learner || {};

  console.log("EditLearnerPage - Rendering, user:", user);

  if (!user || user.userType.toLowerCase() !== "teacher") {
    console.log("EditLearnerPage - No user or not a teacher, redirecting...");
    return null;
  }

  const [formData, setFormData] = useState({
    name: learner?.name || "",
    lrn: learner?.lrn || "",
    gradeLevelSection: learner?.gradeLevelSection || "",
    philIRIScore: learner?.philIRIScore || "",
    crlaScore: learner?.crlaScore || "",
    rmaScore: learner?.rmaScore || "",
    interventionRemarks: learner?.interventionRemarks || {},
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScoreChange = (task, index) => (e) => {
    const updatedRemarks = { ...formData.interventionRemarks };
    updatedRemarks[`score_${task}_${index}`] = e.target.checked ? "1" : "0";
    setFormData({ ...formData, interventionRemarks: updatedRemarks });
  };

  const handleRemarksChange = (task, index) => (e) => {
    const updatedRemarks = { ...formData.interventionRemarks };
    updatedRemarks[`remarks_${task}_${index}`] = e.target.textContent;
    setFormData({ ...formData, interventionRemarks: updatedRemarks });
  };

  const handleOverallScoreRemarksChange = (e) => {
    const updatedRemarks = { ...formData.interventionRemarks };
    updatedRemarks["remarks_overall_score"] = e.target.textContent;
    setFormData({ ...formData, interventionRemarks: updatedRemarks });
  };

  const handleTestingTimeRemarksChange = (e) => {
    const updatedRemarks = { ...formData.interventionRemarks };
    updatedRemarks["remarks_testing_time"] = e.target.textContent;
    setFormData({ ...formData, interventionRemarks: updatedRemarks });
  };

  const handleSave = () => {
    console.log("Saved:", formData);
    navigate("/class-masterlist");
  };

  const handleCancel = () => {
    navigate("/class-masterlist");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-transparent p-4 shadow-md">
        <div className="container mx-auto flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="text-gray-800 hover:text-gray-600"
          >
            <img src={BackIcon} alt="Back" className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Learner's Information</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-grow">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-8">
            {/* Profile Section */}
            <section className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-64 flex-shrink-0">
                <img
                  src="https://via.placeholder.com/256"
                  alt="Profile"
                  className="w-64 h-64 rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LRN</label>
                  <input
                    type="text"
                    name="lrn"
                    value={formData.lrn}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade Level & Section</label>
                  <input
                    type="text"
                    name="gradeLevelSection"
                    value={formData.gradeLevelSection}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>
            <hr className="my-6 border-gray-200" />

            {/* Pre-intervention Assessment */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pre-intervention Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phil IRI Score</label>
                  <input
                    type="text"
                    name="philIRIScore"
                    value={formData.philIRIScore}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CRLA Score</label>
                  <input
                    type="text"
                    name="crlaScore"
                    value={formData.crlaScore}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">RMA/Computational Score</label>
                  <input
                    type="text"
                    name="rmaScore"
                    value={formData.rmaScore}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>
            <hr className="my-6 border-gray-200" />

            {/* Learner's Intervention Remarks */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Learner's Intervention Remarks</h2>
              <div className="overflow-x-auto border border-blue-300 rounded-xl">
                <table className="w-full rounded-xl text-base">
                  <thead className="bg-[#82B9F9]">
                    <tr>
                      <th className="p-2 text-left font-medium w-1/6 rounded-tl-xl">Task / Item</th>
                      <th className="p-2 text-left font-medium w-1/6">Score</th>
                      <th className="p-2 text-left font-medium w-2/3 rounded-tr-xl">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Task 1 (Letters) */}
                    <tr className="hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Task 1 (Letters)</td>
                      <td className="p-2 text-left"></td>
                      <td className="p-2 text-left"></td>
                    </tr>
                    {["A", "m", "E", "L"].map((item, index) => (
                      <tr key={index} className="border-t hover:bg-gray-100">
                        <td className="p-2 text-left">{item}</td>
                        <td className="p-2 text-left">
                          <input
                            type="checkbox"
                            checked={formData.interventionRemarks[`score_Task 1_${index}`] === "1"}
                            onChange={handleScoreChange("Task 1", index)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td
                          className="p-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleRemarksChange("Task 1", index)}
                        >
                          {formData.interventionRemarks[`remarks_Task 1_${index}`] || ""}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Total</td>
                      <td className="p-2 text-left"></td>
                      <td className="p-2 text-left"></td>
                    </tr>

                    {/* Task 2 (Syllables) */}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Task 2 (Syllables)</td>
                      <td className="p-2 text-left"></td>
                      <td className="p-2 text-left"></td>
                    </tr>
                    {["sa", "ti", "ma", "et"].map((item, index) => (
                      <tr key={index} className="border-t hover:bg-gray-100">
                        <td className="p-2 text-left">{item}</td>
                        <td className="p-2 text-left">
                          <input
                            type="checkbox"
                            checked={formData.interventionRemarks[`score_Task 2_${index}`] === "1"}
                            onChange={handleScoreChange("Task 2", index)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td
                          className="p-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleRemarksChange("Task 2", index)}
                        >
                          {formData.interventionRemarks[`remarks_Task 2_${index}`] || ""}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Total</td>
                      <td className="p-2 text-left"></td>
                      <td className="p-2 text-left"></td>
                    </tr>

                    {/* Task 3 (Words) */}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Task 3 (Words)</td>
                      <td className="p-2 text-left"></td>
                      <td className="p-2 text-left"></td>
                    </tr>
                    {["mat", "sit", "met", "tam", "let", "lit"].map((item, index) => (
                      <tr key={index} className="border-t hover:bg-gray-100">
                        <td className="p-2 text-left">{item}</td>
                        <td className="p-2 text-left">
                          <input
                            type="checkbox"
                            checked={formData.interventionRemarks[`score_Task 3_${index}`] === "1"}
                            onChange={handleScoreChange("Task 3", index)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td
                          className="p-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleRemarksChange("Task 3", index)}
                        >
                          {formData.interventionRemarks[`remarks_Task 3_${index}`] || ""}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Total</td>
                      <td className="p-2 text-left"></td>
                      <td className="p-2 text-left"></td>
                    </tr>

                    {/* Task 4 (Phrases) */}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Task 4 (Phrases)</td>
                      <td className="p-2 text-left"></td>
                      <td className="p-2 text-left"></td>
                    </tr>
                    {["P1", "P2", "P3"].map((item, index) => (
                      <tr key={index} className="border-t hover:bg-gray-100">
                        <td className="p-2 text-left">{item}</td>
                        <td className="p-2 text-left">
                          <input
                            type="checkbox"
                            checked={formData.interventionRemarks[`score_Task 4_${index}`] === "1"}
                            onChange={handleScoreChange("Task 4", index)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td
                          className="p-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleRemarksChange("Task 4", index)}
                        >
                          {formData.interventionRemarks[`remarks_Task 4_${index}`] || ""}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Total</td>
                      <td className="p-2 text-left"></td>
                      <td className="p-2 text-left"></td>
                    </tr>

                    {/* Overall Score */}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold text-base">Overall Score</td>
                      <td className="p-2 text-left text-base">Total Score</td>
                      <td
                        className="p-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleOverallScoreRemarksChange}
                      >
                        {formData.interventionRemarks["remarks_overall_score"] || ""}
                      </td>
                    </tr>

                    {/* Total Time */}
                    <tr className="border-t hover:bg-gray-100">
                      <td className="p-2 text-left font-semibold">Total Time</td>
                      <td className="p-2 text-left"></td>
                      <td
                        className="p-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleTestingTimeRemarksChange}
                      >
                        {formData.interventionRemarks["remarks_testing_time"] || ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditLearnerPage;