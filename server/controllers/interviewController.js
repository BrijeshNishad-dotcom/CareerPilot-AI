const Interview = require("../models/Interview");

const {
    generateInterviewQuestions,
    evaluateInterviewAnswer,
    generateInterviewResult,
} = require("../ai-service/interviewService");

const startInterview = async (req, res) => {
  try {
    const {
      jobRole,
      experienceLevel,
      interviewType,
      totalQuestions,
    } = req.body;

    if (
      !jobRole ||
      !experienceLevel ||
      !interviewType ||
      !totalQuestions
    ) {
      return res.status(400).json({
        message: "All interview fields are required.",
      });
    }

    const questionCount = Number(totalQuestions);

    if (
      !Number.isInteger(questionCount) ||
      questionCount < 1 ||
      questionCount > 10
    ) {
      return res.status(400).json({
        message:
          "Number of questions must be between 1 and 10.",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login again.",
      });
    }

    console.log("Generating interview questions...");

    const generatedQuestions =
      await generateInterviewQuestions({
        jobRole: jobRole.trim(),
        experienceLevel: experienceLevel.trim(),
        interviewType: interviewType.trim(),
        totalQuestions: questionCount,
      });

    const questions = generatedQuestions
      .slice(0, questionCount)
      .map((item) => ({
        question: item.question,
        answer: "",
        score: 0,
        feedback: "",
        idealAnswer: "",
      }));

    if (questions.length < questionCount) {
      return res.status(500).json({
        message:
          "AI could not generate enough interview questions.",
      });
    }

    const interview = await Interview.create({
      user: req.user,
      jobRole: jobRole.trim(),
      experienceLevel: experienceLevel.trim(),
      interviewType: interviewType.trim(),
      totalQuestions: questionCount,
      questions,
      status: "in-progress",
    });

    return res.status(201).json({
      message: "Interview started successfully.",
      interview,
    });
  } catch (error) {
    console.error(
      "Start Interview Controller Error:",
      error
    );

    if (
      error.statusCode === 429 ||
      error.statusCode === 503
    ) {
      return res.status(error.statusCode).json({
        message:
          "AI service is temporarily unavailable. Please try again in a few minutes.",
      });
    }

    return res.status(500).json({
      message:
        "Unable to start interview right now. Please try again later.",
    });
  }
};
const getInterviewById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please login again.",
            });
        }

        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user,
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found.",
            });
        }

        return res.status(200).json({
            message: "Interview fetched successfully",
            interview,
        });
    } catch (error) {
        console.error("Get Interview By ID Error:", error);

        return res.status(500).json({
            message: "Unable to fetch interview.",
        });
    }
};

const submitInterviewAnswer = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please login again.",
            });
        }

        const { questionIndex, answer } = req.body;

        if (
            questionIndex === undefined ||
            !answer ||
            !answer.trim()
        ) {
            return res.status(400).json({
                message: "Question index and answer are required.",
            });
        }

        const index = Number(questionIndex);

        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user,
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found.",
            });
        }

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= interview.questions.length
        ) {
            return res.status(400).json({
                message: "Invalid question index.",
            });
        }

        const currentQuestion =
            interview.questions[index];

        const evaluation =
            await evaluateInterviewAnswer({
                question: currentQuestion.question,
                answer: answer.trim(),
                jobRole: interview.jobRole,
                interviewType: interview.interviewType,
            });

        currentQuestion.answer = answer.trim();
        currentQuestion.score = evaluation.score;
        currentQuestion.feedback = evaluation.feedback;
        currentQuestion.idealAnswer = evaluation.idealAnswer;

        await interview.save();

        return res.status(200).json({
            message: "Answer evaluated successfully.",
            evaluation,
            interview,
        });
    } catch (error) {
        console.error(
            "Submit Interview Answer Error:",
            error
        );

        if (
            error.statusCode === 429 ||
            error.statusCode === 503
        ) {
            return res.status(error.statusCode).json({
                message:
                    "AI service is temporarily unavailable. Please try again in a few minutes.",
            });
        }

        return res.status(500).json({
            message:
                "Unable to evaluate your answer right now.",
        });
    }
};

const completeInterview = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please login again.",
            });
        }

        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user,
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found.",
            });
        }

        const unansweredQuestion = interview.questions.find(
            (item) => !item.answer || !item.answer.trim()
        );

        if (unansweredQuestion) {
            return res.status(400).json({
                message:
                    "Please answer all interview questions before completing the interview.",
            });
        }

        const totalScore = interview.questions.reduce(
            (sum, item) => sum + Number(item.score || 0),
            0
        );

        const overallScore =
            interview.questions.length > 0
                ? Math.round(
                      (totalScore /
                          (interview.questions.length * 10)) *
                          100
                  )
                : 0;

        const aiResult = await generateInterviewResult({
            jobRole: interview.jobRole,
            interviewType: interview.interviewType,
            questions: interview.questions,
        });

        interview.overallScore = overallScore;
        interview.strengths = aiResult.strengths;
        interview.weaknesses = aiResult.weaknesses;
        interview.overallFeedback =
            aiResult.overallFeedback;
        interview.status = "completed";

        await interview.save();

        return res.status(200).json({
            message: "Interview completed successfully.",
            interview,
        });
    } catch (error) {
        console.error(
            "Complete Interview Error:",
            error
        );

        if (
            error.statusCode === 429 ||
            error.statusCode === 503
        ) {
            return res.status(error.statusCode).json({
                message:
                    "AI service is temporarily unavailable. Please try again in a few minutes.",
            });
        }

        return res.status(500).json({
            message:
                "Unable to complete the interview right now.",
        });
    }
};

module.exports = {
    startInterview,
    getInterviewById,
    submitInterviewAnswer,
    completeInterview,
};