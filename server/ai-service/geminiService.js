const https = require("https");

const GEMINI_MODEL_NAME = "gemini-3.6-flash";
const GROQ_MODEL_NAME = "openai/gpt-oss-20b";

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/*
|--------------------------------------------------------------------------
| Gemini Request
|--------------------------------------------------------------------------
*/

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

    req.on("error", (error) => {
      reject(error);
    });

    req.write(requestBody);
    req.end();
  });
};

/*
|--------------------------------------------------------------------------
| Groq Request
|--------------------------------------------------------------------------
*/

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

    req.on("error", (error) => {
      reject(error);
    });

    req.write(requestBody);
    req.end();
  });
};

/*
|--------------------------------------------------------------------------
| Common ATS Prompt
|--------------------------------------------------------------------------
*/

const createPrompt = (resumeText, jobDescription) => {
  return `
You are an expert ATS resume analyzer and recruiter.

Analyze the following resume against the given job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON in exactly this structure:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "experienceMatch": "",
  "roleMatch": "",
  "atsSuggestions": [],
  "recommendation": ""
}

Rules:

- matchScore must be a number between 0 and 100.
- matchedSkills: skills from the resume that match the job description.
- missingSkills: important job requirements missing from the resume.
- strengths: relevant strengths of the candidate.
- weaknesses: relevant gaps or weaknesses.
- experienceMatch: explain the experience match.
- roleMatch: explain how suitable the candidate is for the role.
- atsSuggestions: practical suggestions to improve the resume for this job.
- recommendation: clear final recommendation.
- Do not use Markdown.
- Return only JSON.
`;
};

/*
|--------------------------------------------------------------------------
| Parse AI JSON
|--------------------------------------------------------------------------
*/

const parseAnalysisJSON = (text) => {
  if (!text) {
    throw new Error("AI service did not return a valid response.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Invalid AI JSON:", text);

    throw new Error(
      "AI service returned an invalid analysis response."
    );
  }
};

/*
|--------------------------------------------------------------------------
| Gemini Analysis
|--------------------------------------------------------------------------
*/

const analyzeWithGemini = async (resumeText, jobDescription) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in .env");
    }

    if (!resumeText || typeof resumeText !== "string") {
      throw new Error("Resume text is invalid.");
    }

    if (!resumeText.trim()) {
      throw new Error("Resume text is empty.");
    }

    const prompt = createPrompt(
      resumeText,
      jobDescription
    );

    const requestBody = JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    let response = null;

    /*
    |--------------------------------------------------------------------------
    | Gemini - 3 Attempts
    |--------------------------------------------------------------------------
    */

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `AI request attempt ${attempt}/3`
        );

        response = await sendGeminiRequest(
          requestBody
        );

        console.log(
          "Gemini request completed successfully."
        );

        break;
      } catch (error) {
        console.error(
          `Gemini attempt ${attempt} failed:`,
          error.message
        );

        /*
        |--------------------------------------------------------------------------
        | 503 - Retry
        |--------------------------------------------------------------------------
        */

        if (
          error.statusCode === 503 &&
          attempt < 3
        ) {
          console.log(
            "AI service temporarily unavailable. Retrying..."
          );

          await wait(attempt * 3000);

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | 429 - Retry remaining Gemini attempts
        |--------------------------------------------------------------------------
        */

        if (
          error.statusCode === 429 &&
          attempt < 3
        ) {
          console.log(
            "Gemini rate limit reached. Trying again..."
          );

          await wait(attempt * 3000);

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Any other error
        |--------------------------------------------------------------------------
        */

        if (attempt < 3) {
          console.log(
            "Gemini request failed. Retrying..."
          );

          await wait(attempt * 2000);

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | All 3 Gemini attempts failed
        |--------------------------------------------------------------------------
        */

        throw error;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Gemini Response
    |--------------------------------------------------------------------------
    */

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error(
        "Gemini did not return a valid text response."
      );
    }

    return parseAnalysisJSON(text);
  } catch (error) {
    console.error(
      "Gemini failed after 3 attempts."
    );

    console.error(
      "Gemini Error:",
      error.message
    );

    /*
    |--------------------------------------------------------------------------
    | Fallback to Groq
    |--------------------------------------------------------------------------
    */

    console.log(
      "Gemini failed. Switching to Groq..."
    );

    return await analyzeWithGroq(
      resumeText,
      jobDescription
    );
  }
};

/*
|--------------------------------------------------------------------------
| Groq Fallback Analysis
|--------------------------------------------------------------------------
*/

const analyzeWithGroq = async (
  resumeText,
  jobDescription
) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is missing in .env"
      );
    }

    console.log(
      "Groq fallback request started."
    );

    const prompt = createPrompt(
      resumeText,
      jobDescription
    );

    const requestBody = JSON.stringify({
      model: GROQ_MODEL_NAME,

      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS resume analyzer and recruiter. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },
    });

    const response = await sendGroqRequest(
      requestBody
    );

    const text =
      response?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error(
        "Groq did not return a valid response."
      );
    }

    const analysis = parseAnalysisJSON(text);

    console.log(
      "Groq fallback request completed successfully."
    );

    return analysis;
  } catch (error) {
    console.error(
      "Groq fallback failed:",
      error
    );

    throw new Error(
      "Both Gemini and Groq AI services are currently unavailable."
    );
  }
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {
  analyzeWithGemini,
};