const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeName: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      required: true,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    experienceMatch: {
      type: String,
      default: "",
    },

    roleMatch: {
      type: String,
      default: "",
    },

    atsSuggestions: {
      type: [String],
      default: [],
    },

    recommendation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);