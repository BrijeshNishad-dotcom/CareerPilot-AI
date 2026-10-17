import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "AI Resume Analyzer",
    description:
      "Analyze your resume against a job description, identify matching and missing skills, and discover areas for improvement.",
    link: "/analyze",
    button: "Learn more",
  },
  {
    number: "02",
    title: "AI Mock Interview",
    description:
      "Practice interview questions, improve your answers, and prepare for real-world interview situations.",
    link: "/interview",
    button: "Learn more",
  },
  {
    number: "03",
    title: "Analysis History",
    description:
      "Access your previous analyses and review your saved results to keep your job preparation organized.",
    link: "/history",
    button: "Learn more",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Provide your resume and the job description for the role you want to pursue.",
  },
  {
    number: "02",
    title: "Analyze and Practice",
    description:
      "Understand your strengths and skill gaps, then practice interview questions.",
  },
  {
    number: "03",
    title: "Improve Your Preparation",
    description:
      "Use the feedback and recommendations to improve your job preparation.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* About Header */}
      <section className="border-b border-slate-200 px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            About CareerPilot AI
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            CareerPilot AI brings resume analysis and interview preparation
            together in one platform to help students and job seekers prepare
            for their career journey with greater clarity and confidence.
          </p>
        </div>
      </section>

      {/* Purpose and Problem */}
      <section className="bg-slate-50 px-5 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              The Purpose
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Why I Built CareerPilot AI
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              When I was in college, I noticed that many students were confused
              about their careers. They didn't know which programming language
              or skills to learn for the field they wanted to pursue, how to
              prepare for interviews, or how to make an ATS-friendly resume.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              That's why I built CareerPilot AI — to help students find the
              right direction, identify useful skills, improve their resumes,
              and prepare for interviews in one place.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900">
              The Problem We&apos;re Solving
            </h3>

            <ul className="mt-6 space-y-4">
              {[
                "Uncertainty about how well a resume matches a job.",
                "Difficulty identifying missing or relevant skills.",
                "Limited opportunities to practice interview answers.",
                "The need to manage job preparation across different tools.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-green-600">✓</span>
                  <span className="text-sm leading-6 text-slate-600">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              What We Offer
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Features of CareerPilot AI
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Explore the tools designed to support different stages of your job
              preparation.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <span className="text-sm font-semibold text-slate-400">
                  {feature.number}
                </span>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>

                <Link
                  to={feature.link}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
                >
                  {feature.button}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              Simple Process
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              How CareerPilot AI Works
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              A straightforward approach to understanding your resume and
              preparing for interviews.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <span className="text-sm font-bold text-blue-700">
                  STEP {step.number}
                </span>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Goal */}
      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Our Goal
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-7 text-slate-600">
            Our goal is to make career preparation more organized, accessible,
            and practical. CareerPilot AI aims to help students and job seekers
            identify improvement areas, practice their skills, and take the next
            step toward their career goals.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
