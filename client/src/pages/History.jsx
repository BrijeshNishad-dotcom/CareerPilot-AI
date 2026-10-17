import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const History = () => {
    const navigate = useNavigate();

    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get("/analyze/history");

                setAnalyses(response.data.analyses || []);
            } catch (error) {
                console.error("History Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load analysis history."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

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
                    Loading analysis history...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Analysis History
                    </h1>

                    <p className="mt-2 text-gray-600">
                        View your previous resume analysis results.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!error && analyses.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800">
                            No analysis history yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Analyze your resume to see your results here.
                        </p>

                        <button
                            onClick={() => navigate("/analyze")}
                            className="mt-6 px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
                        >
                            Analyze Resume
                        </button>
                    </div>
                )}

                {/* History List */}
                {analyses.length > 0 && (
                    <div className="space-y-4">
                        {analyses.map((analysis) => (
                            <div
                                key={analysis._id}
                                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    {/* Resume Info */}
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                                            {analysis.resumeName}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Analyzed on{" "}
                                            {formatDate(analysis.createdAt)}
                                        </p>

                                        {analysis.recommendation && (
                                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                                {analysis.recommendation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Score + Button */}
                                    <div className="flex items-center gap-4 shrink-0">

                                        <div
                                            className={`px-4 py-2 rounded-lg font-semibold ${getScoreClass(
                                                analysis.matchScore
                                            )}`}
                                        >
                                            {analysis.matchScore}/100
                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/analysis/${analysis._id}`
                                                )
                                            }
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            View Analysis
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default History;