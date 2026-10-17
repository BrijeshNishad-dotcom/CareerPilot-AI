
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Your AI-Powered Career Companion
        </h1>

        <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
          Analyze your resume, identify skill gaps, and practice interviews
          to prepare for your next career opportunity.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Resume Analyzer */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-3xl">
              📄
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              AI Resume Analyzer
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              Upload your resume and compare it with a job description.
              Discover your resume match score, matched skills, missing
              skills, and suggestions to improve your profile.
            </p>

            <ul className="mt-5 space-y-3 text-sm text-gray-700">
              <li>✓ Resume and job description matching</li>
              <li>✓ Matched and missing skills</li>
              <li>✓ ATS improvement suggestions</li>
            </ul>

            <div className="mt-auto pt-8">
              <Link
                to="/analyze"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analyze Resume →
              </Link>
            </div>
          </div>

          {/* AI Mock Interview */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-3xl">
              🎤
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              AI Mock Interview
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              Practice job-related interview questions, submit your
              answers, and review AI-generated feedback to improve your
              confidence before a real interview.
            </p>

            <ul className="mt-5 space-y-3 text-sm text-gray-700">
              <li>✓ Practice interview questions</li>
              <li>✓ Submit answers for AI evaluation</li>
              <li>✓ Review your interview results</li>
            </ul>

            <div className="mt-auto pt-8">
              <Link
                to="/interview"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Mock Interview →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;
