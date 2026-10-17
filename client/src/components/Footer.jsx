
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="mb-2">
              <img
                src="/careerpilot-logo.png"
                alt="CareerPilot AI — Your AI-Powered Career Companion"
                className="h-auto w-full max-w-[250px] object-contain object-left"
              />
            </div>

            <p className="max-w-sm text-sm leading-5 text-gray-600">
              Analyze your resume, discover skill gaps, and practice interviews
              with AI to prepare for your next career opportunity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Quick Links
            </h2>

            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-gray-600 hover:text-blue-600">
                  AI Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/interview" className="text-gray-600 hover:text-blue-600">
                  AI Mock Interview
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-600 hover:text-blue-600">
                  Analysis History
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Career Preparation
            </h2>

            <ul className="mt-2 space-y-1.5 text-sm leading-5 text-gray-600">
              <li>Resume and job description matching</li>
              <li>Identify missing skills</li>
              <li>Practice interview questions</li>
              <li>Review AI-generated feedback</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 border-t border-gray-200 pt-3">
          <p className="text-center text-xs leading-5 text-gray-500">
            © {new Date().getFullYear()} CareerPilot AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
