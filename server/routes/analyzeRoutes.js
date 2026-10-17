const express = require("express");
const multer = require("multer");

const protect = require("../middlewares/authMiddleware");

const {
    analyzeResume,
    getAnalysisHistory,
    getAnalysisById,
} = require("../controllers/analyzeController");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});


// Get logged-in user's analysis history
router.get(
    "/history",
    protect,
    getAnalysisHistory
);


// Get one specific analysis
router.get(
    "/:id",
    protect,
    getAnalysisById
);


// Analyze resume
router.post(
    "/",
    protect,
    upload.single("resume"),
    analyzeResume
);


module.exports = router;