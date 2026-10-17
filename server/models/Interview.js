const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    idealAnswer: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    experienceLevel: {
      type: String,
      required: true,
      trim: true,
    },

    interviewType: {
      type: String,
      required: true,
      trim: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    questions: {
      type: [interviewQuestionSchema],
      default: [],
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);