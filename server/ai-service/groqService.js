const https = require("https");

const MODEL_NAME = "openai/gpt-oss-20b";

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

const analyzeWithGroq = async (resumeText, jobDescription) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing in .env");
    }

    const prompt = `
You are an expert ATS resume analyzer and recruiter.

Analyze the resume against the given job description.

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
- matchedSkills must contain skills from the resume that match the job description.
- missingSkills must contain important job requirements missing from the resume.
- strengths must contain relevant strengths of the candidate.
- weaknesses must contain relevant gaps or weaknesses.
- experienceMatch must explain the candidate's experience match.
- roleMatch must explain how suitable the candidate is for the role.
- atsSuggestions must contain practical resume improvement suggestions.
- recommendation must contain a clear final recommendation.
- Do not use Markdown.
- Return only JSON.
`;

    const requestBody = JSON.stringify({
      model: MODEL_NAME,

      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS resume analyzer. Return only valid JSON.",
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

    console.log("Groq fallback request started.");

    const response = await sendGroqRequest(requestBody);

    const text = response?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Groq did not return a valid response.");
    }

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch (error) {
      console.error("Invalid Groq JSON:", text);

      throw new Error(
        "Groq returned an invalid analysis response."
      );
    }

    console.log("Groq fallback request completed successfully.");

    return analysis;
  } catch (error) {
    console.error("Groq API Error:", error);

    throw error;
  }
};

module.exports = {
  analyzeWithGroq,
};