import axios from "axios";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

/* ---------- MOCK DATA FALLBACK ---------- */
// Enhanced mock fallback that uses the provided job title
const getMockSummaries = (jobTitle = "Professional", isBullets = false) => {
  const title = jobTitle || "Professional";
  if (isBullets) {
    return [
      `Developed high-performance features for ${title} applications, improving user engagement by 20%.`,
      `Collaborated with cross-functional teams to design and implement scalable ${title} solutions.`,
      `Optimized codebase and resolved critical bugs in ${title} modules, increasing system stability.`,
      `Mentored junior developers and enforced best practices for ${title} development workflows.`,
      `Led the architecture and deployment of several ${title} projects using modern technologies.`,
    ].join("\n");
  }
  return [
    {
      experience_level: "Fresher",
      summary: `${title} graduate with a passion for innovation. Eager to contribute to collaborative projects and deliver exceptional results while mastering new technologies in the field.`,
    },
    {
      experience_level: "Mid Level",
      summary: `Dynamic ${title} with 5+ years of experience in driving operational efficiency. Proven expertise in strategic planning and cross-functional leadership to solve complex problems.`,
    },
    {
      experience_level: "Senior Level",
      summary: `Accomplished ${title} leader specializing in digital transformation. Expert at mentoring high-performing teams and designing scalable architectures that align with corporate goals.`,
    },
  ];
};

export const generateAIContent = async (prompt) => {
  const isBullets = prompt.toLowerCase().includes("bullet");

  // Robust Job Title Extraction from prompt for fallback/context
  let extractedJobTitle = "Professional";
  const titleRegex = /job title:\s*(.*?)(?:\n|,|$)/i;
  const match = prompt.match(titleRegex);
  if (match && match[1] && match[1].trim() !== "") {
    extractedJobTitle = match[1].trim();
  }

  // 1. Try Gemini API via Axios (Direct REST call - bypasses SDK issues)
  if (geminiApiKey && geminiApiKey !== "") {
    // Verified models from user logs
    const models = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest"];

    for (const modelName of models) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }]
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000
          }
        );

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          let text = response.data.candidates[0].content.parts[0].text;
          if (!isBullets) {
            // Remove markdown backticks if AI decided to wrap JSON
            text = text.replace(/```json|```/g, "").trim();
          }
          return text;
        }
      } catch (innerErr) {
        // Skip 404/Not Found for models and try next in chain
        if (innerErr.response?.status === 404) {
          console.warn(`Model ${modelName} not available, continuing fallback chain.`);
          continue;
        }
        console.warn(`Gemini Error (${modelName}):`, innerErr.message);
      }
    }
  }

  // 2. Try Groq API (Secondary Fallback)
  if (groqApiKey && groqApiKey !== "") {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: isBullets ? undefined : { type: "json_object" },
        },
        {
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (groqError) {
      console.error("Groq API Error:", groqError.message);
    }
  }

  // 3. Final Mock Fallback (Guaranteed relevant to the job title)
  console.warn("AI Services exhausted. Using Job-Specific Mock Fallback.");
  const mock = getMockSummaries(extractedJobTitle, isBullets);
  return isBullets ? mock : JSON.stringify(mock);
};
