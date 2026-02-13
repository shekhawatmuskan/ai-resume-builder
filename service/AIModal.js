import axios from "axios";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

/* ---------- MOCK DATA FALLBACK ---------- */
const getMockSummaries = (jobTitle, isBullets = false) => {
  if (isBullets) {
    return [
      `Developed high-performance features for ${jobTitle} applications, improving user engagement by 20%. I took ownership of the entire development lifecycle, from initial architecture to final deployment.`,
      `Collaborated with cross-functional teams to design and implement scalable ${jobTitle} solutions that met core business objectives. I facilitated weekly standups and design reviews to ensure alignment.`,
      `Optimized codebase and resolved critical bugs in ${jobTitle} modules, reducing latency by 15% and increasing system stability. I implemented automated testing suites that improved code coverage significantly.`,
      `Mentored junior developers and enforced best practices for ${jobTitle} development workflows, resulting in a 30% increase in team velocity. I led technical workshops on modern development patterns.`,
      `Led the architecture and deployment of several ${jobTitle} projects using modern technologies like React and Strapi. I monitored system performance and scaled infrastructure to handle peak traffic.`,
    ].join("\n");
  }
  return [
    {
      experience_level: "Fresher",
      summary: `Motivated and detail-oriented ${jobTitle} graduate with a strong academic foundation. Possesses excellent communication skills and a quick learning ability, eager to leverage passion for innovation within a collaborative team. Committed to continuous professional growth and delivering exceptional results in fast-paced projects. I am dedicated to mastering new technologies and contributing to impactful software solutions.`,
    },
    {
      experience_level: "Mid Level",
      summary: `Dynamic ${jobTitle} with over 5 years of proven experience in developing high-impact solutions and driving operational efficiency. Demonstrated expertise in cross-functional collaboration and strategic planning to meet business objectives. Passionate about applying advanced technical skills to solve complex problems and deliver measurable ROI. Successfully managed multiple projects simultaneously while maintaining high standards of quality and performance.`,
    },
    {
      experience_level: "Senior Level",
      summary: `Accomplished ${jobTitle} leader with a decade of experience in steering large-scale digital transformations and mentoring high-performing teams. Expert in architectural design, performance optimization, and implementing scalable solutions that align with long-term corporate goals. Dedicated to innovation and excellence in all aspects of career. Proven ability to lead through adversity and deliver robust technical strategies that drive long-term business success.`,
    },
  ];
};

export const generateAIContent = async (prompt) => {
  const isBullets = prompt.toLowerCase().includes("bullet");

  // DISNOSTIC: List models if failure persists
  const listAvailableModels = async () => {
    try {
      const resp = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);
      console.log("DEBUG: Available models for this key:", resp.data.models.map(m => m.name));
    } catch (e) {
      console.error("DEBUG: Failed to list models. Key might be invalid or API not enabled.", e.response?.data || e.message);
    }
  };

  // 1. Try Gemini API via Axios (Direct REST call)
  if (geminiApiKey && geminiApiKey !== "") {
    try {
      // Trying the most common and latest model aliases in order
      const models = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

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
              text = text.replace(/```json|```/g, "").trim();
            }
            return text;
          }
        } catch (innerErr) {
          const status = innerErr.response?.status;
          if (status === 404) {
            console.warn(`Model ${modelName} not found, trying next...`);
            continue;
          }
          throw innerErr;
        }
      }

      // If loop finishes with 404s, run diagnostic
      await listAvailableModels();

    } catch (geminiError) {
      console.warn("All Gemini attempts failed, trying fallback:", geminiError);
      await listAvailableModels();
    }
  }

  // 2. Try Groq API (Secondary)
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
      console.error("Groq API Error, falling back to Mock:", groqError);
    }
  }

  // 3. Final Fallback
  const mock = getMockSummaries("Professional", isBullets);
  return isBullets ? mock : JSON.stringify(mock);
};
