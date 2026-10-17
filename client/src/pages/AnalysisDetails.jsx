import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const AnalysisDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await api.get(`/analyze/${id}`);

                setAnalysis(response.data.analysis);
            } catch (error) {
                console.error("Analysis Details Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load analysis."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [id]);

    const getScoreClass = (score) => {
        if (score >= 80) {
            return "text-green-600 bg-green-50";
        }

        if (score >= 60) {
            return "text-yellow-600 bg-yellow-50";
        }

        return "text-red-600 bg-red-50";
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">
                    Loading analysis...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                        {error}
                    </div>

                    <button
                        onClick={() => navigate("/history")}
                        className="mt-5 px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
                    >
                        Back to History
                    </button>

                </div>
            </div>
        );
    }

    if (!analysis) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Analysis Result
                        </h1>

                        <p className="mt-2 text-gray-600">
                            {analysis.resumeName}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Analyzed on {formatDate(analysis.createdAt)}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/history")}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-white transition"
                    >
                        Back to History
                    </button>

                </div>

                {/* Match Score */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div>
                            <p className="text-sm text-gray-500">
                                Overall Match Score
                            </p>

                            <div className="flex items-center gap-3 mt-2">

                                <span
                                    className={`text-4xl font-bold px-4 py-2 rounded-lg ${getScoreClass(
                                        analysis.matchScore
                                    )}`}
                                >
                                    {analysis.matchScore}/100
                                </span>

                            </div>
                        </div>

                        <div className="w-full md:w-1/2">

                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                                <div
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{
                                        width: `${analysis.matchScore}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* Matched and Missing Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    {/* Matched Skills */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Matched Skills
                        </h2>

                        <div className="flex flex-wrap gap-2 mt-4">

                            {analysis.matchedSkills?.length > 0 ? (
                                analysis.matchedSkills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No matched skills found.
                                </p>
                            )}

                        </div>

                    </div>

                    {/* Missing Skills */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Missing Skills
                        </h2>

                        <div className="flex flex-wrap gap-2 mt-4">

                            {analysis.missingSkills?.length > 0 ? (
                                analysis.missingSkills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No missing skills found.
                                </p>
                            )}

                        </div>

                    </div>

                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    {/* Strengths */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Strengths
                        </h2>

                        <div className="mt-4 space-y-3">

                            {analysis.strengths?.length > 0 ? (
                                analysis.strengths.map(
                                    (strength, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 text-sm text-gray-700"
                                        >
                                            <span className="text-green-600 font-semibold">
                                                ✓
                                            </span>

                                            <span>
                                                {strength}
                                            </span>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No strengths available.
                                </p>
                            )}

                        </div>

                    </div>

                    {/* Weaknesses */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Weaknesses
                        </h2>

                        <div className="mt-4 space-y-3">

                            {analysis.weaknesses?.length > 0 ? (
                                analysis.weaknesses.map(
                                    (weakness, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 text-sm text-gray-700"
                                        >
                                            <span className="text-red-600 font-semibold">
                                                !
                                            </span>

                                            <span>
                                                {weakness}
                                            </span>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No weaknesses available.
                                </p>
                            )}

                        </div>

                    </div>

                </div>

                {/* Experience and Role Match */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Experience Match
                        </h2>

                        <p className="mt-4 text-sm text-gray-600 leading-6">
                            {analysis.experienceMatch || "No information available."}
                        </p>

                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Role Match
                        </h2>

                        <p className="mt-4 text-sm text-gray-600 leading-6">
                            {analysis.roleMatch || "No information available."}
                        </p>

                    </div>

                </div>

                {/* ATS Suggestions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">

                    <h2 className="text-lg font-semibold text-gray-900">
                        ATS Suggestions
                    </h2>

                    <div className="mt-4 space-y-3">

                        {analysis.atsSuggestions?.length > 0 ? (
                            analysis.atsSuggestions.map(
                                (suggestion, index) => (
                                    <div
                                        key={index}
                                        className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700"
                                    >
                                        {index + 1}. {suggestion}
                                    </div>
                                )
                            )
                        ) : (
                            <p className="text-sm text-gray-500">
                                No ATS suggestions available.
                            </p>
                        )}

                    </div>

                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">

                    <h2 className="text-lg font-semibold text-blue-800">
                        Final Recommendation
                    </h2>

                    <p className="mt-3 text-sm text-gray-700 leading-6">
                        {analysis.recommendation}
                    </p>

                </div>

            </div>

        </div>
    );
};

export default AnalysisDetails;