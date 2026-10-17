
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceDraft, setVoiceDraft] = useState("");

  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);
  const answerRef = useRef("");
  const voiceDraftRef = useRef("");
  const restartTimerRef = useRef(null);
  const mountedRef = useRef(true);

  // Keep the latest answer available to speech callbacks.
  const updateAnswer = (value) => {
    answerRef.current = value;
    setAnswer(value);
  };

  const updateVoiceDraft = (value) => {
    voiceDraftRef.current = value;
    setVoiceDraft(value);
  };

  useEffect(() => {
    mountedRef.current = true;

    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interview/${id}`);

        if (mountedRef.current) {
          setInterview(response.data.interview);
        }
      } catch (error) {
        console.error("Fetch Interview Error:", error);

        if (mountedRef.current) {
          setError(
            error.response?.data?.message ||
              "Unable to load interview."
          );
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchInterview();

    return () => {
      mountedRef.current = false;
    };
  }, [id]);

  // Read the current interview question aloud.
  const speakQuestion = () => {
    const question = interview?.questions?.[currentQuestion];

    if (!question?.question) return;

    if (!("speechSynthesis" in window)) {
      setVoiceError(
        "Your browser does not support speech playback."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      question.question
    );

    utterance.lang = "en-IN";
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceError("Unable to play the question.");
    };

    setVoiceError("");
    window.speechSynthesis.speak(utterance);
  };

  // Start or restart speech recognition.
  const startRecognition = (recognition) => {
    if (
      !mountedRef.current ||
      !shouldKeepListeningRef.current ||
      recognitionRef.current !== recognition
    ) {
      return;
    }

    try {
      recognition.start();
    } catch (error) {
      // Some browsers need a short delay before restarting.
      if (shouldKeepListeningRef.current) {
        restartTimerRef.current = window.setTimeout(() => {
          startRecognition(recognition);
        }, 400);
      }
    }
  };

  // Start microphone recognition.
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        "Voice input is not supported in this browser. Please type your answer."
      );
      return;
    }

    if (isListening || loading) return;

    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    shouldKeepListeningRef.current = true;

    setVoiceError("");
    updateVoiceDraft("");
    setIsListening(true);

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];
        const transcript = result[0]?.transcript || "";

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Append finalized speech without deleting existing text.
      if (finalTranscript.trim()) {
        const existingAnswer = answerRef.current.trimEnd();
        const separator = existingAnswer ? " " : "";

        updateAnswer(
          existingAnswer +
            separator +
            finalTranscript.trim()
        );
      }

      // Show words while the user is still speaking.
      updateVoiceDraft(interimTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);

      if (!mountedRef.current) return;

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        shouldKeepListeningRef.current = false;
        setIsListening(false);

        setVoiceError(
          "Microphone permission denied. Allow microphone access in your browser."
        );
        return;
      }

      if (event.error === "audio-capture") {
        shouldKeepListeningRef.current = false;
        setIsListening(false);

        setVoiceError(
          "No microphone detected. Check your microphone connection."
        );
        return;
      }

      // A short pause or no-speech event should not stop voice input.
      if (
        event.error !== "no-speech" &&
        event.error !== "aborted"
      ) {
        setVoiceError(
          `Voice recognition issue: ${event.error}. Trying to continue...`
        );
      }
    };

    recognition.onend = () => {
      if (!mountedRef.current) return;

      if (
        shouldKeepListeningRef.current &&
        recognitionRef.current === recognition
      ) {
        // Some browsers end recognition after silence.
        // Restart it while the user still wants voice input.
        restartTimerRef.current = window.setTimeout(() => {
          startRecognition(recognition);
        }, 300);
      } else {
        setIsListening(false);
        updateVoiceDraft("");
      }
    };

    try {
      recognition.start();
    } catch (error) {
      shouldKeepListeningRef.current = false;
      recognitionRef.current = null;
      setIsListening(false);

      setVoiceError(
        "Unable to start the microphone. Please try again."
      );
    }
  };

  // Stop only when the user clicks the voice button again.
  const stopListening = () => {
    shouldKeepListeningRef.current = false;

    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    const recognition = recognitionRef.current;
    recognitionRef.current = null;

    setIsListening(false);
    updateVoiceDraft("");

    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.warn("Unable to stop recognition:", error);
      }
    }
  };

  // Stop microphone and audio when leaving the page.
  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;

      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
      }

      recognitionRef.current?.abort();
      recognitionRef.current = null;

      window.speechSynthesis?.cancel();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading interview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>

          <button
            onClick={() => navigate("/interview")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Interview
          </button>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  const question = interview.questions[currentQuestion];

  const handleSubmitAnswer = async () => {
    // Include any interim words currently visible in the textarea.
    const finalAnswer = [
      answerRef.current.trim(),
      voiceDraftRef.current.trim(),
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!finalAnswer) return;

    // Stop voice input before submitting.
    stopListening();

    try {
      setLoading(true);
      setError("");
      setVoiceError("");

      const response = await api.post(`/interview/${id}/answer`, {
        questionIndex: currentQuestion,
        answer: finalAnswer,
      });

      const updatedInterview = response.data.interview;

      setInterview(updatedInterview);
      updateAnswer("");

      const isLastQuestion =
        currentQuestion === updatedInterview.questions.length - 1;

      if (isLastQuestion) {
        const completeResponse = await api.post(
          `/interview/${id}/complete`
        );

        navigate(`/interview/${id}/result`, {
          state: {
            interview: completeResponse.data.interview,
          },
        });

        return;
      }

      setCurrentQuestion((previous) => previous + 1);
    } catch (error) {
      console.error("Submit Interview Answer Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to evaluate your answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Display finalized speech and live interim transcription together.
  const displayedAnswer = [
    answer,
    voiceDraft,
  ]
    .filter(Boolean)
    .join(answer.trim() && voiceDraft.trim() ? " " : "");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Interview
          </h1>

          <p className="mt-2 text-gray-600">
            {interview.jobRole} · {interview.interviewType}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of{" "}
              {interview.questions.length}
            </span>

            <span className="text-sm font-medium text-blue-600">
              {interview.experienceLevel}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
            {question.question}
          </h2>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              type="button"
              onClick={speakQuestion}
              disabled={isSpeaking || loading}
              className="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
            >
              {isSpeaking ? "Speaking..." : "🔊 Hear Question"}
            </button>

            <button
              type="button"
              onClick={
                isListening ? stopListening : startListening
              }
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white disabled:opacity-50 ${
                isListening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isListening
                ? "⏹ Stop Voice Input"
                : "🎤 Answer with Voice"}
            </button>
          </div>

          {isListening && (
            <p className="mt-3 text-sm text-green-700">
              Listening... Speak naturally. Pauses will not
              intentionally stop voice input. Click Stop Voice
              Input when you finish.
            </p>
          )}

          {voiceError && (
            <p className="mt-3 text-sm text-red-600">
              {voiceError}
            </p>
          )}

          <textarea
            value={displayedAnswer}
            onChange={(e) => {
              // Manual typing remains enabled during voice input.
              updateAnswer(e.target.value);
              updateVoiceDraft("");
            }}
            placeholder="Type your answer here or use Answer with Voice..."
            rows={8}
            className="w-full mt-8 border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSubmitAnswer}
            disabled={!displayedAnswer.trim() || loading}
            className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading
              ? "Evaluating..."
              : currentQuestion < interview.questions.length - 1
                ? "Submit Answer"
                : "Finish Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewSession;
