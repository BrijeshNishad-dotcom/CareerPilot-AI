import { useLocation, useNavigate, useParams } from "react-router-dom";

function InterviewResult() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const interview = location.state?.interview;

    if (!interview) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Interview Result Not Found
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Please open your interview again from the interview section.
                    </p>

                    <button
                        onClick={() => navigate("/interview")}
                        className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Interview
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Interview Completed
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {interview.jobRole} · {interview.interviewType}
                    </p>
                </div>

                {/* Overall Score */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                    <p className="text-sm text-gray-500">
                        Overall Score
                    </p>

                    <div className="text-5xl font-bold text-blue-600 mt-2">
                        {interview.overallScore}
                        <span className="text-2xl text-gray-400">
                            /100
                        </span>
                    </div>

                    <p className="mt-3 text-gray-600">
                        {interview.overallFeedback}
                    </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Strengths
                        </h2>

                        <ul className="mt-4 space-y-3">
                            {interview.strengths?.map(
                                (strength, index) => (
                                    <li
                                        key={index}
                                        className="text-gray-700"
                                    >
                                        • {strength}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Areas to Improve
                        </h2>

                        <ul className="mt-4 space-y-3">
                            {interview.weaknesses?.map(
                                (weakness, index) => (
                                    <li
                                        key={index}
                                        className="text-gray-700"
                                    >
                                        • {weakness}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                </div>

                {/* Question Review */}
                <div className="mt-6">

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Question Review
                    </h2>

                    <div className="space-y-5">

                        {interview.questions?.map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-xl p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">

                                        <h3 className="font-semibold text-gray-900">
                                            Q{index + 1}.{" "}
                                            {item.question}
                                        </h3>

                                        <span className="shrink-0 font-semibold text-blue-600">
                                            {item.score}/10
                                        </span>

                                    </div>

                                    <div className="mt-5">
                                        <p className="text-sm font-medium text-gray-500">
                                            Your Answer
                                        </p>

                                        <p className="mt-2 text-gray-700 whitespace-pre-line">
                                            {item.answer}
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <p className="text-sm font-medium text-gray-500">
                                            AI Feedback
                                        </p>

                                        <p className="mt-2 text-gray-700 whitespace-pre-line">
                                            {item.feedback}
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <p className="text-sm font-medium text-gray-500">
                                            Ideal Answer
                                        </p>

                                        <p className="mt-2 text-gray-700 whitespace-pre-line">
                                            {item.idealAnswer}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}

                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">

                    <button
                        onClick={() => navigate("/interview")}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        Start New Interview
                    </button>

                    <button
                        onClick={() => navigate("/history")}
                        className="flex-1 px-6 py-3 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                    >
                        View History
                    </button>

                </div>

            </div>
        </div>
    );
}

export default InterviewResult;