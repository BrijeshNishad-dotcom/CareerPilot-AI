import { useState } from "react";
import api from "../api/api";

function Analyze() {
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setResume(null);
            return;
        }

        setResume(file);
        setError("");
    };

    const handleAnalyze = async () => {
        if (!resume) {
            setError("Please upload your resume PDF.");
            return;
        }

        if (!jobDescription.trim()) {
            setError("Please enter the job description.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setAnalysis(null);

            const formData = new FormData();

            formData.append("resume", resume);
            formData.append("jobDescription", jobDescription);

            const response = await api.post(
                "/analyze",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setAnalysis(response.data.analysis);

        } catch (error) {
            console.error("Analysis Error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to analyze your resume. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header Section */}
            <section className="max-w-7xl mx-auto px-6 pt-14">

                <div className="text-center">

                    <h1 className="text-4xl font-bold text-gray-900">
                        Analyze Your Resume
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Upload your resume and add the job description to get an
                        AI-powered job match analysis.
                    </p>

                </div>

                {/* Upload + Job Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

                    {/* Resume Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                PDF
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Upload Resume
                                </h2>

                                <p className="text-sm text-gray-500">
                                    PDF format only
                                </p>
                            </div>

                        </div>

                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="mt-6 w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700"
                        />

                        {resume && (
                            <div className="mt-4 bg-gray-50 rounded-lg p-3">

                                <p className="text-xs text-gray-500">
                                    Selected Resume
                                </p>

                                <p className="text-sm text-gray-800 mt-1">
                                    {resume.name}
                                </p>

                            </div>
                        )}

                    </div>

                    {/* Job Description Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                JD
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Job Description
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Paste the job requirements
                                </p>
                            </div>

                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(e.target.value)
                            }
                            placeholder="Paste job description here..."
                            rows="6"
                            className="mt-6 w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="text-right text-xs text-gray-400 mt-1">
                            {jobDescription.length} characters
                        </div>

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                        {error}
                    </div>
                )}

                {/* Analyze Button */}
                <div className="flex justify-center mt-6">

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="px-7 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Analyzing..."
                            : "Analyze Job Match"}
                    </button>

                </div>

            </section>

            {/* Analysis Result */}
            {analysis && (
                <section className="max-w-7xl mx-auto px-6 py-10">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold text-gray-900">
                            Resume Analysis
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Here's how your resume matches the selected job.
                        </p>

                    </div>

                    {/* Match Score */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                            <div>

                                <p className="text-xs text-gray-500 uppercase">
                                    Overall Match Score
                                </p>

                                <div className="flex items-end gap-2 mt-2">

                                    <span className="text-5xl font-bold text-blue-600">
                                        {analysis.matchScore}
                                    </span>

                                    <span className="text-gray-500 mb-1">
                                        /100
                                    </span>

                                </div>

                            </div>

                            <div>

                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-blue-600 rounded-full"
                                        style={{
                                            width: `${analysis.matchScore}%`,
                                        }}
                                    ></div>

                                </div>

                                <p className="text-xs text-gray-500 mt-2">
                                    This score represents the overall alignment
                                    between your resume and the job description.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Matched / Missing Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                            <h3 className="text-lg font-semibold text-gray-900">
                                Matched Skills
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Skills from your resume that match the job requirements.
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4">

                                {analysis.matchedSkills?.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}

                            </div>

                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                            <h3 className="text-lg font-semibold text-gray-900">
                                Missing Skills
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Important skills or requirements that may be missing.
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4">

                                {analysis.missingSkills?.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                    {/* Strengths / Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                            <h3 className="text-lg font-semibold text-gray-900">
                                Strengths
                            </h3>

                            <div className="mt-4 space-y-3">

                                {analysis.strengths?.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 text-sm text-gray-600"
                                        >
                                            <span className="text-green-600">
                                                ✓
                                            </span>

                                            <span>{item}</span>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                            <h3 className="text-lg font-semibold text-gray-900">
                                Weaknesses
                            </h3>

                            <div className="mt-4 space-y-3">

                                {analysis.weaknesses?.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 text-sm text-gray-600"
                                        >
                                            <span className="text-red-600">
                                                !
                                            </span>

                                            <span>{item}</span>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                    {/* Experience / Role Match */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                            <h3 className="text-lg font-semibold text-gray-900">
                                Experience Match
                            </h3>

                            <p className="text-sm text-gray-600 leading-6 mt-4">
                                {analysis.experienceMatch}
                            </p>

                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                            <h3 className="text-lg font-semibold text-gray-900">
                                Role Match
                            </h3>

                            <p className="text-sm text-gray-600 leading-6 mt-4">
                                {analysis.roleMatch}
                            </p>

                        </div>

                    </div>

                    {/* ATS Suggestions */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">

                        <h3 className="text-lg font-semibold text-gray-900">
                            ATS Suggestions
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Practical improvements you can make to increase
                            your resume's relevance.
                        </p>

                        <div className="mt-4 space-y-3">

                            {analysis.atsSuggestions?.map(
                                (suggestion, index) => (
                                    <div
                                        key={index}
                                        className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700"
                                    >
                                        {index + 1}. {suggestion}
                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    {/* Recommendation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">

                        <h3 className="text-lg font-semibold text-blue-800">
                            Final Recommendation
                        </h3>

                        <p className="text-sm text-gray-700 leading-6 mt-3">
                            {analysis.recommendation}
                        </p>

                    </div>

                </section>
            )}

        </div>
    );
}

export default Analyze;