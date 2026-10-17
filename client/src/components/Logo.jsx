
import { Link } from "react-router-dom";

export default function Logo({ showTagline = false }) {
  return (
    <Link
      to="/"
      aria-label="CareerPilot AI Home"
      className="inline-flex w-fit shrink-0 items-center gap-2.5"
    >
      <img
        src="/favicon.png"
        alt=""
        className="h-10 w-10 shrink-0 object-contain"
      />

      <span className="flex flex-col">
        <span className="text-lg font-bold leading-tight tracking-tight text-gray-900 sm:text-xl">
          CareerPilot <span className="text-blue-600">AI</span>
        </span>

        {showTagline && (
          <span className="mt-0.5 text-xs text-gray-500">
            Your AI-Powered Career Companion
          </span>
        )}
      </span>
    </Link>
  );
}
