const express = require("express");

const protect = require("../middlewares/authMiddleware");



const {
    startInterview,
    getInterviewById,
    submitInterviewAnswer,
    completeInterview,
} = require("../controllers/interviewController");

const router = express.Router();

router.post(
    "/start",
    protect,
    startInterview
);

router.get(
    "/:id",
    protect,
    getInterviewById
);

router.post(
    "/:id/answer",
    protect,
    submitInterviewAnswer
);

router.post(
    "/:id/complete",
    protect,
    completeInterview
);

module.exports = router;