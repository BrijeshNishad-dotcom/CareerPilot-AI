import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Interview() {
  const navigate = useNavigate();

  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [interviewType, setInterviewType] = useState("Technical");
  const [totalQuestions, setTotalQuestions] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartInterview = async () => {
    if (!jobRole.trim()) {
      setError("Please enter the job role.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/interview/start", {
        jobRole: jobRole.trim(),
        experienceLevel,
        interviewType,
        totalQuestions: Number(totalQuestions),
      });

      const interview = response.data.interview;

      navigate(`/interview/${interview._id}`);
    } catch (error) {
      console.error("Interview Start Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to start interview. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            AI Interview
          </h1>

          <p className="mt-3 text-gray-600">
            Practice with an AI-powered interview tailored to your target job
            role.
          </p>
        </div>

        {/* Setup Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          {/* Job Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Role
            </label>

            <input
              type="text"
              value={jobRole}
              onChange={(e) => {
                setJobRole(e.target.value);
                setError("");
              }}
              placeholder="e.g. Frontend Developer"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Experience Level */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>

            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Fresher">Fresher</option>

              <option value="0-2 Years">0-2 Years</option>

              <option value="2-5 Years">2-5 Years</option>

              <option value="5+ Years">5+ Years</option>
            </select>
          </div>

          {/* Interview Type */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Type
            </label>

            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Technical">Technical</option>

              <option value="HR">HR</option>

              <option value="Behavioral">Behavioral</option>

              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>

            <select
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 Question</option>
              <option value={2}>2 Questions</option>
              <option value={3}>3 Questions</option>
              <option value={4}>4 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={6}>6 Questions</option>
              <option value={7}>7 Questions</option>
              <option value={8}>8 Questions</option>
              <option value={9}>9 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="w-full mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Preparing Interview..." : "Start Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Interview;
