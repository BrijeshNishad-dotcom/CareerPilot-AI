const { analyzeWithGemini } = require("../ai-service/geminiService");
const Analysis = require("../models/Analysis");
const { extractTextFromPDF } = require("../utils/pdfParser");

const analyzeResume = async (req, res) => {
    try {
        // Check resume
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload your resume PDF.",
            });
        }

        // Check job description
        const jobDescription = req.body.jobDescription?.trim();

        if (!jobDescription) {
            return res.status(400).json({
                message: "Please enter the job description.",
            });
        }

        // Check authenticated user
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please login again.",
            });
        }

        console.log("Extracting text from resume PDF...");

        const resumeText = await extractTextFromPDF(req.file.buffer);

        console.log(
            `Resume text extracted successfully. Characters: ${resumeText.length}`
        );

        // Send extracted resume text and job description to AI
        const analysis = await analyzeWithGemini(
            resumeText,
            jobDescription
        );

        // Save analysis in MongoDB
        const savedAnalysis = await Analysis.create({
            user: req.user,
            resumeName: req.file.originalname,
            jobDescription,
            matchScore: analysis.matchScore,
            matchedSkills: analysis.matchedSkills,
            missingSkills: analysis.missingSkills,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            experienceMatch: analysis.experienceMatch,
            roleMatch: analysis.roleMatch,
            atsSuggestions: analysis.atsSuggestions,
            recommendation: analysis.recommendation,
        });

        return res.status(200).json({
            message: "Resume analyzed successfully",
            analysis,
            analysisId: savedAnalysis._id,
        });
    } catch (error) {
        console.error("Analyze Controller Error:", error);

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
                "Unable to analyze your resume right now. Please try again later.",
        });
    }
};


// Get logged-in user's analysis history
const getAnalysisHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please login again.",
            });
        }

        const analyses = await Analysis.find({
            user: req.user,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Analysis history fetched successfully",
            analyses,
        });
    } catch (error) {
        console.error("Get Analysis History Error:", error);

        return res.status(500).json({
            message: "Unable to fetch analysis history.",
        });
    }
};


// Get one specific analysis
const getAnalysisById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please login again.",
            });
        }

        const analysis = await Analysis.findOne({
            _id: req.params.id,
            user: req.user,
        });

        if (!analysis) {
            return res.status(404).json({
                message: "Analysis not found.",
            });
        }

        return res.status(200).json({
            message: "Analysis fetched successfully",
            analysis,
        });
    } catch (error) {
        console.error("Get Analysis By ID Error:", error);

        return res.status(500).json({
            message: "Unable to fetch analysis.",
        });
    }
};


module.exports = {
    analyzeResume,
    getAnalysisHistory,
    getAnalysisById,
};