import axios from "axios";

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

/* ---------- MOCK DATA FALLBACK ---------- */
const getMockSummaries = (jobTitle) => {
  return [
    {
      experience_level: "Fresher",
      summary: `Motivated and detail-oriented ${jobTitle} graduate with a strong foundation in core principles. Eager to contribute to innovative projects and grow within a professional team environment.`,
    },
    {
      experience_level: "Mid Level",
      summary: `Dedicated ${jobTitle} with over 4 years of experience delivering high-quality solutions. Proven track record of optimizing performance and collaborating effectively with cross-functional teams.`,
    },
    {
      experience_level: "Senior Level",
      summary: `Strategic ${jobTitle} leader with 8+ years of expertise in driving large-scale architectural improvements and mentoring junior developers. Passionate about solving complex problems and delivering business value.`,
    },
  ];
};

export const generateAIContent = async (prompt) => {
  // 1. If no API key, use Mock Fallback immediately
  if (!groqApiKey || groqApiKey === "") {
    console.warn("No Groq API key found. Using Mock Fallback.");
    return JSON.stringify(getMockSummaries("Professional"));
  }

  // 2. Try Groq API
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error, falling back to Mock:", error);
    // 3. Final Fallback if API fails (quota or network)
    return JSON.stringify(getMockSummaries("Professional"));
  }
};
