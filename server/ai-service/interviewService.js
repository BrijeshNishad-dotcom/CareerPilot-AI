
const https = require("https");

const GEMINI_MODEL_NAME = "gemini-3.6-flash";
const GROQ_MODEL_NAME =
    process.env.GROQ_MODEL_NAME || "openai/gpt-oss-120b";

// --------------------------------------------------
// Gemini API request
// --------------------------------------------------

const sendGeminiRequest = (requestBody) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "generativelanguage.googleapis.com",
            path: `/v1beta/models/${GEMINI_MODEL_NAME}:generateContent`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY,
                "Content-Length": Buffer.byteLength(requestBody),
            },
        };

        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const parsedData = JSON.parse(data);

                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        const error = new Error(
                            `Gemini API Error ${res.statusCode}: ${data}`
                        );
                        error.statusCode = res.statusCode;
                        reject(error);
                        return;
                    }

                    resolve(parsedData);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on("error", reject);
        req.write(requestBody);
        req.end();
    });
};

// --------------------------------------------------
// Groq API request
// --------------------------------------------------

const sendGroqRequest = (requestBody) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.groq.com",
            path: "/openai/v1/chat/completions",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Length": Buffer.byteLength(requestBody),
            },
        };

        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const parsedData = JSON.parse(data);

                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        const error = new Error(
                            `Groq API Error ${res.statusCode}: ${data}`
                        );
                        error.statusCode = res.statusCode;
                        reject(error);
                        return;
                    }

                    resolve(parsedData);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on("error", reject);
        req.write(requestBody);
        req.end();
    });
};

// --------------------------------------------------
// Shared Gemini -> Groq fallback
// --------------------------------------------------

const getJSONWithFallback = async ({
    prompt,
    temperature,
    operation,
    validate,
}) => {
    let lastError = null;

    // Primary provider: Gemini, maximum 3 attempts.
    if (process.env.GEMINI_API_KEY) {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(
                    `${operation}: Gemini attempt ${attempt}/3`
                );

                const requestBody = JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature,
                        responseMimeType: "application/json",
                    },
                });

                const response = await sendGeminiRequest(requestBody);

                const text =
                    response?.candidates?.[0]?.content?.parts
                        ?.map((part) => part.text || "")
                        .join("")
                        .trim();

                if (!text) {
                    throw new Error(
                        "Gemini did not return a valid text response."
                    );
                }

                const result = JSON.parse(text);
                validate(result);

                console.log(`${operation}: Gemini succeeded.`);
                return result;
            } catch (error) {
                lastError = error;

                console.error(
                    `${operation}: Gemini attempt ${attempt} failed:`,
                    error.message
                );

                if (attempt < 3) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, attempt * 2000)
                    );
                }
            }
        }
    } else {
        lastError = new Error(
            "GEMINI_API_KEY is missing in .env"
        );

        console.warn(
            `${operation}: Gemini key missing; trying Groq fallback.`
        );
    }

    // Fallback provider: Groq.
    if (!process.env.GROQ_API_KEY) {
        const error = new Error(
            `${operation} failed. GROQ_API_KEY is missing in .env.`
        );

        error.statusCode = lastError?.statusCode;
        throw error;
    }

    try {
        console.log(
            `${operation}: Switching to Groq fallback using ${GROQ_MODEL_NAME}.`
        );

        const groqPrompt = `
Return exactly one valid JSON object.

Important rules:
- Return JSON only, without Markdown or code fences.
- Use double quotes for JSON keys and string values.
- Do not add comments or text outside the JSON object.
- Follow the required structure in the task below.
- Do not leave any required field empty unless the structure asks for an empty string or array.

TASK:
${prompt}
`;

        const requestBody = JSON.stringify({
            model: GROQ_MODEL_NAME,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert interview assistant. " +
                        "Follow the user's requested JSON structure exactly. " +
                        "Return only a valid JSON object.",
                },
                {
                    role: "user",
                    content: groqPrompt,
                },
            ],
            temperature: 0,
            max_completion_tokens: 4096,
            reasoning_effort: "low",
            response_format: {
                type: "json_object",
            },
        });

        const response = await sendGroqRequest(requestBody);

        const choice = response?.choices?.[0];
        const text = choice?.message?.content?.trim();

        if (!text) {
            throw new Error(
                `Groq returned empty content. Finish reason: ${
                    choice?.finish_reason || "unknown"
                }`
            );
        }

        let result;

        try {
            result = JSON.parse(text);
        } catch (parseError) {
            console.error(
                `${operation}: Groq returned invalid JSON:`,
                text
            );

            throw new Error(
                "Groq response was not valid JSON."
            );
        }

        validate(result);

        console.log(`${operation}: Groq fallback succeeded.`);
        return result;
    } catch (error) {
        console.error(
            `${operation}: Groq fallback failed:`,
            error.message
        );

        if (!error.statusCode && lastError?.statusCode) {
            error.statusCode = lastError.statusCode;
        }

        throw error;
    }
};

// --------------------------------------------------
// Interview question prompt
// --------------------------------------------------

const createInterviewPrompt = ({
    jobRole,
    experienceLevel,
    interviewType,
    totalQuestions,
}) => {
    return `
You are an expert interviewer.

Create exactly ${totalQuestions} interview questions for this candidate.

Job Role:
${jobRole}

Experience Level:
${experienceLevel}

Interview Type:
${interviewType}

Requirements:
- Questions must be relevant to the selected job role.
- Questions must match the candidate's experience level.
- Do not generate duplicate questions.
- Questions should have a reasonable difficulty progression.
- Technical interviews should focus on technical concepts and practical knowledge.
- HR interviews should focus on motivation, communication, career goals and workplace behavior.
- Behavioral interviews should focus on real-world situations and problem solving.
- Mixed interviews should contain a balanced combination of technical, HR and behavioral questions.

Return a JSON object using exactly this structure:

{
  "questions": [
    {
      "question": "Question text"
    }
  ]
}

The questions array must contain exactly ${totalQuestions} items.
Do not use Markdown or add text outside the JSON.
`;
};

// --------------------------------------------------
// Generate interview questions
// --------------------------------------------------

const generateInterviewQuestions = async ({
    jobRole,
    experienceLevel,
    interviewType,
    totalQuestions,
}) => {
    try {
        const prompt = createInterviewPrompt({
            jobRole,
            experienceLevel,
            interviewType,
            totalQuestions,
        });

        const result = await getJSONWithFallback({
            prompt,
            temperature: 0.4,
            operation: "Interview question generation",

            validate: (data) => {
                if (
                    !data ||
                    !Array.isArray(data.questions) ||
                    data.questions.length !== Number(totalQuestions) ||
                    !data.questions.every(
                        (item) =>
                            item &&
                            typeof item.question === "string" &&
                            item.question.trim().length > 0
                    )
                ) {
                    throw new Error(
                        "AI returned an invalid questions structure."
                    );
                }
            },
        });

        return result.questions;
    } catch (error) {
        console.error("Interview Service Error:", error);
        throw error;
    }
};

// --------------------------------------------------
// Evaluate interview answer
// --------------------------------------------------

const evaluateInterviewAnswer = async ({
    question,
    answer,
    jobRole,
    interviewType,
}) => {
    try {
        const prompt = `
You are an expert interviewer evaluating a candidate's interview answer.

Job Role:
${jobRole}

Interview Type:
${interviewType}

Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer fairly.

Return a JSON object using exactly this structure:

{
  "score": 0,
  "feedback": "",
  "idealAnswer": ""
}

Rules:
- score must be a number between 0 and 10.
- feedback should explain what the candidate did well and what could be improved.
- idealAnswer should provide a strong and concise answer to the question.
- Return only JSON. Do not use Markdown.
`;

        const evaluation = await getJSONWithFallback({
            prompt,
            temperature: 0.2,
            operation: "Interview answer evaluation",

            validate: (data) => {
                if (
                    !data ||
                    typeof data.score !== "number" ||
                    data.score < 0 ||
                    data.score > 10 ||
                    typeof data.feedback !== "string" ||
                    typeof data.idealAnswer !== "string"
                ) {
                    throw new Error(
                        "AI returned an invalid answer evaluation."
                    );
                }
            },
        });

        return evaluation;
    } catch (error) {
        console.error("Interview Answer Evaluation Error:", error);
        throw error;
    }
};

// --------------------------------------------------
// Generate final interview result
// --------------------------------------------------

const generateInterviewResult = async ({
    jobRole,
    interviewType,
    questions,
}) => {
    try {
        const questionSummary = questions.map((item, index) => ({
            questionNumber: index + 1,
            question: item.question,
            answer: item.answer,
            score: item.score,
            feedback: item.feedback,
        }));

        const prompt = `
You are an expert interview evaluator.

Job Role:
${jobRole}

Interview Type:
${interviewType}

Candidate's complete interview performance:
${JSON.stringify(questionSummary, null, 2)}

Analyze the complete performance.

Return a JSON object using exactly this structure:

{
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "overallFeedback": "Overall interview feedback"
}

Rules:
- strengths must contain 2 to 4 concise points.
- weaknesses must contain 2 to 4 concise points.
- overallFeedback should summarize the candidate's overall interview performance.
- Base the evaluation only on the provided answers and scores.
- Do not invent information.
- Return only JSON. Do not use Markdown.
`;

        const result = await getJSONWithFallback({
            prompt,
            temperature: 0.3,
            operation: "Interview result generation",

            validate: (data) => {
                if (
                    !data ||
                    !Array.isArray(data.strengths) ||
                    !Array.isArray(data.weaknesses) ||
                    data.strengths.length < 2 ||
                    data.strengths.length > 4 ||
                    data.weaknesses.length < 2 ||
                    data.weaknesses.length > 4 ||
                    !data.strengths.every(
                        (item) => typeof item === "string"
                    ) ||
                    !data.weaknesses.every(
                        (item) => typeof item === "string"
                    ) ||
                    typeof data.overallFeedback !== "string"
                ) {
                    throw new Error(
                        "AI returned an invalid final interview result."
                    );
                }
            },
        });

        return result;
    } catch (error) {
        console.error("Generate Interview Result Error:", error);
        throw error;
    }
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
    generateInterviewQuestions,
    evaluateInterviewAnswer,
    generateInterviewResult,
};
