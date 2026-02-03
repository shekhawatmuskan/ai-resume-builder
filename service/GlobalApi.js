import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ================= AI CONFIG ================= */

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const AIChatSession = model.startChat({
  generationConfig,
  history: [],
});

/* ================= STRAPI API CONFIG ================= */

const BASE_URL = "http://localhost:1337/api";

/**
 * Get all resumes for a specific user
 */
export const GetUserResumes = (email) => {
  return axios.get(`${BASE_URL}/user-resumes?filters[userEmail][$eq]=${email}`);
};

/**
 * Create a new resume
 */
export const CreateNewResume = (data) => {
  return axios.post(`${BASE_URL}/user-resumes`, data);
};

/**
 * Get resume by documentId
 * (Used in Edit Resume page)
 */
export const GetResumeById = (documentId) => {
  return axios.get(
    `${BASE_URL}/user-resumes?filters[documentId][$eq]=${documentId}`,
  );
};

export const UpdateResumeDetail = (documentId, formData) => {
  return axios.put(`${BASE_URL}/user-resumes/${documentId}`, {
    data: formData,
  });
};
